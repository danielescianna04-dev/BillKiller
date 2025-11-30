import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: subscriptionId } = await params
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get subscription to verify ownership and get details
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('merchant_canonical, user_id, amount, title, first_seen, last_seen')
    .eq('id', subscriptionId)
    .single()

  if (!subscription || subscription.user_id !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  console.log('Subscription:', {
    merchant: subscription.merchant_canonical,
    amount: subscription.amount,
    title: subscription.title
  })

  // Strategy 1: Search by merchant_canonical (exact or partial match)
  const baseMerchant = subscription.merchant_canonical.startsWith('unknown-')
    ? subscription.merchant_canonical.split('-').slice(0, 2).join('-')
    : subscription.merchant_canonical

  let { data: transactions } = await supabase
    .from('transactions')
    .select('id, occurred_at, amount, description, merchant_canonical')
    .eq('user_id', user.id)
    .ilike('merchant_canonical', `%${baseMerchant}%`)
    .order('occurred_at', { ascending: false })

  // Strategy 2: If no results, search by similar amount (±10%)
  if (!transactions || transactions.length === 0) {
    const minAmount = subscription.amount * 0.9
    const maxAmount = subscription.amount * 1.1

    const { data: amountTxs } = await supabase
      .from('transactions')
      .select('id, occurred_at, amount, description, merchant_canonical')
      .eq('user_id', user.id)
      .gte('amount', -maxAmount)
      .lte('amount', -minAmount)
      .order('occurred_at', { ascending: false })

    if (amountTxs && amountTxs.length > 0) {
      transactions = amountTxs
      console.log('Found by amount range:', transactions.length)
    }
  }

  // Strategy 3: Search by title/description match
  if (!transactions || transactions.length === 0) {
    const titleWords = subscription.title.toLowerCase().split(/\s+/).filter(w => w.length > 2)

    for (const word of titleWords) {
      const { data: descTxs } = await supabase
        .from('transactions')
        .select('id, occurred_at, amount, description, merchant_canonical')
        .eq('user_id', user.id)
        .ilike('description', `%${word}%`)
        .order('occurred_at', { ascending: false })
        .limit(20)

      if (descTxs && descTxs.length > 0) {
        transactions = descTxs
        console.log(`Found by description match "${word}":`, transactions.length)
        break
      }
    }
  }

  console.log('Final transactions found:', transactions?.length || 0)

  // Add source field
  const enrichedTransactions = transactions?.map(tx => ({
    ...tx,
    source: 'statement'
  })) || []

  return NextResponse.json({ transactions: enrichedTransactions })
}

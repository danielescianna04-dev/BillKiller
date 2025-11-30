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

  // Extract base merchant name (remove amount suffix if present)
  // e.g., "apple-5.99" -> "apple", "netflix" -> "netflix"
  const merchantParts = subscription.merchant_canonical.split('-')
  const lastPart = merchantParts[merchantParts.length - 1]
  const hasAmountSuffix = !isNaN(parseFloat(lastPart))
  const baseMerchant = hasAmountSuffix
    ? merchantParts.slice(0, -1).join('-')
    : subscription.merchant_canonical

  console.log('Base merchant:', baseMerchant, 'Amount:', subscription.amount)

  // Strategy 1: Search by merchant AND similar amount (±10%)
  const minAmount = subscription.amount * 0.9
  const maxAmount = subscription.amount * 1.1

  let { data: transactions } = await supabase
    .from('transactions')
    .select('id, occurred_at, amount, description, merchant_canonical')
    .eq('user_id', user.id)
    .ilike('merchant_canonical', `%${baseMerchant}%`)
    .gte('amount', -maxAmount)
    .lte('amount', -minAmount)
    .order('occurred_at', { ascending: false })

  console.log('Strategy 1 (merchant + amount):', transactions?.length || 0)

  // Strategy 2: Search by description containing merchant name AND similar amount
  if (!transactions || transactions.length === 0) {
    const { data: descTxs } = await supabase
      .from('transactions')
      .select('id, occurred_at, amount, description, merchant_canonical')
      .eq('user_id', user.id)
      .ilike('description', `%${baseMerchant}%`)
      .gte('amount', -maxAmount)
      .lte('amount', -minAmount)
      .order('occurred_at', { ascending: false })

    if (descTxs && descTxs.length > 0) {
      transactions = descTxs
      console.log('Strategy 2 (description + amount):', transactions.length)
    }
  }

  // Strategy 3: Search by title words in description AND similar amount
  if (!transactions || transactions.length === 0) {
    const titleWords = subscription.title.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2)

    for (const word of titleWords) {
      const { data: descTxs } = await supabase
        .from('transactions')
        .select('id, occurred_at, amount, description, merchant_canonical')
        .eq('user_id', user.id)
        .ilike('description', `%${word}%`)
        .gte('amount', -maxAmount)
        .lte('amount', -minAmount)
        .order('occurred_at', { ascending: false })
        .limit(20)

      if (descTxs && descTxs.length > 0) {
        transactions = descTxs
        console.log(`Strategy 3 (title "${word}" + amount):`, transactions.length)
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

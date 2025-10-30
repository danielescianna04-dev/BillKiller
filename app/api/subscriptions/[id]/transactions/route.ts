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

  // Get subscription to verify ownership
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('merchant_canonical, user_id')
    .eq('id', subscriptionId)
    .single()

  if (!subscription || subscription.user_id !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  console.log('Subscription merchant_canonical:', subscription.merchant_canonical)

  // Get transactions for this subscription
  // For unknown-* subscriptions, merchant_canonical has amount suffix, but transactions don't
  const baseMerchant = subscription.merchant_canonical.startsWith('unknown-')
    ? subscription.merchant_canonical.split('-').slice(0, 2).join('-') // "unknown-pos-1.99" -> "unknown-pos"
    : subscription.merchant_canonical

  console.log('Searching transactions with merchant:', baseMerchant)

  const { data: transactions } = await supabase
    .from('transactions')
    .select('id, occurred_at, amount, description, merchant_canonical')
    .eq('user_id', user.id)
    .eq('merchant_canonical', baseMerchant)
    .order('occurred_at', { ascending: false })

  console.log('Found transactions:', transactions?.length || 0)
  
  // Also check what merchants exist for this user
  const { data: allMerchants } = await supabase
    .from('transactions')
    .select('merchant_canonical')
    .eq('user_id', user.id)
    .limit(50)
  
  console.log('All merchants in DB:', [...new Set(allMerchants?.map(t => t.merchant_canonical))])

  // Add source field based on statement_id presence
  const enrichedTransactions = transactions?.map(tx => ({
    ...tx,
    source: 'statement' // Default to statement for now
  })) || []

  return NextResponse.json({ transactions: enrichedTransactions })
}

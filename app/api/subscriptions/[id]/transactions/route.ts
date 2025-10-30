import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subscriptionId = params.id

  // Get subscription to verify ownership
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('merchant_canonical, user_id')
    .eq('id', subscriptionId)
    .single()

  if (!subscription || subscription.user_id !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Get transactions for this subscription
  const { data: transactions } = await supabase
    .from('transactions')
    .select('id, occurred_at, amount, description, source')
    .eq('user_id', user.id)
    .eq('merchant_canonical', subscription.merchant_canonical)
    .order('occurred_at', { ascending: false })

  return NextResponse.json({ transactions: transactions || [] })
}

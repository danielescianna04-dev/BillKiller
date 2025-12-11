import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: subscriptionId } = await params
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title } = await req.json()

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  // Verify ownership
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, user_id')
    .eq('id', subscriptionId)
    .single()

  if (!subscription || subscription.user_id !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Update subscription title and mark as manually identified
  const { error } = await supabase
    .from('subscriptions')
    .update({
      title: title.trim(),
      meta: { identification_method: 'manual' }
    })
    .eq('id', subscriptionId)

  if (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

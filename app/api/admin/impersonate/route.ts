import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // SECURITY: Solo in development o con secret
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userId } = await req.json()
  
  const supabase = await createServerSupabaseClient()
  
  // Get user email
  const { data: { user } } = await supabase.auth.admin.getUserById(userId)
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Generate magic link
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: user.email!,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ 
    email: user.email,
    loginUrl: data.properties.action_link 
  })
}

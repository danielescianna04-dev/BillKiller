import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // SECURITY: Solo in development o con secret
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userId } = await req.json()
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
  
  // Get user from auth.users
  const { data, error } = await supabase.auth.admin.getUserById(userId)
  
  if (error || !data.user) {
    console.error('User not found:', error)
    return NextResponse.json({ error: 'User not found', details: error?.message }, { status: 404 })
  }

  // Generate magic link
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: data.user.email!,
  })

  if (linkError) {
    console.error('Link generation failed:', linkError)
    return NextResponse.json({ error: linkError.message }, { status: 500 })
  }

  return NextResponse.json({ 
    email: data.user.email,
    loginUrl: linkData.properties.action_link 
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/auth/outlook/callback`
  const scope = 'Mail.Read offline_access'
  
  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    state: user.id,
    prompt: 'consent'
  })}`

  return NextResponse.redirect(authUrl)
}

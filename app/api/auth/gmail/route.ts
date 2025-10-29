import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/auth/gmail/callback`
  const scope = 'https://www.googleapis.com/auth/gmail.readonly'
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    access_type: 'offline',
    state: user.id,
    prompt: 'consent'
  })}`

  return NextResponse.redirect(authUrl)
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const code = searchParams.get('code')
  const userId = searchParams.get('state')

  if (!code || !userId) {
    return NextResponse.redirect(new URL('/app/email?error=invalid', req.url))
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/auth/gmail/callback`,
        grant_type: 'authorization_code'
      })
    })

    const tokens = await tokenResponse.json()
    
    if (!tokens.access_token) {
      console.error('Token exchange failed:', tokens)
      return NextResponse.redirect(new URL('/app/email?error=token_failed', req.url))
    }

    // Save source
    const { data: source, error: insertError } = await supabase.from('sources').insert({
      user_id: userId,
      type: 'gmail',
      label: 'Gmail',
      status: 'active',
      meta: { 
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: Date.now() + tokens.expires_in * 1000
      }
    }).select().single()
    
    if (insertError) {
      console.error('Source insert error:', insertError)
      return NextResponse.redirect(new URL('/app/email?error=db_failed', req.url))
    }
    
    console.log('Gmail source saved:', source)

    // Trigger email scan (async)
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/scan/gmail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    }).catch(err => console.error('Scan trigger failed:', err))

    return NextResponse.redirect(new URL('/app/email?success=true', req.url))
  } catch (error) {
    console.error('Gmail OAuth error:', error)
    return NextResponse.redirect(new URL('/app/email?error=failed', req.url))
  }
}

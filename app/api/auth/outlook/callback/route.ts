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
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/auth/outlook/callback`,
        grant_type: 'authorization_code'
      })
    })

    const tokens = await tokenResponse.json()

    await supabase.from('sources').insert({
      user_id: userId,
      type: 'outlook',
      label: 'Outlook',
      status: 'active',
      meta: { 
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: Date.now() + tokens.expires_in * 1000
      }
    })

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/scan/outlook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })

    return NextResponse.redirect(new URL('/app/email?success=true', req.url))
  } catch (error) {
    console.error('Outlook OAuth error:', error)
    return NextResponse.redirect(new URL('/app/email?error=failed', req.url))
  }
}

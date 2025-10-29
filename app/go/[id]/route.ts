import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const AFFILIATE_URLS: Record<string, string> = {
  'nordvpn': 'https://nordvpn.com/?aff=YOUR_ID',
  'pcloud': 'https://pcloud.com/?ref=YOUR_ID',
  'disney': 'https://disneyplus.com/?ref=YOUR_ID',
  'iliad': 'https://iliad.it/?ref=YOUR_ID',
  'chatgpt': 'https://chat.openai.com/plus',
  'canva': 'https://canva.com/pro?ref=YOUR_ID'
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const url = AFFILIATE_URLS[id]

  if (!url) {
    return NextResponse.redirect(new URL('/app/offerte', req.url))
  }

  // Log click (optional analytics)
  try {
    await supabase.from('affiliate_clicks').insert({
      merchant_id: id,
      clicked_at: new Date().toISOString(),
      user_agent: req.headers.get('user-agent'),
      referer: req.headers.get('referer')
    })
  } catch (e) {
    // Ignore logging errors
  }

  return NextResponse.redirect(url)
}

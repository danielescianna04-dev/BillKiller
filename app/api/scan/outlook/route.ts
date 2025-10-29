import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    const { data: source } = await supabase
      .from('sources')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'outlook')
      .single()

    if (!source) throw new Error('Outlook source not found')

    const accessToken = source.meta.access_token

    const filter = "$filter=contains(subject,'receipt') or contains(subject,'invoice') or contains(subject,'subscription') or contains(subject,'payment')"
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/messages?${filter}&$top=50&$select=subject,from,receivedDateTime`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    const data = await response.json()
    
    if (!data.value) {
      return NextResponse.json({ found: 0 })
    }

    let found = 0

    for (const message of data.value.slice(0, 20)) {
      const from = message.from?.emailAddress?.address || ''
      const subject = message.subject || ''
      const date = message.receivedDateTime

      const merchant = extractMerchantFromEmail(from, subject)
      const amount = extractAmountFromSubject(subject)

      if (merchant && amount) {
        await supabase.from('transactions').insert({
          user_id: userId,
          source_id: source.id,
          occurred_at: new Date(date).toISOString().split('T')[0],
          description: subject,
          raw_merchant: merchant,
          merchant_canonical: merchant.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          amount: -amount,
          currency: 'EUR',
          hash: `${userId}-email-${message.id}`,
          meta: { email_id: message.id, from }
        })
        found++
      }
    }

    return NextResponse.json({ found })
  } catch (error: any) {
    console.error('Outlook scan error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function extractMerchantFromEmail(from: string, subject: string): string | null {
  const fromMatch = from.match(/@([^.]+)/)
  if (fromMatch) return fromMatch[1]
  
  const merchants = ['netflix', 'spotify', 'apple', 'google', 'microsoft', 'adobe']
  for (const m of merchants) {
    if (subject.toLowerCase().includes(m)) return m
  }
  
  return null
}

function extractAmountFromSubject(subject: string): number | null {
  const match = subject.match(/€\s*(\d+[.,]\d{2})|(\d+[.,]\d{2})\s*€/)
  if (match) {
    const amount = (match[1] || match[2]).replace(',', '.')
    return parseFloat(amount)
  }
  return null
}

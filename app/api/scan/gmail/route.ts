import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getMerchantTitle } from '@/lib/merchants'

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
      .eq('type', 'gmail')
      .single()

    if (!source) throw new Error('Gmail source not found')

    let accessToken = source.meta.access_token

    // Check if token is expired and refresh if needed
    if (source.meta.expires_at && Date.now() >= source.meta.expires_at) {
      console.log('Access token expired, refreshing...')
      
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: source.meta.refresh_token,
          grant_type: 'refresh_token'
        })
      })

      const tokens = await refreshResponse.json()
      
      if (tokens.error) {
        console.error('Token refresh failed:', tokens)
        throw new Error('Failed to refresh access token')
      }

      accessToken = tokens.access_token

      // Update source with new token
      await supabase
        .from('sources')
        .update({
          meta: {
            ...source.meta,
            access_token: tokens.access_token,
            expires_at: Date.now() + tokens.expires_in * 1000
          }
        })
        .eq('id', source.id)

      console.log('Access token refreshed successfully')
    }

    // Search for subscription-related emails (expanded query)
    const query = '(subject:(receipt OR invoice OR subscription OR payment OR renewal OR abbonamento OR fattura OR rinnovo OR billing OR charge OR ricevuta OR pagamento OR addebito OR canone OR mensile OR annuale OR rata OR rate OR installment) OR from:(*stripe.com OR *paypal.com OR *spotify.com OR *netflix.com OR *apple.com OR *google.com OR *microsoft.com OR *adobe.com OR *amazon.com OR *tim.it OR *vodafone.it OR *wind.it OR *iliad.it OR *fastweb.it OR *sky.it OR *dazn.com OR *primevideo.com OR *disney.com OR *hbo.com OR *ionos.* OR *aruba.it OR *register.it OR *klarna.com))'
    console.log('Gmail search query:', query)
    
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=500`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    const data = await response.json()
    console.log('Gmail API response:', data)
    
    if (!data.messages) {
      console.log('No messages found matching query')
      return NextResponse.json({ found: 0 })
    }

    console.log(`Found ${data.messages.length} messages, processing all...`)
    let found = 0

    for (const message of data.messages) {
      const msgResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      
      const msgData = await msgResponse.json()
      const headers = msgData.payload.headers
      
      const from = headers.find((h: any) => h.name === 'From')?.value || ''
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || ''
      const date = headers.find((h: any) => h.name === 'Date')?.value || ''

      // Extract body text (try HTML first, then plain text)
      let bodyText = ''
      if (msgData.payload.parts) {
        for (const part of msgData.payload.parts) {
          if (part.mimeType === 'text/html' && part.body?.data) {
            bodyText = Buffer.from(part.body.data, 'base64').toString('utf-8')
            break
          }
        }
        if (!bodyText) {
          for (const part of msgData.payload.parts) {
            if (part.mimeType === 'text/plain' && part.body?.data) {
              bodyText = Buffer.from(part.body.data, 'base64').toString('utf-8')
              break
            }
          }
        }
      } else if (msgData.payload.body?.data) {
        bodyText = Buffer.from(msgData.payload.body.data, 'base64').toString('utf-8')
      }

      // Extract merchant from email
      const merchant = extractMerchantFromEmail(from, subject)
      // Try to extract amount from subject first, then body
      let amount = extractAmountFromSubject(subject)
      if (!amount && bodyText) {
        amount = extractAmountFromText(bodyText)
      }

      // Skip promotional emails without amount
      if (!amount) continue
      
      // Skip promotional/marketing emails
      const marketingKeywords = ['ritorna', 'torna', 'scopri', 'spendi', 'inizia a guardare', 'benvenuto', 'buon', 'ricordi', 'passati', 'vuoi guardare', 'solo €', 'solo 7', 'solo 9', 'solo 10', 'abbiamo piani', 'a partire da']
      const isMarketing = marketingKeywords.some(keyword => subject.toLowerCase().includes(keyword))
      if (isMarketing) continue
      
      // Skip promotional emails (free trials, €0 offers)
      const isPromo = subject.toLowerCase().includes('€0') || 
                      subject.toLowerCase().includes('gratis') || 
                      subject.toLowerCase().includes('free') ||
                      subject.toLowerCase().includes('prova')
      if (isPromo) continue
      
      console.log(`Email: from="${from}", subject="${subject}"`)
      
      // Try to extract installment info from subject and body
      const installmentInfo = extractInstallmentInfo(subject + ' ' + bodyText)

      console.log(`  Extracted: merchant="${merchant}", amount="${amount}", installments="${installmentInfo ? `${installmentInfo.current}/${installmentInfo.total}` : 'none'}"`)

      if (merchant) {
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
          meta: { 
            email_id: message.id, 
            from,
            installment_info: installmentInfo 
          }
        })
        found++
        console.log(`  ✓ Saved transaction`)
      }
    }

    console.log(`Gmail scan complete: ${found} transactions found`)
    
    // Run detection on all user transactions
    if (found > 0) {
      const { detectSubscriptions } = await import('@/lib/detection')
      const { data: allTransactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('occurred_at', { ascending: true })
      
      if (allTransactions && allTransactions.length > 0) {
        const detected = detectSubscriptions(allTransactions)
        console.log(`Detection: found ${detected.length} subscriptions`)
        
        // Insert/update subscriptions
        for (const sub of detected) {
          const merchantKey = sub.merchant_canonical.startsWith('unknown-')
            ? `${sub.merchant_canonical}-${sub.amount.toFixed(2)}`
            : sub.merchant_canonical
          
          await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              merchant_canonical: merchantKey,
              title: getMerchantTitle(sub.merchant_canonical),
              periodicity: sub.periodicity,
              amount: sub.amount,
              confidence: sub.confidence,
              first_seen: sub.first_seen,
              last_seen: sub.last_seen,
              status: sub.status || 'active'
            }, {
              onConflict: 'user_id,merchant_canonical'
            })
        }
        
        // Try to identify unknown subscriptions
        const { identifyUnknownSubscriptions } = await import('@/lib/identify-unknown')
        await identifyUnknownSubscriptions(userId, supabase)
      }
    }
    
    return NextResponse.json({ found })
  } catch (error: any) {
    console.error('Gmail scan error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function extractMerchantFromEmail(from: string, subject: string): string | null {
  // Extract domain from email
  const emailMatch = from.match(/@([\w.-]+\.\w+)/i)
  if (emailMatch) {
    const domain = emailMatch[1].toLowerCase()
    
    // Extract main brand from domain
    // e.g., email.playstation.com -> playstation
    // e.g., account.netflix.com -> netflix
    // e.g., mailer.netflix.com -> netflix
    const parts = domain.split('.')
    if (parts.length >= 2) {
      // Get second-to-last part (brand name)
      const brand = parts[parts.length - 2]
      
      // Skip generic domains
      if (!['email', 'mailer', 'account', 'noreply', 'no-reply', 'info'].includes(brand)) {
        return brand
      }
      
      // If generic, try to find brand in subject
      const knownBrands = ['netflix', 'spotify', 'apple', 'google', 'microsoft', 'adobe', 'playstation', 'amazon', 'disney', 'hbo', 'dazn', 'sky', 'tim', 'vodafone', 'wind', 'iliad']
      for (const merchant of knownBrands) {
        if (domain.includes(merchant) || subject.toLowerCase().includes(merchant)) {
          return merchant
        }
      }
    }
  }
  
  return null
}

function extractAmountFromSubject(subject: string): number | null {
  // Match €50.00, $50.00, 50,00€, 50.00$, etc.
  const match = subject.match(/[€$]\s*(\d+[.,]\d{2})|(\d+[.,]\d{2})\s*[€$]/)
  if (match) {
    const amount = (match[1] || match[2]).replace(',', '.')
    return parseFloat(amount)
  }
  return null
}

function extractInstallmentInfo(text: string): { current: number; total: number } | null {
  // Look for patterns like "rata 3/12", "3 di 12", "installment 3 of 12", "3/12 rate"
  const patterns = [
    /rata\s+(\d+)\s*\/\s*(\d+)/i,
    /(\d+)\s+di\s+(\d+)\s+rate/i,
    /installment\s+(\d+)\s+of\s+(\d+)/i,
    /(\d+)\s*\/\s*(\d+)\s+rate/i,
    /payment\s+(\d+)\s+of\s+(\d+)/i,
    /(\d+)\s*\/\s*(\d+)\s+pagamenti/i
  ]
  
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const current = parseInt(match[1])
      const total = parseInt(match[2])
      if (current > 0 && total > 0 && current <= total && total <= 60) {
        return { current, total }
      }
    }
  }
  return null
}

function extractAmountFromText(text: string): number | null {
  // Strip HTML tags for better matching
  const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ')
  
  // Look for common patterns in email body
  const patterns = [
    // Italian patterns
    /(?:totale|importo|prezzo|costo|pagamento|addebito|canone)[\s:]*[€]?\s*(\d+[.,]\d{2})\s*[€]?/i,
    // English patterns
    /(?:total|amount|price|cost|payment|charge|subscription)[\s:]*[$€]?\s*(\d+[.,]\d{2})\s*[$€]?/i,
    // Generic currency patterns
    /[€$]\s*(\d+[.,]\d{2})/,
    /(\d+[.,]\d{2})\s*[€$]/,
    // EUR/USD explicit
    /(\d+[.,]\d{2})\s*(?:EUR|USD|eur|usd)/i
  ]
  
  const amounts: number[] = []
  
  for (const pattern of patterns) {
    const matches = cleanText.matchAll(new RegExp(pattern, 'gi'))
    for (const match of matches) {
      const amountStr = match[1].replace(',', '.')
      const parsed = parseFloat(amountStr)
      // Filter out unrealistic amounts
      if (parsed >= 0.50 && parsed <= 10000) {
        amounts.push(parsed)
      }
    }
  }
  
  // Return the most common amount, or the first one if all unique
  if (amounts.length === 0) return null
  if (amounts.length === 1) return amounts[0]
  
  // Find most frequent amount
  const frequency: { [key: number]: number } = {}
  amounts.forEach(amt => {
    frequency[amt] = (frequency[amt] || 0) + 1
  })
  
  const mostFrequent = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])[0]
  
  return parseFloat(mostFrequent[0])
}

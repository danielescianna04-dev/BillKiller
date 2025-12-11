import { NextResponse } from 'next/server'
import { analyzeWithAI } from '@/lib/groq'

interface LivePrice {
  service: string
  price: number | null
  plan_name: string | null
  period: string
  source_url: string
  error?: string
}

// Configurazione servizi con URL prezzi
const SERVICES: Record<string, { name: string; url: string }> = {
  'netflix': { name: 'Netflix', url: 'https://www.netflix.com/it/signup/planform' },
  'spotify': { name: 'Spotify', url: 'https://www.spotify.com/it/premium/' },
  'disney-plus': { name: 'Disney+', url: 'https://www.disneyplus.com/it-it' },
  'amazon-prime': { name: 'Amazon Prime', url: 'https://www.amazon.it/amazonprime' },
  'youtube-premium': { name: 'YouTube Premium', url: 'https://www.youtube.com/premium' },
  'apple-music': { name: 'Apple Music', url: 'https://www.apple.com/it/apple-music/' },
  'apple-one': { name: 'Apple One', url: 'https://www.apple.com/it/apple-one/' },
  'dazn': { name: 'DAZN', url: 'https://www.dazn.com/it-IT' },
  'now-tv': { name: 'NOW', url: 'https://www.nowtv.it/' },
  'nordvpn': { name: 'NordVPN', url: 'https://nordvpn.com/it/pricing/' },
  'surfshark': { name: 'Surfshark', url: 'https://surfshark.com/it/pricing' },
  'expressvpn': { name: 'ExpressVPN', url: 'https://www.expressvpn.com/order' },
  'dropbox': { name: 'Dropbox', url: 'https://www.dropbox.com/plans' },
  'google-one': { name: 'Google One', url: 'https://one.google.com/about/plans' },
  'icloud': { name: 'iCloud+', url: 'https://www.apple.com/it/icloud/' },
  'canva': { name: 'Canva Pro', url: 'https://www.canva.com/pricing/' },
  'adobe-creative-cloud': { name: 'Adobe CC', url: 'https://www.adobe.com/it/creativecloud/plans.html' },
  'microsoft-365': { name: 'Microsoft 365', url: 'https://www.microsoft.com/it-it/microsoft-365/buy/microsoft-365' },
  'iliad': { name: 'Iliad', url: 'https://www.iliad.it/' },
  'ho-mobile': { name: 'ho. Mobile', url: 'https://www.ho-mobile.it/' },
  'very-mobile': { name: 'Very Mobile', url: 'https://www.verymobile.it/' },
  'playstation-plus': { name: 'PlayStation Plus', url: 'https://www.playstation.com/it-it/ps-plus/' },
  'xbox-game-pass': { name: 'Xbox Game Pass', url: 'https://www.xbox.com/it-IT/xbox-game-pass' },
}

const SYSTEM_PROMPT = `Sei un assistente che estrae prezzi da pagine web.

Analizza il contenuto e trova il prezzo mensile del piano base/standard.

REGOLE:
1. Cerca prezzi in EUR (€)
2. Se trovi solo prezzo annuale, dividi per 12
3. Prendi il piano più economico/base
4. Se non trovi prezzi chiari, rispondi con price: null

Rispondi SOLO con JSON:
{
  "price": 12.99,
  "plan_name": "Standard",
  "period": "monthly",
  "raw_price_text": "€12,99/mese"
}

Se non trovi prezzi:
{
  "price": null,
  "plan_name": null,
  "period": "unknown",
  "raw_price_text": null
}`

async function fetchAndExtractPrice(serviceKey: string): Promise<LivePrice> {
  const service = SERVICES[serviceKey]
  if (!service) {
    return {
      service: serviceKey,
      price: null,
      plan_name: null,
      period: 'unknown',
      source_url: '',
      error: 'Servizio non supportato'
    }
  }

  try {
    // Fetch pagina
    const response = await fetch(service.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'it-IT,it;q=0.9'
      },
      signal: AbortSignal.timeout(10000)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()

    // Pulisci HTML (rimuovi script, style, etc)
    const cleanedContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 6000) // Limita per token AI

    // Estrai prezzo con AI
    const result = await analyzeWithAI<{
      price: number | null
      plan_name: string | null
      period: string
      raw_price_text: string | null
    }>(
      `Estrai il prezzo mensile base da questa pagina di ${service.name}:\n\n${cleanedContent}`,
      SYSTEM_PROMPT
    )

    return {
      service: serviceKey,
      price: result.price,
      plan_name: result.plan_name,
      period: result.period || 'monthly',
      source_url: service.url
    }

  } catch (error) {
    console.error(`Error fetching ${serviceKey}:`, error)
    return {
      service: serviceKey,
      price: null,
      plan_name: null,
      period: 'unknown',
      source_url: service.url,
      error: error instanceof Error ? error.message : 'Errore sconosciuto'
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const servicesParam = searchParams.get('services')

  if (!servicesParam) {
    return NextResponse.json({
      error: 'Specifica i servizi con ?services=netflix,spotify,dazn',
      available: Object.keys(SERVICES)
    }, { status: 400 })
  }

  const requestedServices = servicesParam.split(',').map(s => s.trim().toLowerCase())

  // Scrape tutti in parallelo
  const results = await Promise.all(
    requestedServices.map(service => fetchAndExtractPrice(service))
  )

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    prices: results
  })
}

export const dynamic = 'force-dynamic'
export const maxDuration = 60

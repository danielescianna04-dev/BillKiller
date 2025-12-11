import { analyzeWithAI } from './groq'

interface PriceInfo {
  price: number | null
  currency: string
  period: 'monthly' | 'yearly' | 'one-time'
  plan_name: string | null
  source_url: string
  confidence: number
  raw_text: string | null
}

interface ScrapedPrices {
  prices: PriceInfo[]
  error: string | null
}

// Servizi con le loro pagine prezzi ufficiali
const PRICE_SOURCES: Record<string, { name: string; urls: string[] }> = {
  'netflix': {
    name: 'Netflix',
    urls: ['https://www.netflix.com/it/signup/planform']
  },
  'spotify': {
    name: 'Spotify',
    urls: ['https://www.spotify.com/it/premium/']
  },
  'disney-plus': {
    name: 'Disney+',
    urls: ['https://www.disneyplus.com/it-it/sign-up']
  },
  'amazon-prime': {
    name: 'Amazon Prime',
    urls: ['https://www.amazon.it/amazonprime']
  },
  'youtube-premium': {
    name: 'YouTube Premium',
    urls: ['https://www.youtube.com/premium']
  },
  'apple-music': {
    name: 'Apple Music',
    urls: ['https://www.apple.com/it/shop/product/apple-music']
  },
  'apple-one': {
    name: 'Apple One',
    urls: ['https://www.apple.com/it/apple-one/']
  },
  'dazn': {
    name: 'DAZN',
    urls: ['https://www.dazn.com/it-IT/welcome']
  },
  'now-tv': {
    name: 'NOW TV',
    urls: ['https://www.nowtv.it/offerte']
  },
  'tim-vision': {
    name: 'TIM Vision',
    urls: ['https://www.timvision.it/']
  },
  'sky': {
    name: 'Sky',
    urls: ['https://www.sky.it/offerte']
  },
  'nordvpn': {
    name: 'NordVPN',
    urls: ['https://nordvpn.com/it/pricing/']
  },
  'expressvpn': {
    name: 'ExpressVPN',
    urls: ['https://www.expressvpn.com/order']
  },
  'surfshark': {
    name: 'Surfshark',
    urls: ['https://surfshark.com/it/pricing']
  },
  'dropbox': {
    name: 'Dropbox',
    urls: ['https://www.dropbox.com/plans']
  },
  'google-one': {
    name: 'Google One',
    urls: ['https://one.google.com/about/plans']
  },
  'icloud': {
    name: 'iCloud+',
    urls: ['https://www.apple.com/it/icloud/']
  },
  'adobe-creative-cloud': {
    name: 'Adobe Creative Cloud',
    urls: ['https://www.adobe.com/it/creativecloud/plans.html']
  },
  'canva': {
    name: 'Canva Pro',
    urls: ['https://www.canva.com/pricing/']
  },
  'microsoft-365': {
    name: 'Microsoft 365',
    urls: ['https://www.microsoft.com/it-it/microsoft-365/compare-all-microsoft-365-products']
  },
  'zoom': {
    name: 'Zoom',
    urls: ['https://zoom.us/pricing']
  },
  'playstation-plus': {
    name: 'PlayStation Plus',
    urls: ['https://www.playstation.com/it-it/ps-plus/']
  },
  'xbox-game-pass': {
    name: 'Xbox Game Pass',
    urls: ['https://www.xbox.com/it-IT/xbox-game-pass']
  },
  'nintendo-switch-online': {
    name: 'Nintendo Switch Online',
    urls: ['https://www.nintendo.it/Nintendo-Switch-Online/Nintendo-Switch-Online-2159587.html']
  },
  'iliad': {
    name: 'Iliad',
    urls: ['https://www.iliad.it/offerta-iliad.html']
  },
  'ho-mobile': {
    name: 'ho. Mobile',
    urls: ['https://www.ho-mobile.it/offerta.html']
  },
  'very-mobile': {
    name: 'Very Mobile',
    urls: ['https://www.verymobile.it/offerte']
  },
  'vodafone': {
    name: 'Vodafone',
    urls: ['https://www.vodafone.it/privati/offerte.html']
  },
  'tim': {
    name: 'TIM',
    urls: ['https://www.tim.it/offerte/mobile']
  },
  'wind-tre': {
    name: 'WindTre',
    urls: ['https://www.windtre.it/offerte-mobile/']
  }
}

const SYSTEM_PROMPT = `Sei un assistente specializzato nell'estrazione di prezzi da pagine web di servizi in abbonamento.

Il tuo compito è analizzare il contenuto HTML/testo di una pagina prezzi e estrarre TUTTI i piani disponibili con i loro prezzi.

REGOLE IMPORTANTI:
1. Estrai SOLO prezzi chiaramente indicati nella pagina
2. Distingui tra prezzi mensili, annuali e pagamenti una tantum
3. Se un prezzo annuale è mostrato, calcola anche l'equivalente mensile
4. Identifica il nome del piano (Base, Standard, Premium, etc.)
5. Se non trovi prezzi chiari, restituisci un array vuoto
6. I prezzi devono essere in EUR (€)
7. Ignora prezzi promozionali temporanei se il prezzo standard è visibile
8. Confidence: 1.0 se prezzo chiaro, 0.7 se dedotto, 0.5 se incerto

Rispondi SEMPRE in JSON con questo formato:
{
  "prices": [
    {
      "price": 12.99,
      "currency": "EUR",
      "period": "monthly",
      "plan_name": "Standard",
      "confidence": 1.0,
      "raw_text": "€12,99/mese"
    }
  ],
  "error": null
}

Se non riesci a trovare prezzi:
{
  "prices": [],
  "error": "Nessun prezzo trovato nella pagina"
}`

/**
 * Fetches a URL and returns its text content
 */
async function fetchPageContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8'
      },
      signal: AbortSignal.timeout(15000)
    })

    if (!response.ok) {
      console.error(`HTTP ${response.status} for ${url}`)
      return null
    }

    const html = await response.text()

    // Rimuovi script, style e tag inutili per ridurre il contenuto
    const cleanedHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // Limita a 8000 caratteri per non superare il limite di token
    return cleanedHtml.slice(0, 8000)
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    return null
  }
}

/**
 * Uses AI to extract prices from page content
 */
export async function extractPricesWithAI(
  serviceName: string,
  pageContent: string,
  sourceUrl: string
): Promise<ScrapedPrices> {
  try {
    const prompt = `Analizza il seguente contenuto della pagina prezzi di "${serviceName}" e estrai tutti i piani con i relativi prezzi.

URL sorgente: ${sourceUrl}

Contenuto pagina:
${pageContent}

Estrai i prezzi disponibili.`

    const result = await analyzeWithAI<ScrapedPrices>(prompt, SYSTEM_PROMPT)

    // Aggiungi source_url a ogni prezzo
    if (result.prices) {
      result.prices = result.prices.map(p => ({
        ...p,
        source_url: sourceUrl
      }))
    }

    return result
  } catch (error) {
    console.error(`AI extraction error for ${serviceName}:`, error)
    return {
      prices: [],
      error: `AI error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Scrapes prices for a specific service
 */
export async function scrapeServicePrice(serviceKey: string): Promise<PriceInfo | null> {
  const service = PRICE_SOURCES[serviceKey]
  if (!service) {
    console.log(`No price source configured for ${serviceKey}`)
    return null
  }

  console.log(`🔍 Scraping prices for ${service.name}...`)

  for (const url of service.urls) {
    const content = await fetchPageContent(url)
    if (!content) continue

    const result = await extractPricesWithAI(service.name, content, url)

    if (result.prices && result.prices.length > 0) {
      // Prendi il piano base/standard mensile se disponibile
      const monthlyPlan = result.prices.find(p => p.period === 'monthly')
      const yearlyPlan = result.prices.find(p => p.period === 'yearly')

      if (monthlyPlan && monthlyPlan.price) {
        console.log(`✅ Found ${service.name}: €${monthlyPlan.price}/month (${monthlyPlan.plan_name || 'base'})`)
        return monthlyPlan
      }

      // Se solo annuale, calcola mensile
      if (yearlyPlan && yearlyPlan.price) {
        const monthlyEquivalent = Math.round((yearlyPlan.price / 12) * 100) / 100
        console.log(`✅ Found ${service.name}: €${monthlyEquivalent}/month (from €${yearlyPlan.price}/year)`)
        return {
          ...yearlyPlan,
          price: monthlyEquivalent,
          period: 'monthly'
        }
      }
    }
  }

  console.log(`❌ Could not find prices for ${service.name}`)
  return null
}

/**
 * Scrapes prices for all configured services
 */
export async function scrapeAllPrices(): Promise<Record<string, PriceInfo | null>> {
  const results: Record<string, PriceInfo | null> = {}

  for (const serviceKey of Object.keys(PRICE_SOURCES)) {
    try {
      results[serviceKey] = await scrapeServicePrice(serviceKey)
      // Piccola pausa per non sovraccaricare
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Error scraping ${serviceKey}:`, error)
      results[serviceKey] = null
    }
  }

  return results
}

/**
 * Get list of supported services
 */
export function getSupportedServices(): string[] {
  return Object.keys(PRICE_SOURCES)
}

/**
 * Get service info
 */
export function getServiceInfo(serviceKey: string): { name: string; urls: string[] } | null {
  return PRICE_SOURCES[serviceKey] || null
}

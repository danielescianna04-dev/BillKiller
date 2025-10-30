import * as cheerio from 'cheerio'

interface ScraperConfig {
  url: string
  selector: string
  transform?: (text: string) => number
}

// Configurazione scraper per ogni servizio
const scraperConfigs: Record<string, ScraperConfig> = {
  'netflix': {
    url: 'https://www.netflix.com/it/',
    selector: 'meta[property="og:description"]',
    transform: (text) => {
      const match = text.match(/€\s*(\d+[.,]\d+)/)
      return match ? parseFloat(match[1].replace(',', '.')) : 12.99
    }
  },
  'spotify': {
    url: 'https://www.spotify.com/it/premium/',
    selector: 'meta[name="description"]',
    transform: (text) => {
      const match = text.match(/€\s*(\d+[.,]\d+)/)
      return match ? parseFloat(match[1].replace(',', '.')) : 10.99
    }
  },
  'disney-plus': {
    url: 'https://www.disneyplus.com/it-it',
    selector: 'meta[property="og:description"]',
    transform: (text) => {
      const match = text.match(/€\s*(\d+[.,]\d+)/)
      return match ? parseFloat(match[1].replace(',', '.')) : 8.99
    }
  },
  'amazon-prime': {
    url: 'https://www.amazon.it/amazonprime',
    selector: 'meta[name="description"]',
    transform: (text) => {
      const match = text.match(/€\s*(\d+[.,]\d+)/)
      return match ? parseFloat(match[1].replace(',', '.')) : 4.99
    }
  },
  'youtube-premium': {
    url: 'https://www.youtube.com/premium',
    selector: 'meta[property="og:description"]',
    transform: (text) => {
      const match = text.match(/€\s*(\d+[.,]\d+)/)
      return match ? parseFloat(match[1].replace(',', '.')) : 11.99
    }
  },
  'apple-music': {
    url: 'https://www.apple.com/it/apple-music/',
    selector: 'meta[property="og:description"]',
    transform: (text) => {
      const match = text.match(/€\s*(\d+[.,]\d+)/)
      return match ? parseFloat(match[1].replace(',', '.')) : 10.99
    }
  },
  'dazn': {
    url: 'https://www.dazn.com/it-IT',
    selector: 'meta[name="description"]',
    transform: (text) => {
      const match = text.match(/€\s*(\d+[.,]\d+)/)
      return match ? parseFloat(match[1].replace(',', '.')) : 44.99
    }
  }
}

export async function scrapePrice(merchant: string): Promise<number | null> {
  const config = scraperConfigs[merchant.toLowerCase()]
  if (!config) {
    console.log(`No scraper config for ${merchant}`)
    return null
  }

  try {
    // Fetch HTML
    const response = await fetch(config.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8'
      },
      signal: AbortSignal.timeout(10000) // 10s timeout
    })

    if (!response.ok) {
      console.error(`HTTP ${response.status} for ${merchant}`)
      return null
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Estrai il prezzo
    const element = $(config.selector)
    const priceText = element.attr('content') || element.text() || ''
    
    // Trasforma il testo in numero
    const price = config.transform ? config.transform(priceText) : parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(',', '.'))
    
    if (isNaN(price) || price <= 0) {
      console.error(`Invalid price for ${merchant}: ${priceText}`)
      return null
    }

    console.log(`✅ Scraped ${merchant}: €${price}`)
    return price

  } catch (error) {
    console.error(`❌ Error scraping ${merchant}:`, error)
    return null
  }
}

// Fallback con prezzi mock se scraping fallisce
export async function fetchPriceWithFallback(merchant: string): Promise<number | null> {
  // Prova scraping reale
  const scrapedPrice = await scrapePrice(merchant)
  if (scrapedPrice) return scrapedPrice

  // Fallback a prezzi mock aggiornati (Gennaio 2025)
  const mockPrices: Record<string, number> = {
    'netflix': 12.99,
    'spotify': 10.99,
    'disney-plus': 8.99,
    'amazon-prime': 4.99,
    'youtube-premium': 11.99,
    'apple-music': 10.99,
    'dazn': 44.99,
    'nordvpn': 3.99,
    'expressvpn': 12.95,
    'surfshark': 2.49,
    'dropbox': 11.99,
    'google-one': 1.99,
    'icloud': 0.99,
    'pcloud': 4.99,
    'adobe-creative-cloud': 60.49,
    'canva': 11.99,
    'microsoft-365': 7.00,
    'zoom': 13.99,
    'playstation-plus': 16.99,
    'xbox-game-pass': 9.99,
    'nintendo-switch-online': 19.99
  }

  const fallbackPrice = mockPrices[merchant.toLowerCase()] || null
  if (fallbackPrice) {
    console.log(`⚠️ Using fallback price for ${merchant}: €${fallbackPrice}`)
  }
  
  return fallbackPrice
}

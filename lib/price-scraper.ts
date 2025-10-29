import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

interface ScraperConfig {
  url: string
  selector: string
  transform?: (text: string) => number
}

// Configurazione scraper per ogni servizio
const scraperConfigs: Record<string, ScraperConfig> = {
  'nordvpn': {
    url: 'https://nordvpn.com/it/pricing/',
    selector: '[data-testid="price-value"]',
    transform: (text) => parseFloat(text.replace(/[^0-9.,]/g, '').replace(',', '.'))
  },
  'expressvpn': {
    url: 'https://www.expressvpn.com/order',
    selector: '.price-amount',
    transform: (text) => parseFloat(text.replace(/[^0-9.,]/g, '').replace(',', '.'))
  },
  'dropbox': {
    url: 'https://www.dropbox.com/it/plans',
    selector: '[data-testid="price"]',
    transform: (text) => parseFloat(text.replace(/[^0-9.,]/g, '').replace(',', '.'))
  },
  'google-one': {
    url: 'https://one.google.com/about/plans',
    selector: '.plan-price',
    transform: (text) => parseFloat(text.replace(/[^0-9.,]/g, '').replace(',', '.'))
  },
  'netflix': {
    url: 'https://www.netflix.com/it/signup/planform',
    selector: '.plan-price',
    transform: (text) => parseFloat(text.replace(/[^0-9.,]/g, '').replace(',', '.'))
  },
  'spotify': {
    url: 'https://www.spotify.com/it/premium/',
    selector: '[data-testid="price"]',
    transform: (text) => parseFloat(text.replace(/[^0-9.,]/g, '').replace(',', '.'))
  },
  'disney-plus': {
    url: 'https://www.disneyplus.com/it-it/welcome/plans',
    selector: '.price',
    transform: (text) => parseFloat(text.replace(/[^0-9.,]/g, '').replace(',', '.'))
  },
  'canva': {
    url: 'https://www.canva.com/pricing/',
    selector: '[data-testid="pro-price"]',
    transform: (text) => parseFloat(text.replace(/[^0-9.,]/g, '').replace(',', '.'))
  }
}

export async function scrapePrice(merchant: string): Promise<number | null> {
  const config = scraperConfigs[merchant.toLowerCase()]
  if (!config) {
    console.log(`No scraper config for ${merchant}`)
    return null
  }

  let browser = null

  try {
    // Launch browser (Vercel compatible)
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    })

    const page = await browser.newPage()
    
    // Set user agent per evitare blocchi
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    
    // Vai alla pagina
    await page.goto(config.url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })

    // Aspetta che il selettore sia visibile
    await page.waitForSelector(config.selector, { timeout: 10000 })

    // Estrai il prezzo
    const priceText = await page.$eval(config.selector, el => el.textContent || '')
    
    await browser.close()

    // Trasforma il testo in numero
    const price = config.transform ? config.transform(priceText) : parseFloat(priceText)
    
    if (isNaN(price) || price <= 0) {
      console.error(`Invalid price for ${merchant}: ${priceText}`)
      return null
    }

    console.log(`Scraped ${merchant}: €${price}`)
    return price

  } catch (error) {
    console.error(`Error scraping ${merchant}:`, error)
    if (browser) await browser.close()
    return null
  }
}

// Fallback con prezzi mock se scraping fallisce
export async function fetchPriceWithFallback(merchant: string): Promise<number | null> {
  // Prova scraping reale
  const scrapedPrice = await scrapePrice(merchant)
  if (scrapedPrice) return scrapedPrice

  // Fallback a prezzi mock
  const mockPrices: Record<string, number> = {
    'nordvpn': 3.99,
    'expressvpn': 12.95,
    'dropbox': 9.99,
    'google-one': 9.99,
    'netflix': 12.99,
    'prime-video': 8.99,
    'disney-plus': 5.99,
    'adobe-creative-cloud': 54.99,
    'spotify': 10.99,
    'apple-music': 10.99,
    'canva': 9.99,
    'peloton': 44.00
  }

  return mockPrices[merchant] || null
}

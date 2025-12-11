import { NextResponse } from 'next/server'
import { scrapeServicePrice, getSupportedServices, getServiceInfo } from '@/lib/ai-price-scraper'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const service = searchParams.get('service')

  // Se nessun servizio specificato, ritorna lista servizi supportati
  if (!service) {
    const services = getSupportedServices().map(key => ({
      key,
      ...getServiceInfo(key)
    }))

    return NextResponse.json({
      message: 'Specify a service with ?service=netflix',
      supported_services: services
    })
  }

  try {
    console.log(`🔍 Testing price scrape for: ${service}`)

    const priceInfo = await scrapeServicePrice(service)

    if (!priceInfo) {
      return NextResponse.json({
        success: false,
        service,
        error: 'Could not extract price',
        suggestion: 'Service may not be configured or page structure changed'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      service,
      price_info: priceInfo
    })

  } catch (error) {
    console.error(`Error testing ${service}:`, error)
    return NextResponse.json({
      success: false,
      service,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// No caching for test endpoint
export const dynamic = 'force-dynamic'
export const maxDuration = 60

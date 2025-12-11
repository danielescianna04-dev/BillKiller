import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { scrapeServicePrice, getSupportedServices } from '@/lib/ai-price-scraper'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    // Verifica authorization header per sicurezza
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supportedServices = getSupportedServices()
    const updates: Array<{ service: string; price: number; plan: string | null }> = []
    const errors: Array<{ service: string; error: string }> = []
    const skipped: string[] = []

    console.log(`🚀 Starting AI price scraping for ${supportedServices.length} services...`)

    for (const serviceKey of supportedServices) {
      try {
        console.log(`\n📊 Processing ${serviceKey}...`)

        const priceInfo = await scrapeServicePrice(serviceKey)

        if (priceInfo && priceInfo.price) {
          // Aggiorna o inserisce nella tabella service_prices
          const { error: upsertError } = await supabase
            .from('service_prices')
            .upsert({
              service_key: serviceKey,
              price: priceInfo.price,
              currency: priceInfo.currency || 'EUR',
              period: priceInfo.period || 'monthly',
              plan_name: priceInfo.plan_name,
              source_url: priceInfo.source_url,
              confidence: priceInfo.confidence || 0.8,
              last_updated: new Date().toISOString()
            }, {
              onConflict: 'service_key'
            })

          if (upsertError) {
            console.error(`DB error for ${serviceKey}:`, upsertError)
            errors.push({ service: serviceKey, error: upsertError.message })
          } else {
            updates.push({
              service: serviceKey,
              price: priceInfo.price,
              plan: priceInfo.plan_name
            })
          }
        } else {
          skipped.push(serviceKey)
        }

        // Pausa tra richieste per non sovraccaricare
        await new Promise(resolve => setTimeout(resolve, 2000))

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        console.error(`❌ Error processing ${serviceKey}:`, errorMsg)
        errors.push({ service: serviceKey, error: errorMsg })
      }
    }

    console.log(`\n✅ Price update complete!`)
    console.log(`   Updated: ${updates.length}`)
    console.log(`   Skipped: ${skipped.length}`)
    console.log(`   Errors: ${errors.length}`)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        total: supportedServices.length,
        updated: updates.length,
        skipped: skipped.length,
        errors: errors.length
      },
      updates,
      skipped,
      errors
    })

  } catch (error) {
    console.error('Fatal error in price update:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

// Timeout lungo per AI scraping (max 5 minuti)
export const maxDuration = 300

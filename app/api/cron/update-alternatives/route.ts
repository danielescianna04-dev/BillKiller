import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchPriceWithFallback } from '@/lib/price-scraper'

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

    // Ottieni tutte le alternative attive
    const { data: alternatives, error } = await supabase
      .from('alternatives')
      .select('*')
      .eq('is_active', true)

    if (error) throw error

    const updates = []
    const errors = []

    for (const alt of alternatives || []) {
      try {
        // Fetch prezzo corrente con scraping reale
        const currentPrice = await fetchPriceWithFallback(alt.merchant_canonical)
        
        if (currentPrice && Math.abs(currentPrice - alt.alternative_price) > 0.5) {
          // Aggiorna prezzo nel database solo se differenza > €0.50
          const { error: updateError } = await supabase
            .from('alternatives')
            .update({
              alternative_price: currentPrice,
              last_price_check: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', alt.id)

          if (!updateError) {
            updates.push({
              merchant: alt.merchant_canonical,
              oldPrice: alt.alternative_price,
              newPrice: currentPrice
            })
          }
        } else {
          // Aggiorna solo timestamp check
          await supabase
            .from('alternatives')
            .update({ last_price_check: new Date().toISOString() })
            .eq('id', alt.id)
        }
      } catch (err) {
        errors.push({
          merchant: alt.merchant_canonical,
          error: err instanceof Error ? err.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      checked: alternatives?.length || 0,
      updated: updates.length,
      errorCount: errors.length,
      updates,
      errors
    })
  } catch (error) {
    console.error('Error updating alternatives:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Timeout più lungo per scraping
export const maxDuration = 300 // 5 minuti

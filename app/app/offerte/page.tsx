import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, TrendingDown, Sparkles, RefreshCw } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase'

export const revalidate = 3600 // Cache 1 ora

interface OfferWithPrice {
  id: string
  merchant_canonical: string
  alternative_name: string
  alternative_price: number
  savings_percentage: number
  affiliate_url: string
  description: string
  category: string
  is_active: boolean
  // From service_prices join
  current_market_price?: number
  market_plan_name?: string
  price_last_updated?: string
  calculated_savings?: number
}

async function getOffers(): Promise<OfferWithPrice[]> {
  const supabase = await createServerSupabaseClient()

  // Prima prova la vista con prezzi reali
  const { data: offersWithPrices, error: viewError } = await supabase
    .from('v_alternatives_with_prices')
    .select('*')
    .eq('is_active', true)
    .order('calculated_savings', { ascending: false })

  if (!viewError && offersWithPrices && offersWithPrices.length > 0) {
    return offersWithPrices
  }

  // Fallback alla tabella base se la vista non esiste ancora
  const { data } = await supabase
    .from('alternatives')
    .select('*')
    .eq('is_active', true)
    .order('savings_percentage', { ascending: false })

  return data || []
}

function formatLastUpdated(dateString?: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Aggiornato oggi'
  if (diffDays === 1) return 'Aggiornato ieri'
  if (diffDays < 7) return `Aggiornato ${diffDays} giorni fa`
  return `Aggiornato il ${date.toLocaleDateString('it-IT')}`
}

export default async function OffertePage() {
  const offers = await getOffers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Alternative più economiche</h1>
        <p className="text-gray-600">
          Scopri offerte e alternative per risparmiare sui tuoi abbonamenti.
        </p>
      </div>

      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <strong>Trasparenza:</strong> Alcuni link sono affiliati. Guadagniamo una commissione
              se sottoscrivi tramite noi, senza costi extra per te. Così manteniamo BillKiller a meno di 1€/mese.
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {offers.map((offer) => {
          // Usa i prezzi reali se disponibili
          const displaySavings = offer.calculated_savings ?? offer.savings_percentage
          const hasRealPrice = !!offer.current_market_price

          return (
            <Card key={offer.id} className="hover:shadow-lg transition-all hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{offer.category}</div>
                    <CardTitle className="text-xl">{offer.alternative_name}</CardTitle>
                  </div>
                  {displaySavings > 0 && (
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      -{displaySavings}%
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{offer.description}</p>

                <div className="flex items-center justify-center gap-4">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Prezzo offerta</div>
                    <div className="text-2xl font-bold text-green-600">
                      €{Number(offer.alternative_price).toFixed(2)}/mese
                    </div>
                  </div>
                </div>

                {/* Mostra prezzo di mercato se disponibile */}
                {hasRealPrice && offer.current_market_price && (
                  <div className="text-center text-sm text-gray-500">
                    <span className="line-through">
                      €{Number(offer.current_market_price).toFixed(2)}/mese
                    </span>
                    <span className="ml-2 text-xs">
                      ({offer.market_plan_name || offer.merchant_canonical})
                    </span>
                  </div>
                )}

                {displaySavings > 0 && (
                  <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg text-center">
                    Risparmi fino al <strong>{displaySavings}%</strong>
                  </div>
                )}

                <a href={offer.affiliate_url} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    Scopri offerta
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Link affiliato</span>
                  {offer.price_last_updated && (
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      {formatLastUpdated(offer.price_last_updated)}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

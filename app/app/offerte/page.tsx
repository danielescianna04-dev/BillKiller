import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, TrendingDown, Sparkles } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const revalidate = 3600 // Cache 1 ora

async function getOffers() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('alternatives')
    .select('*')
    .eq('is_active', true)
    .order('savings_percentage', { ascending: false })
  
  return data || []
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
        {offers.map((offer) => (
          <Card key={offer.id} className="hover:shadow-lg transition-all hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-1">{offer.category}</div>
                  <CardTitle className="text-xl">{offer.alternative_name}</CardTitle>
                </div>
                {offer.savings_percentage > 0 && (
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    -{offer.savings_percentage}%
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
                  <div className="text-2xl font-bold text-green-600">€{Number(offer.alternative_price).toFixed(2)}/mese</div>
                </div>
              </div>

              {offer.savings_percentage > 0 && (
                <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg text-center">
                  Risparmi fino al <strong>{offer.savings_percentage}%</strong>
                </div>
              )}

              <a href={offer.affiliate_url} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  Scopri offerta
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>

              <p className="text-xs text-gray-500 text-center">
                Link affiliato • Supporti BillKiller
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

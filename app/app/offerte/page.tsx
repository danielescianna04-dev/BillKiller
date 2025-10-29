'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, TrendingDown, Sparkles } from 'lucide-react'

const offers = [
  {
    category: 'VPN',
    merchant: 'NordVPN',
    current: 11.99,
    offer: 3.99,
    savings: 67,
    url: '/go/nordvpn',
    description: 'Piano 2 anni con 3 mesi gratis'
  },
  {
    category: 'Cloud Storage',
    merchant: 'pCloud',
    current: 9.99,
    offer: 4.99,
    savings: 50,
    url: '/go/pcloud',
    description: 'Piano lifetime in offerta'
  },
  {
    category: 'Streaming',
    merchant: 'Disney+',
    current: 8.99,
    offer: 5.99,
    savings: 33,
    url: '/go/disney',
    description: 'Piano annuale con sconto'
  },
  {
    category: 'Telefonia',
    merchant: 'Iliad',
    current: 29.99,
    offer: 9.99,
    savings: 67,
    url: '/go/iliad',
    description: 'Giga illimitati 5G'
  },
  {
    category: 'AI Tools',
    merchant: 'ChatGPT Plus',
    current: 20.00,
    offer: 20.00,
    savings: 0,
    url: '/go/chatgpt',
    description: 'Nessuna alternativa più economica'
  },
  {
    category: 'Design',
    merchant: 'Canva Pro',
    current: 11.99,
    offer: 9.99,
    savings: 17,
    url: '/go/canva',
    description: 'Piano annuale con sconto'
  }
]

export default function OffertePage() {
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
          <Card key={offer.merchant} className="hover:shadow-lg transition-all hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-1">{offer.category}</div>
                  <CardTitle className="text-xl">{offer.merchant}</CardTitle>
                </div>
                {offer.savings > 0 && (
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    -{offer.savings}%
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{offer.description}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Prezzo medio</div>
                  <div className="text-lg line-through text-gray-400">€{offer.current.toFixed(2)}/mese</div>
                </div>
                <TrendingDown className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-xs text-gray-500">Con offerta</div>
                  <div className="text-2xl font-bold text-green-600">€{offer.offer.toFixed(2)}/mese</div>
                </div>
              </div>

              {offer.savings > 0 && (
                <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                  Risparmi <strong>€{((offer.current - offer.offer) * 12).toFixed(2)}/anno</strong>
                </div>
              )}

              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                onClick={() => window.open(offer.url, '_blank')}
              >
                Scopri offerta
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>

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

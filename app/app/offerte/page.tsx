'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, TrendingDown, Sparkles, Loader2, RefreshCw, AlertCircle } from 'lucide-react'

interface Offer {
  id: string
  merchant_canonical: string
  alternative_name: string
  alternative_price: number
  savings_percentage: number
  affiliate_url: string
  description: string
  category: string
}

interface LivePrice {
  service: string
  price: number | null
  plan_name: string | null
  error?: string
}

// Offerte statiche
const OFFERS: Offer[] = [
  // Streaming Video
  {
    id: '1',
    merchant_canonical: 'netflix',
    alternative_name: 'Amazon Prime Video',
    alternative_price: 4.99,
    savings_percentage: 0,
    affiliate_url: 'https://www.amazon.it/amazonprime',
    description: 'Include anche spedizioni gratis e Prime Music',
    category: 'Streaming Video'
  },
  {
    id: '2',
    merchant_canonical: 'disney-plus',
    alternative_name: 'NOW Entertainment',
    alternative_price: 6.99,
    savings_percentage: 0,
    affiliate_url: 'https://www.nowtv.it/',
    description: 'Cinema e serie TV in streaming',
    category: 'Streaming Video'
  },
  {
    id: '3',
    merchant_canonical: 'dazn',
    alternative_name: 'NOW Sport',
    alternative_price: 14.99,
    savings_percentage: 0,
    affiliate_url: 'https://www.nowtv.it/sport',
    description: 'Sport in streaming a prezzo ridotto',
    category: 'Sport'
  },
  // Musica
  {
    id: '4',
    merchant_canonical: 'spotify',
    alternative_name: 'YouTube Music',
    alternative_price: 9.99,
    savings_percentage: 0,
    affiliate_url: 'https://music.youtube.com/premium',
    description: 'Include YouTube senza pubblicità',
    category: 'Musica'
  },
  {
    id: '5',
    merchant_canonical: 'apple-music',
    alternative_name: 'Spotify Free',
    alternative_price: 0,
    savings_percentage: 100,
    affiliate_url: 'https://www.spotify.com/it/free/',
    description: 'Versione gratuita con pubblicità',
    category: 'Musica'
  },
  // Cloud Storage
  {
    id: '6',
    merchant_canonical: 'dropbox',
    alternative_name: 'Google One 100GB',
    alternative_price: 1.99,
    savings_percentage: 0,
    affiliate_url: 'https://one.google.com',
    description: 'Più economico con stesse funzioni',
    category: 'Cloud Storage'
  },
  {
    id: '7',
    merchant_canonical: 'icloud',
    alternative_name: 'Google One 200GB',
    alternative_price: 2.99,
    savings_percentage: 0,
    affiliate_url: 'https://one.google.com',
    description: 'Alternativa cross-platform',
    category: 'Cloud Storage'
  },
  // VPN
  {
    id: '8',
    merchant_canonical: 'expressvpn',
    alternative_name: 'Surfshark',
    alternative_price: 2.49,
    savings_percentage: 0,
    affiliate_url: 'https://surfshark.com/it',
    description: 'Dispositivi illimitati, più economico',
    category: 'VPN'
  },
  {
    id: '9',
    merchant_canonical: 'nordvpn',
    alternative_name: 'Surfshark',
    alternative_price: 2.49,
    savings_percentage: 0,
    affiliate_url: 'https://surfshark.com/it',
    description: 'Dispositivi illimitati',
    category: 'VPN'
  },
  // Telefonia
  {
    id: '10',
    merchant_canonical: 'vodafone',
    alternative_name: 'Iliad',
    alternative_price: 9.99,
    savings_percentage: 0,
    affiliate_url: 'https://www.iliad.it',
    description: 'Giga illimitati a prezzo fisso per sempre',
    category: 'Telefonia'
  },
  {
    id: '11',
    merchant_canonical: 'tim',
    alternative_name: 'ho. Mobile',
    alternative_price: 6.99,
    savings_percentage: 0,
    affiliate_url: 'https://www.ho-mobile.it',
    description: 'Rete Vodafone a prezzo basso',
    category: 'Telefonia'
  },
  // Software
  {
    id: '12',
    merchant_canonical: 'adobe-creative-cloud',
    alternative_name: 'Canva Pro',
    alternative_price: 11.99,
    savings_percentage: 0,
    affiliate_url: 'https://www.canva.com/pro',
    description: 'Design grafico semplice e potente',
    category: 'Design'
  },
  {
    id: '13',
    merchant_canonical: 'microsoft-365',
    alternative_name: 'Google Workspace',
    alternative_price: 5.75,
    savings_percentage: 0,
    affiliate_url: 'https://workspace.google.com',
    description: 'Suite office completa online',
    category: 'Produttività'
  },
  // Gaming
  {
    id: '14',
    merchant_canonical: 'playstation-plus',
    alternative_name: 'Xbox Game Pass',
    alternative_price: 12.99,
    savings_percentage: 0,
    affiliate_url: 'https://www.xbox.com/it-IT/xbox-game-pass',
    description: 'Centinaia di giochi inclusi dal day one',
    category: 'Gaming'
  },
]

export default function OffertePage() {
  const [livePrices, setLivePrices] = useState<Record<string, LivePrice>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLivePrices = async () => {
    setLoading(true)
    setError(null)

    try {
      // Prendi i merchant unici dalle offerte
      const merchants = [...new Set(OFFERS.map(o => o.merchant_canonical))]

      const response = await fetch(`/api/prices/live?services=${merchants.join(',')}`)

      if (!response.ok) {
        throw new Error('Errore nel caricamento prezzi')
      }

      const data = await response.json()

      // Converti array in oggetto per lookup veloce
      const pricesMap: Record<string, LivePrice> = {}
      for (const price of data.prices) {
        pricesMap[price.service] = price
      }

      setLivePrices(pricesMap)
    } catch (err) {
      console.error('Error fetching live prices:', err)
      setError('Impossibile caricare i prezzi in tempo reale')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLivePrices()
  }, [])

  const calculateSavings = (offer: Offer, livePrice: LivePrice | undefined): number => {
    if (!livePrice?.price || livePrice.price <= offer.alternative_price) {
      return offer.savings_percentage
    }
    return Math.round(((livePrice.price - offer.alternative_price) / livePrice.price) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Alternative più economiche</h1>
          <p className="text-gray-600">
            Prezzi aggiornati in tempo reale dai siti ufficiali.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchLivePrices}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span className="ml-2">Aggiorna</span>
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <strong>Trasparenza:</strong> I prezzi vengono recuperati in tempo reale dai siti ufficiali.
              Alcuni link sono affiliati - guadagniamo una commissione senza costi extra per te.
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {OFFERS.map((offer) => {
          const livePrice = livePrices[offer.merchant_canonical]
          const savings = calculateSavings(offer, livePrice)
          const hasLivePrice = livePrice?.price !== null && livePrice?.price !== undefined

          return (
            <Card key={offer.id} className="hover:shadow-lg transition-all hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{offer.category}</div>
                    <CardTitle className="text-xl">{offer.alternative_name}</CardTitle>
                  </div>
                  {savings > 0 && (
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      -{savings}%
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{offer.description}</p>

                {/* Prezzo originale (live) */}
                {loading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Caricamento prezzo...</span>
                  </div>
                ) : hasLivePrice ? (
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">
                      Prezzo {offer.merchant_canonical.replace(/-/g, ' ')} {livePrice?.plan_name && `(${livePrice.plan_name})`}
                    </div>
                    <div className="text-lg text-gray-500 line-through">
                      €{livePrice!.price!.toFixed(2)}/mese
                    </div>
                  </div>
                ) : livePrice?.error ? (
                  <div className="text-center text-xs text-gray-400">
                    Prezzo non disponibile
                  </div>
                ) : null}

                {/* Prezzo alternativa */}
                <div className="flex items-center justify-center gap-4">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Con {offer.alternative_name}</div>
                    <div className="text-2xl font-bold text-green-600">
                      {offer.alternative_price === 0 ? (
                        'GRATIS'
                      ) : (
                        `€${offer.alternative_price.toFixed(2)}/mese`
                      )}
                    </div>
                  </div>
                </div>

                {savings > 0 && (
                  <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg text-center">
                    Risparmi <strong>{savings}%</strong>
                    {hasLivePrice && livePrice!.price! > offer.alternative_price && (
                      <span className="block text-xs mt-1">
                        = €{((livePrice!.price! - offer.alternative_price) * 12).toFixed(0)}/anno
                      </span>
                    )}
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
          )
        })}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink, TrendingDown, Sparkles, Loader2, RefreshCw, AlertCircle, Tv, Music, Cloud, Shield, Phone, Palette, Gamepad2, Zap, ArrowRight, BadgePercent } from 'lucide-react'

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

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; gradient: string; bgLight: string; textColor: string }> = {
  'Streaming Video': { icon: Tv, gradient: 'from-red-500 to-pink-500', bgLight: 'bg-red-50', textColor: 'text-red-600' },
  'Sport': { icon: Zap, gradient: 'from-green-500 to-emerald-500', bgLight: 'bg-green-50', textColor: 'text-green-600' },
  'Musica': { icon: Music, gradient: 'from-purple-500 to-violet-500', bgLight: 'bg-purple-50', textColor: 'text-purple-600' },
  'Cloud Storage': { icon: Cloud, gradient: 'from-blue-500 to-cyan-500', bgLight: 'bg-blue-50', textColor: 'text-blue-600' },
  'VPN': { icon: Shield, gradient: 'from-slate-600 to-slate-800', bgLight: 'bg-slate-50', textColor: 'text-slate-600' },
  'Telefonia': { icon: Phone, gradient: 'from-orange-500 to-amber-500', bgLight: 'bg-orange-50', textColor: 'text-orange-600' },
  'Design': { icon: Palette, gradient: 'from-pink-500 to-rose-500', bgLight: 'bg-pink-50', textColor: 'text-pink-600' },
  'Produttività': { icon: Sparkles, gradient: 'from-indigo-500 to-blue-500', bgLight: 'bg-indigo-50', textColor: 'text-indigo-600' },
  'Gaming': { icon: Gamepad2, gradient: 'from-violet-500 to-purple-600', bgLight: 'bg-violet-50', textColor: 'text-violet-600' },
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const fetchLivePrices = async () => {
    setLoading(true)
    setError(null)

    try {
      const merchants = [...new Set(OFFERS.map(o => o.merchant_canonical))]
      const response = await fetch(`/api/prices/live?services=${merchants.join(',')}`)

      if (!response.ok) {
        throw new Error('Errore nel caricamento prezzi')
      }

      const data = await response.json()
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

  const categories = [...new Set(OFFERS.map(o => o.category))]
  const filteredOffers = selectedCategory
    ? OFFERS.filter(o => o.category === selectedCategory)
    : OFFERS

  // Calcola risparmio totale potenziale
  const totalPotentialSavings = OFFERS.reduce((sum, offer) => {
    const livePrice = livePrices[offer.merchant_canonical]
    if (livePrice?.price && livePrice.price > offer.alternative_price) {
      return sum + (livePrice.price - offer.alternative_price) * 12
    }
    return sum
  }, 0)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 sm:p-8 md:p-10 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                <BadgePercent className="w-4 h-4" />
                Risparmia fino al 100%
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
                Alternative più economiche
              </h1>
              <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-xl">
                Prezzi aggiornati in tempo reale. Trova l'alternativa perfetta per risparmiare sui tuoi abbonamenti.
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={fetchLivePrices}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm self-start"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Aggiorna prezzi
            </Button>
          </div>

          {/* Stats */}
          {!loading && totalPotentialSavings > 0 && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex flex-wrap gap-4 sm:gap-8">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold">€{totalPotentialSavings.toFixed(0)}</div>
                  <div className="text-white/70 text-xs sm:text-sm">Risparmio potenziale/anno</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold">{OFFERS.length}</div>
                  <div className="text-white/70 text-xs sm:text-sm">Offerte disponibili</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold">{categories.length}</div>
                  <div className="text-white/70 text-xs sm:text-sm">Categorie</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Transparency Note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
        <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-900">
          <strong>Trasparenza:</strong> I prezzi vengono recuperati in tempo reale dai siti ufficiali.
          Alcuni link sono affiliati - guadagniamo una commissione senza costi extra per te.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            selectedCategory === null
              ? 'bg-gray-900 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Tutte
        </button>
        {categories.map((category) => {
          const config = CATEGORY_CONFIG[category] || { icon: Sparkles, gradient: 'from-gray-500 to-gray-600', bgLight: 'bg-gray-50', textColor: 'text-gray-600' }
          const Icon = config.icon
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                selectedCategory === category
                  ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                  : `${config.bgLight} ${config.textColor} hover:opacity-80`
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {category}
            </button>
          )
        })}
      </div>

      {/* Offers Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredOffers.map((offer) => {
          const livePrice = livePrices[offer.merchant_canonical]
          const savings = calculateSavings(offer, livePrice)
          const hasLivePrice = livePrice?.price !== null && livePrice?.price !== undefined
          const config = CATEGORY_CONFIG[offer.category] || { icon: Sparkles, gradient: 'from-gray-500 to-gray-600', bgLight: 'bg-gray-50', textColor: 'text-gray-600' }
          const Icon = config.icon

          return (
            <div
              key={offer.id}
              className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col"
            >
              {/* Category Badge */}
              <div className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgLight} ${config.textColor}`}>
                <Icon className="w-3 h-3" />
                {offer.category}
              </div>

              {/* Savings Badge */}
              {savings > 0 && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  -{savings}%
                </div>
              )}

              <div className="p-5 sm:p-6 pt-14 flex flex-col flex-1">
                {/* Alternative Name */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {offer.alternative_name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{offer.description}</p>

                {/* Price Comparison */}
                <div className="flex-1 flex flex-col justify-center py-4 space-y-3">
                  {/* Original Price */}
                  <div className="min-h-[44px] flex items-center">
                    {loading ? (
                      <div className="flex items-center text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        <span className="text-sm">Caricamento...</span>
                      </div>
                    ) : hasLivePrice ? (
                      <div className="w-full">
                        <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                          Invece di {offer.merchant_canonical.replace(/-/g, ' ')}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl text-gray-400 line-through">
                            €{livePrice!.price!.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-400">/mese</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-300">
                        Confronto prezzo non disponibile
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-100"></div>
                    <TrendingDown className="w-5 h-5 text-green-500" />
                    <div className="flex-1 h-px bg-gray-100"></div>
                  </div>

                  {/* Alternative Price */}
                  <div>
                    <div className="text-xs text-green-600 uppercase tracking-wide mb-1 font-medium">
                      Con {offer.alternative_name}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-bold text-green-600">
                        {offer.alternative_price === 0 ? 'GRATIS' : `€${offer.alternative_price.toFixed(2)}`}
                      </span>
                      {offer.alternative_price > 0 && (
                        <span className="text-sm text-gray-500">/mese</span>
                      )}
                    </div>
                  </div>

                  {/* Yearly Savings */}
                  {savings > 0 && hasLivePrice && livePrice!.price! > offer.alternative_price && (
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <div className="text-green-700 font-semibold">
                        Risparmi €{((livePrice!.price! - offer.alternative_price) * 12).toFixed(0)}/anno
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <div className="mt-auto pt-4">
                  <a href={offer.affiliate_url} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className={`w-full bg-gradient-to-r ${config.gradient} hover:opacity-90 transition-opacity text-white font-semibold py-5 rounded-xl group/btn`}>
                      <span>Scopri offerta</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                  <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2">
                    Link affiliato
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessuna offerta in questa categoria</h3>
          <p className="text-gray-500">Seleziona un'altra categoria o visualizza tutte le offerte.</p>
        </div>
      )}
    </div>
  )
}

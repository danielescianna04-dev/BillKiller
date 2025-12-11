
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { CreditCard, Mail, CheckCircle, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react'
import ExportButton from './export-button'
import SubscriptionDetailsDialog from './subscription-details-dialog'
import { useState } from 'react'

interface Subscription {
  id: string
  merchant_canonical: string
  title: string
  periodicity: string
  amount: number
  monthly_amount: number
  currency: string
  confidence: number
  first_seen: string
  last_seen: string
  email_hint?: string
  payment_hint?: string
  is_installment?: boolean
  installments_total?: number | null
  installments_paid?: number | null
  installments_remaining?: number | null
  meta?: { identification_method?: 'email' | 'description' }
}

interface SubscriptionsListProps {
  subscriptions: Subscription[]
  isPremium: boolean
  title?: string
}

export default function SubscriptionsList({ subscriptions, isPremium, title = "I Tuoi Abbonamenti" }: SubscriptionsListProps) {
  const [selectedSubscription, setSelectedSubscription] = useState<{ id: string; title: string } | null>(null)
  
  const getPeriodicityLabel = (periodicity: string) => {
    const labels = {
      monthly: 'Mese',
      yearly: 'Anno',
      quarterly: 'Trimestre',
      semiannual: 'Semestre',
      unknown: 'Sconosciuto'
    }
    return labels[periodicity as keyof typeof labels] || periodicity
  }

  if (!subscriptions.length) {
    return (
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Nessun abbonamento attivo
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Appena aggiungerai un abbonamento, lo vedrai qui. Inizia caricando un estratto conto.
            </p>
            <a 
              href="/app/upload" 
              className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 font-semibold transition-all"
            >
              Carica Documento
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm sm:text-base md:text-xl font-bold text-gray-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500 flex-shrink-0" />
          <span className="whitespace-nowrap">{title}</span>
        </h2>
        {isPremium && <ExportButton />}
      </div>
      
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {subscriptions.map((sub) => {
          // Merchant generici che non permettono di capire il servizio specifico
          const genericMerchants = ['apple', 'google', 'microsoft', 'amazon']
          const isGenericMerchant = genericMerchants.some(m =>
            sub.merchant_canonical.toLowerCase() === m ||
            sub.merchant_canonical.toLowerCase().startsWith(m + '-')
          )

          const isUnknown = sub.merchant_canonical.includes('unknown-') ||
                           sub.meta?.identification_method === 'description' ||
                           sub.periodicity === 'unknown' ||
                           isGenericMerchant
          return (
          <Card 
            key={sub.id}
            className={`group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col ${
              isUnknown 
                ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 hover:border-amber-400' 
                : 'border-gray-200/80 hover:border-green-400'
            }`}
          >
            <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col flex-1">
              {isUnknown && (
                <div className="mb-2 flex items-center gap-1.5 text-amber-700">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs font-medium">Non identificato</span>
                </div>
              )}
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg text-gray-900 truncate">{sub.title}</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 truncate">{sub.merchant_canonical}</p>
                </div>
                <div className={`text-[9px] sm:text-[10px] md:text-xs font-bold px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full flex-shrink-0 ${sub.confidence > 0.8 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {Math.round(sub.confidence * 100)}%
                </div>
              </div>
              
              <div className="my-3 sm:my-4 md:my-6 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">{formatCurrency(sub.amount)}</div>
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500">/{getPeriodicityLabel(sub.periodicity)}</div>
              </div>

              <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs md:text-sm">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-gray-600 flex items-center gap-1 sm:gap-2">
                    <TrendingUp className="w-3 h-3 flex-shrink-0"/>
                    <span className="hidden md:inline">Spesa annuale</span>
                    <span className="md:hidden">Annuale</span>
                  </span>
                  <span className="font-semibold text-gray-800">{formatCurrency(sub.monthly_amount * 12)}</span>
                </div>
                {sub.payment_hint && (
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-gray-600 flex items-center gap-1 sm:gap-2">
                      <CreditCard className="w-3 h-3 flex-shrink-0"/>
                      Carta
                    </span>
                    <span className="font-semibold text-gray-800">...{sub.payment_hint}</span>
                  </div>
                )}
                {sub.email_hint && (
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-gray-600 flex items-center gap-1 sm:gap-2">
                      <Mail className="w-3 h-3 flex-shrink-0"/>
                      Email
                    </span>
                    <span className="font-semibold text-gray-800 truncate max-w-[80px] sm:max-w-[120px]">{sub.email_hint}</span>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-2 sm:pt-3 md:pt-4 border-t border-gray-100">
                {isUnknown ? (
                  <div className="text-center">
                    <p className="text-[9px] sm:text-[10px] text-amber-700 px-2">
                      {(() => {
                        const merchant = sub.merchant_canonical.toLowerCase()
                        if (merchant.startsWith('apple') || merchant === 'apple') {
                          return 'Potrebbe essere iCloud, Music o altro. Verifica in Impostazioni > [tuo nome] > Abbonamenti sul tuo iPhone/iPad'
                        }
                        if (merchant.startsWith('google') || merchant === 'google') {
                          return 'Potrebbe essere YouTube, One o altro. Verifica su play.google.com/store/account/subscriptions'
                        }
                        if (merchant.startsWith('samsung') || merchant === 'samsung') {
                          return 'Verifica in Galaxy Store > Menu > Abbonamenti sul tuo dispositivo Samsung'
                        }
                        if (merchant.startsWith('microsoft') || merchant === 'microsoft') {
                          return 'Potrebbe essere Xbox, 365 o altro. Verifica su account.microsoft.com/services'
                        }
                        if (merchant.startsWith('amazon') || merchant === 'amazon') {
                          return 'Potrebbe essere Prime, Music o altro. Verifica su amazon.it/gp/primecentral'
                        }
                        return 'Servizio non identificato'
                      })()}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <button 
                      onClick={() => setSelectedSubscription({ id: sub.id, title: sub.title })}
                      className="text-[10px] sm:text-xs md:text-sm font-semibold text-green-600 group-hover:text-green-500 inline-flex items-center gap-1"
                    >
                      Dettagli <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transform transition-transform group-hover:translate-x-1"/>
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
        })}
      </div>
      
      {selectedSubscription && (
        <SubscriptionDetailsDialog
          subscriptionId={selectedSubscription.id}
          title={selectedSubscription.title}
          open={!!selectedSubscription}
          onOpenChange={(open) => !open && setSelectedSubscription(null)}
        />
      )}
    </div>
  )
}


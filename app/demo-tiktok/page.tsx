'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle, TrendingDown, AlertTriangle, Sparkles, CreditCard, Calendar, ArrowRight, X } from 'lucide-react'
import BillKillerLogo from '@/components/logo'

// Dati finti per il demo
const FAKE_SUBSCRIPTIONS = [
  { name: 'Netflix', amount: 17.99, icon: '🎬', color: 'bg-red-500' },
  { name: 'Spotify', amount: 10.99, icon: '🎵', color: 'bg-green-500' },
  { name: 'Amazon Prime', amount: 4.99, icon: '📦', color: 'bg-orange-500' },
  { name: 'Disney+', amount: 8.99, icon: '🏰', color: 'bg-blue-500' },
  { name: 'iCloud 200GB', amount: 2.99, icon: '☁️', color: 'bg-gray-500' },
  { name: 'YouTube Premium', amount: 11.99, icon: '▶️', color: 'bg-red-600' },
  { name: 'ChatGPT Plus', amount: 20.00, icon: '🤖', color: 'bg-emerald-500' },
  { name: 'Palestra FitActive', amount: 29.90, icon: '💪', color: 'bg-purple-500' },
]

function DemoContent() {
  const searchParams = useSearchParams()
  const secret = searchParams.get('key')

  // Protezione con chiave segreta
  if (secret !== 'billkiller2024') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/20 text-sm">404</p>
      </div>
    )
  }

  const totalMonthly = FAKE_SUBSCRIPTIONS.reduce((sum, s) => sum + s.amount, 0)
  const totalYearly = totalMonthly * 12

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b border-amber-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BillKillerLogo size={28} />
            <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              BillKiller
            </span>
          </div>
          <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">Premium</span>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="mx-4 mt-4 p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl text-white">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm">Attenzione!</p>
            <p className="text-xs text-white/90 mt-0.5">
              Stai spendendo <span className="font-bold">€{totalYearly.toFixed(0)}/anno</span> in abbonamenti
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-lg shadow-amber-500/10 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-500">Spesa Mensile</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">€{totalMonthly.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg shadow-amber-500/10 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-500">Spesa Annuale</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">€{totalYearly.toFixed(2)}</p>
        </div>
      </div>

      {/* Subscriptions Found */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            {FAKE_SUBSCRIPTIONS.length} Abbonamenti Trovati
          </h2>
        </div>

        <div className="space-y-3">
          {FAKE_SUBSCRIPTIONS.map((sub, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 shadow-lg shadow-gray-200/50 border border-gray-100 flex items-center justify-between"
              style={{
                animation: `slideIn 0.3s ease-out ${i * 0.1}s both`
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${sub.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                  {sub.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{sub.name}</p>
                  <p className="text-xs text-gray-500">Mensile</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">€{sub.amount.toFixed(2)}</p>
                <p className="text-xs text-gray-400">/mese</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Suggestion */}
      <div className="px-4 mt-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold">Potresti risparmiare</p>
              <p className="text-3xl font-bold mt-1">€247/anno</p>
              <p className="text-sm text-white/80 mt-2">
                Scopri alternative più economiche ai tuoi abbonamenti
              </p>
            </div>
          </div>
          <button className="w-full mt-4 bg-white text-green-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
            Scopri come <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
        <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 text-lg">
          <Sparkles className="w-5 h-5" />
          Prova BillKiller Gratis
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">
          Nessuna carta richiesta • 100% Privacy
        </p>
      </div>

      {/* Spacer for fixed CTA */}
      <div className="h-28" />

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

export default function DemoTikTokPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DemoContent />
    </Suspense>
  )
}

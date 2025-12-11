'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle, TrendingDown, AlertTriangle, Sparkles, CreditCard, Calendar, ArrowRight, Flame, Zap, X } from 'lucide-react'
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

// Versione Screenshot - compatta per singola schermata
function ScreenshotVersion() {
  const subscriptions = FAKE_SUBSCRIPTIONS.slice(0, 5) // Solo 5 per stare in uno screenshot
  const totalMonthly = FAKE_SUBSCRIPTIONS.reduce((sum, s) => sum + s.amount, 0)
  const totalYearly = totalMonthly * 12

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header compatto */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">BillKiller</span>
              <p className="text-xs text-slate-400">I tuoi abbonamenti</p>
            </div>
          </div>
          <div className="bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-full">
            <span className="text-xs font-bold text-amber-400">8 trovati</span>
          </div>
        </div>
      </div>

      {/* Big Number - Impatto visivo */}
      <div className="px-5 py-6 text-center">
        <p className="text-slate-400 text-sm mb-2">Stai spendendo ogni anno</p>
        <div className="relative inline-block">
          <p className="text-6xl font-black text-white tracking-tight">
            €{totalYearly.toFixed(0)}
          </p>
          <div className="absolute -top-2 -right-8 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            WOW
          </div>
        </div>
        <p className="text-slate-500 text-sm mt-2">in abbonamenti nascosti</p>
      </div>

      {/* Lista abbonamenti compatta */}
      <div className="px-5 flex-1">
        <div className="bg-slate-800/50 rounded-3xl p-4 border border-slate-700/50">
          <div className="space-y-3">
            {subscriptions.map((sub, i) => (
              <div
                key={i}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 ${sub.color} rounded-xl flex items-center justify-center text-xl shadow-lg`}>
                    {sub.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{sub.name}</p>
                    <p className="text-xs text-slate-500">ogni mese</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-white">€{sub.amount.toFixed(2)}</p>
              </div>
            ))}
            {/* More indicator */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="w-2 h-2 bg-slate-600 rounded-full" />
              <div className="w-2 h-2 bg-slate-600 rounded-full" />
              <div className="w-2 h-2 bg-slate-600 rounded-full" />
              <span className="text-xs text-slate-500 ml-1">+3 altri</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risparmio + CTA */}
      <div className="px-5 pb-8 pt-4">
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs">Potresti risparmiare</p>
              <p className="text-2xl font-bold text-white">€247/anno</p>
            </div>
          </div>
          <Zap className="w-8 h-8 text-white/50" />
        </div>

        <button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-lg shadow-lg shadow-amber-500/30">
          Prova Gratis
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-xs text-slate-600 mt-3">
          billkiller.it
        </p>
      </div>
    </div>
  )
}

// Versione 3 - Prima/Dopo
function BeforeAfterVersion() {
  const totalMonthly = FAKE_SUBSCRIPTIONS.reduce((sum, s) => sum + s.amount, 0)
  const savedMonthly = 20.58 // Simulato

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 pt-8 pb-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Flame className="w-8 h-8 text-white" />
          <span className="text-2xl font-bold text-white">BillKiller</span>
        </div>
        <p className="text-white/90 text-sm">Hai controllato i tuoi abbonamenti?</p>
      </div>

      {/* Cards Before/After */}
      <div className="px-5 -mt-10 flex-1">
        {/* PRIMA */}
        <div className="bg-white rounded-3xl shadow-xl p-5 mb-4 border-2 border-red-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-5 h-5 text-red-500" />
            </div>
            <span className="font-bold text-red-500">PRIMA</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-gray-500 text-sm">Spendevi</p>
              <p className="text-4xl font-black text-gray-900">€{totalMonthly.toFixed(2)}</p>
              <p className="text-gray-400 text-sm">/mese</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">8 abbonamenti</p>
              <p className="text-gray-400 text-xs">alcuni dimenticati</p>
            </div>
          </div>
        </div>

        {/* DOPO */}
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl shadow-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold">DOPO</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/80 text-sm">Ora spendi</p>
              <p className="text-4xl font-black">€{(totalMonthly - savedMonthly).toFixed(2)}</p>
              <p className="text-white/60 text-sm">/mese</p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 rounded-xl px-3 py-2">
                <p className="text-white/80 text-xs">Risparmi</p>
                <p className="text-xl font-bold">€{(savedMonthly * 12).toFixed(0)}/anno</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-8 pt-6">
        <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-lg">
          <Sparkles className="w-5 h-5" />
          Scopri quanto risparmi
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          Gratis • Nessuna carta • billkiller.it
        </p>
      </div>
    </div>
  )
}

// Versione originale con scroll
function ScrollVersion() {
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

function DemoContent() {
  const searchParams = useSearchParams()
  const secret = searchParams.get('key')
  const version = searchParams.get('v') || '1'

  // Protezione con chiave segreta
  if (secret !== 'billkiller2024') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/20 text-sm">404</p>
      </div>
    )
  }

  // Selezione versione
  if (version === '2') {
    return <ScreenshotVersion />
  }
  if (version === '3') {
    return <BeforeAfterVersion />
  }
  return <ScrollVersion />
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

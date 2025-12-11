'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle, TrendingDown, AlertTriangle, Sparkles, CreditCard, Calendar, ArrowRight, Flame, Zap, X, Eye, EyeOff, Skull, Bell, Shield, Trash2, Star } from 'lucide-react'
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

// Versione 4 - "Soldi che bruciano" stile drammatico
function MoneyBurningVersion() {
  const totalMonthly = FAKE_SUBSCRIPTIONS.reduce((sum, s) => sum + s.amount, 0)
  const totalYearly = totalMonthly * 12
  const perDay = totalMonthly / 30

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Fire effect header */}
      <div className="relative pt-12 pb-8 px-5">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/30 via-red-600/20 to-transparent" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 px-4 py-2 rounded-full mb-6">
            <Skull className="w-4 h-4 text-red-500" />
            <span className="text-red-400 text-sm font-bold">ALERT</span>
          </div>
          <p className="text-white/60 text-sm mb-2">Ogni giorno stai bruciando</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-6xl font-black text-transparent bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 bg-clip-text">
              €{perDay.toFixed(2)}
            </span>
            <Flame className="w-10 h-10 text-orange-500 animate-pulse" />
          </div>
          <p className="text-white/40 text-xs mt-3">in abbonamenti che non usi</p>
        </div>
      </div>

      {/* Abbonamenti "in fiamme" */}
      <div className="px-5 flex-1">
        <div className="space-y-3">
          {FAKE_SUBSCRIPTIONS.slice(0, 4).map((sub, i) => (
            <div
              key={i}
              className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 border border-orange-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-2xl">
                    {sub.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{sub.name}</p>
                    <p className="text-xs text-orange-400">€{(sub.amount * 12).toFixed(0)}/anno</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">€{sub.amount}</p>
                  <Flame className="w-4 h-4 text-orange-500 ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totale drammatico */}
      <div className="px-5 pb-8 pt-4">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-5 text-center mb-4">
          <p className="text-white/80 text-sm">Totale annuale</p>
          <p className="text-4xl font-black text-white my-2">€{totalYearly.toFixed(0)}</p>
          <p className="text-white/60 text-xs">che potrebbero restare in tasca tua</p>
        </div>

        <button className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-lg">
          Smetti di bruciare soldi
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-xs text-white/30 mt-3">billkiller.it</p>
      </div>
    </div>
  )
}

// Versione 5 - "Notifica shock" stile iPhone notification
function NotificationVersion() {
  const totalMonthly = FAKE_SUBSCRIPTIONS.reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col justify-center px-4">
      {/* Fake time bar */}
      <div className="text-center mb-8">
        <p className="text-black/80 font-semibold text-sm">9:41</p>
        <p className="text-black/40 text-xs">Mercoledì 11 Dicembre</p>
      </div>

      {/* Notification stack */}
      <div className="space-y-3">
        {/* Main notification */}
        <div className="bg-white rounded-3xl p-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">BillKiller</span>
                <span className="text-xs text-gray-400">ora</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Ho trovato <span className="font-bold text-red-500">8 abbonamenti</span> attivi collegati alla tua banca
              </p>
              <div className="mt-3 bg-red-50 rounded-xl p-3 border border-red-100">
                <p className="text-red-600 text-xs font-medium">Stai spendendo</p>
                <p className="text-2xl font-black text-red-600">€{totalMonthly.toFixed(2)}/mese</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary notifications */}
        <div className="bg-white/80 rounded-2xl p-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Netflix</span> rinnoverà tra 3 giorni
              </p>
              <p className="text-xs text-gray-400">€17.99</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 rounded-2xl p-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">2 abbonamenti</span> non usati da 3+ mesi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8">
        <button className="w-full bg-black text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
          Scopri i tuoi abbonamenti
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">billkiller.it • Gratis</p>
      </div>
    </div>
  )
}

// Versione 6 - "Confronto visivo" con grafico a barre
function BarChartVersion() {
  const subscriptions = FAKE_SUBSCRIPTIONS.slice(0, 6)
  const maxAmount = Math.max(...subscriptions.map(s => s.amount))
  const totalMonthly = FAKE_SUBSCRIPTIONS.reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col px-5 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <Flame className="w-8 h-8 text-amber-500" />
          <span className="text-2xl font-bold text-white">BillKiller</span>
        </div>
        <p className="text-slate-400 text-sm">Dove vanno i tuoi soldi ogni mese?</p>
      </div>

      {/* Bar chart */}
      <div className="flex-1 space-y-4">
        {subscriptions.map((sub, i) => {
          const width = (sub.amount / maxAmount) * 100
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                {sub.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-medium">{sub.name}</span>
                  <span className="text-white font-bold">€{sub.amount}</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${sub.color} rounded-full`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total */}
      <div className="mt-8 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-400 text-sm">Totale mensile</p>
            <p className="text-3xl font-black text-white">€{totalMonthly.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs">All'anno</p>
            <p className="text-xl font-bold text-amber-400">€{(totalMonthly * 12).toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button className="mt-6 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
        Analizza i tuoi
        <ArrowRight className="w-5 h-5" />
      </button>
      <p className="text-center text-xs text-slate-600 mt-3">billkiller.it</p>
    </div>
  )
}

// Versione 7 - "Cancella e risparmia" con swipe cards
function SwipeCardsVersion() {
  const cancelledSubs = [
    { name: 'Palestra mai usata', amount: 29.90, icon: '💪', saved: true },
    { name: 'App dimenticata', amount: 9.99, icon: '📱', saved: true },
    { name: 'Streaming duplicato', amount: 8.99, icon: '📺', saved: true },
  ]
  const totalSaved = cancelledSubs.reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="px-5 pt-8 pb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 rounded-full mb-4">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-bold">Soldi salvati</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Marco ha cancellato 3 abbonamenti
        </h1>
        <p className="text-slate-400 text-sm">che non usava più</p>
      </div>

      {/* Cancelled cards */}
      <div className="px-5 flex-1 space-y-4">
        {cancelledSubs.map((sub, i) => (
          <div
            key={i}
            className="bg-slate-800/50 rounded-2xl p-4 border border-emerald-500/20 relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-emerald-500/20 to-transparent flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex items-center gap-4 pr-12">
              <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center text-2xl">
                {sub.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white line-through opacity-60">{sub.name}</p>
                <p className="text-emerald-400 text-sm font-bold">+€{sub.amount}/mese risparmiati</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Savings summary */}
      <div className="px-5 pb-8 pt-4">
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-6 text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-5 h-5 text-white" />
            <span className="text-white/80 text-sm font-medium">Risparmio totale</span>
            <Star className="w-5 h-5 text-white" />
          </div>
          <p className="text-5xl font-black text-white">€{(totalSaved * 12).toFixed(0)}</p>
          <p className="text-white/60 text-sm mt-1">all'anno</p>
        </div>

        <button className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-lg">
          Trova i tuoi abbonamenti inutili
        </button>
        <p className="text-center text-xs text-slate-500 mt-3">billkiller.it • Gratis</p>
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
  if (version === '4') {
    return <MoneyBurningVersion />
  }
  if (version === '5') {
    return <NotificationVersion />
  }
  if (version === '6') {
    return <BarChartVersion />
  }
  if (version === '7') {
    return <SwipeCardsVersion />
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

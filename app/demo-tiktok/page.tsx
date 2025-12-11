'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle, TrendingDown, AlertTriangle, Sparkles, CreditCard, Calendar, ArrowRight, Flame, Zap, X, Eye, EyeOff, Skull, Bell, Shield, Trash2, Star, Upload, Scan, PiggyBank, Gift, Clock, Target } from 'lucide-react'
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

// Versione Screenshot (v2) - compatta per singola schermata
function ScreenshotVersion() {
  const subscriptions = FAKE_SUBSCRIPTIONS.slice(0, 4)
  const totalMonthly = FAKE_SUBSCRIPTIONS.reduce((sum, s) => sum + s.amount, 0)
  const totalYearly = totalMonthly * 12

  return (
    <div className="h-screen max-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
      {/* Header compatto */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">BillKiller</span>
              <p className="text-[10px] text-slate-400">I tuoi abbonamenti</p>
            </div>
          </div>
          <div className="bg-amber-500/20 border border-amber-500/30 px-2 py-1 rounded-full">
            <span className="text-[10px] font-bold text-amber-400">8 trovati</span>
          </div>
        </div>
      </div>

      {/* Big Number */}
      <div className="px-4 py-3 text-center">
        <p className="text-slate-400 text-xs mb-1">Stai spendendo ogni anno</p>
        <div className="relative inline-block">
          <p className="text-5xl font-black text-white tracking-tight">€{totalYearly.toFixed(0)}</p>
          <div className="absolute -top-1 -right-6 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">WOW</div>
        </div>
        <p className="text-slate-500 text-xs mt-1">in abbonamenti nascosti</p>
      </div>

      {/* Lista abbonamenti */}
      <div className="px-4 flex-1">
        <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
          <div className="space-y-2">
            {subscriptions.map((sub, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 ${sub.color} rounded-lg flex items-center justify-center text-lg`}>{sub.icon}</div>
                  <div>
                    <p className="font-semibold text-white text-sm">{sub.name}</p>
                    <p className="text-[10px] text-slate-500">ogni mese</p>
                  </div>
                </div>
                <p className="text-base font-bold text-white">€{sub.amount.toFixed(2)}</p>
              </div>
            ))}
            <div className="flex items-center justify-center gap-1 pt-1">
              <div className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
              <div className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
              <div className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
              <span className="text-[10px] text-slate-500 ml-1">+4 altri</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risparmio + CTA */}
      <div className="px-4 pb-5 pt-2">
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl p-3 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-[10px]">Potresti risparmiare</p>
              <p className="text-xl font-bold text-white">€247/anno</p>
            </div>
          </div>
          <Zap className="w-6 h-6 text-white/50" />
        </div>
        <button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-base">
          Prova Gratis <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-center text-[10px] text-slate-600 mt-2">billkiller.it</p>
      </div>
    </div>
  )
}

// Versione 3 - Prima/Dopo
function BeforeAfterVersion() {
  const totalMonthly = FAKE_SUBSCRIPTIONS.reduce((sum, s) => sum + s.amount, 0)
  const savedMonthly = 20.58

  return (
    <div className="h-screen max-h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 pt-6 pb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Flame className="w-6 h-6 text-white" />
          <span className="text-xl font-bold text-white">BillKiller</span>
        </div>
        <p className="text-white/90 text-xs">Hai controllato i tuoi abbonamenti?</p>
      </div>

      {/* Cards Before/After */}
      <div className="px-4 -mt-8 flex-1 flex flex-col justify-center">
        {/* PRIMA */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-3 border-2 border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-4 h-4 text-red-500" />
            </div>
            <span className="font-bold text-red-500 text-sm">PRIMA</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-gray-500 text-xs">Spendevi</p>
              <p className="text-3xl font-black text-gray-900">€{totalMonthly.toFixed(2)}</p>
              <p className="text-gray-400 text-xs">/mese</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-[10px]">8 abbonamenti</p>
              <p className="text-gray-400 text-[10px]">alcuni dimenticati</p>
            </div>
          </div>
        </div>

        {/* DOPO */}
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm">DOPO</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/80 text-xs">Ora spendi</p>
              <p className="text-3xl font-black">€{(totalMonthly - savedMonthly).toFixed(2)}</p>
              <p className="text-white/60 text-xs">/mese</p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 rounded-lg px-2 py-1.5">
                <p className="text-white/80 text-[10px]">Risparmi</p>
                <p className="text-lg font-bold">€{(savedMonthly * 12).toFixed(0)}/anno</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-5 pt-3">
        <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-base">
          <Sparkles className="w-4 h-4" />
          Scopri quanto risparmi
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-2">Gratis • Nessuna carta • billkiller.it</p>
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
    <div className="h-screen max-h-screen bg-black flex flex-col overflow-hidden">
      {/* Fire effect header */}
      <div className="relative pt-6 pb-4 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/30 via-red-600/20 to-transparent" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 px-3 py-1 rounded-full mb-3">
            <Skull className="w-3 h-3 text-red-500" />
            <span className="text-red-400 text-xs font-bold">ALERT</span>
          </div>
          <p className="text-white/60 text-xs mb-1">Ogni giorno stai bruciando</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-5xl font-black text-transparent bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 bg-clip-text">
              €{perDay.toFixed(2)}
            </span>
            <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
          </div>
          <p className="text-white/40 text-[10px] mt-1">in abbonamenti che non usi</p>
        </div>
      </div>

      {/* Abbonamenti "in fiamme" */}
      <div className="px-4 flex-1">
        <div className="space-y-2">
          {FAKE_SUBSCRIPTIONS.slice(0, 4).map((sub, i) => (
            <div key={i} className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-3 border border-orange-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-xl">{sub.icon}</div>
                  <div>
                    <p className="font-semibold text-white text-sm">{sub.name}</p>
                    <p className="text-[10px] text-orange-400">€{(sub.amount * 12).toFixed(0)}/anno</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-1">
                  <p className="text-lg font-bold text-white">€{sub.amount}</p>
                  <Flame className="w-3 h-3 text-orange-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totale drammatico */}
      <div className="px-4 pb-5 pt-2">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-3 text-center mb-3">
          <p className="text-white/80 text-xs">Totale annuale</p>
          <p className="text-3xl font-black text-white my-1">€{totalYearly.toFixed(0)}</p>
          <p className="text-white/60 text-[10px]">che potrebbero restare in tasca tua</p>
        </div>
        <button className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-base">
          Smetti di bruciare soldi <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-center text-[10px] text-white/30 mt-2">billkiller.it</p>
      </div>
    </div>
  )
}

// Versione 5 - "Notifica shock" stile iPhone notification
function NotificationVersion() {
  const totalMonthly = FAKE_SUBSCRIPTIONS.reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="h-screen max-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col justify-center px-4 overflow-hidden">
      {/* Fake time bar */}
      <div className="text-center mb-4">
        <p className="text-black/80 font-semibold text-sm">9:41</p>
        <p className="text-black/40 text-[10px]">Mercoledì 11 Dicembre</p>
      </div>

      {/* Notification stack */}
      <div className="space-y-2">
        {/* Main notification */}
        <div className="bg-white rounded-2xl p-3 shadow-xl">
          <div className="flex items-start gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">BillKiller</span>
                <span className="text-[10px] text-gray-400">ora</span>
              </div>
              <p className="text-gray-600 text-xs mt-0.5">
                Ho trovato <span className="font-bold text-red-500">8 abbonamenti</span> attivi
              </p>
              <div className="mt-2 bg-red-50 rounded-lg p-2 border border-red-100">
                <p className="text-red-600 text-[10px] font-medium">Stai spendendo</p>
                <p className="text-xl font-black text-red-600">€{totalMonthly.toFixed(2)}/mese</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary notifications */}
        <div className="bg-white/80 rounded-xl p-2.5 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-700"><span className="font-semibold">Netflix</span> rinnoverà tra 3 giorni</p>
              <p className="text-[10px] text-gray-400">€17.99</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 rounded-xl p-2.5 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600"><span className="font-semibold">2 abbonamenti</span> non usati da 3+ mesi</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-5">
        <button className="w-full bg-black text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
          Scopri i tuoi abbonamenti
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-2">billkiller.it • Gratis</p>
      </div>
    </div>
  )
}

// Versione 6 - "Confronto visivo" con grafico a barre
function BarChartVersion() {
  const subscriptions = FAKE_SUBSCRIPTIONS.slice(0, 5)
  const maxAmount = Math.max(...subscriptions.map(s => s.amount))
  const totalMonthly = FAKE_SUBSCRIPTIONS.reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="h-screen max-h-screen bg-slate-900 flex flex-col px-4 py-5 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 mb-2">
          <Flame className="w-6 h-6 text-amber-500" />
          <span className="text-xl font-bold text-white">BillKiller</span>
        </div>
        <p className="text-slate-400 text-xs">Dove vanno i tuoi soldi ogni mese?</p>
      </div>

      {/* Bar chart */}
      <div className="flex-1 space-y-2.5">
        {subscriptions.map((sub, i) => {
          const width = (sub.amount / maxAmount) * 100
          return (
            <div key={i} className="flex items-center gap-2">
              <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-lg flex-shrink-0">{sub.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-white text-xs font-medium">{sub.name}</span>
                  <span className="text-white text-sm font-bold">€{sub.amount}</span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${sub.color} rounded-full`} style={{ width: `${width}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total */}
      <div className="mt-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-400 text-xs">Totale mensile</p>
            <p className="text-2xl font-black text-white">€{totalMonthly.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-[10px]">All'anno</p>
            <p className="text-lg font-bold text-amber-400">€{(totalMonthly * 12).toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button className="mt-3 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
        Analizza i tuoi <ArrowRight className="w-4 h-4" />
      </button>
      <p className="text-center text-[10px] text-slate-600 mt-2">billkiller.it</p>
    </div>
  )
}

// Versione 7 - "Cancella e risparmia" con swipe cards
function SwipeCardsVersion() {
  const cancelledSubs = [
    { name: 'Palestra mai usata', amount: 29.90, icon: '💪' },
    { name: 'App dimenticata', amount: 9.99, icon: '📱' },
    { name: 'Streaming duplicato', amount: 8.99, icon: '📺' },
  ]
  const totalSaved = cancelledSubs.reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="h-screen max-h-screen bg-gradient-to-b from-emerald-900 to-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 text-center">
        <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full mb-3">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400 text-xs font-bold">Soldi salvati</span>
        </div>
        <h1 className="text-xl font-bold text-white mb-1">Marco ha cancellato 3 abbonamenti</h1>
        <p className="text-slate-400 text-xs">che non usava più</p>
      </div>

      {/* Cancelled cards */}
      <div className="px-4 flex-1 space-y-2">
        {cancelledSubs.map((sub, i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl p-3 border border-emerald-500/20 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-emerald-500/20 to-transparent flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center gap-3 pr-10">
              <div className="w-11 h-11 bg-slate-700 rounded-lg flex items-center justify-center text-xl">{sub.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm line-through opacity-60">{sub.name}</p>
                <p className="text-emerald-400 text-xs font-bold">+€{sub.amount}/mese risparmiati</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Savings summary */}
      <div className="px-4 pb-5 pt-2">
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl p-4 text-center mb-3">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Star className="w-4 h-4 text-white" />
            <span className="text-white/80 text-xs font-medium">Risparmio totale</span>
            <Star className="w-4 h-4 text-white" />
          </div>
          <p className="text-4xl font-black text-white">€{(totalSaved * 12).toFixed(0)}</p>
          <p className="text-white/60 text-xs mt-0.5">all'anno</p>
        </div>
        <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
          Trova i tuoi abbonamenti inutili
        </button>
        <p className="text-center text-[10px] text-slate-500 mt-2">billkiller.it • Gratis</p>
      </div>
    </div>
  )
}

// ===== VERSIONI INSTAGRAM CAROSELLO (v8, v9, v10) =====
// Formato mobile fisso, colori BillKiller (amber/orange), NO SCROLL

// Versione 8 - Instagram Slide 1: "Il Problema"
function InstagramSlide1() {
  return (
    <div className="h-screen max-h-screen bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Logo */}
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
        <Flame className="w-10 h-10 text-orange-500" />
      </div>

      {/* Main text */}
      <div className="text-center">
        <p className="text-white/80 text-base mb-3">Lo sapevi che in media</p>
        <p className="text-white text-5xl font-black mb-3">€1.284</p>
        <p className="text-white/80 text-base mb-6">all'anno se ne vanno in abbonamenti?</p>

        {/* Visual element */}
        <div className="flex justify-center gap-2 mb-6">
          {['🎬', '🎵', '📦', '☁️', '💪'].map((emoji, i) => (
            <div key={i} className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl backdrop-blur-sm">
              {emoji}
            </div>
          ))}
        </div>

        <p className="text-white text-xl font-bold">
          E tu, sai quanto spendi?
        </p>
      </div>

      {/* Swipe indicator */}
      <div className="absolute bottom-6 flex items-center gap-2">
        <div className="w-6 h-1 bg-white rounded-full" />
        <div className="w-2 h-1 bg-white/40 rounded-full" />
        <div className="w-2 h-1 bg-white/40 rounded-full" />
        <ArrowRight className="w-4 h-4 text-white ml-2" />
      </div>
    </div>
  )
}

// Versione 9 - Instagram Slide 2: "La Soluzione"
function InstagramSlide2() {
  const steps = [
    { icon: Upload, text: 'Carica estratto conto', num: '1' },
    { icon: Scan, text: 'Analisi automatica AI', num: '2' },
    { icon: Target, text: 'Trova abbonamenti', num: '3' },
    { icon: PiggyBank, text: 'Scopri quanto risparmi', num: '4' },
  ]

  return (
    <div className="h-screen max-h-screen bg-white flex flex-col p-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          <Flame className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">BillKiller</p>
          <p className="text-xs text-gray-500">Come funziona</p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 flex flex-col justify-center space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center relative flex-shrink-0">
              <step.icon className="w-7 h-7 text-orange-500" />
              <div className="absolute -top-1.5 -left-1.5 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                {step.num}
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-800">{step.text}</p>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="text-center py-2">
        <p className="text-gray-500 text-xs">100% Privacy • Nessun accesso alla banca</p>
      </div>

      {/* Swipe indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="w-2 h-1 bg-orange-200 rounded-full" />
        <div className="w-6 h-1 bg-orange-500 rounded-full" />
        <div className="w-2 h-1 bg-orange-200 rounded-full" />
      </div>
    </div>
  )
}

// Versione 10 - Instagram Slide 3: "CTA Finale"
function InstagramSlide3() {
  const totalMonthly = FAKE_SUBSCRIPTIONS.reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="h-screen max-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-5 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative text-center w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-full mb-4">
          <Gift className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 text-sm font-bold">GRATIS</span>
        </div>

        {/* Logo */}
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-orange-500/30">
          <Flame className="w-10 h-10 text-white" />
        </div>

        {/* Main CTA */}
        <h1 className="text-2xl font-black text-white mb-2">
          Smetti di sprecare soldi
        </h1>
        <p className="text-slate-400 text-sm mb-4">
          Scopri i tuoi abbonamenti in 30 secondi
        </p>

        {/* Fake demo result */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-slate-400 text-xs">Marco ha trovato</p>
              <p className="text-2xl font-bold text-white">€{totalMonthly.toFixed(0)}/mese</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-400 text-xs">Risparmio</p>
              <p className="text-xl font-bold text-emerald-400">€247/anno</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-2">
          <button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold py-4 rounded-xl text-lg shadow-lg shadow-amber-500/30">
            Provalo Gratis
          </button>
          <p className="text-slate-500 text-xs flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            30 secondi • Nessuna registrazione
          </p>
        </div>
      </div>

      {/* Website */}
      <p className="absolute bottom-12 text-slate-600 text-xs font-medium">
        billkiller.it
      </p>

      {/* Swipe indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="w-2 h-1 bg-slate-600 rounded-full" />
        <div className="w-2 h-1 bg-slate-600 rounded-full" />
        <div className="w-6 h-1 bg-amber-500 rounded-full" />
      </div>
    </div>
  )
}

// Versione originale (v1) - compatta per una schermata
function ScrollVersion() {
  const totalMonthly = FAKE_SUBSCRIPTIONS.reduce((sum, s) => sum + s.amount, 0)
  const totalYearly = totalMonthly * 12
  const subscriptions = FAKE_SUBSCRIPTIONS.slice(0, 4)

  return (
    <div className="h-screen max-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-amber-100">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BillKillerLogo size={24} />
            <span className="text-base font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">BillKiller</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span className="text-[10px] font-semibold text-amber-700">Premium</span>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="mx-4 mt-2 p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-xs">Attenzione!</p>
            <p className="text-[10px] text-white/90">Stai spendendo <span className="font-bold">€{totalYearly.toFixed(0)}/anno</span> in abbonamenti</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mt-2 grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl p-2.5 shadow-sm border border-amber-100">
          <div className="flex items-center gap-1.5 mb-1">
            <CreditCard className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] text-gray-500">Spesa Mensile</span>
          </div>
          <p className="text-xl font-bold text-gray-900">€{totalMonthly.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl p-2.5 shadow-sm border border-amber-100">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] text-gray-500">Spesa Annuale</span>
          </div>
          <p className="text-xl font-bold text-gray-900">€{totalYearly.toFixed(2)}</p>
        </div>
      </div>

      {/* Subscriptions Found */}
      <div className="px-4 mt-2 flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm font-bold text-gray-900">{FAKE_SUBSCRIPTIONS.length} Abbonamenti Trovati</span>
        </div>
        <div className="space-y-1.5">
          {subscriptions.map((sub, i) => (
            <div key={i} className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 ${sub.color} rounded-lg flex items-center justify-center text-lg`}>{sub.icon}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{sub.name}</p>
                  <p className="text-[10px] text-gray-500">Mensile</p>
                </div>
              </div>
              <p className="text-base font-bold text-gray-900">€{sub.amount.toFixed(2)}</p>
            </div>
          ))}
          <div className="flex items-center justify-center gap-1 pt-1">
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            <span className="text-[10px] text-gray-400 ml-1">+4 altri</span>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="px-4 pb-4 pt-2">
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl p-3 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-white" />
            <div>
              <p className="text-white/80 text-[10px]">Potresti risparmiare</p>
              <p className="text-lg font-bold text-white">€247/anno</p>
            </div>
          </div>
        </div>
        <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 text-sm">
          <Sparkles className="w-4 h-4" />
          Prova BillKiller Gratis
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-1.5">Nessuna carta richiesta • 100% Privacy</p>
      </div>
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
  // Instagram Carosello
  if (version === '8') {
    return <InstagramSlide1 />
  }
  if (version === '9') {
    return <InstagramSlide2 />
  }
  if (version === '10') {
    return <InstagramSlide3 />
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

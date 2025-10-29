'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle, Upload, Mail, TrendingDown, Shield, Sparkles, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import BillKillerLogo from '@/components/logo'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleNavigate = () => {
    setIsNavigating(true)
    setTimeout(() => router.push('/auth/signup'), 300)
  }
  return (
    <div className={`min-h-screen bg-white text-gray-800 relative overflow-hidden transition-opacity duration-300 ${isNavigating ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-white to-amber-100" />
      
      {/* Animated Shapes */}
      <div className="absolute top-[-10rem] left-[-10rem] w-96 h-96 bg-amber-500/20 rounded-full filter blur-3xl animate-blob" />
      <div className="absolute bottom-[-10rem] right-[-10rem] w-96 h-96 bg-orange-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      <div className="absolute top-[20rem] right-[10rem] w-72 h-72 bg-yellow-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000" />


      {/* Header */}
      <header className="relative container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
        <Link href="/" className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
          <BillKillerLogo size={24} className="sm:w-7 sm:h-7" />
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">BillKiller</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-sm sm:text-base hover:bg-amber-100/50 hover:text-gray-900 px-3 sm:px-4">Accedi</Button>
          </Link>
          <Link href="/auth/signup" id="signup-section">
            <Button className="text-sm sm:text-base bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105 px-3 sm:px-4 py-2 sm:py-2.5">
              Inizia Gratis <ArrowRight className="hidden sm:inline w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-800 text-xs sm:text-sm mb-6 sm:mb-8">
          <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Risparmia fino a €500/anno</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight text-gray-900">
          Tieni traccia dei tuoi abbonamenti.
          <br />
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Senza sforzo.
          </span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto">
          Carica il tuo estratto conto e lascia che BillKiller trovi tutti i tuoi abbonamenti ricorrenti.
          Nessun accesso bancario richiesto.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full px-4 sm:px-0">
          <Button 
            size="lg" 
            className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-full shadow-2xl shadow-amber-500/30 transform hover:scale-105 transition-transform text-white"
            onClick={handleNavigate}
          >
            Scopri quanto stai sprecando
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-white/50 border-gray-300 hover:bg-white/80 rounded-full text-gray-800">
            Guarda la Demo
          </Button>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-12 sm:mt-16 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>GDPR & Privacy-first</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Hosting 100% Europeo</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Nessun accesso bancario</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-gray-900">Come funziona, in 3 semplici passi</h2>
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 text-center">
          <div className="bg-white/50 p-6 sm:p-8 rounded-2xl border border-gray-200/50 transform hover:scale-105 hover:border-amber-500/50 transition-all shadow-lg">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg shadow-amber-500/20">
              <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">1. Carica</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Trascina il file CSV o PDF del tuo estratto conto. Supportiamo tutte le principali banche italiane.
            </p>
          </div>

          <div className="bg-white/50 p-6 sm:p-8 rounded-2xl border border-gray-200/50 transform hover:scale-105 hover:border-orange-500/50 transition-all shadow-lg">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg shadow-orange-500/20">
              <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">2. Collega (Opzionale)</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Connetti la tua email per trovare ricevute e notifiche di rinnovo. Massima sicurezza, solo lettura.
            </p>
          </div>

          <div className="bg-white/50 p-6 sm:p-8 rounded-2xl border border-gray-200/50 transform hover:scale-105 hover:border-yellow-500/50 transition-all shadow-lg">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg shadow-yellow-500/20">
              <TrendingDown className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">3. Risparmia</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Visualizza tutti i tuoi abbonamenti, scopri quanto spendi e trova alternative più convenienti.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-50/50 border-t border-gray-200 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 sm:gap-x-8 sm:gap-y-12 text-center sm:text-left">
            <div className="col-span-2 sm:col-span-1 md:col-span-1">
              <div className="text-xl sm:text-2xl font-bold flex items-center gap-2 mb-4 justify-center sm:justify-start">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                BillKiller
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                Trova i tuoi abbonamenti nascosti e riprendi il controllo delle tue finanze.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-gray-900">Prodotto</h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                <li><Link href="/features" className="hover:text-gray-900 transition-colors">Funzionalità</Link></li>
                <li><Link href="/pricing" className="hover:text-gray-900 transition-colors">Prezzi</Link></li>
                <li><Link href="/demo" className="hover:text-gray-900 transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-gray-900">Legale</h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                <li><Link href="/legal/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="hover:text-gray-900 transition-colors">Termini di Servizio</Link></li>
                <li><Link href="/legal/cookies" className="hover:text-gray-900 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-gray-900">Supporto</h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                <li><Link href="/help" className="hover:text-gray-900 transition-colors">Centro Aiuto</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contatti</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 sm:mt-10 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-500">
            <p>&copy; 2024 BillKiller. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

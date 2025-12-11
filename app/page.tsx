'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle, Upload, TrendingDown, Shield, Sparkles, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import BillKillerLogo from '@/components/logo'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleNavigate = () => {
    setIsNavigating(true)
    setTimeout(() => router.push('/auth/signup'), 200)
  }

  const handleLogin = () => {
    setIsNavigating(true)
    setTimeout(() => router.push('/auth/login'), 200)
  }
  return (
    <div className={`page min-h-screen bg-white text-gray-800 relative overflow-hidden transition-all duration-200 ${isNavigating ? 'opacity-0 -translate-y-10 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
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
          <Button 
            variant="ghost" 
            className="text-sm sm:text-base hover:bg-amber-100/50 hover:text-gray-900 px-3 sm:px-4"
            onClick={handleLogin}
          >
            Accedi
          </Button>
          <Link href="/auth/signup" id="signup-section">
            <Button className="text-sm sm:text-base bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105 px-3 sm:px-4 py-2 sm:py-2.5">
              Inizia Gratis <ArrowRight className="hidden sm:inline w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero relative container mx-auto px-4 sm:px-6 pt-14 pb-8 sm:py-24 text-center flex flex-col items-center">
        <div className="hidden sm:inline-block mb-4 sm:mb-6 group">
          <div className="px-2 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 shadow-md transition-all group-hover:shadow-lg group-hover:scale-105">
            <p className="text-xs text-gray-600 font-semibold">
              💸 Scopri dove vanno davvero i tuoi soldi ogni mese.
            </p>
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-5 sm:mb-6 leading-tight text-gray-900">
          Tieni traccia dei tuoi abbonamenti.
          <br />
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Senza sforzo.
          </span>
        </h1>
        
        <p className="subtitle text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-12 max-w-3xl mx-auto">
          Carica il tuo estratto conto e lascia che BillKiller trovi tutti i tuoi abbonamenti ricorrenti.
          Nessun accesso bancario richiesto.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full px-4 sm:px-0">
          <Button 
            size="lg" 
            className="cta w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-full shadow-2xl shadow-amber-500/30 transform hover:scale-105 transition-transform text-white"
            onClick={handleNavigate}
          >
            Scopri quanto stai sprecando
          </Button>
        </div>
        
        <div className="trust-badges flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-5 sm:mt-16 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
            <span>GDPR<span className="long"> & Privacy-first</span></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
            <span>Hosting<span className="long"> 100% Europeo</span></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
            <span>Nessun accesso bancario</span>
          </div>
        </div>
        <p className="disclaimer text-center text-xs text-gray-600 mt-2 px-4">
          🔒 Analizziamo solo il file che carichi. Nessun dato personale viene condiviso o salvato oltre 30 giorni.
        </p>
      </section>

      <hr className="divider mx-auto mt-6 mb-4 w-1/2 border-t border-gray-200 opacity-50" />

      {/* How it works */}
      <section className="howitworks relative container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-gray-900">Come funziona, in 2 semplici passi</h2>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 text-center max-w-4xl mx-auto">
          <div className="bg-white/50 p-6 sm:p-8 rounded-2xl border border-gray-200/50 transform hover:scale-105 hover:border-amber-500/50 transition-all shadow-lg">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg shadow-amber-500/20">
              <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">1. Carica</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Trascina il file CSV o PDF del tuo estratto conto. Supportiamo tutte le principali banche italiane.
            </p>
          </div>

          <div className="bg-white/50 p-6 sm:p-8 rounded-2xl border border-gray-200/50 transform hover:scale-105 hover:border-yellow-500/50 transition-all shadow-lg">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg shadow-yellow-500/20">
              <TrendingDown className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">2. Risparmia</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Visualizza tutti i tuoi abbonamenti, scopri quanto spendi e trova alternative più convenienti.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section - SEO */}
      <section className="relative py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              Domande Frequenti
            </h2>
            <p className="text-lg text-gray-600">
              Tutto quello che devi sapere su BillKiller
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Come faccio a sapere quanti abbonamenti ho?
              </h3>
              <p className="text-gray-600">
                BillKiller analizza automaticamente i tuoi estratti conto per trovare tutti gli abbonamenti attivi.
                Carica un estratto conto e scopri in pochi secondi quanti abbonamenti hai e quanto spendi ogni mese.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Come trovare abbonamenti nascosti?
              </h3>
              <p className="text-gray-600">
                Gli abbonamenti nascosti sono spesso sepolti negli estratti conto con nomi poco chiari. BillKiller usa l'intelligenza artificiale 
                per riconoscere automaticamente Netflix, Spotify, Amazon Prime e centinaia di altri servizi, anche se appaiono con nomi diversi.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Quanto costa BillKiller?
              </h3>
              <p className="text-gray-600">
                BillKiller è gratis per sempre fino a 5 abbonamenti. Il piano Premium costa solo €0,99/mese e include abbonamenti illimitati,
                grafici dettagliati ed export PDF/CSV. Nessun costo nascosto.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                I miei dati bancari sono al sicuro?
              </h3>
              <p className="text-gray-600">
                Sì, al 100%. Non chiediamo mai le credenziali bancarie. Analizzi tu stesso gli estratti conto scaricati dalla tua banca. 
                Tutti i dati sono criptati, ospitati in Europa (GDPR compliant) e puoi eliminarli in qualsiasi momento con un click.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Quali abbonamenti può trovare BillKiller?
              </h3>
              <p className="text-gray-600">
                BillKiller riconosce automaticamente Netflix, Spotify, Amazon Prime, Disney+, Apple Music, Adobe, Microsoft 365, 
                palestre, telefonia mobile e centinaia di altri servizi. Se un abbonamento si ripete mensilmente o annualmente, lo troviamo.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Posso cancellare gli abbonamenti da BillKiller?
              </h3>
              <p className="text-gray-600">
                BillKiller ti mostra tutti i tuoi abbonamenti e quanto spendi, ma la cancellazione va fatta direttamente sul sito del servizio. 
                Ti forniamo link diretti e istruzioni per disdire velocemente ogni abbonamento che non vuoi più.
              </p>
            </div>
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

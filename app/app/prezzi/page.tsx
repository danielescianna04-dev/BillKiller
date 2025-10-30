import { Check, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrezziPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Piani e Prezzi
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scegli il piano perfetto per gestire i tuoi abbonamenti
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription className="text-3xl font-bold text-gray-900 mt-2">
                €0<span className="text-lg font-normal text-gray-600">/mese</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Fino a 3 abbonamenti</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Upload estratti conto (CSV/PDF)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Rilevamento automatico</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Totali mensili e annuali</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">Hub offerte alternative</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">Grafici e trend</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">Export PDF/CSV</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">Collegamento email illimitato</span>
                </div>
              </div>
              <a href="/app/dashboard" className="block">
                <Button variant="outline" className="w-full mt-6">
                  Continua con Free
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 border-amber-500 hover:shadow-2xl transition-shadow relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Consigliato
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Premium</CardTitle>
              <CardDescription className="text-3xl font-bold text-gray-900 mt-2">
                €0,99<span className="text-lg font-normal text-gray-600">/mese</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900 font-medium">Abbonamenti illimitati</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900">Upload estratti conto (CSV/PDF)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900">Rilevamento automatico</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900">Totali mensili e annuali</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900">Hub offerte alternative</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900 font-medium">Grafici e trend dettagliati</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900 font-medium">Export PDF/CSV</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900 font-medium">Collegamento email illimitato</span>
                </div>
              </div>
              <a href="/api/checkout" className="block">
                <Button className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  Passa a Premium
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Domande Frequenti</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posso cancellare in qualsiasi momento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sì, puoi cancellare il tuo abbonamento Premium in qualsiasi momento dalla pagina Account. 
                  Non ci sono vincoli o penali.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cosa succede se supero i 3 abbonamenti con il piano Free?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Potrai vedere solo i primi 3 abbonamenti. Per sbloccare tutti gli abbonamenti rilevati, 
                  passa al piano Premium.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">I miei dati sono al sicuro?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sì, tutti i dati sono criptati e ospitati in server UE. Gli estratti conto vengono 
                  automaticamente eliminati dopo 30 giorni per garantire la tua privacy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

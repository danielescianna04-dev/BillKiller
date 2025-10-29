import { createServerSupabaseClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Shield, CheckCircle, AlertCircle, Lock } from 'lucide-react'
import Link from 'next/link'
import EmailPageClient from './email-client'

export default async function EmailPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: userProfile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  const isPremium = userProfile?.plan === 'premium'

  // Check if email is already connected
  const { data: gmailSource } = await supabase
    .from('sources')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'gmail')
    .single()

  const { data: outlookSource } = await supabase
    .from('sources')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'outlook')
    .single()

  if (!isPremium) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Collega email</h1>
          <p className="text-gray-600">
            Trova ricevute e notifiche di rinnovo nella tua casella email.
          </p>
        </div>

        <Card className="border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-amber-500/10 rounded-full">
                <Lock className="w-12 h-12 text-amber-600" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Funzionalità Premium</h3>
              <p className="text-gray-600">
                Il collegamento email è disponibile solo per gli utenti Premium
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 space-y-3 text-left shadow-sm">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">Scansione automatica Gmail e Outlook</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">Trova ricevute e notifiche di rinnovo</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">Abbonamenti illimitati</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">Grafici e trend dettagliati</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">Export CSV/PDF</span>
              </div>
            </div>
            <Link href="/app/account">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8">
                Passa a Premium - €0,99/mese
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <strong>Accesso solo lettura.</strong> Cerchiamo solo ricevute e notifiche di abbonamenti. 
                Non leggiamo email personali e puoi disconnettere in qualsiasi momento.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <EmailPageClient 
    gmailConnected={!!gmailSource} 
    outlookConnected={!!outlookSource}
  />
}



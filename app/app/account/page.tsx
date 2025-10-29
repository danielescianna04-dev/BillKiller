import { createServerSupabaseClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import { Crown, Trash2, User, CheckCircle, Sparkles, BarChart3, FileText, TrendingUp, ArrowRight, Mail, Calendar } from 'lucide-react'
import { DeleteAccountButton } from '@/components/delete-account-button'

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('plan, created_at')
    .eq('id', user.id)
    .single()

  const isPremium = profile?.plan === 'premium'

  const Feature = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-center gap-2 sm:gap-3">
      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
      <span className="text-xs sm:text-sm text-gray-700">{children}</span>
    </li>
  );

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Il Tuo Account</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">Gestisci il tuo piano, le impostazioni e i dati personali.</p>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
            Informazioni Personali
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-500">Email</span>
            </div>
            <span className="font-semibold text-sm sm:text-base text-gray-800 truncate">{user.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-500">Membro dal</span>
            </div>
            <span className="font-semibold text-sm sm:text-base text-gray-800">{new Date(profile?.created_at || '').toLocaleDateString('it-IT')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Plan Card */}
      {isPremium ? (
        <Card className="border-2 border-amber-400 bg-amber-50">
          <CardHeader className="text-center p-4 sm:p-6">
            <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 mx-auto" />
            <CardTitle className="text-xl sm:text-2xl font-bold text-amber-800 mt-2">Sei un utente Premium</CardTitle>
            <p className="text-sm sm:text-base text-amber-700">Grazie per il tuo supporto!</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <ul className="space-y-2 sm:space-y-3">
              <Feature>Abbonamenti Illimitati</Feature>
              <Feature>Grafici e Analisi Avanzate</Feature>
              <Feature>Esportazione Dati (CSV/PDF)</Feature>
              <Feature>Suggerimenti per Risparmiare</Feature>
              <Feature>Supporto Prioritario</Feature>
            </ul>
            <div className="border-t border-amber-200 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <p className="text-xs sm:text-sm text-gray-600">Il tuo abbonamento si rinnoverà automaticamente.</p>
              <form action="/api/checkout" method="POST">
                <input type="hidden" name="action" value="manage" />
                <Button variant="outline" className="border-amber-400 hover:bg-amber-100 w-full sm:w-auto text-sm" type="submit">
                  Gestisci
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl font-bold">Il Tuo Piano Gratuito</CardTitle>
            <p className="text-sm sm:text-base text-gray-600">Funzionalità base per iniziare a risparmiare.</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li className="flex items-center gap-2 sm:gap-3"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" /> Fino a 3 abbonamenti</li>
              <li className="flex items-center gap-2 sm:gap-3"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" /> Analisi base</li>
              <li className="flex items-center gap-2 sm:gap-3 line-through text-gray-400"><Sparkles className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> Esportazione Dati</li>
              <li className="flex items-center gap-2 sm:gap-3 line-through text-gray-400"><TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> Suggerimenti per Risparmiare</li>
            </ul>
          </CardContent>
          <div className="bg-gray-800 text-white p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Passa a Premium</h3>
                <p className="text-sm sm:text-base text-gray-300">Sblocca tutte le funzionalità.</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-2xl sm:text-3xl font-bold">€0,99<span className="text-base sm:text-lg font-normal text-gray-400">/mese</span></p>
              </div>
            </div>
            <form action="/api/checkout" method="POST" className="mt-4">
              <Button size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-base sm:text-lg" type="submit">
                Attiva Premium Ora <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </form>
          </div>
        </Card>
      )}

      {/* Danger Zone */}
      <Card className="border-2 border-red-500/50">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl text-red-700">
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            Zona Pericolosa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <p className="text-xs sm:text-sm text-red-800">
            L'eliminazione del tuo account è un'azione irreversibile. Tutti i tuoi dati verranno cancellati per sempre. Assicurati di aver salvato tutte le informazioni importanti.
          </p>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  )
}

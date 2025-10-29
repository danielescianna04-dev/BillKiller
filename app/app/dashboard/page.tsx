import { createServerSupabaseClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, CreditCard, Calendar, AlertCircle, Lock, CheckCircle, XCircle, Clock, Package, Sparkles, DollarSign } from 'lucide-react'
import SubscriptionsList from '@/components/subscriptions-list'
import UpgradePrompt from '@/components/upgrade-prompt'
import SubscriptionCharts from '@/components/subscription-charts'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import WelcomeToast from './welcome-toast'
import UploadBox from '@/components/upload-box'
import AnimatedWrapper from '@/components/animated-wrapper'
import ReportMissingButton from '@/components/report-missing-button'

export const revalidate = 300 // Cache per 5 minuti

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get user plan
  const { data: userProfile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  const isPremium = userProfile?.plan === 'premium'

  // Check if user has uploaded any files
  const { data: sources } = await supabase
    .from('sources')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
  
  const hasUploadedFile = sources && sources.length > 0

  // Get last uploaded statement for report button
  const { data: lastStatementData } = await supabase
    .from('statements')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
  
  const lastStatement = lastStatementData?.[0]
  console.log('Last statement:', lastStatement)

  // Get all subscriptions from base table
  const { data: allSubscriptionsRaw } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('amount', { ascending: false })
  
  // Add monthly_amount calculation for each subscription
  const allSubscriptionsWithMonthly = allSubscriptionsRaw?.map((sub) => {
    let monthly_amount = sub.amount
    if (sub.periodicity === 'yearly') monthly_amount = sub.amount / 12
    else if (sub.periodicity === 'quarterly') monthly_amount = sub.amount / 3
    else if (sub.periodicity === 'semiannual') monthly_amount = sub.amount / 6
    return { ...sub, monthly_amount }
  }) || []
  
  // Filter out installment plans
  const allSubscriptions = allSubscriptionsWithMonthly.filter((sub) => !sub.meta?.is_installment_plan)

  // Get installment plans only
  const installmentPlans = allSubscriptionsWithMonthly.filter((sub) => sub.meta?.is_installment_plan === true)

  // Filter installment plans from regular subscriptions
  const activeSubscriptions = allSubscriptions?.filter((sub) => sub.status === 'active') || []
  const cancelledSubscriptions = allSubscriptions?.filter((sub) => sub.status === 'cancelled') || []
  
  // Split installment plans into active and completed
  const activeInstallmentPlans = installmentPlans?.filter((plan) => !plan.meta?.is_completed) || []
  const completedInstallmentPlans = installmentPlans?.filter((plan) => plan.meta?.is_completed) || []
  
  console.log('Dashboard data:', {
    allSubscriptions: allSubscriptions?.length,
    installmentPlans: installmentPlans?.length,
    activeInstallmentPlans: activeInstallmentPlans.length,
    completedInstallmentPlans: completedInstallmentPlans.length,
    activeSubscriptions: activeSubscriptions.length,
    cancelledSubscriptions: cancelledSubscriptions.length
  })

  const totalMonthly = activeSubscriptions?.reduce((sum, sub) => sum + sub.monthly_amount, 0) || 0
  const totalYearly = totalMonthly * 12

  // Limit to 3 for free users
  const displayActive = isPremium ? activeSubscriptions : activeSubscriptions?.slice(0, 3)
  const hiddenCount = activeSubscriptions ? activeSubscriptions.length - (displayActive?.length || 0) : 0

  return (
    <AnimatedWrapper>
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-0 pb-6">
      <WelcomeToast />
      {/* Hero Cards */}
      <div className={`grid grid-cols-3 gap-2 sm:gap-4 ${!hasUploadedFile ? 'blur-sm pointer-events-none' : ''}`}>
        <Card className="border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-[10px] sm:text-sm font-medium text-gray-600">Spesa Mensile</CardTitle>
            <div className="p-1 sm:p-2 bg-gray-100 rounded-lg">
              <DollarSign className="h-3 w-3 sm:h-5 sm:w-5 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className={`text-lg sm:text-3xl font-bold text-gray-900 ${activeSubscriptions.length === 0 ? 'blur-sm' : ''}`}>{formatCurrency(totalMonthly)}</div>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 flex items-center gap-1">
              <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3" />
              {activeSubscriptions?.length || 0} attivi
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-[10px] sm:text-sm font-medium text-gray-600">Spesa Annuale</CardTitle>
            <div className="p-1 sm:p-2 bg-gray-100 rounded-lg">
              <Calendar className="h-3 w-3 sm:h-5 sm:w-5 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className={`text-lg sm:text-3xl font-bold text-gray-900 ${activeSubscriptions.length === 0 ? 'blur-sm' : ''}`}>{formatCurrency(totalYearly)}</div>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3" />
              12 mesi
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-[10px] sm:text-sm font-medium text-gray-600">Piano</CardTitle>
            <div className="p-1 sm:p-2 bg-gray-100 rounded-lg">
              {isPremium ? <Sparkles className="h-3 w-3 sm:h-5 sm:w-5 text-amber-600" /> : <CreditCard className="h-3 w-3 sm:h-5 sm:w-5 text-gray-600" />}
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-3xl font-bold text-gray-900">{isPremium ? 'Premium' : 'Free'}</div>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              {isPremium ? '✨ Completo' : 'Max 3'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Free user limitation warning */}
      {!isPremium && hiddenCount > 0 && activeSubscriptions.length > 3 && (
        <Card className="border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg shadow-orange-500/10">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg flex-shrink-0">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <p className="text-sm sm:text-base text-orange-900">
                Hai {hiddenCount} abbonamenti nascosti. 
                <span className="font-semibold"> Passa a Premium per vederli tutti.</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      {!hasUploadedFile || (activeSubscriptions.length === 0 && cancelledSubscriptions.length === 0) ? (
        <UploadBox />
      ) : activeSubscriptions.length > 0 && !isPremium ? (
        <div className="relative">
          <div className="blur-sm pointer-events-none">
            <SubscriptionCharts subscriptions={displayActive || []} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <Card className="max-w-md border-amber-300 shadow-2xl">
              <CardContent className="pt-6 text-center space-y-4">
                <Lock className="w-12 h-12 text-amber-600 mx-auto" />
                <h3 className="text-xl font-bold">Grafici Premium</h3>
                <p className="text-gray-600">
                  Sblocca grafici dettagliati e trend degli ultimi 12 mesi
                </p>
                <Link href="/app/account">
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    Passa a Premium - €0,99/mese
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : activeSubscriptions.length > 0 && isPremium ? (
        <SubscriptionCharts subscriptions={displayActive || []} />
      ) : null}

      {/* Subscriptions List */}
      <div className={`grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 ${!hasUploadedFile ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Active Subscriptions */}
          {activeSubscriptions.length === 0 && cancelledSubscriptions.length === 0 && installmentPlans.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-8 sm:py-12">
                {!hasUploadedFile ? (
                  <>
                    <CreditCard className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">Nessun abbonamento trovato</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">Carica un estratto conto o collega la tua email per iniziare</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
                      <Link href="/app/upload">
                        <Button className="w-full sm:w-auto">Carica estratto conto</Button>
                      </Link>
                      <Link href="/app/email">
                        <Button variant="outline" className="w-full sm:w-auto">Collega email</Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">Ottimo! Nessun abbonamento attivo</h3>
                    <p className="text-sm sm:text-base text-gray-600 px-4">
                      Non abbiamo rilevato abbonamenti ricorrenti nel tuo estratto conto. Continua così! 🎉
                    </p>
                    {lastStatement && (
                      <div className="pt-4">
                        <ReportMissingButton statementId={lastStatement.id} />
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {activeSubscriptions.length > 0 && (
                <>
                  <SubscriptionsList 
                    subscriptions={displayActive || []} 
                    isPremium={isPremium}
                    title="Abbonamenti Attivi"
                  />
                  {lastStatement && (
                    <div className="mt-4">
                      <ReportMissingButton statementId={lastStatement.id} />
                    </div>
                  )}
                </>
              )}
            </>
          )}
          
          {/* Installment Plans */}
          {activeInstallmentPlans && activeInstallmentPlans.length > 0 && (
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50/50 to-amber-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                  🔄 Piani Rateali Attivi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeInstallmentPlans.length === 0 ? (
                  <p className="text-sm text-gray-500">Nessun piano rateale attivo</p>
                ) : (
                  activeInstallmentPlans.map((plan) => (
                    <div key={plan.id} className="p-3 sm:p-4 border border-orange-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1">
                          <div className="font-semibold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-600 flex-shrink-0" />
                            <span className="break-words">{plan.title}</span>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 mt-2 flex flex-wrap items-center gap-2">
                            <span className="font-medium">{formatCurrency(plan.amount)}</span>
                            <span className="text-gray-400">×</span>
                            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                              {plan.meta?.installments_paid}/{plan.meta?.installments_total} rate
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            💰 Totale: {formatCurrency(plan.meta?.total_amount || 0)}
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-xs sm:text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full inline-block">
                            {plan.meta?.installments_remaining || 0} rimanenti
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Cancelled Subscriptions */}
          {cancelledSubscriptions && cancelledSubscriptions.length > 0 && (
            <Card className="border-red-100 bg-gradient-to-br from-red-50/30 to-gray-50">
              <CardHeader>
                <CardTitle className="text-gray-600 flex items-center gap-2 text-base sm:text-lg">
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  ⏸️ Abbonamenti Scaduti
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cancelledSubscriptions.slice(0, 5).map((sub) => (
                  <div key={sub.id} className="p-3 bg-white border border-red-100 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 opacity-70">
                      <div className="flex-1">
                        <div className="font-medium text-sm sm:text-base text-gray-700 flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span className="break-words">{sub.title}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Ultimo: {new Date(sub.last_seen).toLocaleDateString('it-IT')}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">{formatCurrency(sub.monthly_amount)}/mese</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          
          {/* Quick Actions */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Azioni Rapide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <a href="/app/upload" className="group block p-3 sm:p-4 rounded-xl border-2 border-gray-100 hover:border-amber-300 hover:bg-amber-50/50 transition-all">
                <div className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">Carica estratto conto</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Trova nuovi abbonamenti</div>
              </a>
              <a href="/app/email" className="group block p-3 sm:p-4 rounded-xl border-2 border-gray-100 hover:border-orange-300 hover:bg-orange-50/50 transition-all">
                <div className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">Collega email</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Trova ricevute e rinnovi</div>
              </a>
              <a href="/app/offerte" className="group block p-3 sm:p-4 rounded-xl border-2 border-gray-100 hover:border-yellow-300 hover:bg-yellow-50/50 transition-all">
                <div className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">Scopri offerte</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Alternative più economiche</div>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
          </div>
        </AnimatedWrapper>
      )}

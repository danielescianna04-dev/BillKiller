'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Shield, CheckCircle, AlertCircle, Zap, Search, Clock } from 'lucide-react'

export default function EmailPageClient({ 
  gmailConnected, 
  outlookConnected 
}: { 
  gmailConnected: boolean
  outlookConnected: boolean 
}) {
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState<'gmail' | 'outlook' | null>(null)
  const [message, setMessage] = useState('')

  const connectGmail = async () => {
    window.location.href = '/api/auth/gmail'
  }

  const connectOutlook = async () => {
    window.location.href = '/api/auth/outlook'
  }

  const disconnectEmail = async (type: 'gmail' | 'outlook') => {
    setDisconnecting(type)
    try {
      const res = await fetch('/api/auth/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })
      if (res.ok) {
        window.location.reload()
      } else {
        setMessage('Errore durante la disconnessione')
      }
    } catch (error) {
      setMessage('Errore durante la disconnessione')
    } finally {
      setDisconnecting(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Collega la tua Email
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Trova automaticamente ricevute e notifiche di rinnovo nella tua casella
        </p>
      </div>

      {/* Privacy Banner */}
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-md">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-xs sm:text-sm text-amber-900">
              <strong className="block mb-1">🔒 Privacy garantita</strong>
              Accesso solo lettura. Cerchiamo solo ricevute di abbonamenti. 
              Non leggiamo email personali e puoi disconnettere in qualsiasi momento.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Providers Grid */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Gmail Card */}
        <Card className={`hover:shadow-xl transition-all duration-300 ${gmailConnected ? 'border-green-300 bg-green-50/30' : 'hover:scale-[1.02]'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
                  <path d="M0 5.457v.727l12 9 12-9v-.727c0-2.023-2.309-3.178-3.927-1.964L12 9.548 3.927 3.493C2.31 2.28 0 3.434 0 5.457z" fill="#FBBC04"/>
                  <path d="M18.545 11.73v9.273h3.819c.904 0 1.636-.732 1.636-1.636V11.73l-5.455 4.091z" fill="#34A853"/>
                  <path d="M1.636 21.003h3.819V11.73L0 7.639v11.727c0 .904.732 1.636 1.636 1.636z" fill="#4285F4"/>
                </svg>
                <span className="text-lg">Gmail</span>
              </div>
              {gmailConnected && (
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-100 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  Attivo
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {gmailConnected ? (
              <>
                <div className="bg-white rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span>Scansione automatica attiva</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Search className="w-4 h-4 text-amber-600" />
                    <span>Cerca ricevute in tempo reale</span>
                  </div>
                </div>
                <Button 
                  onClick={() => disconnectEmail('gmail')} 
                  disabled={disconnecting === 'gmail'}
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                >
                  {disconnecting === 'gmail' ? 'Disconnessione...' : 'Disconnetti Gmail'}
                </Button>
              </>
            ) : (
              <>
                <p className="text-xs sm:text-sm text-gray-600">
                  Collega Google per trovare automaticamente ricevute e abbonamenti
                </p>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Solo lettura, massima sicurezza</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Cerca solo ricevute di pagamento</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Disconnetti con 1 click</span>
                  </div>
                </div>
                <Button 
                  onClick={connectGmail} 
                  disabled={connecting}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Collega Gmail
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Outlook Card */}
        <Card className={`hover:shadow-xl transition-all duration-300 ${outlookConnected ? 'border-green-300 bg-green-50/30' : 'hover:scale-[1.02]'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <path d="M0 0h11.377v11.372H0z" fill="#0364B8"/>
                  <path d="M12.623 0H24v11.372H12.623z" fill="#0078D4"/>
                  <path d="M0 12.628h11.377V24H0z" fill="#1490DF"/>
                  <path d="M12.623 12.628H24V24H12.623z" fill="#28A8EA"/>
                </svg>
                <span className="text-lg">Outlook</span>
              </div>
              {outlookConnected && (
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-100 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  Attivo
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {outlookConnected ? (
              <>
                <div className="bg-white rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span>Scansione automatica attiva</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Search className="w-4 h-4 text-orange-600" />
                    <span>Cerca ricevute in tempo reale</span>
                  </div>
                </div>
                <Button 
                  onClick={() => disconnectEmail('outlook')} 
                  disabled={disconnecting === 'outlook'}
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                >
                  {disconnecting === 'outlook' ? 'Disconnessione...' : 'Disconnetti Outlook'}
                </Button>
              </>
            ) : (
              <>
                <p className="text-xs sm:text-sm text-gray-600">
                  Collega Microsoft per trovare automaticamente ricevute e abbonamenti
                </p>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Solo lettura, massima sicurezza</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Cerca solo ricevute di pagamento</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Disconnetti con 1 click</span>
                  </div>
                </div>
                <Button 
                  onClick={connectOutlook} 
                  disabled={connecting}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Collega Outlook
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message Alert */}
      {message && (
        <Card className="border-orange-200 bg-orange-50 animate-in fade-in duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-900">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{message}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-white">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-600" />
            Cosa cerchiamo nelle tue email
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs sm:text-sm text-gray-600 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Ricevute di pagamento</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Notifiche di rinnovo</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Conferme di addebito</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Fatture mensili/annuali</span>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Non salviamo il contenuto delle email, solo i metadati degli abbonamenti rilevati
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

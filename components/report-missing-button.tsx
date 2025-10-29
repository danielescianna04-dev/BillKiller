'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Send, CheckCircle, X } from 'lucide-react'

export default function ReportMissingButton({ statementId }: { statementId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/report-missing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statementId, message })
      })
      
      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Errore durante l\'invio')
      }
    } catch (err: any) {
      setError(err.message || 'Errore di connessione')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="text-amber-700 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all shadow-sm"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Abbonamento non rilevato?
        </Button>
      </div>
    )
  }

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md">
      <CardContent className="pt-6 space-y-4">
        {success ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-green-800 mb-1">Segnalazione inviata!</h3>
              <p className="text-sm text-green-700">Grazie per il tuo feedback</p>
            </div>
            <Button
              onClick={() => {
                setSuccess(false)
                setMessage('')
              }}
              variant="outline"
              className="border-green-300 hover:bg-green-50"
            >
              Invia un'altra segnalazione
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Segnala abbonamenti mancanti
                  </h3>
                  <p className="text-sm text-gray-600">
                    Aiutaci a migliorare il rilevamento
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-amber-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Quali abbonamenti non sono stati rilevati?
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Es: Netflix €12.99/mese, Spotify €9.99/mese..."
                className="w-full p-3 border border-amber-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-2">
                Invieremo l'estratto conto al nostro team per analizzarlo e migliorare il rilevamento
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={loading || !message.trim()}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Invio...' : 'Invia segnalazione'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="border-gray-300 hover:bg-gray-50"
              >
                Annulla
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

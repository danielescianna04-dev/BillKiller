'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Send, CheckCircle } from 'lucide-react'

export default function ReportMissingButton({ statementId }: { statementId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/report-missing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statementId, message })
      })
      
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          setIsOpen(false)
          setSuccess(false)
          setMessage('')
        }, 2000)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-orange-600 border-orange-300 hover:bg-orange-50"
      >
        <AlertCircle className="w-4 h-4 mr-2" />
        Segnala abbonamenti mancanti
      </Button>
    )
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="pt-6 space-y-4">
        {success ? (
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Segnalazione inviata!</span>
          </div>
        ) : (
          <>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Segnala abbonamenti non rilevati
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Ci invierai l'estratto conto per migliorare il rilevamento. Descrivi quali abbonamenti mancano:
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Es: Non ha rilevato Netflix e Spotify..."
                className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Invio...' : 'Invia segnalazione'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
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

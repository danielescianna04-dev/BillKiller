'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Loader2, Pencil } from 'lucide-react'

interface IdentifySubscriptionDialogProps {
  subscriptionId: string
  currentTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function IdentifySubscriptionDialog({
  subscriptionId,
  currentTitle,
  open,
  onOpenChange,
  onSuccess
}: IdentifySubscriptionDialogProps) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Inserisci un nome')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/subscriptions/${subscriptionId}/identify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() })
      })

      if (!res.ok) {
        throw new Error('Errore durante il salvataggio')
      }

      onSuccess()
      onOpenChange(false)
      setTitle('')
    } catch {
      setError('Errore durante il salvataggio. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-amber-600" />
            Identifica abbonamento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Attualmente: <span className="font-medium">{currentTitle}</span>
            </p>
            <Input
              placeholder="Es: Netflix, Spotify, iCloud..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              autoFocus
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={loading || !title.trim()}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                'Salva'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

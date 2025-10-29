'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true)
      return
    }

    setDeleting(true)
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' })
      if (res.ok) {
        router.push('/')
      } else {
        alert('Errore durante l\'eliminazione')
        setDeleting(false)
      }
    } catch (error) {
      alert('Errore durante l\'eliminazione')
      setDeleting(false)
    }
  }

  return (
    <Button
      variant={confirming ? 'destructive' : 'outline'}
      onClick={handleDelete}
      disabled={deleting}
    >
      <Trash2 className="w-4 h-4 mr-2" />
      {deleting ? 'Eliminazione...' : confirming ? 'Conferma eliminazione' : 'Elimina tutto'}
    </Button>
  )
}

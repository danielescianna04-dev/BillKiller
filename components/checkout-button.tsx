'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setLoading(false)
    }
  }

  return (
    <Button 
      size="lg" 
      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-base sm:text-lg" 
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? 'Caricamento...' : 'Attiva Premium Ora'} <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
    </Button>
  )
}

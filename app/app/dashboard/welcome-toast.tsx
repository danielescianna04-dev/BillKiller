'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function WelcomeToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const welcome = searchParams.get('welcome')
  const login = searchParams.get('login')

  useEffect(() => {
    if (welcome === 'true') {
      // Show welcome notification
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-in slide-in-from-top duration-300'
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <div class="font-semibold">Benvenuto su BillKiller! 🎉</div>
            <div class="text-sm opacity-90">Registrazione completata con successo</div>
          </div>
        </div>
      `
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.remove()
        router.replace('/app/dashboard')
      }, 4000)
    } else if (login === 'success') {
      // Show login notification
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-in slide-in-from-top duration-300'
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <div class="font-semibold">Bentornato! 👋</div>
            <div class="text-sm opacity-90">Accesso effettuato con successo</div>
          </div>
        </div>
      `
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.remove()
        router.replace('/app/dashboard')
      }, 3000)
    }
  }, [welcome, login, router])

  return null
}

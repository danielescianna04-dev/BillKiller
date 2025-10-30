'use client'

import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { LogOut, Settings, Upload, Mail, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useTransition } from 'react'
import BillKillerLogo from './logo'

interface AppNavbarProps {
  user: User
}

export default function AppNavbar({ user }: AppNavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const navigate = (href: string) => {
    startTransition(() => {
      router.push(href)
      setIsOpen(false)
    })
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8 flex-1 min-w-0">
              <Link href="/app/dashboard" className="flex items-center gap-2 flex-shrink-0">
                <BillKillerLogo size={28} />
                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  BillKiller
                </span>
              </Link>
              <div className="hidden md:flex space-x-6 flex-shrink-0">
                <Link href="/app/dashboard" prefetch={true} className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link href="/app/upload" prefetch={true} className="text-gray-700 hover:text-blue-600 flex items-center space-x-1">
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </Link>
                <Link href="/app/email" prefetch={true} className="text-gray-700 hover:text-blue-600 flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </Link>
                <Link href="/app/offerte" prefetch={true} className="text-gray-700 hover:text-blue-600">
                  Offerte
                </Link>
                <Link href="/app/prezzi" prefetch={true} className="text-gray-700 hover:text-blue-600">
                  Prezzi
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4 flex-shrink-0 ml-auto">
              <span className="text-sm text-gray-600 truncate max-w-[120px]">{user.email}</span>
              <Link href="/app/account">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            <button className="md:hidden" onClick={() => setIsOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 animate-in fade-in duration-200" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl animate-in slide-in-from-right duration-300">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <BillKillerLogo size={24} />
                  <span className="font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Menu</span>
                </div>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <Link href="/app/dashboard" prefetch={true} className={`flex items-center space-x-3 py-2 hover:text-blue-600 ${pathname === '/app/dashboard' ? 'text-blue-600 font-semibold bg-blue-50 px-3 rounded-lg' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>
                  <span>Dashboard</span>
                </Link>
                <Link href="/app/upload" prefetch={true} className={`flex items-center space-x-3 py-2 hover:text-blue-600 ${pathname === '/app/upload' ? 'text-blue-600 font-semibold bg-blue-50 px-3 rounded-lg' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>
                  <Upload className="w-5 h-5" />
                  <span>Upload</span>
                </Link>
                <Link href="/app/email" prefetch={true} className={`flex items-center space-x-3 py-2 hover:text-blue-600 ${pathname === '/app/email' ? 'text-blue-600 font-semibold bg-blue-50 px-3 rounded-lg' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </Link>
                <Link href="/app/offerte" prefetch={true} className={`flex items-center space-x-3 py-2 hover:text-blue-600 ${pathname === '/app/offerte' ? 'text-blue-600 font-semibold bg-blue-50 px-3 rounded-lg' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>
                  <span>Offerte</span>
                </Link>
                <Link href="/app/prezzi" prefetch={true} className={`flex items-center space-x-3 py-2 hover:text-blue-600 ${pathname === '/app/prezzi' ? 'text-blue-600 font-semibold bg-blue-50 px-3 rounded-lg' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>
                  <span>Prezzi</span>
                </Link>
                
                <div className="border-t pt-4 mt-4">
                  <Link href="/app/account" prefetch={true} className={`flex items-center space-x-3 py-2 hover:text-blue-600 ${pathname === '/app/account' ? 'text-blue-600 font-semibold bg-blue-50 px-3 rounded-lg' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>
                    <Settings className="w-5 h-5" />
                    <span>Account</span>
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center space-x-3 py-2 text-gray-700 hover:text-blue-600">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>

                <div className="border-t pt-4 text-sm text-gray-600 truncate">{user.email}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

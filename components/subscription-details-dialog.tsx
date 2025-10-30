'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils'
import { Calendar, FileText, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Transaction {
  id: string
  occurred_at: string
  amount: number
  description: string
  source: string
}

interface SubscriptionDetailsDialogProps {
  subscriptionId: string
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SubscriptionDetailsDialog({ 
  subscriptionId, 
  title, 
  open, 
  onOpenChange 
}: SubscriptionDetailsDialogProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && subscriptionId) {
      setLoading(true)
      fetch(`/api/subscriptions/${subscriptionId}/transactions`)
        .then(res => res.json())
        .then(data => {
          setTransactions(data.transactions || [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [open, subscriptionId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg pr-8">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4 mt-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500 text-sm">Caricamento...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">Nessuna transazione trovata</div>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-gray-600">
                {transactions.length} {transactions.length === 1 ? 'transazione' : 'transazioni'}
              </p>
              <div className="space-y-2 sm:space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {tx.source === 'email' ? (
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                          ) : (
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                          )}
                          <span className="text-[10px] sm:text-xs font-medium text-gray-500">
                            {tx.source === 'email' ? 'Da Email' : 'Da Estratto Conto'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 break-words line-clamp-2 sm:line-clamp-none">{tx.description}</p>
                        <div className="flex items-center gap-1 mt-2 text-[10px] sm:text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(tx.occurred_at).toLocaleDateString('it-IT', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <div className="text-base sm:text-lg font-bold text-gray-900">
                          {formatCurrency(Math.abs(tx.amount))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

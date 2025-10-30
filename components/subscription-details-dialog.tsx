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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dettagli: {title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Caricamento...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nessuna transazione trovata</div>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Trovate {transactions.length} transazioni
              </p>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {tx.source === 'email' ? (
                            <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-green-500 flex-shrink-0" />
                          )}
                          <span className="text-xs font-medium text-gray-500">
                            {tx.source === 'email' ? 'Da Email' : 'Da Estratto Conto'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 break-words">{tx.description}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(tx.occurred_at).toLocaleDateString('it-IT', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-gray-900">
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

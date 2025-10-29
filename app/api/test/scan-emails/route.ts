import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Simula email con ricevute di pagamento
  const mockEmails = [
    {
      date: '2025-05-15',
      subject: 'Ricevuta pagamento Netflix',
      body: 'Grazie per il tuo abbonamento Netflix. Importo addebitato: €15.99',
      merchant: 'Netflix',
      amount: 15.99
    },
    {
      date: '2025-06-15',
      subject: 'Ricevuta pagamento Netflix',
      body: 'Grazie per il tuo abbonamento Netflix. Importo addebitato: €15.99',
      merchant: 'Netflix',
      amount: 15.99
    },
    {
      date: '2025-07-15',
      subject: 'Ricevuta pagamento Netflix',
      body: 'Grazie per il tuo abbonamento Netflix. Importo addebitato: €15.99',
      merchant: 'Netflix',
      amount: 15.99
    },
    {
      date: '2025-04-10',
      subject: 'Pagamento rata 3 di 12 - iPhone 15',
      body: 'Hai pagato la rata 3 di 12 per iPhone 15 Pro. Importo: €83.25',
      merchant: 'Apple Store',
      amount: 83.25
    },
    {
      date: '2025-05-10',
      subject: 'Pagamento rata 4 di 12 - iPhone 15',
      body: 'Hai pagato la rata 4 di 12 per iPhone 15 Pro. Importo: €83.25',
      merchant: 'Apple Store',
      amount: 83.25
    },
    {
      date: '2025-06-10',
      subject: 'Pagamento rata 5 di 12 - iPhone 15',
      body: 'Hai pagato la rata 5 di 12 per iPhone 15 Pro. Importo: €83.25',
      merchant: 'Apple Store',
      amount: 83.25
    }
  ]

  // Inserisci transazioni simulate
  const transactions = mockEmails.map(email => ({
    user_id: user.id,
    occurred_at: email.date,
    amount: -email.amount,
    merchant_canonical: email.merchant.toLowerCase().replace(/\s+/g, '-'),
    description: `${email.subject} - ${email.body}`,
    source: 'email'
  }))

  const { error } = await supabase
    .from('transactions')
    .insert(transactions)

  if (error) {
    console.error('Error inserting test transactions:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log(`✅ Inserted ${transactions.length} test email transactions`)

  return NextResponse.json({ 
    success: true, 
    count: transactions.length,
    message: 'Test email transactions inserted. Go to /app/upload and reprocess to detect subscriptions.'
  })
}

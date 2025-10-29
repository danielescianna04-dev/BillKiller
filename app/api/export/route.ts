import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import puppeteer from 'puppeteer'

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check premium
  const { data: profile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan !== 'premium') {
    return NextResponse.json({ error: 'Premium required' }, { status: 403 })
  }

  const format = req.nextUrl.searchParams.get('format') || 'csv'

  // Get subscriptions (exclude installment plans)
  const { data: allSubscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')

  if (!allSubscriptions) {
    return NextResponse.json({ error: 'No data' }, { status: 404 })
  }

  // Filter out installment plans and add monthly_amount calculation
  const subscriptions = allSubscriptions
    .filter(sub => !sub.meta?.is_installment_plan)
    .map(sub => {
      let monthly_amount = sub.amount
      if (sub.periodicity === 'yearly') monthly_amount = sub.amount / 12
      else if (sub.periodicity === 'quarterly') monthly_amount = sub.amount / 3
      else if (sub.periodicity === 'semiannual') monthly_amount = sub.amount / 6
      return { ...sub, monthly_amount }
    })

  const totalMonthly = subscriptions.reduce((sum, s) => sum + s.monthly_amount, 0)
  const totalYearly = totalMonthly * 12

  if (format === 'csv') {
    const csv = [
      'Abbonamento,Periodicità,Importo,Importo Mensile,Prima Rilevazione,Ultima Rilevazione',
      ...subscriptions.map(s => 
        `"${s.title}",${s.periodicity},€${s.amount.toFixed(2)},€${s.monthly_amount.toFixed(2)},${s.first_seen},${s.last_seen}`
      )
    ].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="abbonamenti.csv"'
      }
    })
  }

  if (format === 'pdf') {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #f59e0b; }
          .summary { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f59e0b; color: white; }
          .total { font-weight: bold; background: #fef3c7; }
        </style>
      </head>
      <body>
        <h1>BillKiller - Report Abbonamenti</h1>
        <p>Generato il ${new Date().toLocaleDateString('it-IT')}</p>
        
        <div class="summary">
          <h2>Riepilogo</h2>
          <p><strong>Spesa Mensile:</strong> €${totalMonthly.toFixed(2)}</p>
          <p><strong>Spesa Annuale:</strong> €${totalYearly.toFixed(2)}</p>
          <p><strong>Abbonamenti Attivi:</strong> ${subscriptions.length}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Abbonamento</th>
              <th>Periodicità</th>
              <th>Importo</th>
              <th>Mensile</th>
              <th>Prima Rilevazione</th>
            </tr>
          </thead>
          <tbody>
            ${subscriptions.map(s => `
              <tr>
                <td>${s.title}</td>
                <td>${s.periodicity}</td>
                <td>€${s.amount.toFixed(2)}</td>
                <td>€${s.monthly_amount.toFixed(2)}</td>
                <td>${new Date(s.first_seen).toLocaleDateString('it-IT')}</td>
              </tr>
            `).join('')}
            <tr class="total">
              <td colspan="3">Totale Mensile</td>
              <td>€${totalMonthly.toFixed(2)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.setContent(html)
    const pdf = await page.pdf({ format: 'A4', printBackground: true })
    await browser.close()

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="abbonamenti.pdf"'
      }
    })
  }

  return NextResponse.json({ error: 'Format not supported' }, { status: 400 })
}

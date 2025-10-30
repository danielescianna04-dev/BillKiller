import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import PDFDocument from 'pdfkit'

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
      ),
      '',
      `"Totale Mensile",,,,€${totalMonthly.toFixed(2)}`,
      `"Totale Annuale",,,,€${totalYearly.toFixed(2)}`
    ].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="abbonamenti.csv"'
      }
    })
  }

  if (format === 'pdf') {
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []

    doc.on('data', (chunk) => chunks.push(chunk))
    
    return new Promise<NextResponse>((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks)
        resolve(new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="abbonamenti.pdf"'
          }
        }))
      })

      // Header
      doc.fontSize(24).fillColor('#f59e0b').text('BillKiller', { align: 'left' })
      doc.fontSize(16).fillColor('#000').text('Report Abbonamenti', { align: 'left' })
      doc.fontSize(10).fillColor('#666').text(`Generato il ${new Date().toLocaleDateString('it-IT')}`, { align: 'left' })
      doc.moveDown(2)

      // Summary box
      doc.rect(50, doc.y, 500, 100).fillAndStroke('#fef3c7', '#f59e0b')
      doc.fillColor('#000').fontSize(12)
      doc.text(`Spesa Mensile: €${totalMonthly.toFixed(2)}`, 70, doc.y - 80, { width: 460 })
      doc.text(`Spesa Annuale: €${totalYearly.toFixed(2)}`, 70, doc.y + 5, { width: 460 })
      doc.text(`Abbonamenti Attivi: ${subscriptions.length}`, 70, doc.y + 5, { width: 460 })
      doc.moveDown(4)

      // Table header
      const tableTop = doc.y
      doc.fontSize(10).fillColor('#fff')
      doc.rect(50, tableTop, 500, 25).fill('#f59e0b')
      doc.text('Abbonamento', 60, tableTop + 8, { width: 150 })
      doc.text('Periodicità', 210, tableTop + 8, { width: 80 })
      doc.text('Importo', 290, tableTop + 8, { width: 80 })
      doc.text('Mensile', 370, tableTop + 8, { width: 80 })
      doc.text('Dal', 450, tableTop + 8, { width: 90 })

      // Table rows
      let y = tableTop + 35
      doc.fillColor('#000')
      subscriptions.forEach((sub, i) => {
        if (y > 700) {
          doc.addPage()
          y = 50
        }
        
        const bgColor = i % 2 === 0 ? '#f9fafb' : '#fff'
        doc.rect(50, y - 5, 500, 25).fill(bgColor)
        
        doc.fontSize(9)
        doc.text(sub.title.substring(0, 25), 60, y, { width: 140 })
        doc.text(sub.periodicity, 210, y, { width: 70 })
        doc.text(`€${sub.amount.toFixed(2)}`, 290, y, { width: 70 })
        doc.text(`€${sub.monthly_amount.toFixed(2)}`, 370, y, { width: 70 })
        doc.text(new Date(sub.first_seen).toLocaleDateString('it-IT'), 450, y, { width: 90 })
        
        y += 30
      })

      // Total row
      doc.rect(50, y - 5, 500, 25).fill('#fef3c7')
      doc.fontSize(10).font('Helvetica-Bold')
      doc.text('Totale Mensile', 60, y, { width: 300 })
      doc.text(`€${totalMonthly.toFixed(2)}`, 370, y, { width: 80 })

      doc.end()
    })
  }

  return NextResponse.json({ error: 'Format not supported' }, { status: 400 })
}

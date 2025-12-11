import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { jsPDF } from 'jspdf'

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
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()

      // Header
      doc.setFontSize(24)
      doc.setTextColor(245, 158, 11) // amber-500
      doc.text('BillKiller', 20, 25)

      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.text('Report Abbonamenti', 20, 35)

      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generato il ${new Date().toLocaleDateString('it-IT')}`, 20, 43)

      // Summary box
      doc.setFillColor(254, 243, 199) // amber-100
      doc.setDrawColor(245, 158, 11) // amber-500
      doc.roundedRect(20, 50, pageWidth - 40, 35, 3, 3, 'FD')

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text(`Spesa Mensile: €${totalMonthly.toFixed(2)}`, 30, 62)
      doc.text(`Spesa Annuale: €${totalYearly.toFixed(2)}`, 30, 72)
      doc.text(`Abbonamenti Attivi: ${subscriptions.length}`, 30, 82)

      // Table header
      const tableTop = 100
      doc.setFillColor(245, 158, 11)
      doc.rect(20, tableTop, pageWidth - 40, 10, 'F')

      doc.setFontSize(9)
      doc.setTextColor(255, 255, 255)
      doc.text('Abbonamento', 25, tableTop + 7)
      doc.text('Periodicità', 85, tableTop + 7)
      doc.text('Importo', 120, tableTop + 7)
      doc.text('Mensile', 150, tableTop + 7)
      doc.text('Dal', 175, tableTop + 7)

      // Table rows
      let y = tableTop + 18
      doc.setTextColor(0, 0, 0)

      const getPeriodicityLabel = (p: string) => {
        const labels: Record<string, string> = {
          monthly: 'Mensile',
          yearly: 'Annuale',
          quarterly: 'Trimestrale',
          semiannual: 'Semestrale',
          unknown: 'Sconosciuto'
        }
        return labels[p] || p
      }

      subscriptions.forEach((sub, i) => {
        // Check if we need a new page
        if (y > 270) {
          doc.addPage()
          y = 20
        }

        // Alternating row colors
        if (i % 2 === 0) {
          doc.setFillColor(249, 250, 251)
          doc.rect(20, y - 5, pageWidth - 40, 10, 'F')
        }

        doc.setFontSize(8)
        const title = sub.title.length > 20 ? sub.title.substring(0, 20) + '...' : sub.title
        doc.text(title, 25, y)
        doc.text(getPeriodicityLabel(sub.periodicity), 85, y)
        doc.text(`€${sub.amount.toFixed(2)}`, 120, y)
        doc.text(`€${sub.monthly_amount.toFixed(2)}`, 150, y)
        doc.text(new Date(sub.first_seen).toLocaleDateString('it-IT'), 175, y)

        y += 10
      })

      // Total row
      doc.setFillColor(254, 243, 199)
      doc.rect(20, y - 3, pageWidth - 40, 10, 'F')
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Totale Mensile:', 25, y + 4)
      doc.text(`€${totalMonthly.toFixed(2)}`, 150, y + 4)

      // Generate PDF buffer
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="abbonamenti.pdf"'
        }
      })
    } catch (error) {
      console.error('PDF generation error:', error)
      return NextResponse.json({ error: 'Errore nella generazione del PDF' }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Format not supported' }, { status: 400 })
}

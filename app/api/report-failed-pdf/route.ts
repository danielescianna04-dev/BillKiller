import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { filePath, userEmail } = await req.json()

    // Get the failed PDF from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('statements')
      .download(filePath)

    if (downloadError || !fileData) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Convert blob to base64 for email attachment
    const buffer = await fileData.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const fileName = filePath.split('/').pop() || 'estratto-conto.pdf'

    // Save report to database
    const { error: reportError } = await supabase
      .from('failed_pdf_reports')
      .insert({
        user_id: user.id,
        user_email: userEmail,
        file_path: filePath,
        file_name: fileName,
        reported_at: new Date().toISOString()
      })

    if (reportError) {
      console.error('Error saving report:', reportError)
    }

    // Send email with Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'BillKiller <noreply@billkiller.com>',
          to: 'daniele.scianna04@gmail.com',
          subject: `🔴 PDF non supportato - ${userEmail}`,
          html: `
            <h2>Nuovo PDF non supportato</h2>
            <p><strong>Utente:</strong> ${userEmail}</p>
            <p><strong>User ID:</strong> ${user.id}</p>
            <p><strong>File:</strong> ${fileName}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString('it-IT')}</p>
            <hr>
            <p>Analizza il PDF allegato e aggiungi il supporto per questa banca.</p>
          `,
          attachments: [{
            filename: fileName,
            content: base64
          }]
        })
      } catch (emailError) {
        console.error('Email send error:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Report failed PDF error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

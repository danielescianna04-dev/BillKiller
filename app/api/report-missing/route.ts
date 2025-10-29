import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerSupabaseClient } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { statementId, message } = await req.json()

    // Get statement file
    const { data: statement } = await supabase
      .from('statements')
      .select('file_path, file_name')
      .eq('id', statementId)
      .eq('user_id', user.id)
      .single()

    if (!statement) {
      return NextResponse.json({ error: 'Statement not found' }, { status: 404 })
    }

    // Download file from Supabase Storage
    const { data: fileData } = await supabase.storage
      .from('statements')
      .download(statement.file_path)

    if (!fileData) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Convert blob to base64
    const buffer = await fileData.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    // Send email with Resend
    await resend.emails.send({
      from: 'BillKiller <noreply@billkiller.it>',
      to: 'daniele.scianna04@gmail.com',
      subject: `Segnalazione abbonamenti mancanti - ${user.email}`,
      html: `
        <h2>Segnalazione da ${user.email}</h2>
        <p><strong>Messaggio:</strong></p>
        <p>${message || 'Nessun messaggio'}</p>
        <p><strong>File:</strong> ${statement.file_name}</p>
        <p><strong>User ID:</strong> ${user.id}</p>
      `,
      attachments: [
        {
          filename: statement.file_name,
          content: base64,
        },
      ],
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error sending report:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

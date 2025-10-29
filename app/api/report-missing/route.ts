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

    // Get source file
    const { data: source, error: sourceError } = await supabase
      .from('sources')
      .select('*')
      .eq('id', statementId)
      .eq('user_id', user.id)
      .single()

    console.log('Source query:', { statementId, userId: user.id, source, sourceError })

    if (!source) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 })
    }

    // Construct file path from user_id and label
    const filePath = `${user.id}/${source.label}`
    const fileName = source.label

    console.log('Downloading file:', filePath)

    // Download file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('statements')
      .download(filePath)

    console.log('Download result:', { fileData: !!fileData, downloadError })

    if (!fileData) {
      return NextResponse.json({ error: 'File not found in storage' }, { status: 404 })
    }

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
        <p><strong>File:</strong> ${fileName}</p>
        <p><strong>User ID:</strong> ${user.id}</p>
      `,
      attachments: [
        {
          filename: fileName,
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

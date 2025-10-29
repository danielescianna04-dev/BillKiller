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

    const fileName = source.label

    // List files in user folder to find the one with matching label
    const { data: files, error: listError } = await supabase.storage
      .from('statements')
      .list(user.id)

    console.log('Files in folder:', files?.map(f => f.name))

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files found in storage' }, { status: 404 })
    }

    // Find file that ends with the label
    const matchingFile = files.find(f => f.name.endsWith(source.label))

    if (!matchingFile) {
      return NextResponse.json({ error: 'File not found in storage' }, { status: 404 })
    }

    const filePath = `${user.id}/${matchingFile.name}`

    console.log('Downloading file:', filePath)

    // Download file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('statements')
      .download(filePath)

    console.log('Download result:', { fileData: !!fileData, downloadError })

    if (!fileData) {
      return NextResponse.json({ error: 'File download failed' }, { status: 404 })
    }

    if (!fileData) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Convert blob to base64
    const buffer = await fileData.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    console.log('Sending email to daniele.scianna04@gmail.com')

    // Send email with Resend
    const emailResult = await resend.emails.send({
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

    console.log('Email sent:', emailResult)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error sending report:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

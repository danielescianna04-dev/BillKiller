import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get connected email sources
    const { data: sources, error } = await supabase
      .from('sources')
      .select('*')
      .eq('user_id', user.id)
      .in('type', ['gmail', 'outlook'])
      .eq('status', 'active')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!sources || sources.length === 0) {
      return NextResponse.json({ 
        error: 'Nessuna email collegata. Vai su /app/email per collegare Gmail o Outlook.' 
      }, { status: 400 })
    }

    let totalScanned = 0

    // Trigger scan for each connected source
    for (const source of sources) {
      try {
        const endpoint = source.type === 'gmail' 
          ? '/api/scan/gmail' 
          : '/api/scan/outlook'
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${endpoint}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({ userId: user.id })
        })

        if (response.ok) {
          const data = await response.json()
          totalScanned += data.count || 0
        }
      } catch (err) {
        console.error(`Error scanning ${source.type}:`, err)
      }
    }

    return NextResponse.json({ 
      success: true, 
      sources: sources.length,
      transactions: totalScanned,
      message: `Scansionate ${totalScanned} email da ${sources.length} account. Ricarica il PDF per riprocessare.`
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

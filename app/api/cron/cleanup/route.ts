import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get old sources
    const { data: oldSources } = await supabase
      .from('sources')
      .select('id, meta')
      .eq('type', 'statement')
      .lt('created_at', thirtyDaysAgo.toISOString())

    if (!oldSources) {
      return NextResponse.json({ deleted: 0 })
    }

    let deleted = 0

    for (const source of oldSources) {
      // Delete file from storage
      if (source.meta?.file_path) {
        await supabase.storage
          .from('statements')
          .remove([source.meta.file_path])
      }

      // Update source to mark file as deleted
      await supabase
        .from('sources')
        .update({ 
          status: 'archived',
          meta: { ...source.meta, file_deleted: true }
        })
        .eq('id', source.id)

      deleted++
    }

    return NextResponse.json({ 
      success: true, 
      deleted,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Cleanup error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

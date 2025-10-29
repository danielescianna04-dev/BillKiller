import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Delete all user files from storage
    const { data: sources } = await supabaseAdmin
      .from('sources')
      .select('meta')
      .eq('user_id', user.id)
      .eq('type', 'statement')

    if (sources) {
      const filePaths = sources
        .map(s => s.meta?.file_path)
        .filter(Boolean)
      
      if (filePaths.length > 0) {
        await supabaseAdmin.storage
          .from('statements')
          .remove(filePaths)
      }
    }

    // Delete user data (cascade will handle related tables)
    await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', user.id)

    // Delete auth user
    await supabaseAdmin.auth.admin.deleteUser(user.id)

    // Sign out
    await supabase.auth.signOut()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete account error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

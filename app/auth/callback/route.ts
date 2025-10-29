import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code:', error)
      return NextResponse.redirect(new URL('/auth/login?error=callback', req.url))
    }
    
    // Get user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Check if user exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()
      
      // Create user if doesn't exist
      if (!existingUser) {
        await supabase.from('users').insert({
          id: user.id,
          email: user.email!,
          plan: 'free'
        })
        // New user - show welcome message
        return NextResponse.redirect(new URL('/app/dashboard?welcome=true', req.url))
      }
    }
    
    // Existing user - show login success
    return NextResponse.redirect(new URL('/app/dashboard?login=success', req.url))
  }

  return NextResponse.redirect(new URL('/auth/login', req.url))
}

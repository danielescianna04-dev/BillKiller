import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url)
  const code = requestUrl.searchParams.get('code')

  console.log('Callback called with code:', code ? 'present' : 'missing')

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
    
    console.log('Session exchanged successfully')
    
    // Get user
    const { data: { user } } = await supabase.auth.getUser()
    
    console.log('User:', user?.id)
    
    if (user) {
      // Check if user exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()
      
      // Create user if doesn't exist
      if (!existingUser) {
        console.log('Creating new user')
        await supabase.from('users').insert({
          id: user.id,
          email: user.email!,
          plan: 'free'
        })
        // New user - redirect to dashboard
        const dashboardUrl = new URL('/app/dashboard', req.url)
        dashboardUrl.searchParams.set('welcome', 'true')
        console.log('Redirecting new user to:', dashboardUrl.toString())
        return NextResponse.redirect(dashboardUrl)
      }
    }
    
    // Existing user - redirect to dashboard
    const dashboardUrl = new URL('/app/dashboard', req.url)
    dashboardUrl.searchParams.set('login', 'success')
    console.log('Redirecting existing user to:', dashboardUrl.toString())
    return NextResponse.redirect(dashboardUrl)
  }

  console.log('No code, redirecting to login')
  return NextResponse.redirect(new URL('/auth/login', req.url))
}

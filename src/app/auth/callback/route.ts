import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  
  if (code) {
    console.log('Exchanging code for session...')
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error.message)
      return NextResponse.redirect(
        new URL(`/signin?error=${encodeURIComponent(error.message)}`, req.url)
      )
    }
    
    // Check if user's email is verified
    const { data: { user } } = await supabase.auth.getUser()
    console.log('User after code exchange:', user?.id, 'Email confirmed:', !!user?.email_confirmed_at)
    
    // Only redirect to dashboard if email is confirmed
    if (user?.email_confirmed_at) {
      console.log('Email confirmed, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    } else {
      // Otherwise redirect to verify-email page
      console.log('Email not confirmed, redirecting to verify-email')
      return NextResponse.redirect(new URL('/verify-email', req.url))
    }
  }
  
  // Fallback redirect
  console.log('No code found, redirecting to home')
  return NextResponse.redirect(new URL('/', req.url))
}
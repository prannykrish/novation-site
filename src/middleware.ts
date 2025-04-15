import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Refresh session if expired - helps prevent redirect loops
  await supabase.auth.getSession()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log('Middleware path:', req.nextUrl.pathname)
  console.log('Session exists:', !!session)

  // If there's no session and we're trying to access the dashboard
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      console.log('No session found, redirecting to /signin')
      return NextResponse.redirect(new URL('/signin', req.url))
    }
    
    // Get user details to check if email is verified
    const { data: { user } } = await supabase.auth.getUser()
    console.log('User email confirmed:', !!user?.email_confirmed_at)
    
    // Check if email is confirmed (email_confirmed_at will be null if not confirmed)
    if (user && !user.email_confirmed_at) {
      console.log('Email not verified, redirecting to /verify-email')
      return NextResponse.redirect(new URL('/verify-email', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    // Add routes that should be protected here
    '/dashboard/:path*',
  ],
}
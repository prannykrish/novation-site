import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Refresh session if possible
  await supabase.auth.getSession()
  
  // Get updated session
  const { data: { session } } = await supabase.auth.getSession()
  
  // Auth routes: callback, reset password - these need special handling
  if (req.nextUrl.pathname.startsWith('/auth/reset')) {
    // Only allow access to reset page if user has a session
    // This ensures only users with valid reset links can access
    if (!session) {
      return NextResponse.redirect(new URL('/signin', req.url))
    }
    return res
  }

  // Auth callback should be handled by its own route handler
  if (req.nextUrl.pathname.startsWith('/auth/callback')) {
    return res
  }
  
  // Protected routes require authentication
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/signin', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/reset',
    '/auth/callback'
  ]
}
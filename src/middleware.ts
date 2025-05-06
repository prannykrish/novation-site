import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { pathname } = req.nextUrl
  
  // Check session
  const { data: { session }} = await supabase.auth.getSession()
  
  // Special handling for auth/reset routes - allow access if this is a recovery flow
  if (pathname === '/auth/reset') {
    const { searchParams } = req.nextUrl
    const isRecovery = searchParams.get('type') === 'recovery'
    
    if (isRecovery) {
      return res
    }
  }
  
  // Auth callback should always be accessible
  if (pathname === '/auth/callback') {
    return res
  }
  
  // Redirect unauthenticated users for protected routes
  if (!session && pathname.startsWith('/dashboard')) {
    const redirectUrl = new URL('/signin', req.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
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
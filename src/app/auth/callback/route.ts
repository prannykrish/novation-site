import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  
  // Get the host from the request URL
  const host = req.headers.get('host') || ''
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`
  
  console.log(`Auth callback triggered. Host: ${host}, Base URL: ${baseUrl}`)
  
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
    
    // Check if this is a password recovery flow
    if (type === 'recovery') {
      // For password recovery, redirect to the reset page
      const resetUrl = new URL('/auth/reset', req.url)
      console.log(`Redirecting to reset page: ${resetUrl.toString()}`)
      return NextResponse.redirect(resetUrl)
    }
  }
  
  // For normal sign-in/sign-up flows, redirect to dashboard
  const dashboardUrl = new URL('/dashboard', req.url)
  console.log(`Redirecting to dashboard: ${dashboardUrl.toString()}`)
  return NextResponse.redirect(dashboardUrl)
}
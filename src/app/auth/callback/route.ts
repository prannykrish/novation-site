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
  
  // Get the proper base URL - consider X-Forwarded-Host for proxies
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || ''
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  
  // Use NEXT_PUBLIC_URL if available (recommended approach)
  const baseUrl = process.env.NEXT_PUBLIC_URL || `${protocol}://${host}`
  console.log(`Auth callback triggered. Base URL: ${baseUrl}, Type: ${type}`)
  
  if (code) {
    // Exchange the code for a session in all cases
    await supabase.auth.exchangeCodeForSession(code)
    
    // Special handling for password recovery flows
    if (type === 'recovery') {
      // For password recovery, redirect to the reset page
      return NextResponse.redirect(`${baseUrl}/auth/reset?type=recovery`)
    }
    
    // Handle email verification flow
    if (type === 'email_verification' || type === 'signup') {
      // For email verification, redirect to the verify page
      return NextResponse.redirect(`${baseUrl}/auth/verify?type=${type}`)
    }
  }
  
  // For normal sign-in/sign-up flows, redirect to dashboard
  return NextResponse.redirect(`${baseUrl}/dashboard`)
}
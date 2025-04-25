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
  console.log(`Auth callback triggered. Base URL: ${baseUrl}`)
  
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
    
    // Check if this is a password recovery flow
    if (type === 'recovery') {
      // For password recovery, redirect to the reset page
      return NextResponse.redirect(`${baseUrl}/auth/reset`)
    }
  }
  
  // For normal sign-in/sign-up flows, redirect to dashboard
  return NextResponse.redirect(`${baseUrl}/dashboard`)
}
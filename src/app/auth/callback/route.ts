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
  
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
    
    // Check if this is a password recovery flow
    if (type === 'recovery') {
      // For password recovery, redirect to the reset page
      return NextResponse.redirect(new URL('/auth/reset', req.url))
    }
  }
  
  // For normal sign-in/sign-up flows, redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', req.url))
}
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 1) named export:
export function middleware(request: NextRequest) {
  // …any logic you need…
  return NextResponse.next()
}

// 2) (optional) route matcher
export const config = {
  matcher: '/:path*',      // apply to all routes
  // or narrow it to specific paths
}

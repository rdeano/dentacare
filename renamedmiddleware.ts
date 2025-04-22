import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const url = req.nextUrl.clone()

  // Skip middleware for login or register
  if (url.pathname === '/admin/login' || url.pathname === '/admin/register') {
    console.log('[Middleware] Skipping auth check for:', url.pathname)
    return res
  }

  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  console.log('[Middleware] Path:', url.pathname)
  console.log('[Middleware] Session:', session)
  console.log('[Middleware] Error:', error)

  const isAdminRoute = url.pathname.startsWith('/admin')

  if (isAdminRoute && !session) {
    console.log('[Middleware] No session, redirecting to /admin/login')
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  return res
}

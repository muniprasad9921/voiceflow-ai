import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/admin']

// Auth routes — authenticated users should be bounced away from these
const AUTH_ROUTES = ['/login', '/signup']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { supabase, supabaseResponse } = createClient(request)

  // Refresh the session. IMPORTANT: do NOT remove this call — it keeps the
  // auth token fresh and writes updated cookies back to supabaseResponse.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthenticated = !!user

  // ── Protect /dashboard/* and /admin/* ────────────────────
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── Redirect authenticated users away from /login & /signup ─
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isAuthRoute && isAuthenticated) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // Pass through, with refreshed session cookies attached
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image  (image optimisation)
     * - favicon.ico  (favicon)
     * - public assets (svg, png, jpg, etc.)
     * - api routes that handle their own auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

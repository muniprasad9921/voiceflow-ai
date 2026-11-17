import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database'

/**
 * Creates a Supabase client for use inside Next.js Middleware.
 * Returns both the client and the response object (which may have
 * refreshed session cookies attached).
 */
export function createClient(request: NextRequest) {
  // Start with a plain pass-through response so we can attach cookies.
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Mirror cookies onto the outgoing request (for downstream middleware)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Re-create the response so it carries the new cookies
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  return { supabase, supabaseResponse }
}

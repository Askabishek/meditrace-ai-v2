import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// inside createServerClient's cookies: { ... }
setAll(
  cookiesToSet: { name: string; value: string; options: CookieOptions }[]
) {
  cookiesToSet.forEach(({ name, value }) =>
    request.cookies.set(name, value)
  )
  response = NextResponse.next({ request })
  cookiesToSet.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options)
  )
},

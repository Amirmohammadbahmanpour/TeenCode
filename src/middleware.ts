import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // این خط سشن رو تازه می‌کنه
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // اگر یوزر لاگین بود و خواست بره به صفحات ورود
  if (user && (url.pathname === '/login' || url.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // اگر یوزر لاگین نبود و خواست بره به صفحات محافظت شده
  if (!user && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/complete-profile'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/login', '/register', '/dashboard/:path*', '/complete-profile'],
}
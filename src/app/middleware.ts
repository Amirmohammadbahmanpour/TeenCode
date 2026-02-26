import { createServerClient } from '@supabase/ssr'
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
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // --- بخش کلیدی بهینه‌سازی ---
  const { pathname } = request.nextUrl

  // فقط اگر کاربر خواست به صفحات حساس بره، هویتش رو چک کن
  // اگر صفحه اصلی یا وبلاگ بود، مستقیم رد شو (سرعت موشک)
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/grow') || 
                           pathname.startsWith('/courses');

  if (isProtectedRoute) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // اگر یوزر نبود، بفرستش به لاگین
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  if (pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
  
    // چک کردن نقش ادمین از دیتابیس
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
  
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url)) // اگر ادمین نبود برگرده به خونه
    }
  }

  // برای بقیه صفحات (Home, Blog, ...) فقط نشست رو رفرش کن (بدون معطلیgetUser)
  // سوبابیس خودش در پس‌زمینه با getSession کار می‌کنه که سریع‌تره
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
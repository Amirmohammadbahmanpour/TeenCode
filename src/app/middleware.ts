import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // ایجاد کلاینت سوبابیس برای مدیریت نشست‌ها در کوکی
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // آپدیت کردن کوکی‌ها در درخواست و پاسخ
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // این خط بسیار مهم است؛ باعث می‌شود توکن منقضی شده به‌صورت خودکار رفرش شود
  await supabase.auth.getUser()

  return response
}

// تعیین اینکه میدل‌ویر روی کدام مسیرها اجرا شود
export const config = {
  matcher: [
    /*
     * اعمال روی تمام مسیرها به جز:
     * - _next/static (فایل‌های استاتیک)
     * - _next/image (تصاویر بهینه‌شده)
     * - favicon.ico (آیکون سایت)
     * - فایل‌های با پسوند (svg, png, jpg, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
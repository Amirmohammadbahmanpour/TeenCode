"use client"
import { LogOut, BookOpen, LayoutDashboard, Podcast, BarChart3, MessageSquare, Home, UserCircle, AlertCircle } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar, // برای کنترل وضعیت سایدبار (بستن در موبایل)
} from "@/components/ui/sidebar"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation" // اضافه شدن usePathname
import { useState, useEffect } from "react"
import { User } from "@supabase/supabase-js"
import { cn } from "@/lib/utils" // تابع کمکی shadcn برای کلاس‌ها

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname() // گرفتن آدرس فعلی صفحه
  const { setOpenMobile, isMobile } = useSidebar() // دسترسی به کنترلر سایدبار

  const [user, setUser] = useState<User | null>(null)
  const [isProfileComplete, setIsProfileComplete] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
      if (currentUser && !currentUser.user_metadata?.full_name) {
        setIsProfileComplete(false)
      }
    }
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setIsProfileComplete(!!session?.user?.user_metadata?.full_name)
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  // تابع کمکی برای بستن سایدبار در موبایل بعد از کلیک
  const handleItemClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const publicItems = [{ title: "خانه", url: "/", icon: Home }]

  const privateItems = [
    { title: "داشبورد", url: "/dashboard", icon: LayoutDashboard },
    { title: "۳۰ روز تحول", url: "/courses", icon: BookOpen },
    { title: "مطالب آموزشی", url: "/lesson-page", icon: BarChart3 },
    { title: "نمودار رشد", url: "/grow", icon: MessageSquare },
  ]

  // تابع رندر کردن آیتم‌های منو
  const renderMenuItems = (items: typeof publicItems) => (
    items.map((item) => {
      const isActive = pathname === item.url; // بررسی فعال بودن لینک
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            className={cn(
              "py-6 transition-all duration-200",
              isActive ? "bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-400 font-bold" : "text-stone-600 dark:text-stone-400"
            )}
            onClick={handleItemClick} // بستن سایدبار در موبایل
          >
            <Link href={item.url} className="flex items-center gap-3 w-full">
              <item.icon className={cn("h-5 w-5", isActive ? "text-sage-600" : "text-stone-400")} />
              <span>{item.title}</span>
              {isActive && <div className="absolute left-2 w-1.5 h-1.5 rounded-full bg-sage-600" />}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    })
  )

  return (
    <Sidebar side="right" collapsible="offcanvas" className="border-none bg-sidebar">
      <SidebarContent>
        {user && (
          <div className="p-4 mb-2 bg-sage-50/50 dark:bg-white/5 mx-2 mt-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="bg-sage-100 dark:bg-sage-900/40 rounded-full p-2">
                <UserCircle className="text-sage-600 h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-stone-400">خوش آمدی،</span>
                <span className="text-sm font-bold text-stone-700 dark:text-white truncate max-w-[120px]">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-sm mb-2 px-4">منوی دسترسی</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(publicItems)}
              {user ? renderMenuItems(privateItems) : (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="py-6 bg-sage-600 text-white hover:bg-sage-700"
                    onClick={handleItemClick}
                  >
                    <Link href="/login" className="flex items-center gap-3 justify-center">
                      <Podcast className="h-5 w-5" />
                      <span className="font-bold">ورود / ثبت‌نام</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && !isProfileComplete && (
          <div className="mx-4 mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Link href="/complete-profile" onClick={handleItemClick} className="flex items-center gap-2 text-amber-700 dark:text-amber-500 text-xs font-bold">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              تکمیل اطلاعات پروفایل
            </Link>
          </div>
        )}
      </SidebarContent>

      {user && (
        <SidebarFooter className="p-4 border-t border-stone-200/50 dark:border-stone-800/50">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleSignOut} className="py-6 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                <LogOut className="h-5 w-5" />
                <span className="font-bold">خروج از حساب</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
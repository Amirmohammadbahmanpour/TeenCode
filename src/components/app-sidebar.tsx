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
} from "@/components/ui/sidebar"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { User } from "@supabase/supabase-js"

export function AppSidebar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isProfileComplete, setIsProfileComplete] = useState(true) // فرض اولیه بر کامل بودن

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      // چک کردن تکمیل بودن پروفایل (مثلاً چک کردن وجود نام در متادیتا)
      if (currentUser && !currentUser.user_metadata?.full_name) {
        setIsProfileComplete(false)
      }
    }
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user && !session.user.user_metadata?.full_name) {
        setIsProfileComplete(false)
      } else {
        setIsProfileComplete(true)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  // تعریف منوها بر اساس وضعیت کاربر
  const publicItems = [{ title: "خانه", url: "/", icon: Home }]

  const privateItems = [
    { title: "داشبورد", url: "/dashboard", icon: LayoutDashboard },
    { title: "۳۰ روز تحول", url: "/courses", icon: BookOpen },
    { title: "مطالب آموزشی", url: "/lesson-page", icon: BarChart3 },
    { title: "نمودار رشد", url: "/grow", icon: MessageSquare },
  ]

  return (
    <Sidebar side="right" collapsible="offcanvas" className="border-none bg-sidebar">
      <SidebarContent>
        {/* بخش اطلاعات کاربر اگر وارد شده باشد */}
        {user && (
          <div className="p-4 mb-2 bg-sage-50/50 dark:bg-white/5 mx-2 mt-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="bg-sage-500 rounded-full p-2">
                <UserCircle className="text-sage-600 h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-stone-400">خوش آمدی،</span>
                <span className="text-sm font-bold text-stone-700 dark:text-white truncate max-w-[120px]">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-sm mb-2">منوی دسترسی</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* آیتم‌های عمومی */}
              {publicItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="py-6">
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-sage-600" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* نمایش آیتم‌های خصوصی فقط برای کاربران وارد شده */}
              {user ? (
                privateItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="py-6">
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-sage-600" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="py-6 bg-sage-600 text-white hover:bg-sage-700">
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

        {/* هشدار پروفایل ناقص */}
        {user && !isProfileComplete && (
          <div className="mx-4 mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Link href="/profile" className="flex items-center gap-2 text-amber-700 dark:text-amber-500 text-xs font-bold">
              <AlertCircle className="h-4 w-4" />
              تکمیل اطلاعات پروفایل
            </Link>
          </div>
        )}
      </SidebarContent>

      {user && (
        <SidebarFooter className="p-4 border-t border-stone-200/50 dark:border-stone-800/50">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleSignOut} className="py-6 text-red-500 hover:bg-red-50 transition-colors">
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
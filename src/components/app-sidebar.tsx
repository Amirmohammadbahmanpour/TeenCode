"use client"
import { LogOut,BookOpen, LayoutDashboard, Podcast, BarChart3, MessageSquare, Settings, Home } from "lucide-react"
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
import { supabase } from "@/lib/supabase" // ایمپورت سوپابیس
import { useRouter } from "next/navigation"
import { useState , useEffect } from "react"
import { User } from "@supabase/supabase-js"

const menuItems = [
  { title: "خانه", url: "/", icon: Home },
  { title: "داشبورد", url: "/dashboard", icon: LayoutDashboard },
  { title: "۳۰ روز تحول", url: "/courses", icon: BookOpen },
  { title: "ورود", url: "/login", icon: Podcast },
  { title: " مطالب اموزشی", url: "/lesson-page", icon: BarChart3 },
  { title: "نمودار رشد", url: "/grow", icon: MessageSquare },

]

export function AppSidebar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
    }
    checkUser()
  
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
  
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])
  
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.push("/login")
      router.refresh() // برای پاک کردن کش استیت‌های قبلی
    }
  }
  return (
    <Sidebar side="right" collapsible="offcanvas" className="border-none bg-sage-soft dark:bg-[#7a9179]">
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-stone-500 dark:text-sage-soft font-bold text-sm mb-4">
            منوی اصلی
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-sage-100 transition-colors py-6">
                    <Link href={item.url} className="flex items-center gap-3 w-full cursor-pointer">
                      <item.icon className="h-5 w-5 text-sage-600 dark:text-sage-soft" />
                      <span className="text-stone-500 dark:text-sage-soft font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {user && (
        <SidebarFooter className="bg-sidebar p-4 border-t border-stone-200/50 dark:border-stone-800/50">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full py-6 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
              >
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
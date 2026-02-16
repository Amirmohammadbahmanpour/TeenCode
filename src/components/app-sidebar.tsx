import { BookOpen, LayoutDashboard, Podcast, BarChart3, MessageSquare, Settings, Home } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const menuItems = [
  { title: "خانه", url: "/", icon: Home },
  { title: "داشبورد", url: "/pages/dashboard", icon: LayoutDashboard },
  { title: "۳۰ روز تحول", url: "/pages/courses", icon: BookOpen },
  { title: "پادکست‌ها", url: "/pages/login", icon: Podcast },
  { title: " مطالب اموزشی", url: "/pages/lesson/page", icon: BarChart3 },
  { title: "گفتگو با (هوش مصنوعی)", url: "/chat", icon: MessageSquare },
]

export function AppSidebar() {
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
    </Sidebar>
  )
}
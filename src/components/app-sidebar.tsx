import { BookOpen, LayoutDashboard, Podcast, BarChart3, MessageSquare, Settings } from "lucide-react"
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

const menuItems = [
  { title: "داشبورد", url: "/", icon: LayoutDashboard },
  { title: "۳۰ روز تحول", url: "/lessons", icon: BookOpen },
  { title: "پادکست‌ها", url: "/podcasts", icon: Podcast },
  { title: "نمودار پیشرفت", url: "/progress", icon: BarChart3 },
  { title: "گفتگو با (هوش مصنوعی)", url: "/chat", icon: MessageSquare },
]

export function AppSidebar() {
  return (
    <Sidebar side="right" collapsible="icon" className="border-l border-sage-200">
      <SidebarContent className="bg-stone-50">
        <SidebarGroup>
          <SidebarGroupLabel className="text-stone-500 font-bold text-sm mb-4">
            منوی اصلی
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-sage-100 transition-colors py-6">
                    <a href={item.url} className="flex items-center gap-3 w-full">
                      <item.icon className="h-5 w-5 text-sage-600" />
                      <span className="text-stone-800 font-medium">{item.title}</span>
                    </a>
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
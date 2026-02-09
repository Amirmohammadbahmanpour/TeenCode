import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">
        {/* SidebarProvider مدیریت باز و بسته شدن را به عهده دارد */}
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            {/* نمایش سایدبار */}
            <AppSidebar />
            
            {/* بخش اصلی محتوا */}
            <main className="flex-1 bg-white">
              <header className="flex items-center h-16 border-b border-stone-200 px-4 bg-stone-50/50">
                {/* SidebarTrigger همان دکمه همبرگری است که در موبایل سایدبار را باز می‌کند */}
                <SidebarTrigger />
                <div className="mr-4 font-bold text-sage-700">پروژه کتاب تحول</div>
              </header>
              
              <div className="p-6">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
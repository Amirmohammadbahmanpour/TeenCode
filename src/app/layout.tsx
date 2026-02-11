import { Vazirmatn } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

// تنظیم فونت استاندارد فارسی
const vazir = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
});

// layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazir.className} antialiased overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-stone-950">
              
              <AppSidebar />

              <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                
                {/* نوبار ثابت در همه صفحات */}
                <nav className="h-16 bg-cream-soft dark:bg-cream-dark border-b border-stone-200/50 flex items-center justify-between px-6 z-20 shadow-sm shrink-0">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <h1 className="text-lg font-bold text-stone-800 dark:text-stone-200">
                      کتاب <span className="text-sage-600">تحول</span>
                    </h1>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium mr-4 text-stone-600 dark:text-stone-400">
                      <Link href="/" className="hover:text-sage-600 transition-colors">صفحه اصلی</Link>
                      <Link href="/about" className="hover:text-sage-600 transition-colors">درباره ما</Link>
                      <Link href="/contact" className="hover:text-sage-600 transition-colors">ارتباط با ما</Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ModeToggle />
                    <div className="h-9 w-9 rounded-full bg-sage-200 dark:bg-stone-800 flex items-center justify-center text-xs font-bold text-sage-800 dark:text-sage-200 border border-sage-300/30">
                      ر ت
                    </div>
                  </div>
                </nav>

                {/* محتوای متغیر صفحات */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  {children}
                </div>
              </div>

            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
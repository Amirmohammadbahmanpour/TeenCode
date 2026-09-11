import { Vazirmatn } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/contact-us"; 
import { SmartFooter } from "@/components/SmartFooter";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const vazir = Vazirmatn({ subsets: ["arabic"], display: "swap" });

export const metadata = {
  title: "تین کد | مسیر تحول",
  description: "آموزش و رشد برای نسل جدید",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazir.className} antialiased bg-stone-50 dark:bg-stone-950`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
              
              {/* سایدبار در پس‌زمینه لود می‌شود */}
              <AppSidebar />

              <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                {/* نوبار به عنوان یک جزء کلاینتی جداگانه */}
                <Navbar />

                {/* محتوای اصلی که حالا با سرعت موشک لود می‌شود */}
                <main className="flex-1 overflow-y-auto relative">
                  {children}
                  <Toaster position="top-center" reverseOrder={false} />

                  <SmartFooter />
                </main>
              </div>

            </div>
          </SidebarProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
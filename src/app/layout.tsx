import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7a9179" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://noojavaneh.ir"),
  title: {
    default: "نوجوانه | پلتفرم تخصصی رشد، مهارت و تحول فردی نوجوانان",
    template: "%s | نوجوانه",
  },
  description:
    "نوجوانه؛ سامانه جامع آموزش و رشد فردی نوجوانان، پرورش مهارت‌های زندگی، مدیریت تمرکز و عادات و راهنمای مادران در مسیر همراهی با نوجوان.",
  keywords: [
    "نوجوان",
    "نوجوانان",
    "تربیت نوجوان",
    "روانشناسی نوجوان",
    "رشد فردی نوجوان",
    "مهارت های زندگی نوجوانان",
    "آموزش نوجوان",
    "دوره آموزشی نوجوانان",
    "استعدادیابی نوجوانان",
    "بلوغ نوجوانان",
    "مدیریت تمرکز نوجوان",
    "عادت سازی برای نوجوانان",
    "هوش هیجانی نوجوان",
    "فرزندپروری نوجوان",
    "والدین نوجوان",
    "هدف گذاری نوجوانان",
    "انگیزه و عزت نفس نوجوان",
    "مشاوره نوجوان",
    "نوجوان موفق",
  ],
  authors: [{ name: "نوجوانه", url: "https://noojavaneh.ir" }],
  creator: "نوجوانه",
  publisher: "نوجوانه",
  openGraph: {
    title: "نوجوانه | پلتفرم تخصصی رشد و تحول فردی نوجوانان",
    description: "مسیر تحول نوجوانان؛ مهارت‌های تمرکز، عزت نفس، مدیریت زمان، هوش هیجانی و ارتباط با والدین.",
    url: "https://noojavaneh.ir",
    siteName: "نوجوانه",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "/course-banner.png",
        width: 1200,
        height: 630,
        alt: "نوجوانه - مسیر تحول و رشد فردی نوجوانان",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "نوجوانه | پلتفرم تخصصی آموزش و رشد نوجوانان",
    description: "آموزش عادات موثر، مدیریت تمرکز، هوش هیجانی و مهارت‌های زندگی برای نوجوانان.",
    images: ["/course-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://noojavaneh.ir/#organization",
      "name": "نوجوانه",
      "url": "https://noojavaneh.ir",
      "logo": "https://noojavaneh.ir/course-banner.png",
      "description": "پلتفرم تخصصی آموزش و رشد فردی نوجوانان، مهارت‌های زندگی، عادت‌سازی، تمرکز و همراهی مادران.",
      "sameAs": []
    },
    {
      "@type": "WebSite",
      "@id": "https://noojavaneh.ir/#website",
      "url": "https://noojavaneh.ir",
      "name": "نوجوانه",
      "description": "پلتفرم جامع رشد، مهارت و تحول فردی نوجوانان",
      "publisher": {
        "@id": "https://noojavaneh.ir/#organization"
      },
      "inLanguage": "fa-IR"
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${vazir.className} antialiased bg-stone-50 dark:bg-stone-950`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
              
              {/* سایدبار در پس‌زمینه لود می‌شود */}
              <AppSidebar />

              <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                {/* نوبار به عنوان یک جزء کلاینتی جداگانه */}
                <Navbar />

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
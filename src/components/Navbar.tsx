"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  
  // نوبار در همه صفحات هست، اما محتوای آن می‌تواند شرطی باشد
  return (
    <nav className="h-16 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200/50 flex items-center justify-between px-6 z-20 shadow-sm shrink-0 sticky top-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-lg font-bold text-stone-800 dark:text-stone-200">
          تین <span className="text-sage-600">کد</span>
        </h1>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium mr-4 text-stone-600 dark:text-stone-400">
          <Link href="/" className="hover:text-sage-600 transition-colors">خانه</Link>
          <Link href="/blog" className="hover:text-sage-600 transition-colors">وبلاگ</Link>
          <Link href="/#about-us" className="hover:text-sage-600 transition-colors">درباره ما</Link>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <Link href="/dashboard" className="h-9 w-9 rounded-full bg-sage-200 dark:bg-stone-800 flex items-center justify-center text-sage-800 dark:text-sage-200 transition-transform hover:scale-110">
          <UserCircle size={24} />
        </Link>
      </div>
    </nav>
  );
}
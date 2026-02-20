"use client"
import Link from "next/link";
import { UserCheck, LayoutDashboard, Home } from "lucide-react";

export default function AlreadyLoggedIn() {
  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
      <div className="bg-white dark:bg-stone-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-stone-200/50 dark:border-stone-800/50 text-center relative overflow-hidden">
        
        {/* افکت نوری پس‌زمینه */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-sage-500/10 rounded-full blur-2xl -mr-12 -mt-12"></div>

        {/* آیکون اصلی */}
        <div className="relative z-10 w-20 h-20 bg-sage-50 dark:bg-sage-950/50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
          <UserCheck className="text-sage-600 h-10 w-10 -rotate-3" />
        </div>

        {/* متن‌ها */}
        <h2 className="text-2xl font-black text-stone-800 dark:text-stone-100 mb-3">
          شما وارد شده‌اید!
        </h2>
        <p className="text-stone-500 dark:text-stone-400 leading-relaxed mb-8 text-sm md:text-base">
          حساب کاربری شما در حال حاضر فعال است. برای دسترسی به محتوا می‌توانید به داشبورد یا صفحه اصلی بروید.
        </p>

        {/* دکمه‌ها */}
        <div className="space-y-3 relative z-10">
          <Link 
            href="/dashboard" 
            className="flex items-center justify-center gap-2 w-full bg-sage-600 hover:bg-sage-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-sage-200/50 dark:shadow-none hover:-translate-y-1"
          >
            <LayoutDashboard size={18} />
            ورود به پنل کاربری
          </Link>

          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 py-4 rounded-2xl font-bold transition-all hover:bg-stone-200 dark:hover:bg-stone-700"
          >
            <Home size={18} />
            بازگشت به خانه
          </Link>
        </div>

        {/* فوتر کوچک */}
        <p className="mt-8 text-xs text-stone-400 dark:text-stone-600 flex items-center justify-center gap-1">
          نیاز به تغییر حساب دارید؟ از منوی کناری خارج شوید.
        </p>
      </div>
    </div>
  );
}
"use client";

import {
    Instagram,
    Linkedin,
    Mail,
    Phone,
    LogIn,
    UserPlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const pathname = usePathname();

    return (
        <footer
            id="contact-us"
            className="w-full max-w-full overflow-hidden bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-900 px-3 sm:px-5 lg:px-6 py-7 sm:py-10 lg:pt-16 lg:pb-8 transition-colors duration-300"
            dir="rtl"
        >
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-7 sm:gap-x-8 sm:gap-y-10 lg:gap-10 mb-7 sm:mb-10 lg:mb-14">

                    {/* برند */}
                    <div className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-right">
                        <h2 className="text-xl sm:text-2xl font-black text-stone-800 dark:text-white mb-2.5 sm:mb-4">
                            تین <span className="text-sage-600 dark:text-sage-500">کد</span>
                        </h2>

                        <p className="text-[10px] sm:text-sm text-stone-500 dark:text-stone-400 leading-5 sm:leading-7 max-w-sm mb-3.5 sm:mb-5">
                            همراه شما در مسیر تحول و رشد شخصی با متدهای مدرن و طراحی مینیمال.
                        </p>

                        <div className="flex gap-2 sm:gap-3">
                            {[
                                {
                                    icon: <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />,
                                    href: "https://instagram.com",
                                    name: "اینستاگرام",
                                },
                                {
                                    icon: <Linkedin size={16} className="sm:w-[18px] sm:h-[18px]" />,
                                    href: "https://linkedin.com",
                                    name: "لینکدین",
                                },
                                {
                                    icon: <Mail size={16} className="sm:w-[18px] sm:h-[18px]" />,
                                    href: "mailto:hello@teencode.ir",
                                    name: "ایمیل",
                                },
                            ].map((social, index) => (
                                <Link
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    aria-label={social.name}
                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white dark:bg-stone-900 text-stone-400 dark:text-stone-500 hover:text-sage-600 dark:hover:text-sage-400 rounded-xl sm:rounded-2xl transition-colors shadow-sm border border-stone-100 dark:border-stone-800"
                                >
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* دسترسی سریع */}
                    <div className="text-center lg:text-right">
                        <h3 className="text-[12px] sm:text-sm lg:text-base font-bold text-stone-800 dark:text-white mb-3 sm:mb-5">
                            دسترسی سریع
                        </h3>

                        <ul className="space-y-2 sm:space-y-3 text-[10px] sm:text-sm text-stone-500 dark:text-stone-400">
                            <li><Link href="/" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">صفحه اصلی</Link></li>
                            <li><Link href="/#about-us" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">داستان ما</Link></li>
                            <li><Link href="/#FAQ" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">سوالات متداول</Link></li>
                            <li><Link href="/blog" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">وبلاگ</Link></li>
                            <li><Link href="/courses" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">دوره‌ها</Link></li>
                        </ul>
                    </div>

                    {/* ارتباط با ما */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-right">
                        <h3 className="text-[12px] sm:text-sm lg:text-base font-bold text-stone-800 dark:text-white mb-3 sm:mb-5">
                            ارتباط با ما
                        </h3>

                        <ul className="space-y-2.5 sm:space-y-3">
                            <li className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 text-[10px] sm:text-sm text-stone-500 dark:text-stone-400">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center text-sage-600 dark:text-sage-400">
                                    <Phone size={14} className="sm:w-4 sm:h-4" />
                                </div>
                                <span dir="ltr">۰۲۱-۱۲۳۴۵۶۷۸</span>
                            </li>

                            <li className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 text-[10px] sm:text-sm text-stone-500 dark:text-stone-400">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center text-sage-600 dark:text-sage-400">
                                    <Mail size={14} className="sm:w-4 sm:h-4" />
                                </div>
                                <span className="truncate">hello@teencode.ir</span>
                            </li>
                        </ul>
                    </div>

                    
                    {/* حساب کاربری */}
                    <div className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-right">
    <h3 className="text-[12px] sm:text-sm lg:text-base font-bold text-stone-800 dark:text-white mb-3 sm:mb-5">
        حساب کاربری
    </h3>

    <div className="w-full max-w-sm lg:max-w-none flex flex-col gap-1.5 sm:gap-2">
        <Link
            href={pathname === "/login" ? "/" : "/login"}
            className="w-full flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg sm:rounded-xl hover:border-sage-400 dark:hover:border-sage-700 transition-colors group"
        >
            <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-md sm:rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 dark:text-stone-400 group-hover:bg-sage-100 group-hover:text-sage-600 dark:group-hover:bg-sage-900/30 dark:group-hover:text-sage-400 transition-colors">
                <LogIn size={12} className="sm:w-3.5 sm:h-3.5" />
            </div>

            <span className="text-[10px] sm:text-xs font-bold text-stone-700 dark:text-stone-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">
                ورود به حساب
            </span>
        </Link>

        <Link
            href={pathname === "/register" ? "/" : "/register"}
            className="w-full flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 bg-sage-600 hover:bg-sage-700 text-white rounded-lg sm:rounded-xl transition-colors"
        >
            <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-md sm:rounded-lg bg-white/15 flex items-center justify-center">
                <UserPlus size={12} className="sm:w-3.5 sm:h-3.5" />
            </div>

            <span className="text-[10px] sm:text-xs font-bold">
                ثبت‌نام جدید
            </span>
        </Link>
    </div>

    <p className="text-[8px] sm:text-[10px] text-stone-400 dark:text-stone-500 mt-2 leading-4 text-center lg:text-right">
        با عضویت در تین کد، به دوره‌های آموزشی دسترسی پیدا کنید.
    </p>
                    </div>


                </div>

                {/* کپی‌رایت */}
                <div className="border-t border-stone-200 dark:border-stone-900 pt-4 sm:pt-6 flex flex-col md:flex-row justify-between items-center gap-2.5 sm:gap-4 text-stone-400 dark:text-stone-500 text-[9px] sm:text-xs font-medium">
                    <p suppressHydrationWarning>
                        © {currentYear} تین کد. تمامی حقوق محفوظ است.
                    </p>

                    <div className="flex gap-4 sm:gap-6">
                        <Link href="/terms" className="hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
                            قوانین و مقررات
                        </Link>
                        <Link href="/privacy" className="hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
                            حریم خصوصی
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

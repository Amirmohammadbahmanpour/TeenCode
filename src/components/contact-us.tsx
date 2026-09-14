"use client";

import Link from "next/link";
import {
    Instagram,
    PhoneCall,
    Mail,
    MessageCircle,
} from "lucide-react";

export default function Footer() {
    return (
        <footer
            className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950"
            dir="rtl"
        >
            <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">

                    {/* برند */}
                    <div className="text-center sm:text-right">
                        <h3 className="text-lg font-black text-stone-800 sm:text-xl dark:text-stone-100">
                            نوجوانه
                        </h3>

                        <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-stone-500 sm:mx-0 sm:mt-3 sm:text-sm sm:leading-7 dark:text-stone-400">
                            مسیر رشد و یادگیری برای ساختن آینده‌ای بهتر.
                        </p>

                        <div className="mt-3 flex items-center justify-center gap-2 sm:mt-5 sm:justify-start">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="اینستاگرام"
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-sage-100 hover:text-sage-600 sm:h-10 sm:w-10 dark:bg-stone-900 dark:hover:bg-stone-800"
                            >
                                <Instagram size={17} />
                            </a>

                            <a
                                href="tel:09025825382"
                                aria-label="تماس با ما"
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-sage-100 hover:text-sage-600 sm:h-10 sm:w-10 dark:bg-stone-900 dark:hover:bg-stone-800"
                            >
                                <PhoneCall size={17} />
                            </a>

                            <a
                                href="mailto:amirmohammadbahmann@gmail.com"
                                aria-label="ایمیل"
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-sage-100 hover:text-sage-600 sm:h-10 sm:w-10 dark:bg-stone-900 dark:hover:bg-stone-800"
                            >
                                <Mail size={17} />
                            </a>
                        </div>
                    </div>

                    {/* دسترسی سریع */}
                    <div className="text-center sm:text-right">
                        <h4 className="mb-2.5 text-xs font-bold text-stone-800 sm:mb-4 sm:text-sm dark:text-stone-100">
                            دسترسی سریع
                        </h4>

                        <div className="space-y-2 text-xs text-stone-500 sm:space-y-3 sm:text-sm dark:text-stone-400">
                            <Link
                                href="/"
                                className="block cursor-pointer transition hover:text-sage-600"
                            >
                                صفحه اصلی
                            </Link>

                            <Link
                                href="/courses"
                                className="block cursor-pointer transition hover:text-sage-600"
                            >
                                دوره‌ها
                            </Link>

                            <Link
                                href="/blog"
                                className="block cursor-pointer transition hover:text-sage-600"
                            >
                                وبلاگ
                            </Link>

                            <Link
                                href="/support"
                                className="block cursor-pointer transition hover:text-sage-600"
                            >
                                پشتیبانی
                            </Link>
                        </div>
                    </div>

                    {/* ارتباط با ما */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        <h4 className="mb-2.5 text-center text-xs font-bold text-stone-800 sm:mb-4 sm:text-right sm:text-sm dark:text-stone-100">
                            ارتباط با ما
                        </h4>

                        <div className="mb-3 flex items-start justify-center gap-2 sm:mb-5 sm:justify-start">
                            <MessageCircle
                                size={16}
                                className="mt-0.5 shrink-0 text-sage-600 sm:h-[18px] sm:w-[18px]"
                            />

                            <p className="max-w-2xl text-center text-xs leading-6 text-stone-500 sm:text-right sm:text-sm sm:leading-7 dark:text-stone-400">
                                برای دریافت مشاوره و ویزیت تخصصی و همچنین
                                دسترسی به محتوای ویدیویی و خدمات مام‌اپ،
                                می‌توانید از لینک‌های زیر استفاده کنید.
                            </p>
                        </div>

                        {/* سرویس‌ها */}
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-3">

                            {/* آپارات */}
                            <a
                                href="https://share.google/TeFcUp8Wa1Dr9LKf1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex min-h-[52px] cursor-pointer items-center justify-center gap-1 rounded-lg border border-stone-100 bg-stone-50 px-1.5 py-2 transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 sm:min-h-[64px] sm:gap-3 sm:rounded-xl sm:px-4 sm:py-3 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800"
                            >
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-[10px] font-black text-orange-600 sm:h-10 sm:w-10 sm:rounded-xl sm:text-sm dark:bg-orange-950/40 dark:text-orange-400">
                                    A
                                </div>

                                <span className="text-[11px] font-bold text-stone-700 sm:text-sm dark:text-stone-200">
                                    آپارات
                                </span>
                            </a>

                            {/* مام‌اپ */}
                            <a
                                href="https://share.google/ZwXW5hVFvuKvDRlxZ"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex min-h-[52px] cursor-pointer items-center justify-center gap-1 rounded-lg border border-stone-100 bg-stone-50 px-1.5 py-2 transition-all hover:-translate-y-0.5 hover:border-pink-200 hover:bg-pink-50 sm:min-h-[64px] sm:gap-3 sm:rounded-xl sm:px-4 sm:py-3 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800"
                            >
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-[10px] font-black text-pink-600 sm:h-10 sm:w-10 sm:rounded-xl sm:text-sm dark:bg-pink-950/40 dark:text-pink-400">
                                    M
                                </div>

                                <span className="text-[11px] font-bold text-stone-700 sm:text-sm dark:text-stone-200">
                                    مام‌اپ
                                </span>
                            </a>

                            {/* بازار */}
                            <a
                                href="http://cafebazaar.ir/app/?id=ir.mumapp.patient&ref=share"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex min-h-[52px] cursor-pointer items-center justify-center gap-1 rounded-lg border border-stone-100 bg-stone-50 px-1.5 py-2 transition-all hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 sm:min-h-[64px] sm:gap-3 sm:rounded-xl sm:px-4 sm:py-3 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800"
                            >
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-100 text-[10px] font-black text-green-600 sm:h-10 sm:w-10 sm:rounded-xl sm:text-sm dark:bg-green-950/40 dark:text-green-400">
                                    B
                                </div>

                                <span className="text-[11px] font-bold text-stone-700 sm:text-sm dark:text-stone-200">
                                    بازار
                                </span>
                            </a>

                        </div>
                    </div>
                </div>

                {/* پایین Footer */}
                <div className="mt-6 flex flex-col gap-2 border-t border-stone-100 pt-4 text-center text-[10px] text-stone-400 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:pt-6 sm:text-xs sm:text-right dark:border-stone-800">
                    <p>
                        © {new Date().getFullYear()} نوجوانه. تمامی حقوق محفوظ است.
                    </p>

                    <p>
                        ساخته شده با ❤️ برای نسل آینده
                    </p>
                </div>
            </div>
        </footer>
    );
}

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
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

                    {/* برند */}
                    <div>
                        <h3 className="text-xl font-black text-stone-800 dark:text-stone-100">
                            نوجوانه
                        </h3>

                        <p className="mt-3 max-w-xs text-sm leading-7 text-stone-500 dark:text-stone-400">
                            مسیر رشد و یادگیری برای ساختن آینده‌ای بهتر.
                        </p>

                        <div className="mt-5 flex items-center gap-2">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-sage-100 hover:text-sage-600 dark:bg-stone-900 dark:hover:bg-stone-800"
                            >
                                <Instagram size={18} />
                            </a>

                            <a
                                href="tel:09025825382" 
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-sage-100 hover:text-sage-600 dark:bg-stone-900 dark:hover:bg-stone-800"
                                aria-label="تماس با ما"
                            >
                                <PhoneCall size={18} />
                            </a>

                            <a
                                href="mailto:amirmohammadbahmann@gmail.com.ir"
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-sage-100 hover:text-sage-600 dark:bg-stone-900 dark:hover:bg-stone-800"
                            >
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* دسترسی سریع */}
                    <div>
                        <h4 className="mb-4 text-sm font-bold text-stone-800 dark:text-stone-100">
                            دسترسی سریع
                        </h4>

                        <div className="space-y-3 text-sm text-stone-500 dark:text-stone-400">
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
                        <h4 className="mb-4 text-sm font-bold text-stone-800 dark:text-stone-100">
                            ارتباط با ما
                        </h4>

                        <div className="mb-5 flex items-start gap-2.5">
                            <MessageCircle
                                size={18}
                                className="mt-0.5 shrink-0 text-sage-600"
                            />

                            <p className="text-sm leading-7 text-stone-500 dark:text-stone-400">
                                برای دریافت مشاوره و ویزیت تخصصی و همچنین
                                دسترسی به محتوای ویدیویی و خدمات مام‌اپ،
                                می‌توانید از لینک‌های زیر استفاده کنید.
                            </p>
                        </div>

                        {/* سرویس‌ها */}
                        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">

                            {/* آپارات */}
                            <a
                                href="https://share.google/TeFcUp8Wa1Dr9LKf1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex min-h-[64px] cursor-pointer items-center justify-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-sm font-black text-orange-600 transition-transform group-hover:scale-105 dark:bg-orange-950/40 dark:text-orange-400">
                                    A
                                </div>

                                <span className="text-sm font-bold text-stone-700 dark:text-stone-200">
                                    آپارات
                                </span>
                            </a>

                            {/* مام‌اپ */}
                            <a
                                href="https://share.google/ZwXW5hVFvuKvDRlxZ"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex min-h-[64px] cursor-pointer items-center justify-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-pink-200 hover:bg-pink-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-sm font-black text-pink-600 transition-transform group-hover:scale-105 dark:bg-pink-950/40 dark:text-pink-400">
                                    M
                                </div>

                                <span className="text-sm font-bold text-stone-700 dark:text-stone-200">
                                    مام‌اپ
                                </span>
                            </a>

                            {/* بازار */}
                            <a
                                href="http://cafebazaar.ir/app/?id=ir.mumapp.patient&ref=share"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex min-h-[64px] cursor-pointer items-center justify-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-sm font-black text-green-600 transition-transform group-hover:scale-105 dark:bg-green-950/40 dark:text-green-400">
                                    B
                                </div>

                                <span className="text-sm font-bold text-stone-700 dark:text-stone-200">
                                    بازار
                                </span>
                            </a>

                        </div>
                    </div>
                </div>

                {/* پایین Footer */}
                <div className="mt-8 flex flex-col gap-3 border-t border-stone-100 pt-6 text-center text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between sm:text-right dark:border-stone-800">
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

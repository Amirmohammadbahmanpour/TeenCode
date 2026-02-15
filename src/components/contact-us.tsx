"use client"
import { Instagram, Linkedin, ArrowLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="contact-us" className="bg-stone-50 dark:bg-stone-950 md:pt-20 md:pb-10 py-10 px-6 border-t border-stone-200 dark:border-stone-900">
            <div className="max-w-7xl mx-auto">
                {/* تغییر در گرید برای وسط‌چین شدن محتوا در موبایل */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-center lg:text-right">

                    {/* ستون ۱: برند و آیکون‌های اجتماعی */}
                    <div className="flex flex-col items-center lg:items-start">
                        <h2 className="text-2xl font-black text-stone-800 dark:text-white mb-6">
                            تین <span className="text-sage-600">کد</span>
                        </h2>
                        <p className="text-stone-500 dark:text-stone-400 leading-relaxed mb-6 max-w-sm">
                            همراه شما در مسیر تحول و رشد شخصی با متدهای مدرن و طراحی مینیمال.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: <Instagram size={20} />, href: "#" },
                                { icon: <Linkedin size={20} />, href: "#" },
                                { icon: <Mail size={20} />, href: "#" },
                            ].map((social, index) => (
                                <Link
                                    key={index}
                                    href={social.href}
                                    className="p-3 bg-white dark:bg-stone-900 text-stone-400 dark:text-stone-500 hover:text-sage-600 dark:hover:text-sage-400 rounded-2xl transition-all shadow-sm border border-stone-100 dark:border-stone-800"
                                >
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* ستون ۲: دسترسی سریع */}
                    <div>
                        <h3 className="font-bold text-stone-800 dark:text-white mb-6">دسترسی سریع</h3>
                        <ul className="space-y-4 text-stone-500 dark:text-stone-400">
                            <li><Link href="/" className="hover:text-sage-600 transition-colors">صفحه اصلی</Link></li>
                            <li><a href="#about-us" className="hover:text-sage-600 transition-colors">داستان ما</a></li>
                            <li><a href="#FAQ" className="hover:text-sage-600 transition-colors">سوالات متداول</a></li>
                            <li><a href="/blog" className="hover:text-sage-600 transition-colors">وبلاگ</a></li>
                        </ul>
                    </div>

                    {/* ستون ۳: اطلاعات تماس */}
                    <div className="flex flex-col items-center lg:items-start">
                        <h3 className="font-bold text-stone-800 dark:text-white mb-6">ارتباط با ما</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center justify-center lg:justify-start gap-3 text-stone-500 dark:text-stone-400">
                                <div className="w-8 h-8 rounded-lg bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center text-sage-600">
                                    <Phone size={16} />
                                </div>
                                <span dir="ltr">۰۲۱-۱۲۳۴۵۶۷۸</span>
                            </li>
                            <li className="flex items-center justify-center lg:justify-start gap-3 text-stone-500 dark:text-stone-400">
                                <div className="w-8 h-8 rounded-lg bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center text-sage-600">
                                    <Mail size={16} />
                                </div>
                                <span>hello@yoursite.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* ستون ۴: خبرنامه */}
                    <div className="flex flex-col items-center lg:items-start">
                        <h3 className="font-bold text-stone-800 dark:text-white mb-6">عضویت در خبرنامه</h3>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mb-4 max-w-xs">از آخرین تخفیف‌ها و آموزش‌ها باخبر شوید.</p>
                        <div className="relative w-full max-w-sm">
                            <input
                                type="email"
                                placeholder="ایمیل شما"
                                className="pr-1 w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-3 px-4 lg:pr-12 focus:outline-none focus:border-sage-500 transition-colors dark:text-white text-right"
                            />
                            <button className="absolute left-2 top-1.5 bg-sage-600 hover:bg-sage-700 text-white p-2 rounded-xl transition-colors">
                                <ArrowLeft size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* بخش کپی‌رایت */}
                <div className="border-t border-stone-200 dark:border-stone-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-stone-400 text-sm font-medium">
                    <p suppressHydrationWarning>© {currentYear} تین کد. تمامی حقوق محفوظ است.</p>
                    <div className="flex gap-8">
                        <Link href="/terms" className="hover:text-stone-600 transition-colors">قوانین و مقررات</Link>
                        <Link href="/privacy" className="hover:text-stone-600 transition-colors">حریم خصوصی</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
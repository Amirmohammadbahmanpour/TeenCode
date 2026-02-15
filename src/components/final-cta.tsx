"use client"
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
    return (
        <section className="py-10 md:py-20 bg-white dark:bg-stone-950 px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
                <div className="relative bg-sage-600 dark:bg-stone-900 rounded-[2rem] md:rounded-[3rem] p-6 sm:p-10 md:p-16 overflow-hidden shadow-2xl transition-colors duration-500">
                    
                    {/* Glow Effects */}
                    <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-sage-500 rounded-full blur-[80px] md:blur-[100px] opacity-40 dark:opacity-20 -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-sage-400 rounded-full blur-[60px] md:blur-[80px] opacity-30 dark:opacity-10 -ml-5 -mb-5"></div>

                    <div className="relative z-10 flex flex-col items-center text-center space-y-6 md:space-y-10">
                        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white dark:text-stone-100 leading-tight">
                            آماده‌ای تا فصل جدید <br className="hidden sm:block" />
                            <span className="text-sage-100 dark:text-sage-500"> داستانت رو شروع کنی؟</span>
                        </h2>

                        <p className="text-sage-50/90 dark:text-stone-400 max-w-sm sm:max-w-md md:max-w-xl text-base sm:text-lg lg:text-xl leading-relaxed">
                            ما اینجا هستیم تا در هر قدم از این مسیر کنار تو باشیم. همین حالا اولین گام رو بردار.
                        </p>

                        {/* راه حل نهایی: استفاده از Grid برای مدیریت فضای متغیر سایدبار */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 pt-2 w-full max-w-[300px] sm:max-w-md md:max-w-none mx-auto">
                            <Link 
                                href="/login"
                                className="bg-white dark:bg-sage-600 text-sage-700 dark:text-white hover:bg-sage-50 dark:hover:bg-sage-500 px-4 sm:px-6 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group whitespace-nowrap"
                            >
                                <span>شروع سفر</span>
                                <span suppressHydrationWarning className="hidden lg:block">
                                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                </span>
                            </Link>

                            <Link 
                                href="/consulting"
                                className="bg-transparent border-2 border-white/30 dark:border-stone-700 text-white dark:text-stone-300 hover:bg-white/10 dark:hover:bg-stone-800 px-4 sm:px-6 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg transition-all duration-300 text-center flex items-center justify-center whitespace-nowrap"
                            >
                                مشاوره رایگان
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-6 md:mt-8 text-stone-400 text-xs md:text-sm opacity-80">
                    بیش از ۵۰۰ نفر قبلاً این مسیر را شروع کرده‌اند. تو هم به ما ملحق شو.
                </p>
            </div>
        </section>
    );
}
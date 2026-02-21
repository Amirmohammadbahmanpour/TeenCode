import { ArrowLeft, UserCircle } from "lucide-react";
import Link from "next/link";

interface FinalCTAProps {
    profile: {
        full_name: string | null;
    } | null;
    isLoggedIn: boolean;
}

export default function FinalCTA({ profile, isLoggedIn }: FinalCTAProps) {
    // ۱. اگر کاربر لاگین نکرده باشد، طبق گفته شما کلا چیزی نشان نمی‌دهیم
    if (!isLoggedIn) return null;

    // ۲. اگر کاربر لاگین کرده ولی نام او در دیتابیس خالی است (پروفایل ناقص)
    const isProfileIncomplete = !profile?.full_name;

    // ۳. اگر پروفایل کامل بود، باز هم چیزی نشان نمی‌دهیم
    if (!isProfileIncomplete) return null;

    return (
        <section className="py-10 md:py-20 bg-white dark:bg-stone-950 px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
                <div className="relative bg-sage-600 dark:bg-stone-900 rounded-[2rem] md:rounded-[3rem] p-6 sm:p-10 md:p-16 overflow-hidden shadow-2xl">

                    {/* Glow Effects */}
                    <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-sage-500 rounded-full blur-[80px] opacity-40 -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-sage-400 rounded-full blur-[60px] opacity-30 -ml-5 -mb-5"></div>

                    <div className="relative z-10 flex flex-col items-center text-center space-y-6 md:space-y-10">
                        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white leading-tight">
                            یک قدم تا تکمیل <br className="hidden sm:block" />
                            <span className="text-sage-100 dark:text-sage-500"> حساب کاربری شما </span>
                        </h2>

                        <p className="text-sage-50/90 dark:text-stone-400 max-w-sm sm:max-w-md md:max-w-xl text-base sm:text-lg lg:text-xl leading-relaxed">
                            برای دسترسی کامل به امکانات دوره و شخصی‌سازی مسیر یادگیری، لطفاً اطلاعات پروفایل خود را تکمیل کنید.
                        </p>

                        <div className="pt-2 w-full max-w-[280px] sm:max-w-xs mx-auto">
                            <Link
                                href="/profile/edit"
                                className="bg-white dark:bg-sage-600 text-sage-700 dark:text-white hover:bg-sage-50 dark:hover:bg-sage-500 px-6 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-3 group"
                            >
                                <span>تکمیل اطلاعات</span>
                                <UserCircle size={22} className="group-hover:scale-110 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
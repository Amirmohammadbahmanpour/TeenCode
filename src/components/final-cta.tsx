import { ArrowLeft, UserCircle, Rocket } from "lucide-react";
import Link from "next/link";

interface FinalCTAProps {
    profile: {
        full_name: string | null;
    } | null;
    isLoggedIn: boolean;
}

export default function FinalCTA({ profile, isLoggedIn }: FinalCTAProps) {

    // ۳. اگر کاربر لاگین کرده و نام او کامل است، کل بخش مخفی می‌شود
    if (isLoggedIn && profile?.full_name) {
        return null;
    }

    // تعیین محتوا بر اساس وضعیت کاربر
    const content = !isLoggedIn
        ? {
            title: "آماده‌ای برای شروع؟",
            highlight: "به خانواده تین کد بپیوند",
            desc: "همین حالا ثبت‌نام کن و اولین قدم رو برای تحول شخصی و یادگیری مهارت‌های نوین بردار.",
            btnText: "شروع یادگیری",
            btnLink: "/login",
            icon: <Rocket size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        }
        : {
            title: "یک قدم تا تکمیل",
            highlight: "حساب کاربری شما",
            desc: "برای دسترسی کامل به امکانات دوره و شخصی‌سازی مسیر یادگیری، لطفاً اطلاعات پروفایل خود را تکمیل کنید.",
            btnText: "تکمیل اطلاعات",
            btnLink: "/profile/edit",
            icon: <UserCircle size={22} className="group-hover:scale-110 transition-transform" />
        };

    return (
        <section className="py-10 md:py-20 bg-white dark:bg-stone-950 px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
                <div className="relative bg-sage-600 dark:bg-stone-900 rounded-[2rem] md:rounded-[3rem] p-6 sm:p-10 md:p-16 overflow-hidden shadow-2xl">

                    {/* Glow Effects */}
                    <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-sage-500 rounded-full blur-[80px] opacity-40 -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-sage-400 rounded-full blur-[60px] opacity-30 -ml-5 -mb-5"></div>

                    <div className="relative z-10 flex flex-col items-center text-center space-y-6 md:space-y-10">
                        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white leading-tight">
                            {content.title} <br className="hidden sm:block" />
                            <span className="text-sage-100 dark:text-sage-500"> {content.highlight} </span>
                        </h2>

                        <p className="text-sage-50/90 dark:text-stone-400 max-w-sm sm:max-w-md md:max-w-xl text-base sm:text-lg lg:text-xl leading-relaxed">
                            {content.desc}
                        </p>

                        <div className="pt-2 w-full max-w-[280px] sm:max-w-xs mx-auto">
                            <Link
                                href={content.btnLink}
                                className="bg-white dark:bg-sage-600 text-sage-700 dark:text-white hover:bg-sage-50 dark:hover:bg-sage-500 px-6 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-3 group"
                            >
                                <span>{content.btnText}</span>
                                {content.icon}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
"use client";

import { useState } from "react";
import { Plus, X, LucideIcon, Target, BookOpen, Rocket, Star, Trophy } from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserProfile {
    full_name: string | null;
}

interface UserProgress {
    id: string;
    is_completed: boolean;
    lesson_id: string;
}

interface InitialDataProps {
    user: User | null;
    profile: UserProfile | null;
    progress: UserProgress[] | null;
}

interface StepCardProps {
    title: string;
    desc: string;
    icon: LucideIcon;
    isExpanded: boolean;
    onToggle: () => void;
}

const StepCard = ({ title, desc, icon: IconComponent, isExpanded, onToggle }: StepCardProps) => {
    return (
        <div className={`w-[72vw] sm:w-auto shrink-0 sm:shrink snap-start bg-white dark:bg-stone-900 px-3.5 py-3.5 sm:p-6 lg:p-8 rounded-xl sm:rounded-3xl lg:rounded-[2.5rem] shadow-sm sm:shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-stone-100 dark:border-stone-800 flex flex-col items-center text-center group transition-[background-color,border-color,box-shadow,transform] duration-300 relative h-full ${isExpanded ? "z-20 sm:scale-[1.01] border-sage-200 dark:border-sage-900 shadow-md" : "z-10"}`}>
            <div className="w-11 h-11 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mb-2.5 sm:mb-5 lg:mb-6 flex items-center justify-center relative shrink-0">
                <div className={`absolute inset-0 bg-sage-100 dark:bg-sage-900/30 rounded-xl sm:rounded-2xl lg:rounded-3xl rotate-6 group-hover:rotate-0 transition-all duration-300 ${isExpanded ? "bg-sage-600 dark:bg-sage-600 rotate-0 shadow-md shadow-sage-200/50 dark:shadow-sage-950/50" : ""}`}></div>
                <IconComponent size={20} className={`sm:w-7 sm:h-7 lg:w-8 lg:h-8 relative z-10 transition-colors duration-300 ${isExpanded ? "text-white" : "text-sage-600 dark:text-sage-400"}`} strokeWidth={1.8} />
            </div>

            <h3 className="text-[14px] sm:text-lg lg:text-xl font-bold mb-1.5 sm:mb-3 lg:mb-4 text-stone-800 dark:text-white leading-6 sm:leading-7">
                {title}
            </h3>

            <div className={`relative w-full transition-all duration-300 ease-out overflow-hidden ${isExpanded ? "max-h-[400px] opacity-100" : "max-h-[55px] sm:max-h-[70px] opacity-100"}`}>
                <p className="text-[10.5px] sm:text-sm lg:text-base text-stone-500 dark:text-stone-400 leading-5 sm:leading-6 lg:leading-relaxed font-medium">
                    {desc}
                </p>

                {!isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 bg-gradient-to-t from-white dark:from-stone-900 to-transparent pointer-events-none" />
                )}
            </div>

            <button type="button" onClick={onToggle} aria-expanded={isExpanded} className={`mt-2.5 sm:mt-4 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors duration-300 z-10 ${isExpanded ? "bg-sage-600 text-white shadow-md" : "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:bg-sage-600 hover:text-white"}`}>
                {isExpanded ? <X size={14} /> : <Plus size={14} />}
            </button>
        </div>
    );
};

export default function HowItWorks({ initialData }: { initialData: InitialDataProps }) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const isLoggedIn = !!initialData.user;

    const getUserFullName = (): string => {
        if (initialData.user?.name) return initialData.user.name;
        if (initialData.profile?.full_name) return initialData.profile.full_name;
        return "";
    };

    const fullName = getUserFullName();
    const displayName = fullName || "کاربر عزیز";
    const firstName = fullName ? fullName.split(" ")[0] : "کاربر عزیز";

    const completedLessons = initialData.progress?.filter((p) => p.is_completed).length || 0;
    const totalLessons = initialData.progress?.length || 0;
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const guestSteps = [
        {
            title: "ارزیابی اولیه",
            desc: "با آزمون‌های ورودی، پتانسیل‌های پنهان تو رو شناسایی می‌کنیم تا نقشه راهت دقیق طراحی بشه.",
            icon: Target,
        },
        {
            title: "یادگیری فعال",
            desc: "دسترسی به محتوای ویدیویی و متنی اختصاصی متناسب با سن تو که به جای حفظ کردن، روی تغییر تمرکز داره.",
            icon: BookOpen,
        },
        {
            title: "تحول و نتیجه",
            desc: "شاهد تغییرات ملموس در اعتمادبه‌نفس و مهارت‌هات باش و گواهی معتبر تین‌کد رو دریافت کن.",
            icon: Rocket,
        },
    ];

    const memberSteps = [
        {
            title: `سلام ${firstName} ✨`,
            desc: `${displayName} عزیز، پروفایل تو بر اساس آخرین فعالیتت به‌روز شده. خوشحالیم که دوباره در مسیر رشد همراه مایی.`,
            icon: Star,
        },
        {
            title: "ادامه یادگیری",
            desc: `برنامه‌های آموزشی جدید بر اساس سطح فعلی تو آماده شده‌اند. ${firstName} جان، کافیست روی دکمه شروع کلیک کنی.`,
            icon: BookOpen,
        },
        {
            title: "پیشرفت شما",
            desc: `تبریک ${firstName}! شما تا این لحظه ${progressPercent}٪ از کل مسیر آموزشی تین‌کد را با موفقیت پشت سر گذاشته‌اید.`,
            icon: Trophy,
        },
    ];

    const currentData = isLoggedIn ? memberSteps : guestSteps;

    return (
        <section className="w-full bg-cream-soft dark:bg-stone-950 px-0 sm:px-5 lg:px-6 py-7 sm:py-12 lg:py-20 transition-colors duration-300">
            <div className="w-full max-w-7xl mx-auto">
                <div className="text-center px-3 mb-5 sm:mb-10 lg:mb-16">
                    <h2 className="text-[21px] sm:text-3xl md:text-4xl lg:text-5xl font-black text-stone-800 dark:text-white leading-[1.5] sm:leading-tight">
                        {isLoggedIn ? "میزبانِ " : "مسیر "}
                        <span className="text-sage-600 dark:text-sage-500">{isLoggedIn ? "پیشرفت " : "آموزش "}</span>
                        {isLoggedIn ? "شما" : "تو چطور رقم می‌خورد؟"}
                    </h2>

                    <p className="mt-1.5 sm:mt-3 text-[10px] sm:text-sm lg:text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-5 sm:leading-7 font-medium">
                        {isLoggedIn ? `${firstName} جان، گزارش لحظه‌ای از سفرِ آموزش تو` : "سه گام ساده برای رسیدن به بهترین نسخه از خودت"}
                    </p>
                </div>

                <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-5 lg:gap-8 items-stretch overflow-x-auto sm:overflow-visible snap-x snap-mandatory scrollbar-hide px-3 sm:px-0">
                    {currentData.map((item, index) => (
                        <StepCard
                            key={index}
                            title={item.title}
                            desc={item.desc}
                            icon={item.icon}
                            isExpanded={expandedIndex === index}
                            onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}


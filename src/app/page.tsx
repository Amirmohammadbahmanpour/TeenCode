import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { Suspense } from "react";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import AboutUs from "@/components/about-us";
import FinalCTA from "@/components/final-cta";

// ========== متادیتا برای سئو ==========
export const metadata = {
    title: " نوجوانه | آموزش تربیت نوجوان و تحول فردی برای مادران",
    description: "دوره جامع تربیت نوجوان و تحول شخصی برای مادران آگاه. با متدهای نوین آموزشی، مسیر رشد خود و فرزندتان را هموار کنید.",
    keywords: "تربیت نوجوان, آموزش مادران, فرزندپروری, تحول فردی, مشاوره خانواده",
    authors: [{ name: "نوجوانه" }],
    openGraph: {
        title: " نوجوانه | مسیر تحول فردی مادران",
        description: "به جمع مادران آگاه بپیوندید و مسیر رشد خود و فرزندتان را آغاز کنید",
        url: "https://nojavaaneh.ir",
        siteName: " نوجوانه",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "تین کد - آموزش تربیت نوجوان",
            },
        ],
        locale: "fa_IR",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: "https://nojavaaneh.ir",
    },
};

// ========== تایپ‌ها ==========
interface UserProfile {
    full_name: string | null;
}

interface UserProgress {
    id: string;
    is_completed: boolean;
    lesson_id: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface InitialDataProps {
    user: User | null;
    profile: UserProfile | null;
    progress: UserProgress[] | null;
}

// ========== تابع دریافت داده‌های کاربر ==========
async function getUserData(token: string | undefined): Promise<InitialDataProps> {
    if (!token) {
        return { user: null, profile: null, progress: null };
    }
    
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
        
        // دریافت اطلاعات کاربر
        const userRes = await fetch(`${API_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        
        if (!userRes.ok) {
            return { user: null, profile: null, progress: null };
        }
        
        const userData = await userRes.json();
        
        // ساخت آبجکت کاربر (با ساختار درست)
        const user: User = {
            id: userData.user?.id || userData.id,
            name: userData.user?.name || userData.name,
            email: userData.user?.email || userData.email,
        };
        
        // دریافت پروفایل و پیشرفت همزمان
        const [profileRes, progressRes] = await Promise.all([
            fetch(`${API_URL}/profiles/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            }),
            fetch(`${API_URL}/user-progress?user_id=${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            }),
        ]);
        
        let profile: UserProfile | null = null;
        if (profileRes.ok) {
            const profileData = await profileRes.json();
            profile = { full_name: profileData.full_name || null };
        }
            
        const progress: UserProgress[] = progressRes.ok 
            ? await progressRes.json() 
            : [];
        
        return { user, profile, progress };
        
    } catch (error) {
        console.error("Error fetching user data:", error);
        return { user: null, profile: null, progress: null };
    }
}

// ========== کامپوننت اصلی ==========
export default async function Home() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const { user, profile, progress } = await getUserData(token);
    const isLoggedIn = !!user;
    const userData: InitialDataProps = { user, profile, progress };

    // نام کاربری برای نمایش (اولویت با user.name)
    const getDisplayName = (): string => {
        // اولویت ۱: نام از کاربر (چون توی داشبورد درسته)
        if (user?.name) {
            return user.name.split(" ")[0];
        }
        // اولویت ۲: نام از پروفایل
        if (profile?.full_name) {
            return profile.full_name.split(" ")[0];
        }
        return "جوانه‌ای عزیز";
    };

    const heroText = isLoggedIn 
        ? `خوش آمدی ${getDisplayName()}! بیا مسیر یادگیری‌ات را ادامه دهیم.`
        : "مسیر تحول شخصی و رشد آگاهی با متدهای نوین آموزشی برای نسل جدید.";

    return (
        <>
            {/* Hero Section */}
            <section className="bg-cream-soft dark:bg-stone-950 pt-6 pb-12 lg:pt-10 lg:pb-24 border-b border-stone-200/20 px-6 md:px-12 lg:px-16 scroll-smooth">
                <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-y-10 lg:gap-x-16 xl:gap-x-24">
                    
                    {/* متن Hero */}
                    <div className="text-center lg:text-right space-y-6 flex-1 min-w-0">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-stone-800 dark:text-white leading-[1.2]">
                            نوجوانه، شناسایی<br />
                            <span className="text-sage-600">بیشتر جوانان و نوجوانان</span>
                        </h1>

                        <p className="text-stone-500 dark:text-stone-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto lg:mr-0 leading-relaxed">
                            {heroText}
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                            <Link
                                href={isLoggedIn ? "/dashboard" : "/register"}
                                className="bg-sage-600 hover:bg-sage-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg shadow-sage-200/50 hover:-translate-y-1"
                            >
                                {isLoggedIn ? "ورود به داشبورد" : "شروع کنید"}
                            </Link>

                            <Link
                                href={isLoggedIn ? "/courses" : "/login"}
                                className="border-2 border-stone-300 dark:border-stone-700 px-10 py-4 rounded-full font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900 transition-all text-center"
                            >
                                {isLoggedIn ? "مشاهده دوره‌ها" : "ورود"}
                            </Link>
                        </div>
                    </div>

                    {/* تصویر Hero */}
                    <div className="w-full lg:flex-1 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[280px] md:max-w-[400px] lg:max-w-[480px] xl:max-w-[550px]">
                            <div className="absolute -inset-10 bg-sage-200/40 blur-[80px] rounded-full opacity-60" />
                            <Image
                                src="/banner-img.webp"
                                alt="تین کد - آموزش تربیت نوجوان"
                                width={600}
                                height={600}
                                className="relative w-full h-auto rounded-[2.5rem] drop-shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* بخش‌های پایینی */}
            <main className="p-6 md:p-12">
                <div className="max-w-6xl mx-auto text-center py-20">
                    <Suspense fallback={<div className="h-40 flex items-center justify-center">در حال بارگذاری...</div>}>
                        <HowItWorks initialData={userData} />
                    </Suspense>
                    <Suspense fallback={<div className="h-40 flex items-center justify-center">در حال بارگذاری...</div>}>
                        <AboutUs profile={profile} />
                    </Suspense>
                    <Suspense fallback={<div className="h-40 flex items-center justify-center">در حال بارگذاری...</div>}>
                        <FAQ isLoggedIn={isLoggedIn} />
                    </Suspense>
                    <Suspense fallback={<div className="h-40 flex items-center justify-center">در حال بارگذاری...</div>}>
                        <FinalCTA isLoggedIn={isLoggedIn} profile={profile} />
                    </Suspense>
                </div>
            </main>
        </>
    );
}
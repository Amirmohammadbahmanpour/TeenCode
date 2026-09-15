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
    title: "نوجوانه؛ همراه با مادران در فصل جوانه‌زدن نوجوانان",
    description:
        "دوره جامع تربیت نوجوان و تحول شخصی برای مادران آگاه. با متدهای نوین آموزشی، مسیر رشد خود و فرزندتان را هموار کنید.",
    keywords:
        "تربیت نوجوان, آموزش مادران, فرزندپروری, تحول فردی, مشاوره خانواده",
    authors: [{ name: "نوجوانه" }],
    openGraph: {
        title: "نوجوانه | مسیر تحول فردی مادران",
        description:
            "به جمع مادران آگاه بپیوندید و مسیر رشد خود و فرزندتان را آغاز کنید",
        url: "https://www.noojavaneh.ir",
        siteName: "نوجوانه",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "نوجوانه - آموزش و تربیت نوجوان",
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
        canonical: "https://www.noojavaneh.ir",
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
async function getUserData(
    token: string | undefined
): Promise<InitialDataProps> {
    if (!token) {
        return {
            user: null,
            profile: null,
            progress: null,
        };
    }

    try {
        const API_URL =
            process.env.NEXT_PUBLIC_API_URL ||
            "http://127.0.0.1:8000/api";

        const userRes = await fetch(`${API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!userRes.ok) {
            return {
                user: null,
                profile: null,
                progress: null,
            };
        }

        const userData = await userRes.json();

        const user: User = {
            id: userData.user?.id || userData.id,
            name: userData.user?.name || userData.name,
            email: userData.user?.email || userData.email,
        };

        const [profileRes, progressRes] = await Promise.all([
            fetch(`${API_URL}/profiles/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            }),

            fetch(`${API_URL}/user-progress?user_id=${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            }),
        ]);

        let profile: UserProfile | null = null;

        if (profileRes.ok) {
            const profileData = await profileRes.json();

            profile = {
                full_name: profileData.full_name || null,
            };
        }

        const progress: UserProgress[] = progressRes.ok
            ? await progressRes.json()
            : [];

        return {
            user,
            profile,
            progress,
        };
    } catch (error) {
        console.error("Error fetching user data:", error);

        return {
            user: null,
            profile: null,
            progress: null,
        };
    }
}

// ========== کامپوننت اصلی ==========
export default async function Home() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const { user, profile, progress } = await getUserData(token);

    const isLoggedIn = !!user;

    const userData: InitialDataProps = {
        user,
        profile,
        progress,
    };

    const getDisplayName = (): string => {
        if (user?.name) {
            return user.name.split(" ")[0];
        }

        if (profile?.full_name) {
            return profile.full_name.split(" ")[0];
        }

        return "جوانه‌ای عزیز";
    };

    const heroText = isLoggedIn
        ? `خوش آمدی ${getDisplayName()}! بیا مسیر یادگیری‌ات را ادامه دهیم.`
        : "مسیر تحول شخصی و رشد آگاهی با متدهای نوین آموزشی برای نسل جدید.";

    return (
        <div className="w-full max-w-full overflow-x-hidden">
            {/* ==================== Hero ==================== */}
            <section
                className="w-full max-w-full overflow-hidden bg-cream-soft dark:bg-stone-950 border-b border-stone-200/20 px-3 sm:px-5 md:px-8 lg:px-12 xl:px-16 pt-4 pb-7 sm:pt-6 sm:pb-10 lg:pt-10 lg:pb-16 xl:pb-20 transition-colors duration-300"
                dir="rtl"
            >
                <div className="w-full max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12 xl:gap-20 min-w-0">

                    {/* متن Hero */}
                    <div className="w-full lg:flex-1 min-w-0 text-center lg:text-right">
                        <div className="space-y-3 sm:space-y-5 lg:space-y-6">
                            <h1 className="text-[20px] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-stone-800 dark:text-white leading-[1.65] sm:leading-[1.4] lg:leading-[1.3]">
                                نوجوانه؛ همراه مادران
                                <br />
                                <span className="text-sage-600 dark:text-sage-500">
                                    در فصل جوانه‌زدن نوجوانان
                                </span>
                            </h1>

                            <p className="text-stone-500 dark:text-stone-400 text-[12px] sm:text-sm md:text-base lg:text-lg xl:text-xl max-w-2xl mx-auto lg:mr-0 leading-6 sm:leading-7 lg:leading-relaxed">
                                {heroText}
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 pt-1 sm:pt-2">
                                <Link
                                    href={isLoggedIn ? "/dashboard" : "/register"}
                                    className="bg-sage-600 hover:bg-sage-700 text-white px-5 sm:px-8 lg:px-10 py-2.5 sm:py-3 lg:py-3.5 rounded-full font-bold text-[11px] sm:text-sm lg:text-base transition-[background-color,transform,box-shadow] duration-300 shadow-md sm:shadow-lg shadow-sage-200/40 hover:-translate-y-0.5"
                                >
                                    {isLoggedIn
                                        ? "ورود به داشبورد"
                                        : "شروع کنید"}
                                </Link>

                                <Link
                                    href={isLoggedIn ? "/courses" : "/login"}
                                    className="border border-stone-300 dark:border-stone-700 px-5 sm:px-8 lg:px-10 py-2.5 sm:py-3 lg:py-3.5 rounded-full font-bold text-[11px] sm:text-sm lg:text-base text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors text-center"
                                >
                                    {isLoggedIn
                                        ? "مشاهده دوره‌ها"
                                        : "ورود"}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* تصویر Hero */}
                    <div className="w-full lg:flex-1 min-w-0 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[190px] sm:max-w-[280px] md:max-w-[350px] lg:max-w-[460px] xl:max-w-[520px]">
                            <div className="absolute -inset-4 sm:-inset-8 bg-sage-200/40 dark:bg-sage-900/20 blur-[35px] sm:blur-[60px] rounded-full opacity-60 pointer-events-none" />

                            <Image
                                src="/favicon.png"
                                alt=" نوجوانه - آموزش تربیت نوجوان"
                                width={600}
                                height={600}
                                className="relative w-full h-auto rounded-[1.25rem] sm:rounded-[2rem] lg:rounded-[2.5rem] drop-shadow-xl sm:drop-shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== بخش‌های اصلی ==================== */}
            <main className="w-full max-w-full overflow-x-hidden px-0 sm:px-2 md:px-6">
                <div className="w-full max-w-7xl mx-auto min-w-0">

                    <Suspense
                        fallback={
                            <div className="h-24 flex items-center justify-center text-sm text-stone-400">
                                در حال بارگذاری...
                            </div>
                        }
                    >
                        <HowItWorks initialData={userData} />
                    </Suspense>

                    <Suspense
                        fallback={
                            <div className="h-24 flex items-center justify-center text-sm text-stone-400">
                                در حال بارگذاری...
                            </div>
                        }
                    >
                        <AboutUs profile={profile} />
                    </Suspense>

                    <Suspense
                        fallback={
                            <div className="h-24 flex items-center justify-center text-sm text-stone-400">
                                در حال بارگذاری...
                            </div>
                        }
                    >
                        <FAQ isLoggedIn={isLoggedIn} />
                    </Suspense>

                    <Suspense
                        fallback={
                            <div className="h-24 flex items-center justify-center text-sm text-stone-400">
                                در حال بارگذاری...
                            </div>
                        }
                    >
                        <FinalCTA
                            isLoggedIn={isLoggedIn}
                            profile={profile}
                        />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}

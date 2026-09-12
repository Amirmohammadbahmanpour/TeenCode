import React from "react";
import Image from "next/image";
import { CheckCircle2, BookOpen, Calendar, Lock } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Profile {
    created_at: string;
}

interface ApiUserResponse {
    user: {
        id: number;
        name: string;
        email: string;
    };
    profile: Profile | null;
}

interface ApiLessonsResponse {
    id: string;
    title: string;
    order_index: number;
}

interface ApiProgressResponse {
    lesson_id: string;
    is_completed: boolean;
}

interface PlantStage {
    img: string;
    label: string;
    color: string;
}

async function getUserData(token: string) {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

    const userRes = await fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    if (!userRes.ok) return null;

    const data: ApiUserResponse = await userRes.json();
    return data;
}

async function getLessonsAndProgress(token: string, userId: number) {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

    const [lessonsRes, progressRes] = await Promise.all([
        fetch(`${API_URL}/lessons`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        }),
        fetch(`${API_URL}/my-progress`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        }),
    ]);

    const allLessons: ApiLessonsResponse[] = lessonsRes.ok
        ? await lessonsRes.json()
        : [];

    const progress: ApiProgressResponse[] = progressRes.ok
        ? await progressRes.json()
        : [];

    const sortedLessons = [...allLessons].sort(
        (a, b) => a.order_index - b.order_index
    );

    return {
        allLessons: sortedLessons,
        completedIds: progress
            .filter((p) => p.is_completed)
            .map((p) => p.lesson_id),
    };
}

function getPlantStage(progressPercent: number): PlantStage {
    if (progressPercent < 25) {
        return {
            img: "/grow-1.webp",
            label: "مرحله بذر",
            color: "text-amber-700 dark:text-amber-400",
        };
    }

    if (progressPercent < 50) {
        return {
            img: "/grow-2.webp",
            label: "مرحله جوانه",
            color: "text-emerald-600 dark:text-emerald-400",
        };
    }

    if (progressPercent < 75) {
        return {
            img: "/grow-3.webp",
            label: "در حال رشد",
            color: "text-sage-600 dark:text-sage-400",
        };
    }

    return {
        img: "/grow-4.webp",
        label: "درخت دانایی",
        color: "text-green-800 dark:text-green-400",
    };
}

export default async function GrowthPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        redirect("/login");
    }

    const userData = await getUserData(token);

    if (!userData) {
        redirect("/login");
    }

    const userId = userData.user.id;

    const { allLessons, completedIds } =
        await getLessonsAndProgress(token, userId);

    const totalCount = allLessons.length;
    const completedCount = completedIds.length;

    const progressPercent =
        totalCount > 0
            ? Math.round((completedCount / totalCount) * 100)
            : 0;

    let daysActive = 1;

    if (userData.profile?.created_at) {
        const startDate = new Date(userData.profile.created_at);
        const today = new Date();

        const start = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
        );

        const current = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        daysActive =
            Math.floor(
                (current.getTime() - start.getTime()) /
                    (1000 * 60 * 60 * 24)
            ) + 1;
    }

    const nextLesson = allLessons.find(
        (lesson) => !completedIds.includes(lesson.id)
    );

    const completedLessons = allLessons.filter((lesson) =>
        completedIds.includes(lesson.id)
    );

    const stage = getPlantStage(progressPercent);

    return (
        <main
            className="min-h-screen w-full max-w-full overflow-x-hidden bg-stone-50 dark:bg-stone-950"
            dir="rtl"
        >
            <div className="w-full max-w-4xl mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-6 lg:py-8">

                {/* Header */}
                <header className="mb-4 sm:mb-6">
                    <h1 className="text-[20px] sm:text-2xl lg:text-3xl font-black tracking-tight text-stone-900 dark:text-white">
                        باغچه <span className="text-sage-600">دانایی</span> من
                    </h1>

                    <p className="mt-0.5 text-[10px] sm:text-xs text-stone-400 dark:text-stone-500 font-medium">
                        مسیر اختصاصی یادگیری شما
                    </p>
                </header>

                {/* Growth Card */}
                <section className="bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">

                    <div className="flex flex-col items-center px-3 py-4 sm:px-6 sm:py-6">

                        {/* Plant */}
                        <div className="relative w-[125px] h-[125px] sm:w-44 sm:h-44 lg:w-56 lg:h-56">
                            <Image
                                src={stage.img}
                                alt={stage.label}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Stage */}
                        <h2
                            className={`mt-1 text-[17px] sm:text-xl lg:text-2xl font-black ${stage.color}`}
                        >
                            {stage.label}
                        </h2>

                        {/* Progress */}
                        <div className="w-full max-w-[260px] sm:max-w-xs mt-3">

                            <div
                                className="h-2 sm:h-2.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden"
                                role="progressbar"
                                aria-valuenow={progressPercent}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label="درصد پیشرفت"
                            >
                                <div
                                    className="h-full rounded-full bg-sage-500 transition-[width] duration-700 ease-out"
                                    style={{
                                        width: `${progressPercent}%`,
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-between mt-1.5">
                                <span className="text-[9px] sm:text-[10px] text-stone-400 font-bold">
                                    {completedCount} از {totalCount} درس
                                </span>

                                <span className="text-[10px] sm:text-xs text-sage-600 dark:text-sage-400 font-black">
                                    {progressPercent}٪
                                </span>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-2.5 sm:mt-3">

                    <div className="flex items-center gap-2.5 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm">

                        <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg sm:rounded-xl bg-sage-50 dark:bg-sage-950/40 flex items-center justify-center">
                            <Calendar
                                size={15}
                                className="text-sage-600 dark:text-sage-400"
                            />
                        </div>

                        <div className="min-w-0">
                            <span className="block text-base sm:text-lg font-black text-stone-800 dark:text-white leading-none">
                                {daysActive}
                            </span>

                            <span className="block mt-1 text-[8px] sm:text-[10px] text-stone-400 font-bold">
                                روز همراهی
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm">

                        <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg sm:rounded-xl bg-sage-50 dark:bg-sage-950/40 flex items-center justify-center">
                            <BookOpen
                                size={15}
                                className="text-sage-600 dark:text-sage-400"
                            />
                        </div>

                        <div className="min-w-0">
                            <span className="block text-base sm:text-lg font-black text-stone-800 dark:text-white leading-none">
                                {completedCount}/{totalCount}
                            </span>

                            <span className="block mt-1 text-[8px] sm:text-[10px] text-stone-400 font-bold">
                                درس تکمیل‌شده
                            </span>
                        </div>
                    </div>

                </div>

                {/* Learning Path */}
                <section className="mt-2.5 sm:mt-3 bg-stone-900 dark:bg-sage-950 rounded-2xl sm:rounded-3xl text-white overflow-hidden">

                    <div className="px-3.5 py-3.5 sm:px-5 sm:py-5">

                        {/* Title */}
                        <div className="flex items-center gap-2 mb-3">

                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                <CheckCircle2
                                    size={14}
                                    className="text-sage-400"
                                />
                            </div>

                            <div>
                                <h3 className="text-xs sm:text-sm font-black">
                                    مسیر یادگیری شما
                                </h3>

                                <p className="text-[8px] sm:text-[9px] text-stone-400 mt-0.5">
                                    {completedCount} درس تکمیل شده
                                </p>
                            </div>

                        </div>

                        {/* Next Lesson */}
                        {nextLesson ? (
                            <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-3.5 sm:py-3 rounded-xl bg-white/10 border border-white/10">

                                <div className="min-w-0">
                                    <span className="block text-[8px] sm:text-[9px] text-sage-400 font-black mb-0.5">
                                        قدم بعدی
                                    </span>

                                    <span className="block text-[10px] sm:text-xs font-bold truncate">
                                        {nextLesson.title}
                                    </span>
                                </div>

                                <div className="w-7 h-7 shrink-0 rounded-lg bg-white/10 flex items-center justify-center">
                                    <Lock
                                        size={12}
                                        className="text-sage-400"
                                    />
                                </div>

                            </div>
                        ) : (
                            <div className="px-3 py-2.5 rounded-xl bg-sage-500/20 border border-sage-500/20 text-center">
                                <span className="text-[10px] sm:text-xs font-bold text-sage-300">
                                    🎉 همه درس‌ها را گذرانده‌ای!
                                </span>
                            </div>
                        )}

                        {/* Completed Lessons */}
                        {completedLessons.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-white/10">

                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[9px] sm:text-[10px] text-stone-400 font-bold">
                                        درس‌های تکمیل‌شده
                                    </span>

                                    <span className="text-[8px] text-sage-400 font-bold">
                                        {completedLessons.length} درس
                                    </span>
                                </div>

                                <div className="max-h-32 sm:max-h-40 overflow-y-auto scrollbar-hide">

                                    {completedLessons.map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            className="flex items-center gap-2 py-1.5"
                                        >
                                            <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-sage-400" />

                                            <span className="text-[9px] sm:text-[10px] text-sage-100 font-medium truncate">
                                                {lesson.title}
                                            </span>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        )}

                    </div>
                </section>

            </div>

            <style>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </main>
    );
}


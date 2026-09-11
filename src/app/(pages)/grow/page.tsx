import React from "react";
import Image from "next/image";
import { CheckCircle2, BookOpen, Calendar, Lock } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ========== تایپ‌ها ==========
interface Lesson {
    id: string;
    title: string;
    order_index: number;
}

interface UserProgress {
    lesson_id: string;
    is_completed: boolean;
}

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

// ========== تابع دریافت داده‌ها ==========
async function getUserData(token: string) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    
    const userRes = await fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    
    if (!userRes.ok) return null;
    
    const data: ApiUserResponse = await userRes.json();
    return data;
}

async function getLessonsAndProgress(token: string, userId: number) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    
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
    
    const allLessons: ApiLessonsResponse[] = lessonsRes.ok ? await lessonsRes.json() : [];
    const progress: ApiProgressResponse[] = progressRes.ok ? await progressRes.json() : [];
    
    // ✅ لاگ برای دیباگ
    console.log("📊 Total lessons from API:", allLessons.length);
    console.log("📊 Lessons IDs:", allLessons.map(l => l.id));
    console.log("📊 Progress count:", progress.length);
    console.log("📊 Completed IDs:", progress.filter(p => p.is_completed).map(p => p.lesson_id));
    
    const sortedLessons = [...allLessons].sort((a, b) => a.order_index - b.order_index);
    
    return {
        allLessons: sortedLessons,
        completedIds: progress.filter(p => p.is_completed).map(p => p.lesson_id),
    };
}

// ========== تابع کمکی برای مرحله گیاه ==========
function getPlantStage(progressPercent: number): PlantStage {
    if (progressPercent < 25) {
        return { img: "/grow-1.webp", label: "مرحله بذر", color: "text-amber-700" };
    }
    if (progressPercent < 50) {
        return { img: "/grow-2.webp", label: "مرحله جوانه", color: "text-emerald-600" };
    }
    if (progressPercent < 75) {
        return { img: "/grow-3.webp", label: "در حال رشد", color: "text-sage-600" };
    }
    return { img: "/grow-4.webp", label: "درخت دانایی", color: "text-green-800" };
}

// ========== صفحه اصلی ==========
export default async function GrowthPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    if (!token) {
        redirect("/login");
    }
    
    // دریافت داده‌ها
    const userData = await getUserData(token);
    
    if (!userData) {
        redirect("/login");
    }
    
    const userId = userData.user.id;
    const { allLessons, completedIds } = await getLessonsAndProgress(token, userId);
    
    // محاسبات آمار
    const totalCount = allLessons.length;
    const completedCount = completedIds.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    // محاسبه روزهای همراهی (از تاریخ ایجاد پروفایل)
    let daysActive = 1;
    if (userData.profile?.created_at) {
        const startDate = new Date(userData.profile.created_at);
        daysActive = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
    }
    
    // پیدا کردن درس بعدی (اولین درسی که کامل نشده)
    const nextLesson = allLessons.find(lesson => !completedIds.includes(lesson.id));
    const stage = getPlantStage(progressPercent);
    
    // درس‌های تکمیل شده
    const completedLessons = allLessons.filter(lesson => completedIds.includes(lesson.id));
    
    return (
        <div className="max-w-5xl mx-auto p-6 md:p-12 min-h-screen" dir="rtl">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-[1000] text-stone-900 dark:text-white tracking-tighter">
                    باغچه <span className="text-sage-600">دانایی</span> من
                </h1>
                <p className="text-stone-500 mt-2 font-medium text-lg">مسیر اختصاصی یادگیری شما</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* بخش بصری گیاه */}
                <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-[3.5rem] p-10 border border-stone-100 dark:border-stone-800 shadow-xl flex flex-col items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sage-50 dark:bg-sage-900/20 rounded-bl-[5rem] -z-0" />

                    <div className="relative w-64 h-64 md:w-80 md:h-80 transition-all duration-700">
                        <Image 
                            src={stage.img} 
                            alt={stage.label} 
                            fill 
                            className="object-contain z-10"
                            priority
                        />
                    </div>

                    <div className="mt-10 text-center z-10">
                        <div className={`text-3xl font-black mb-2 ${stage.color}`}>{stage.label}</div>
                        <div className="w-64 h-3 bg-stone-100 dark:bg-stone-800 rounded-full mx-auto overflow-hidden">
                            <div
                                className="h-full bg-sage-500 transition-all duration-1000"
                                style={{ width: `${progressPercent}%` }}
                                role="progressbar"
                                aria-valuenow={progressPercent}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                        <p className="mt-4 text-stone-500 font-bold text-sm">
                            تکمیل شده: {progressPercent}% ({completedCount} از {totalCount} درس)
                        </p>
                    </div>
                </div>

                {/* بخش آمار و لیست دروس */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-sm text-center">
                            <Calendar className="mx-auto text-sage-600 mb-3" size={24} />
                            <span className="block text-2xl font-black text-stone-800 dark:text-white">{daysActive} روز</span>
                            <span className="text-xs text-stone-400 font-bold">همراهی</span>
                        </div>
                        <div className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-sm text-center">
                            <BookOpen className="mx-auto text-sage-600 mb-3" size={24} />
                            <span className="block text-2xl font-black text-stone-800 dark:text-white">{completedCount}/{totalCount}</span>
                            <span className="text-xs text-stone-400 font-bold">دروس پاس شده</span>
                        </div>
                    </div>

                    <div className="bg-stone-900 dark:bg-sage-950 p-8 rounded-[3rem] text-white overflow-hidden">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                            <CheckCircle2 className="text-sage-400" />
                            مسیر یادگیری شما
                        </h3>

                        <div className="space-y-5 max-h-[300px] overflow-y-auto">
                            {/* درس‌های پاس شده */}
                            {completedLessons.map((lesson) => (
                                <div key={lesson.id} className="flex items-center justify-between opacity-100">
                                    <span className="text-sm font-bold text-sage-100">{lesson.title}</span>
                                    <div className="w-2.5 h-2.5 rounded-full bg-sage-400 shadow-[0_0_10px_rgba(163,190,140,0.8)]" />
                                </div>
                            ))}
                        </div>

                        {/* درس بعدی */}
                        {nextLesson ? (
                            <div className="mt-6 p-4 bg-white/10 rounded-2xl border border-white/20">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col text-right">
                                        <span className="text-[10px] text-sage-400 font-black uppercase mb-1">قدم بعدی:</span>
                                        <span className="text-sm font-bold text-white">{nextLesson.title}</span>
                                    </div>
                                    <Lock size={16} className="text-sage-400" />
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 text-center p-4 bg-sage-500/20 rounded-2xl border border-sage-500/30 text-sage-300 text-sm font-bold">
                                🎉 تبریک! همه دروس را با موفقیت گذرانده‌اید.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
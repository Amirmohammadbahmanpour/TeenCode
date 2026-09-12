
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Edit2,
    BookOpen,
    Sparkles,
    Calendar,
    Award,
    Trophy,
    TrendingUp,
    ChevronLeft,
} from "lucide-react";
import { auth } from "@/lib/auth";
import api from "@/lib/axios";

// ========== تایپ‌ها ==========

interface UserProfile {
    name: string | null;
    age: number | null;
    avatar: string;
}

interface ExamData {
    exam_type: "pretest" | "posttest";
    score: number | null;
}

interface ProgressData {
    lesson_id: string;
    is_completed: boolean;
}

interface LessonData {
    id: string;
    title: string;
}

interface ApiResponse {
    user: {
        id: number;
        name: string;
        email: string;
        created_at?: string;
    };
    profile: {
        full_name: string | null;
        age: number | null;
        education_level: string | null;
        economic_status: string | null;
        children_count: number | null;
        teen_age: number | null;
        created_at?: string;
    };
}

// ========== کامپوننت اصلی ==========

export default function Dashboard() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [progressPercent, setProgressPercent] = useState<number>(0);
    const [isCourseFinished, setIsCourseFinished] = useState<boolean>(false);
    const [totalLessons, setTotalLessons] = useState<number>(0);
    const [completedLessons, setCompletedLessons] = useState<number>(0);
    const [daysActive, setDaysActive] = useState<number>(1);

    // ========== محاسبه پیشرفت ==========

    const calculateProgress = useCallback(
        (
            preTestScore: number | null,
            postTestScore: number | null
        ): { percent: number; finished: boolean } => {
            if (postTestScore !== null && postTestScore >= 60) {
                return { percent: 100, finished: true };
            }

            if (preTestScore !== null) {
                const percent = Math.min(
                    15 + (preTestScore / 100) * 25,
                    85
                );

                return {
                    percent: Math.round(percent),
                    finished: false,
                };
            }

            return {
                percent: 0,
                finished: false,
            };
        },
        []
    );

    // ========== محاسبه روزهای همراهی ==========

    const calculateDaysActive = (
        createdAt: string | undefined
    ): number => {
        if (!createdAt) return 1;

        const startDate = new Date(createdAt);
        const today = new Date();

        const diffTime = Math.abs(
            today.getTime() - startDate.getTime()
        );

        const diffDays = Math.ceil(
            diffTime / (1000 * 60 * 60 * 24)
        );

        return diffDays;
    };

    // ========== دریافت اطلاعات ==========

    useEffect(() => {
        async function fetchData() {
            const token = auth.getToken();

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // ۱. اطلاعات کاربر و پروفایل
                const response = await api.get<ApiResponse>("/user");
                const userData = response.data;

                const createdAt =
                    userData.profile?.created_at ||
                    userData.user?.created_at;

                setDaysActive(calculateDaysActive(createdAt));

                // ۲. آزمون‌ها
                let preTestScore: number | null = null;
                let postTestScore: number | null = null;

                try {
                    const examsRes = await api.get("/user-exams");
                    const exams = examsRes.data as ExamData[];

                    const preTest = exams.find(
                        (e) => e.exam_type === "pretest"
                    );

                    const postTest = exams.find(
                        (e) => e.exam_type === "posttest"
                    );

                    preTestScore = preTest?.score ?? null;
                    postTestScore = postTest?.score ?? null;
                } catch (error) {
                    console.log(
                        "No exams data found, using default progress"
                    );
                }

                // ۳. پیشرفت دروس
                let completed = 0;
                let total = 0;

                try {
                    const progressRes = await api.get("/my-progress");
                    const progress =
                        progressRes.data as ProgressData[];

                    completed = progress.filter(
                        (p) => p.is_completed === true
                    ).length;

                    setCompletedLessons(completed);

                    const lessonsRes =
                        await api.get("/lessons");

                    const lessons =
                        lessonsRes.data as LessonData[];

                    total = lessons.length;

                    setTotalLessons(total);

                    if (completed === total && total > 0) {
                        setProgressPercent(100);
                        setIsCourseFinished(true);
                    } else {
                        const { percent, finished } =
                            calculateProgress(
                                preTestScore,
                                postTestScore
                            );

                        setProgressPercent(percent);
                        setIsCourseFinished(finished);
                    }
                } catch (error) {
                    const { percent, finished } =
                        calculateProgress(
                            preTestScore,
                            postTestScore
                        );

                    setProgressPercent(percent);
                    setIsCourseFinished(finished);
                }

                // پروفایل
                setProfile({
                    name:
                        userData.profile?.full_name ||
                        userData.user?.name ||
                        null,
                    age: userData.profile?.age || null,
                    avatar: "/Profile.png",
                });
            } catch (error) {
                console.error(
                    "Error fetching dashboard data:",
                    error
                );

                setProgressPercent(15);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [calculateProgress]);

    // ========== لودینگ ==========

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
                <div className="w-9 h-9 sm:w-11 sm:h-11 animate-spin rounded-full border-2 border-stone-200 dark:border-stone-800 border-b-sage-600" />
            </div>
        );
    }

    const isProfileIncomplete =
        !profile?.name || !profile?.age;

    return (
        <div
            className="min-h-screen w-full max-w-full overflow-x-hidden bg-stone-50 dark:bg-stone-950 transition-colors duration-300"
            dir="rtl"
        >
            <div className="w-full max-w-6xl mx-auto px-3 sm:px-5 md:px-6 lg:px-8 py-5 sm:py-8 lg:py-10">

                {/* ================= هدر ================= */}

                <header className="mb-5 sm:mb-7 lg:mb-8">
                    <h1 className="text-[22px] sm:text-3xl md:text-4xl font-black text-stone-800 dark:text-white leading-tight">
                        سلام،{" "}
                        <span className="text-sage-600 dark:text-sage-500">
                            {profile?.name?.split(" ")[0] ||
                                "دوست عزیز"}{" "}
                            👋
                        </span>
                    </h1>

                    <p className="text-[11px] sm:text-sm md:text-base text-stone-500 dark:text-stone-400 mt-1.5 sm:mt-2">
                        {isCourseFinished
                            ? "🎉 تبریک! دوره را با موفقیت به پایان رساندی."
                            : "به مسیر تحول شخصی خوش آمدی. بیا ادامه بدیم!"}
                    </p>
                </header>

                {/* ================= کارت اصلی ================= */}

                <section className="bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-lg border border-stone-100 dark:border-stone-800 overflow-hidden mb-4 sm:mb-6">

                    <div className="p-4 sm:p-6 lg:p-8">

                        {/* اطلاعات کاربر */}

                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 lg:gap-6">

                            {/* آواتار */}

                            <div className="relative shrink-0">
                                <div className="w-[68px] h-[68px] sm:w-24 sm:h-24 lg:w-28 lg:h-28 relative">
                                    <Image
                                        src={
                                            profile?.avatar ||
                                            "/Profile.png"
                                        }
                                        fill
                                        className="rounded-full object-cover border-[3px] sm:border-4 border-sage-100 dark:border-sage-900"
                                        alt="پروفایل"
                                    />

                                    {isCourseFinished && (
                                        <div className="absolute -top-1 -left-1 bg-amber-500 text-white p-1 sm:p-1.5 rounded-full border-2 border-white dark:border-stone-900">
                                            <Award
                                                size={11}
                                                className="sm:w-3.5 sm:h-3.5"
                                            />
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href="/complete-profile"
                                    aria-label="ویرایش پروفایل"
                                    className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-white dark:bg-stone-800 p-1.5 sm:p-2 rounded-full shadow-sm border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
                                >
                                    <Edit2
                                        size={11}
                                        className="sm:w-3.5 sm:h-3.5 text-sage-600"
                                    />
                                </Link>
                            </div>

                            {/* اطلاعات */}

                            <div className="flex-1 min-w-0 text-center sm:text-right">
                                <h2 className="text-[16px] sm:text-xl lg:text-2xl font-bold text-stone-800 dark:text-white truncate">
                                    {profile?.name ||
                                        "کاربر جدید"}
                                </h2>

                                {profile?.age && (
                                    <p className="text-[10px] sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5 sm:mt-1">
                                        {profile.age} سال
                                        <span className="mx-1.5 text-stone-300 dark:text-stone-700">
                                            •
                                        </span>
                                        {totalLessons} درس
                                    </p>
                                )}

                                <p
                                    className={`inline-block text-[9px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full mt-1.5 sm:mt-2 ${
                                        isCourseFinished
                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                            : "bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-400"
                                    }`}
                                >
                                    {isCourseFinished
                                        ? "🎓 فارغ‌التحصیل"
                                        : "📚 در حال یادگیری"}
                                </p>
                            </div>

                            {/* درصد */}

                            {!isCourseFinished && (
                                <div className="w-full sm:w-auto shrink-0 text-center bg-sage-50 dark:bg-sage-900/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3">
                                    <p className="text-[9px] sm:text-xs text-stone-500 dark:text-stone-400">
                                        نمره ارزیابی اولیه
                                    </p>

                                    <p className="text-xl sm:text-2xl font-black text-sage-600 dark:text-sage-500">
                                        {progressPercent}%
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* نوار پیشرفت */}

                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-stone-100 dark:border-stone-800">

                            <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                                <span className="text-[10px] sm:text-sm font-medium text-stone-600 dark:text-stone-400">
                                    پیشرفت در دوره
                                </span>

                                <span className="text-[10px] sm:text-sm font-bold text-sage-600 dark:text-sage-500">
                                    {progressPercent}%
                                </span>
                            </div>

                            <div className="w-full h-2 sm:h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-[width] duration-700 ${
                                        isCourseFinished
                                            ? "bg-amber-500"
                                            : "bg-sage-500"
                                    }`}
                                    style={{
                                        width: `${progressPercent}%`,
                                    }}
                                />
                            </div>

                            {!isCourseFinished &&
                                totalLessons > 0 && (
                                    <p className="text-[9px] sm:text-xs text-stone-400 mt-1.5 sm:mt-2">
                                        {completedLessons} از{" "}
                                        {totalLessons} درس تکمیل شده
                                    </p>
                                )}
                        </div>
                    </div>
                </section>

                {/* ================= کارت‌های اقدام ================= */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5 mb-4 sm:mb-6">

                    {/* ادامه یادگیری */}

                    <Link
                        href="/courses"
                        className="group bg-white dark:bg-stone-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 lg:p-6 border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-[box-shadow,transform] duration-300"
                    >
                        <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-sage-100 dark:bg-sage-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 sm:mb-4 group-hover:bg-sage-600 transition-colors">
                            <BookOpen
                                className="text-sage-600 group-hover:text-white transition-colors"
                                size={18}
                            />
                        </div>

                        <h3 className="text-[13px] sm:text-base lg:text-lg font-bold text-stone-800 dark:text-white mb-0.5 sm:mb-1">
                            ادامه یادگیری
                        </h3>

                        <p className="text-[10px] sm:text-xs lg:text-sm text-stone-500 dark:text-stone-400">
                            {isCourseFinished
                                ? "مرور دوره"
                                : "به مسیر تحول ادامه بده"}
                        </p>
                    </Link>

                    {/* نمودار رشد */}

                    <Link
                        href="/grow"
                        className="group bg-white dark:bg-stone-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 lg:p-6 border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-[box-shadow,transform] duration-300"
                    >
                        <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 sm:mb-4 group-hover:bg-emerald-600 transition-colors">
                            <TrendingUp
                                className="text-emerald-600 group-hover:text-white transition-colors"
                                size={18}
                            />
                        </div>

                        <h3 className="text-[13px] sm:text-base lg:text-lg font-bold text-stone-800 dark:text-white mb-0.5 sm:mb-1">
                            نمودار رشد
                        </h3>

                        <p className="text-[10px] sm:text-xs lg:text-sm text-stone-500 dark:text-stone-400">
                            ببین چقدر پیشرفت کردی
                        </p>
                    </Link>

                    {/* روزهای همراهی */}

                    <div className="bg-white dark:bg-stone-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 lg:p-6 border border-stone-100 dark:border-stone-800">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 sm:mb-4">
                            <Calendar
                                className="text-amber-600"
                                size={18}
                            />
                        </div>

                        <h3 className="text-[13px] sm:text-base lg:text-lg font-bold text-stone-800 dark:text-white mb-0.5 sm:mb-1">
                            روزهای همراهی
                        </h3>

                        <p className="text-xl sm:text-2xl font-black text-amber-600">
                            {daysActive} روز
                        </p>

                        <p className="text-[9px] sm:text-xs text-stone-400 mt-0.5">
                            از شروع مسیر یادگیری
                        </p>
                    </div>
                </div>

                {/* ================= تکمیل پروفایل ================= */}

                {isProfileIncomplete &&
                    !isCourseFinished && (
                        <section className="bg-gradient-to-r from-sage-50 to-amber-50 dark:from-sage-900/20 dark:to-amber-900/10 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 lg:p-6 border border-sage-200 dark:border-sage-800 mb-4 sm:mb-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">

                                <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
                                    <div className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 bg-sage-100 dark:bg-sage-900/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                                        <Sparkles
                                            className="text-sage-600"
                                            size={18}
                                        />
                                    </div>

                                    <div className="min-w-0 text-right">
                                        <h3 className="text-[12px] sm:text-base font-bold text-stone-800 dark:text-stone-200">
                                            تکمیل اطلاعات پروفایل
                                        </h3>

                                        <p className="text-[9px] sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5 leading-5">
                                            با تکمیل اطلاعات، مسیر یادگیری شخصی‌سازی می‌شود
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/complete-profile"
                                    className="w-full sm:w-auto shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 bg-sage-600 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-bold hover:bg-sage-700 transition-colors flex items-center justify-center gap-1.5"
                                >
                                    تکمیل اطلاعات
                                    <ChevronLeft
                                        size={15}
                                    />
                                </Link>
                            </div>
                        </section>
                    )}

                {/* ================= پایان دوره ================= */}

                {isCourseFinished && (
                    <section className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 text-white text-center">
                        <Trophy
                            className="mx-auto mb-2 sm:mb-3"
                            size={30}
                        />

                        <h3 className="text-lg sm:text-xl font-bold mb-1">
                            🎉 تبریک بزرگ! 🎉
                        </h3>

                        <p className="text-[11px] sm:text-sm text-amber-100 mb-3 sm:mb-4">
                            شما با موفقیت دوره تحول فردی را به پایان رساندید
                        </p>

                        <button className="bg-white text-amber-600 px-5 sm:px-8 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold hover:bg-stone-100 transition-colors inline-flex items-center gap-1.5">
                            <Award size={16} />
                            دریافت مدرک افتخار
                        </button>
                    </section>
                )}
            </div>
        </div>
    );
}
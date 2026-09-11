"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit2, BookOpen, Sparkles, Calendar, Award, Trophy, TrendingUp, ChevronLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import api from "@/lib/axios";

// ========== تایپ‌ها ==========
interface UserProfile {
    name: string | null;
    age: number | null;
    avatar: string;
}

interface ExamData {
    exam_type: 'pretest' | 'posttest';
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

    // تابع محاسبه پیشرفت بر اساس نمره آزمون‌ها
    const calculateProgress = useCallback((preTestScore: number | null, postTestScore: number | null): { percent: number; finished: boolean } => {
        if (postTestScore !== null && postTestScore >= 60) {
            return { percent: 100, finished: true };
        }
        
        if (preTestScore !== null) {
            const percent = Math.min(15 + (preTestScore / 100) * 25, 85);
            return { percent: Math.round(percent), finished: false };
        }
        
        return { percent: 0, finished: false };
    }, []);

    // محاسبه روزهای همراهی از تاریخ ایجاد
    const calculateDaysActive = (createdAt: string | undefined): number => {
        if (!createdAt) return 1;
        const startDate = new Date(createdAt);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    useEffect(() => {
        async function fetchData() {
            const token = auth.getToken();
            
            if (!token) {
                setLoading(false);
                return;
            }
    
            try {
                // ۱. دریافت اطلاعات کاربر و پروفایل
                const response = await api.get<ApiResponse>('/user');
                const userData = response.data;
                
                // محاسبه روزهای همراهی
                const createdAt = userData.profile?.created_at || userData.user?.created_at;
                setDaysActive(calculateDaysActive(createdAt));
                
                // ۲. دریافت وضعیت آزمون‌ها
                let preTestScore: number | null = null;
                let postTestScore: number | null = null;
                
                try {
                    const examsRes = await api.get('/user-exams');
                    const exams = examsRes.data as ExamData[];
                    
                    const preTest = exams.find((e: ExamData) => e.exam_type === 'pretest');
                    const postTest = exams.find((e: ExamData) => e.exam_type === 'posttest');
                    
                    preTestScore = preTest?.score ?? null;
                    postTestScore = postTest?.score ?? null;
                    
                } catch (error) {
                    console.log("No exams data found, using default progress");
                }
                
                // ۳. دریافت تعداد دروس تکمیل شده
                let completed = 0;
                let total = 0;
                
                try {
                    const progressRes = await api.get('/my-progress');
                    const progress = progressRes.data as ProgressData[];
                    completed = progress.filter((p: ProgressData) => p.is_completed === true).length;
                    setCompletedLessons(completed);
                    
                    const lessonsRes = await api.get('/lessons');
                    const lessons = lessonsRes.data as LessonData[];
                    total = lessons.length;
                    setTotalLessons(total);
                    
                    // اگر همه دروس کامل شده بود
                    if (completed === total && total > 0) {
                        setProgressPercent(100);
                        setIsCourseFinished(true);
                    } else {
                        const { percent, finished } = calculateProgress(preTestScore, postTestScore);
                        setProgressPercent(percent);
                        setIsCourseFinished(finished);
                    }
                } catch (error) {
                    const { percent, finished } = calculateProgress(preTestScore, postTestScore);
                    setProgressPercent(percent);
                    setIsCourseFinished(finished);
                }
                
                // تنظیم پروفایل
                setProfile({
                    name: userData.profile?.full_name || userData.user?.name || null,
                    age: userData.profile?.age || null,
                    avatar: "/Profile.png",
                });
                
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setProgressPercent(15);
            } finally {
                setLoading(false);
            }
        }
        
        fetchData();
    }, [calculateProgress]);

    // حالت لودینگ
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-white to-stone-50 dark:from-stone-950 dark:to-stone-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600"></div>
            </div>
        );
    }

    const isProfileIncomplete = !profile?.name || !profile?.age;

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-stone-50 dark:from-stone-950 dark:to-stone-900" dir="rtl">
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                
                {/* هدر خوش‌آمدگویی */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-stone-800 dark:text-white">
                        سلام، <span className="text-sage-600">{profile?.name?.split(' ')[0] || "دوست عزیز"} 👋</span>
                    </h1>
                    <p className="text-stone-500 dark:text-stone-400 mt-1">
                        {isCourseFinished 
                            ? "🎉 تبریک! شما دوره را با موفقیت به پایان رساندید." 
                            : "به مسیر تحول شخصی خوش آمدی. بیا ادامه بدیم!"}
                    </p>
                </div>

                {/* کارت پیشرفت اصلی */}
                <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-xl border border-stone-100 dark:border-stone-800 overflow-hidden mb-8">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* آواتار */}
                            <div className="relative shrink-0">
                                <div className="w-24 h-24 md:w-28 md:h-28 relative">
                                    <Image
                                        src={profile?.avatar || "/Profile.png"}
                                        fill
                                        className="rounded-full object-cover border-4 border-sage-100 dark:border-sage-900"
                                        alt="پروفایل"
                                    />
                                    {isCourseFinished && (
                                        <div className="absolute -top-1 -left-1 bg-amber-500 text-white p-1.5 rounded-full border-2 border-white dark:border-stone-900">
                                            <Award size={14} />
                                        </div>
                                    )}
                                </div>
                                <Link
                                    href="/complete-profile"
                                    className="absolute -bottom-2 -right-2 bg-white dark:bg-stone-800 p-2 rounded-full shadow-md border border-stone-200 dark:border-stone-700 hover:bg-stone-50 transition-all"
                                >
                                    <Edit2 size={14} className="text-sage-600" />
                                </Link>
                            </div>

                            {/* اطلاعات کاربر */}
                            <div className="flex-1 text-center md:text-right">
                                <h2 className="text-xl md:text-2xl font-bold text-stone-800 dark:text-white">
                                    {profile?.name || "کاربر جدید"}
                                </h2>
                                {profile?.age && (
                                    <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
                                        {profile.age} سال • {totalLessons} درس
                                    </p>
                                )}
                                <p className={`inline-block text-xs font-bold px-3 py-1 rounded-full mt-2 ${
                                    isCourseFinished 
                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                                        : 'bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-400'
                                }`}>
                                    {isCourseFinished ? "🎓 فارغ‌التحصیل" : "📚 در حال یادگیری"}
                                </p>
                            </div>

                            {/* نمره آزمون ورودی */}
                            {!isCourseFinished && (
                                <div className="text-center bg-sage-50 dark:bg-sage-900/20 rounded-2xl px-6 py-3">
                                    <p className="text-xs text-stone-500">نمره ارزیابی اولیه</p>
                                    <p className="text-2xl font-black text-sage-600">{progressPercent}%</p>
                                </div>
                            )}
                        </div>

                        {/* نوار پیشرفت */}
                        <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                                    پیشرفت در دوره
                                </span>
                                <span className="text-sm font-bold text-sage-600">{progressPercent}%</span>
                            </div>
                            <div className="w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                        isCourseFinished ? 'bg-amber-500' : 'bg-sage-500'
                                    }`}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            {!isCourseFinished && totalLessons > 0 && (
                                <p className="text-xs text-stone-400 mt-2">
                                    {completedLessons} از {totalLessons} درس تکمیل شده
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* کارت‌های اقدام */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* ادامه یادگیری */}
                    <Link
                        href="/courses"
                        className="group bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                    >
                        <div className="w-12 h-12 bg-sage-100 dark:bg-sage-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sage-600 transition-colors">
                            <BookOpen className="text-sage-600 group-hover:text-white transition-colors" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-1">ادامه یادگیری</h3>
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                            {isCourseFinished ? "مرور دوره" : "به مسیر تحول ادامه بده"}
                        </p>
                    </Link>

                    {/* نمودار رشد */}
                    <Link
                        href="/grow"
                        className="group bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                    >
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
                            <TrendingUp className="text-emerald-600 group-hover:text-white transition-colors" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-1">نمودار رشد</h3>
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                            ببین چقدر پیشرفت کردی
                        </p>
                    </Link>

                    {/* روزهای همراهی */}
                    <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-100 dark:border-stone-800">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
                            <Calendar className="text-amber-600" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-1">روزهای همراهی</h3>
                        <p className="text-2xl font-black text-amber-600">{daysActive} روز</p>
                        <p className="text-xs text-stone-400 mt-1">از شروع مسیر یادگیری</p>
                    </div>
                </div>

                {/* بخش تکمیل پروفایل (اگر کامل نبود) */}
                {isProfileIncomplete && !isCourseFinished && (
                    <div className="bg-gradient-to-r from-sage-50 to-amber-50 dark:from-sage-900/20 dark:to-amber-900/10 rounded-2xl p-6 border border-sage-200 dark:border-sage-800">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-sage-100 dark:bg-sage-900/30 rounded-xl flex items-center justify-center">
                                    <Sparkles className="text-sage-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-stone-800 dark:text-stone-200">تکمیل اطلاعات پروفایل</h3>
                                    <p className="text-sm text-stone-500 dark:text-stone-400">
                                        با تکمیل اطلاعات، مسیر یادگیری شخصی‌سازی می‌شود
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/complete-profile"
                                className="px-6 py-2.5 bg-sage-600 text-white rounded-xl font-bold hover:bg-sage-700 transition-all flex items-center gap-2"
                            >
                                تکمیل اطلاعات
                                <ChevronLeft size={18} />
                            </Link>
                        </div>
                    </div>
                )}

                {/* پیام اتمام دوره */}
                {isCourseFinished && (
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white text-center">
                        <Trophy className="mx-auto mb-3" size={40} />
                        <h3 className="text-xl font-bold mb-1">🎉 تبریک بزرگ! 🎉</h3>
                        <p className="text-amber-100 mb-4">
                            شما با موفقیت دوره تحول فردی را به پایان رساندید
                        </p>
                        <button className="bg-white text-amber-600 px-8 py-3 rounded-xl font-bold hover:bg-stone-100 transition-all inline-flex items-center gap-2">
                            <Award size={18} />
                            دریافت مدرک افتخار
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
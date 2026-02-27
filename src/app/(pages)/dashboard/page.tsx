"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit2, Bookmark, Sparkles, Heart, FileText, MessageSquare, Loader2, Trophy, Share2, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UserProfile {
    name: string | null;
    age: number | null;
    avatar: string;
}

interface ToolItem {
    id: number;
    title: string;
    icon: React.ReactNode;
    count: number;
}

export default function Dashboard() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [progressPercent, setProgressPercent] = useState<number>(0);
    const [isCourseFinished, setIsCourseFinished] = useState(false);

    const tools: ToolItem[] = [
        { id: 1, title: "ذخیره شده‌ها", icon: <Bookmark size={22} />, count: 12 },
        { id: 2, title: "لایک شده‌ها", icon: <Heart size={22} />, count: 5 },
        { id: 3, title: "یادداشت‌ها", icon: <FileText size={22} />, count: 8 },
        { id: 4, title: "پیام‌ها", icon: <MessageSquare size={22} />, count: 2 },
    ];

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // ۱. دریافت اطلاعات پروفایل
                const { data: dbProfile } = await supabase
                    .from('profiles')
                    .select('full_name, age')
                    .eq('id', user.id)
                    .single();

                // ۲. دریافت وضعیت آزمون‌ها برای محاسبه رشد و اتمام دوره
                const { data: exams } = await supabase
                    .from('user_exams')
                    .select('exam_type, score')
                    .eq('user_id', user.id);

                if (exams) {
                    const preTest = exams.find(e => e.exam_type === 'pretest');
                    const postTest = exams.find(e => e.exam_type === 'posttest');

                    if (postTest) {
                        setIsCourseFinished(true);
                        setProgressPercent(100); // وقتی آزمون نهایی داده شده یعنی ۱۰۰٪ مسیر
                    } else {
                        // اگر هنوز تموم نکرده، بر اساس نمره آزمون اول یا تعداد دروس گذرانده (فرضی) رشد را نشان بده
                        setProgressPercent(preTest ? 15 : 0);
                    }
                }

                setProfile({
                    name: dbProfile?.full_name || null,
                    age: dbProfile?.age || null,
                    avatar: user.user_metadata?.avatar_url || "/tem-img.png",
                });
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return (
        <div className="h-screen flex justify-center items-center bg-white dark:bg-stone-950 text-sage-600">
            <Loader2 className="animate-spin" size={40} />
        </div>
    );

    const isProfileIncomplete = !profile?.name || !profile?.age;

    return (
        <section className="h-full w-full overflow-hidden bg-white dark:bg-stone-950 text-right flex flex-col p-4 md:p-8" dir="rtl">
            <div className="max-w-4xl mx-auto w-full flex flex-col h-full">

                {/* ۱. اعلان تبریک یا تکمیل پروفایل */}
                {isCourseFinished ? (
                    <div className="mb-6 relative overflow-hidden group">
                        <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-200 dark:border-amber-900/50 rounded-[2rem] flex items-center justify-between gap-4 shadow-lg shadow-amber-100 dark:shadow-none transition-all">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-14 h-14 flex items-center justify-center bg-white dark:bg-stone-800 rounded-2xl shadow-sm text-amber-600">
                                    <Trophy size={30} className="animate-bounce" />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-black text-stone-800 dark:text-stone-100">شاهکار کردید، {profile?.name}!</h3>
                                    <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-400 mt-1 font-bold">دوره با موفقیت به پایان رسید. مدرک شما آماده است.</p>
                                </div>
                            </div>
                            <button className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2">
                                <Share2 size={14} />
                                اشتراک‌گذاری
                            </button>
                        </div>
                    </div>
                ) : isProfileIncomplete && (
                    <div className="mb-6">
                        {/* همان باکس تکمیل پروفایل قبلی شما اینجا قرار می‌گیرد */}
                    </div>
                )}

                {/* ۲. کارت پروفایل */}
                <div className="shrink-0 bg-stone-50 dark:bg-stone-900 rounded-[2rem] border border-stone-100 dark:border-stone-800/50 shadow-sm transition-colors">
                    <div className="flex items-center gap-4 p-4 sm:p-6">
                        <div className="relative shrink-0">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                                <Image
                                    src={profile?.avatar || "/tem-img.png"}
                                    fill
                                    className="rounded-full object-cover border-2 border-white dark:border-stone-800"
                                    alt="profile"
                                />
                                {/* مدال فارغ‌التحصیلی - سمت چپ بالا */}
                                {isCourseFinished && (
                                    <div className="absolute -top-1 -left-1 bg-amber-500 text-white p-1 rounded-full border-2 border-white dark:border-stone-900 shadow-sm z-10">
                                        <Award size={14} />
                                    </div>
                                )}
                            </div>

                            {/* دکمه ادیت - دقیقاً همان جایی که قبلاً بود (پایین سمت راست) */}
                            <Link
                                href="/complete-profile"
                                className="absolute -bottom-1 -right-1 bg-white dark:bg-stone-800 p-2 rounded-full shadow-md border border-stone-100 dark:border-stone-700 active:scale-90 transition-all z-20 hover:bg-stone-50 dark:hover:bg-stone-700"
                            >
                                <Edit2 size={12} className="text-sage-600 dark:text-sage-400" />
                            </Link>
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 truncate">
                                {profile?.name || "کاربر جدید"}
                            </h1>
                            <p className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mt-1 ${isCourseFinished ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' : 'bg-sage-50 text-sage-600 dark:bg-sage-900/30'}`}>
                                {isCourseFinished ? "فارغ‌التحصیل دوره" : "در حال یادگیری"}
                            </p>
                        </div>
                    </div>

                    {/* بخش رشد داینامیک */}
                    <div className="px-5 pb-5 pt-2 border-t border-stone-200/50 dark:border-stone-800/50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-bold text-stone-400">میزان پیشرفت در مسیر تحول</span>
                            <span className={`text-[9px] font-black ${isCourseFinished ? 'text-amber-600' : 'text-sage-600'}`}>
                                {progressPercent}%
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${isCourseFinished ? 'bg-amber-500' : 'bg-sage-600'}`}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* ۳. گرید ابزارها یا کارت مدرک */}
                <div className="flex-1 mt-4 sm:mt-6">
                    {isCourseFinished ? (
                        /* نمایش مدرک به جای گرید ابزارها */
                        <div className="h-full min-h-[200px] p-8 rounded-[2.5rem] bg-gradient-to-br from-stone-900 to-stone-800 dark:from-stone-900 dark:to-black border-4 border-amber-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                                <Award size={120} className="text-amber-500" />
                            </div>
                            <Sparkles className="text-amber-400 mb-4" size={40} />
                            <h2 className="text-xl font-black text-white mb-2">گواهی تحول فردی</h2>
                            <p className="text-stone-400 text-xs mb-6 px-4">این مدرک به پاس تلاش‌های مستمر و پایان موفقیت‌آمیز دوره به شما اعطا می‌شود.</p>
                            <button className="bg-amber-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-amber-500 transition-all active:scale-95 shadow-lg shadow-amber-600/20">
                                مشاهده و دانلود مدرک
                            </button>
                        </div>
                    ) : (
                        /* گرید معمولی ابزارها */
                        <div className="grid grid-cols-2 gap-3 pb-4">
                            {tools.map((item) => (
                                <div key={item.id} className="p-4 sm:p-6 rounded-[2rem] bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800/50 flex flex-col items-center justify-center text-center active:bg-stone-100 dark:active:bg-stone-800 active:scale-95 transition-all">
                                    <div className="mb-2 sm:mb-3 text-sage-600">{item.icon}</div>
                                    <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200">{item.title}</h4>
                                    <p className="text-[9px] text-stone-400 mt-1">{item.count} مورد</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
import React from "react";
import Image from "next/image";
import { CheckCircle2, BookOpen, Calendar, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

interface Lesson {
  id: number;
  title: string;
}

interface UserProgress {
  lesson_id: number;
  is_completed: boolean;
}

export default async function GrowthPage() {
  // ۱. احراز هویت
  const { data: { session } } = await supabase.auth.getSession();
  const testUserId = "8805f6e8-356c-4824-9548-284596b6134b";
  const userId = session?.user?.id || testUserId;

  if (!userId) {
    redirect("/auth/login");
  }

  // ۲. دریافت اطلاعات (موازی)
  const [lessonsRes, progressRes, profileRes] = await Promise.all([
    supabase.from("lessons").select("id, title").order("id", { ascending: true }),
    supabase.from("user_progress").select("lesson_id, is_completed").eq("user_id", userId).eq("is_completed", true),
    supabase.from("profiles").select("created_at").eq("id", userId).single()
  ]);

  // تعریف متغیرها بعد از دریافت داده‌ها
  const allLessons = (lessonsRes.data as Lesson[]) || [];
  const completedData = (progressRes.data as UserProgress[]) || [];
  const profile = profileRes.data;
  
  // تعریف ستون آیدی‌های تکمیل شده (این باید قبل از nextLesson باشد)
  const completedIds = completedData.map(c => c.lesson_id);

  // پیدا کردن درس بعدی (حالا تمام متغیرهای مورد نیاز تعریف شده‌اند)
  const nextLesson = allLessons.find(lesson => !completedIds.includes(lesson.id));

  // ۳. محاسبات آمار
  const totalCount = allLessons.length || 1;
  const completedCount = completedData.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const startDate = new Date(profile?.created_at || new Date());
  const daysActive = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;

  // ۴. منطق انتخاب مرحله گیاه
  const getPlantStage = () => {
    if (progressPercent < 25) return { img: "/grow-1.webp", label: "مرحله بذر", color: "text-amber-700" };
    if (progressPercent < 50) return { img: "/grow-2.webp", label: "مرحله جوانه", color: "text-emerald-600" };
    if (progressPercent < 75) return { img: "/grow-3.webp", label: "در حال رشد", color: "text-sage-600" };
    return { img: "/grow-4.webp", label: "درخت دانایی", color: "text-green-800" };
  };

  const stage = getPlantStage();

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
            <Image src={stage.img} alt={stage.label} fill className="object-contain z-10" />
          </div>

          <div className="mt-10 text-center z-10">
            <div className={`text-3xl font-black mb-2 ${stage.color}`}>{stage.label}</div>
            <div className="w-64 h-3 bg-stone-100 dark:bg-stone-800 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-sage-500 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-4 text-stone-500 font-bold text-sm">
              تکمیل شده: {progressPercent}%
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

            <div className="space-y-5">
              {/* ۱. درس‌های پاس شده */}
              {allLessons
                .filter(lesson => completedIds.includes(lesson.id))
                .map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between opacity-100">
                    <span className="text-sm font-bold text-sage-100">{lesson.title}</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-sage-400 shadow-[0_0_10px_rgba(163,190,140,0.8)]" />
                  </div>
                ))}

              {/* ۲. فقط یک درس بعدی */}
              {nextLesson ? (
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 mt-4 animate-pulse">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-sage-400 font-black uppercase mb-1">قدم بعدی:</span>
                    <span className="text-sm font-bold text-white">{nextLesson.title}</span>
                  </div>
                  <Lock size={16} className="text-stone-500" />
                </div>
              ) : (
                <div className="text-center p-4 bg-sage-500/10 rounded-2xl border border-sage-500/20 text-sage-400 text-xs font-bold">
                  🎉 تبریک! مسیر رشد را کامل کردید.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
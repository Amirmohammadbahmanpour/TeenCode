"use client";
import React from "react";
import Image from "next/image";
import { CheckCircle2, BookOpen, Calendar } from "lucide-react";

export default function GrowthPage() {
  // این اطلاعات بعداً از دیتابیس می‌آید
  const stats = {
    daysActive: 12,
    totalLessons: 20,
    completedLessons: 8,
  };

  const progressPercent = (stats.completedLessons / stats.totalLessons) * 100;

  // منطق انتخاب عکس گیاه بر اساس درصد پیشرفت
  const getPlantStage = () => {
    if (progressPercent < 25) return { img: "/grow-1.webp", label: "مرحله بذر" };
    if (progressPercent < 50) return { img: "/grow-1.webp", label: "مرحله جوانه" };
    if (progressPercent < 75) return { img: "/grow-1.webp", label: "در حال رشد" };
    return { img: "/plant-4.png", label: "درخت دانایی" };
  };

  const lessons = [
    { id: 1, title: "مقدمات تحول فردی", status: "completed" },
    { id: 2, title: "مدیریت زمان عملی", status: "completed" },
    { id: 3, title: "شناخت نقاط قوت", status: "current" },
    { id: 4, title: "برنامه‌ریزی استراتژیک", status: "locked" },
  ];

  const stage = getPlantStage();

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-8">مسیر رشد آموزشی من</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* بخش بصری گیاه */}
        <div className="bg-cream-soft dark:bg-stone-900 rounded-[3rem] p-8 border border-stone-100 dark:border-stone-800 flex flex-col items-center shadow-inner">
          <div className="relative w-48 h-48 md:w-64 md:h-64 transition-all duration-500 hover:scale-105">
             {/* دقت کن که اسم فایل‌ها با چیزی که ذخیره کردی یکی باشد */}
            <Image src={stage.img} alt="روند رشد" fill className="object-contain" />
          </div>
          <div className="mt-6 text-center">
             <span className="px-4 py-1.5 bg-sage-600 text-white rounded-full text-sm font-bold">
               {stage.label}
             </span>
             <p className="mt-3 text-stone-500 text-sm">شما {progressPercent}% از مسیر آموزش را طی کرده‌اید.</p>
          </div>
        </div>

        {/* بخش آمار و مباحث */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
              <Calendar className="text-sage-600 mb-2" size={20} />
              <p className="text-xs text-stone-500">روزهای فعالیت</p>
              <p className="text-xl font-bold">{stats.daysActive} روز</p>
            </div>
            <div className="flex-1 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
              <BookOpen className="text-sage-600 mb-2" size={20} />
              <p className="text-xs text-stone-500">درس‌های پاس شده</p>
              <p className="text-xl font-bold">{stats.completedLessons}/{stats.totalLessons}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-sage-600" />
              آخرین سرفصل‌ها
            </h3>
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between group">
                  <span className={`text-sm ${lesson.status === 'locked' ? 'text-stone-400' : 'text-stone-700 dark:text-stone-300'}`}>
                    {lesson.title}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${
                    lesson.status === 'completed' ? 'bg-sage-600' : 
                    lesson.status === 'current' ? 'bg-amber-500 animate-pulse' : 'bg-stone-200'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
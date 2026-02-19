"use client";

import Image from "next/image";
import { useState } from "react";
import { Sprout, ChevronDown } from "lucide-react";

interface Chapter {
    id: number;
    title: string;
    duration: string;
    lessonsCount: number;
    image: string;
    lessons: string[];
}

const chaptersData: Chapter[] = [
    {
        id: 1,
        title: "فصل اول: ذهنیت تحول",
        duration: "۲۰ دقیقه",
        lessonsCount: 4,
        image: "/tem-img.png",
        lessons: ["ذهنیت برنده چیست؟", "شناخت موانع درونی", "ترس از تغییر", "تعهد به مسیر ۳۰ روزه"],
    },
    {
        id: 2,
        title: "فصل دوم: مدیریت انرژی و زمان",
        duration: "۱۵ دقیقه",
        lessonsCount: 3,
        image: "/tem-img.png",
        lessons: ["اولویت‌بندی به روش مدرن", "سیکل‌های انرژی بدن", "تکنیک‌های تمرکز عمیق"],
    },
    {
        id: 3,
        title: "فصل دوم: مدیریت انرژی و زمان",
        duration: "۱۵ دقیقه",
        lessonsCount: 3,
        image: "/tem-img.png",
        lessons: ["اولویت‌بندی به روش مدرن", "سیکل‌های انرژی بدن", "تکنیک‌های تمرکز عمیق"],
    },
    {
        id: 4,
        title: "فصل دوم: مدیریت انرژی و زمان",
        duration: "۱۵ دقیقه",
        lessonsCount: 3,
        image: "/tem-img.png",
        lessons: ["اولویت‌بندی به روش مدرن", "سیکل‌های انرژی بدن", "تکنیک‌های تمرکز عمیق"],
    },
    {
        id: 5,
        title: "فصل دوم: مدیریت انرژی و زمان",
        duration: "۱۵ دقیقه",
        lessonsCount: 3,
        image: "/tem-img.png",
        lessons: ["اولویت‌بندی به روش مدرن", "سیکل‌های انرژی بدن", "تکنیک‌های تمرکز عمیق"],
    },
];

function ChapterItem({ chapter }: { chapter: Chapter }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`rounded-3xl p-5 mb-4 cursor-pointer transition-all duration-300 border ${
                isOpen
                    ? "bg-white dark:bg-stone-900 border-sage-200 dark:border-sage-800 shadow-xl"
                    : "bg-[#fdfaf3] dark:bg-stone-950/50 border-transparent hover:bg-[#f9f6ee] dark:hover:bg-stone-900"
            }`}
            onClick={() => setIsOpen(!isOpen)}
        >
            {/* هدر کارت (بخش ثابت) */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-right">
                    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden bg-white dark:bg-stone-800 flex-shrink-0">
                        <Image
                            alt={chapter.title}
                            src={chapter.image}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h3 className={`text-base md:text-lg font-bold transition-colors ${
                            isOpen ? "text-sage-600 dark:text-sage-400" : "text-stone-800 dark:text-stone-200"
                        }`}>
                            {chapter.title}
                        </h3>
                        <span className="text-xs text-stone-400 dark:text-stone-500">
                            {chapter.lessonsCount} درس | {chapter.duration}
                        </span>
                    </div>
                </div>
                <div className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-sage-600" : "text-stone-400"}`}>
                    <ChevronDown size={20} />
                </div>
            </div>

            {/* بخش درس‌ها (بخش بازشونده) */}
            <div 
                className={`grid transition-all duration-500 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-5 pt-5 border-t border-stone-100 dark:border-stone-800" : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden space-y-1">
                    {/* --- شروع بخش جدیدی که خواسته بودی --- */}
                    {chapter.lessons.map((lesson, index) => (
                        <div key={index} className="group relative">
                            {/* بدنه اصلی هر درس با افکت جابجایی در هاور */}
                            <div 
                                className="flex items-center justify-start gap-4 p-4 rounded-2xl transition-all duration-300 
                                           hover:bg-sage-50/50 dark:hover:bg-sage-900/10 hover:-translate-x-2"
                            >
                                {/* آیکون گیاه با انیمیشن رشد */}
                                <div className="text-sage-500 dark:text-sage-400 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-[15deg]">
                                    <Sprout size={18} />
                                </div>

                                <span className="text-sm md:text-base text-stone-700 dark:text-stone-300 font-medium transition-colors group-hover:text-sage-700 dark:group-hover:text-sage-300">
                                    {lesson}
                                    <div className="h-[1px] w-[95%] mx-auto bg-gradient-to-r from-transparent via-sage-600 to-transparent rounded-[100%] shadow-[0_1px_2px_rgba(135,169,107,0.2)]"></div>

                                </span>
                            </div>

                            {/* خط جداکننده منحنی (Curve Line) */}
                            {index !== chapter.lessons.length - 1 && (
                                <div className="relative h-px w-[90%] mx-auto mt-1">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sage-200 dark:via-sage-800 to-transparent rounded-[100%] blur-[0.5px]" />
                                </div>
                            )}
                        </div>
                    ))}
                    {/* --- پایان بخش جدید --- */}
                </div>
            </div>
        </div>
    );
}

export default function CoursesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-stone-950 transition-colors duration-500 pb-20 overflow-x-hidden">
            {/* Banner Section */}
            <header className="relative w-full h-[45vh] md:h-[60vh]">
                <Image
                    src="/course-banner.png"
                    alt="Course Banner"
                    fill
                    priority
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-stone-950 via-transparent to-transparent" />
            </header>

            {/* Content Section */}
            <main className="max-w-4xl mx-auto px-6 relative z-10 -mt-16 md:-mt-24 text-right">
                <h1 className="text-3xl md:text-5xl font-black text-stone-900 dark:text-stone-100 mb-6 leading-tight">
                    دوره جامع ۳۰ روز تحول
                </h1>
                <p className="text-base md:text-lg text-stone-600 dark:text-stone-400 leading-8 md:leading-9 font-medium max-w-3xl mb-12">
                    در این مسیر آموزشی، قدم‌به‌قدم با مفاهیم تحول فردی آشنا می‌شوید.
                    این صفحه شامل فصل‌های تخصصی است که هر کدام مسیر ویژه‌ای را برای شما ترسیم می‌کند.
                </p>

                {/* Chapters List */}
                <section className="max-w-3xl ml-auto">
                    {chaptersData.map((chapter) => (
                        <ChapterItem key={chapter.id} chapter={chapter} />
                    ))}
                </section>
            </main>
        </div>
    );
}
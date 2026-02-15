"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    FileText,Clock,Trash , Play, Mic, Image as ImageIcon,
    Download, ChevronRight, CheckCircle2
} from "lucide-react";

// این اطلاعاتی هست که بعداً از دیتابیس یا بک‌اندر میاد
const lessonData = {
    title: "درس اول: ذهنیت تحول",
    description: "در این درس یاد می‌گیریم که چطور الگوهای فکری قدیمی را شناسایی کرده و آن‌ها را با متدهای نوین بازنویسی کنیم. این پایه و اساس سفر ۳۰ روزه شماست.",
    videoUrl: "/videos/lesson-1.mp4", // آدرس فایل ویدیو در پوشه public
    podcastUrl: "/audio/lesson-1.mp3", // آدرس فایل پادکست در پوشه public
    pdfUrl: "/files/lesson-1-notes.pdf", // آدرس فایل PDF
    infographicUrl: "/banner-img.webp", // عکسی که موضوع رو خلاصه کرده
};




export default function LessonPage() {
    const [isCompleted, setIsCompleted] = useState(false);
    const [ second, setSecond ] = useState(0);
    const [userNote, setUserNote] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("my-lesson-note");
            return saved || "";
        }
        return "";
    });
    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };
    
    const clearNote = () => {
        setUserNote("");
        localStorage.removeItem("my-lesson-note");
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setSecond(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [])

    useEffect(() => {
        localStorage.setItem("my-lesson-note", userNote);
    }, [userNote]);
    return (
        <div className="min-h-screen bg-white dark:bg-stone-950 text-right pb-20 transition-colors duration-500" dir="rtl">

            {/* هدر ناوبری */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-900">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/courses" className="flex items-center gap-2 text-stone-500 hover:text-sage-600 transition-colors font-medium">
                        <ChevronRight size={20} />
                        <span>بازگشت به دوره</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="hidden md:block text-sm text-stone-400">فصل اول / درس اول</span>
                        <div className="h-2 w-2 rounded-full bg-sage-500"></div>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* ستون اصلی (ویدیو و محتوا) */}
                <div className="lg:col-span-2 space-y-10">

                    {/* ۱. بخش ویدیو پلیر واقعی */}
                    <div className="group space-y-4">
                        <h2 className="text-2xl md:text-3xl font-black text-stone-900 dark:text-white">
                            {lessonData.title}
                        </h2>
                        <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 shadow-sage-200/20 dark:shadow-none">
                            <video
                                controls
                                className="w-full h-full object-cover"
                            >
                                <source src={lessonData.videoUrl} type="video/mp4" />
                                مرورگر شما از تگ ویدیو پشتیبانی نمی‌کند.
                            </video>
                        </div>
                    </div>

                    {/* ۲. بخش خلاصه تصویری (اینفوگرافیک) */}
                    <section className="bg-stone-50 dark:bg-stone-900/40 p-6 md:p-8 rounded-[2.5rem] border border-stone-100 dark:border-stone-800">
                        <div className="flex items-center gap-3 mb-6 text-sage-600">
                            <div className="p-2 bg-sage-100 dark:bg-sage-900/30 rounded-xl">
                                <ImageIcon size={24} />
                            </div>
                            <h3 className="font-bold text-xl text-stone-800 dark:text-stone-100">نقشه راه این درس</h3>
                        </div>
                        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-sm">
                            <Image
                                src={lessonData.infographicUrl}
                                alt="خلاصه تصویری"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <p className="mt-6 text-stone-600 dark:text-stone-400 leading-8">
                            {lessonData.description}
                        </p>
                    </section>

                </div>

                {/* ستون کناری (پادکست و دانلودها) */}
                <div className="space-y-8">

                    {/* ۳. بخش پادکست واقعی */}
                    <div className="bg-white dark:bg-stone-900 p-8 rounded-[2.5rem] shadow-sm border border-stone-100 dark:border-stone-800">
                        <div className="flex items-center gap-3 mb-6 text-sage-600">
                            <div className="p-2 bg-sage-100 dark:bg-sage-900/30 rounded-xl">
                                <Mic size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100">شنیدن پادکست</h3>
                        </div>
                        <audio controls className="w-full accent-sage-600">
                            <source src={lessonData.podcastUrl} type="audio/mpeg" />
                        </audio>
                        <p className="text-xs text-stone-400 dark:text-stone-500 mt-4 leading-5">
                            اگر در حرکت هستید یا فرصت تماشای ویدیو را ندارید، نسخه صوتی را بشنوید.
                        </p>
                    </div>

                    {/* ۴. باکس دانلود PDF */}
                    <div className="bg-sage-600 dark:bg-sage-700 p-8 rounded-[2.5rem] shadow-xl shadow-sage-200/50 dark:shadow-none flex flex-col items-center text-center group">
                        <div className="w-20 h-20 bg-white/20 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FileText size={40} className="text-white" />
                        </div>
                        <h3 className="text-white font-bold text-xl mb-2">جزوه آموزشی</h3>
                        <p className="text-sage-100 text-sm mb-8 leading-6 px-4">تمرینات عملی و چکیده مطالب این درس را در قالب PDF دریافت کنید.</p>

                        <a
                            href={lessonData.pdfUrl}
                            download
                            className="w-full bg-white text-sage-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-50 transition-all active:scale-95"
                        >
                            <Download size={20} />
                            <span>دانلود فایل PDF</span>
                        </a>
                    </div>
                    <div className="mt-10 p-6 bg-sage-soft dark:bg-cream-dark rounded-[2rem] shadow-sage-600 dark:shadow-none">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold mb-4">یادداشت های من</h3>
                            <button onClick={clearNote} className="cursor-pointer">
                                <Trash size={20} className="mb-4"/>
                            </button>
                        </div>
                        <textarea value={userNote}
                            onChange={(e) => setUserNote(e.target.value)}
                            placeholder="نکات مهم درس رو اینجا بنویس"
                            className="w-full h-40 p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 outline-none focus:ring-sage-500 transition-all">
                        </textarea>

                        <div className="flex flex-col gap-3 justify-between items-center mt-4 md:flex-row lg:flex-col">
                            <p className="mt-2 text-sm text-sage-600">
                                تعداد کاراکترها : {userNote.length}
                            </p>
                            <div className="flex gap-3 justify-around p-3 bg-sage-600 text-white rounded-[2.5rem] shadow-xl">
                                <div className="flex items-center gap-2 opacity-80">
                                    <Clock size={20}/>
                                    <span className="font-medium">زمان مطالعه این جلسه</span>
                                </div>
                                <div className="text-xl font-black font-mono tracking-tighter">
                                    {formatTime(second)}
                                </div>
                            </div>
                        </div>

                    </div>
                    {/* دکمه اتمام درس */}
                    <button
                        onClick={() => setIsCompleted(!isCompleted)}
                        className={`w-full py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 transition-all ${isCompleted
                            ? "bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-default"
                            : "bg-white dark:bg-stone-900 border-2 border-sage-600 text-sage-600 hover:bg-sage-50 dark:hover:bg-sage-900/30"
                            }`}
                    >
                        <CheckCircle2 size={24} className={isCompleted ? "text-green-500" : ""} />
                        <span>{isCompleted ? "این درس را گذراندید" : "علامت‌گذاری به عنوان تکمیل شده"}</span>
                    </button>
                </div>

            </main>
        </div>
    );
}
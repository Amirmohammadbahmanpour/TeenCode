"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Sprout, ChevronDown, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase"; // کلاینت سوپابیس خودت
import Link from "next/link";

interface Lesson {
    id: number;
    title: string;
}

interface Chapter {
    id: number;
    title: string;
    description: string;
    lessons: Lesson[];
    image_url: string;
}

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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-right">
                    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden bg-white dark:bg-stone-800 flex-shrink-0">
                        <Image
                            alt={chapter.title}
                            src={chapter.image_url || "/tem-img.png"}
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
                            {chapter.lessons.length} درس در این فصل
                        </span>
                    </div>
                </div>
                <div className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-sage-600" : "text-stone-400"}`}>
                    <ChevronDown size={20} />
                </div>
            </div>

            <div className={`grid transition-all duration-500 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-5 pt-5 border-t border-stone-100 dark:border-stone-800" : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden space-y-1">
                    {chapter.lessons.map((lesson) => (
                        <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                            <div className="group relative flex items-center justify-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-sage-50/50 dark:hover:bg-sage-900/10 hover:-translate-x-2">
                                <div className="text-sage-500 dark:text-sage-400 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-[15deg]">
                                    <Sprout size={18} />
                                </div>
                                <span className="text-sm md:text-base text-stone-700 dark:text-stone-300 font-medium transition-colors group-hover:text-sage-700 dark:group-hover:text-sage-300">
                                    {lesson.title}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function CoursesPage() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContent() {
            // دریافت فصل‌ها و درس‌های مربوط به هر فصل با یک کوئری
            const { data, error } = await supabase
                .from('categories')
                .select(`
                    id,
                    title,
                    lessons (
                        id,
                        title,
                        order_index
                    )
                `)
                .order('order_index', { ascending: true });
                if (data) {
                    // تبدیل داده‌های خام دیتابیس به فرمتی که Interface شما (Chapter) انتظار دارد
                    const formattedChapters: Chapter[] = data.map((item: any) => ({
                      id: item.id,
                      title: item.title,
                      description: item.description,
                      image_url: item.image_url,
                      lessons: item.lessons || [] // اگر درسی وجود نداشت یک آرایه خالی بگذارد
                    }));
                  
                    setChapters(formattedChapters);
                  }
                  setLoading(false);
        }
        fetchContent();
    }, []);

    if (loading) return <div className="p-20 text-center">در حال بارگذاری نقشه راه...</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-stone-950 pb-20 overflow-x-hidden">
            <header className="relative w-full h-[45vh] md:h-[60vh]">
                <Image src="/course-banner.png" alt="Course Banner" fill priority className="object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-stone-950 via-transparent to-transparent" />
            </header>

            <main className="max-w-4xl mx-auto px-6 relative z-10 -mt-16 md:-mt-24 text-right">
                <h1 className="text-3xl md:text-5xl font-black text-stone-900 dark:text-stone-100 mb-6 leading-tight">
                    دوره جامع تحول
                </h1>
                
                <section className="max-w-3xl ml-auto mt-12">
                    {chapters.map((chapter) => (
                        <ChapterItem key={chapter.id} chapter={chapter} />
                    ))}
                </section>
            </main>
        </div>
    );
}
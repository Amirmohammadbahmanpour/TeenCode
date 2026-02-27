import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import ChapterList from "./ChapterList";
import Image from "next/image";

// تعریف اینترفیس‌های دقیق
export interface Lesson {
  id: string;
  title: string;
  order_index: number;
}

export interface Chapter {
  id: number;
  title: string;
  slug: string; // اضافه شدن برای شناسایی آزمون نهایی
  lessons: Lesson[];
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CoursesPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // ۱. کوئری وضعیت آزمون‌ها (ورودی و نهایی)
    const { data: examsData } = await supabase
        .from("user_exams")
        .select("exam_type")
        .eq("user_id", user.id);

    // ۲. کوئری دسته‌بندی‌ها و دروس
    const { data: chaptersData } = await supabase
        .from("categories")
        .select(`
            id,
            title,
            slug,
            lessons (
                id,
                title,
                order_index
            )
        `)
        .order("order_index", { ascending: true });

    // ۳. کوئری پیشرفت دروس
    const { data: progressData } = await supabase
        .from("user_progress")
        .select("lesson_id")
        .eq("user_id", user.id);

    // پردازش داده‌ها
    const chapters = (chaptersData as unknown as Chapter[]) || [];
    const completedLessonIds = (progressData || []).map(p => p.lesson_id);
    
    // استخراج وضعیت قبولی آزمون‌ها از آرایه نتایج
    const entranceExamPassed = examsData?.some(e => e.exam_type === "pretest") || false;
    const finalExamPassed = examsData?.some(e => e.exam_type === "posttest") || false;

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-20" dir="rtl">
            
            {/* بخش بنر و هدر */}
            <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
                <Image 
                    src="/course-banner.png" 
                    alt="Banner"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/20 to-transparent dark:from-stone-950 dark:via-stone-950/20" />
            </div>

            {/* بخش محتوای متنی هدر */}
            <div className="max-w-3xl mx-auto px-6 -mt-20 relative z-10 mb-12">
                <div className="inline-block px-4 py-2 bg-sage-600 text-white text-xs font-black rounded-xl mb-4 shadow-lg">
                    دوره جامع
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 mb-4 transition-all">
                    مسیر تحول من
                </h1>
                <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                    اینجا نقشه راه اختصاصی شماست. هر مرحله را با دقت پشت سر بگذارید تا به اهداف بزرگ خود دست پیدا کنید. تداوم، رمز پیروزی شما در این مسیر است.
                </p>
            </div>

            {/* لیست فصل‌ها */}
            <div className="max-w-3xl mx-auto px-6">
                <ChapterList
                    chapters={chapters}
                    completedLessonIds={completedLessonIds}
                    entranceExamPassed={entranceExamPassed}
                    finalExamPassed={finalExamPassed} 
                />
            </div>
        </div>
    );
}
import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import ChapterList from "./ChapterList";
import Image from "next/image";

// تعریف اینترفیس‌ها
export interface Lesson {
  id: string;
  title: string;
  order_index: number;
}

export interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CoursesPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // کوئری‌ها
    const { data: examData } = await supabase
        .from("user_exams")
        .select("id")
        .eq("user_id", user.id)
        .eq("exam_type", "pretest");

    const { data: chaptersData } = await supabase
        .from("categories")
        .select(`
            id,
            title,
            lessons (
                id,
                title,
                order_index
            )
        `)
        .order("order_index", { ascending: true });

    const { data: progressData } = await supabase
        .from("user_progress")
        .select("lesson_id")
        .eq("user_id", user.id);

    const chapters = (chaptersData as unknown as Chapter[]) || [];
    const completedLessonIds = (progressData || []).map(p => p.lesson_id);
    const entranceExamPassed = Array.isArray(examData) && examData.length > 0;

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-20" dir="rtl">
            
            {/* بخش بنر و هدر */}
            <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
                <Image 
                    src="/course-banner.png" // نام فایل بنر خود را اینجا جایگزین کنید
                    alt="Banner"
                    fill
                    className="object-cover"
                    priority
                />
                {/* سایه (Gradient) پایین عکس برای محو شدن در پس‌زمینه */}
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
                    finalExamPassed={false} 
                />
            </div>
        </div>
    );
}
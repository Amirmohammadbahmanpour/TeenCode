import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Image from "next/image"
import ChapterList from "./ChapterList"

// --- Interfaces ---
interface DBPlacement {
    id: number;
    title: string;
    order_index: number;
}

interface DBCategory {
    id: number;
    title: string;
    image_url: string | null;
    lessons: DBPlacement[];
}

export interface Lesson {
    id: number;
    title: string;
}

export interface Chapter {
    id: number;
    title: string;
    image_url: string | null;
    lessons: Lesson[];
}

export default async function CoursesPage() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll() { return cookieStore.getAll() } } }
    )

    // ۱. دریافت اطلاعات یوزر
    const { data: { user } } = await supabase.auth.getUser();

    // ۲. دریافت فصل‌ها و دروس
    const { data: categories } = await supabase
        .from("categories")
        .select(`
            id,
            title,
            image_url,
            lessons ( id, title, order_index )
        `)
        .order("order_index", { ascending: true }) as { data: DBCategory[] | null };

    // ۳. متغیرهای وضعیت کاربر
    let completedLessonIds: number[] = [];
    let entranceExamPassed = false;
    let finalExamPassed = false;

    if (user) {
        // الف) دریافت دروس تمام شده
        const { data: progress } = await supabase
            .from("user_progress")
            .select("lesson_id")
            .eq("user_id", user.id)
            .eq("is_completed", true);

        if (progress) {
            completedLessonIds = progress.map(p => p.lesson_id);
        }

        // ب) دریافت وضعیت آزمون‌ها از جدول جدید
        const { data: examData } = await supabase
            .from('user_exams')
            .select('exam_type, is_passed')
            .eq('user_id', user.id);

        if (examData) {
            entranceExamPassed = examData.find(e => e.exam_type === 'entrance')?.is_passed || false;
            finalExamPassed = examData.find(e => e.exam_type === 'final')?.is_passed || false;
        }
    }

    // ۴. فرمت کردن داده‌ها برای کامپوننت
    const formattedChapters: Chapter[] = (categories ?? []).map((cat): Chapter => ({
        id: cat.id,
        title: cat.title,
        image_url: cat.image_url,
        lessons: (cat.lessons ?? [])
            .sort((a, b) => a.order_index - b.order_index)
            .map((l): Lesson => ({ id: l.id, title: l.title }))
    }));

    return (
        <div className="min-h-screen bg-white dark:bg-stone-950 pb-20 text-right" dir="rtl">
            <header className="relative w-full h-[35vh] md:h-[40vh]">
                <Image
                    src="/course-banner.png"
                    alt="Banner"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-stone-950" />
            </header>

            <main className="max-w-4xl mx-auto px-6 relative z-10 -mt-16 md:-mt-20">
                <div className="flex flex-col items-center md:items-start text-center md:text-right">
                    <h1 className="text-3xl md:text-5xl font-black text-stone-900 dark:text-stone-100 mb-6 leading-tight">
                        نقشه راه تحول ۳۰ روزه
                    </h1>

                    <p className="text-base md:text-lg text-stone-600 dark:text-stone-400 leading-8 md:leading-9 font-medium max-w-3xl mb-12">
                        {entranceExamPassed
                            ? "تبریک! شما آزمون ورودی را با موفقیت گذراندید. حالا مسیر یادگیری برای شما باز شده است."
                            : "برای شروع اولین فصل، ابتدا باید در آزمون ورودی شرکت کنید تا سطح آمادگی شما سنجیده شود."
                        }
                    </p>
                </div>

                <div className="w-full mx-auto">
                    {/* پاس دادن تمام وضعیت‌ها به لیست فصل‌ها */}
                    <ChapterList
                        chapters={formattedChapters}
                        completedLessonIds={completedLessonIds}
                        entranceExamPassed={entranceExamPassed}
                        finalExamPassed={finalExamPassed}
                    />
                </div>
            </main>
        </div>
    );
}
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChapterList from "./ChapterList";
import Image from "next/image";

// ========== تایپ‌ها ==========
export interface Lesson {
    id: string;
    title: string;
    order_index: number;
}

export interface Chapter {
    id: string;
    title: string;
    slug: string;
    lessons: Lesson[];
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface CategoryFromAPI {
    id: string;
    title: string;
    slug: string;
    lessons?: {
        id: string;
        title: string;
        order_index: number;
    }[];
}

interface ProgressFromAPI {
    lesson_id: string;
    is_completed: boolean;
}

interface ChaptersData {
    chapters: Chapter[];
    completedLessonIds: string[];
    entranceExamPassed: boolean;
    finalExamPassed: boolean;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getUserData(): Promise<{ user: User; token: string } | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    if (!token) return null;
    
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
        
        const userRes = await fetch(`${API_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        
        if (!userRes.ok) return null;
        
        const data = await userRes.json();
        const user: User = {
            id: data.user?.id || data.id,
            name: data.user?.name || data.name,
            email: data.user?.email || data.email,
        };
        
        return { user, token };
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

// ✅ تابع جدید برای چک کردن کامل بودن پروفایل
async function isProfileComplete(token: string): Promise<boolean> {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
        const res = await fetch(`${API_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        if (!res.ok) return false;
        const data = await res.json();
        return !!(data.profile?.full_name && data.profile.full_name.trim() !== "");
    } catch (error) {
        console.error("Error checking profile:", error);
        return false;
    }
}

async function getChaptersData(token: string): Promise<ChaptersData> {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
        
        const [categoriesRes, progressRes] = await Promise.all([
            fetch(`${API_URL}/categories`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            }),
            fetch(`${API_URL}/my-progress`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            }),
        ]);
        
        let categories: CategoryFromAPI[] = [];
        let progress: ProgressFromAPI[] = [];
        
        if (categoriesRes.ok) {
            try {
                const categoriesData = await categoriesRes.json();
                categories = Array.isArray(categoriesData) ? categoriesData : [];
            } catch (error) {
                console.error("Error parsing categories:", error);
            }
        } else {
            console.error("Categories API error:", categoriesRes.status);
        }
        
        if (progressRes.ok) {
            try {
                const progressData = await progressRes.json();
                progress = Array.isArray(progressData) ? progressData : [];
            } catch (error) {
                console.error("Error parsing progress:", error);
            }
        } else {
            // ✅ اصلاح شده
            const status = progressRes.status || 'unknown';
            console.error(`Progress API error: ${status}`);
            
            // اگر خطای 429 بود، یک پیام مناسب نشان بده
            if (status === 429) {
                console.warn("⚠️ Too many requests to API. Please wait a moment.");
            }
        }
        
        // دریافت وضعیت آزمون‌ها
        let entranceExamPassed = false;
        let finalExamPassed = false;
        
        try {
            const examsRes = await fetch(`${API_URL}/user-exams/check?exam_type=pretest`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            });
            if (examsRes.ok) {
                const data = await examsRes.json();
                entranceExamPassed = data.exists === true;
            }
            
            const finalRes = await fetch(`${API_URL}/user-exams/check?exam_type=posttest`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            });
            if (finalRes.ok) {
                const data = await finalRes.json();
                finalExamPassed = data.exists === true;
            }
        } catch (error) {
            console.log("Error checking exams:", error);
        }
        
        const chapters: Chapter[] = categories.map((cat: CategoryFromAPI) => ({
            id: cat.id,
            title: cat.title,
            slug: cat.slug,
            lessons: cat.lessons?.map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                order_index: lesson.order_index,
            })) || [],
        }));
        
        const completedLessonIds: string[] = progress
            .filter((p: ProgressFromAPI) => p.is_completed === true)
            .map((p: ProgressFromAPI) => p.lesson_id);
        
        return {
            chapters,
            completedLessonIds,
            entranceExamPassed,
            finalExamPassed,
        };
    } catch (error) {
        console.error("Error fetching chapters:", error);
        return {
            chapters: [],
            completedLessonIds: [],
            entranceExamPassed: false,
            finalExamPassed: false,
        };
    }
}

export default async function CoursesPage() {
    const userData = await getUserData();
    
    if (!userData) {
        redirect("/login");
    }
    
    // ✅ چک کردن کامل بودن پروفایل
    const profileComplete = await isProfileComplete(userData.token);
    
    if (!profileComplete) {
        redirect("/complete-profile");
    }
    
    const { chapters, completedLessonIds, entranceExamPassed, finalExamPassed } = 
        await getChaptersData(userData.token);

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
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ChevronRight, Loader2, Lock, CheckCircle2, Clock, Trash, Mic, Image as ImageIcon
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";

// ========== اینترفیس‌ها ==========
interface Category {
    title: string;
}

interface Lesson {
    id: string;
    title: string;
    description: string;
    content_text: string;
    video_url: string;
    video_type: string;
    podcast_url: string;
    featured_image_url: string;
    category: Category;
    is_locked: boolean;
    is_completed: boolean;
}

interface ApiError {
    response?: {
        status?: number;
        data?: {
            message?: string;
        };
    };
}

// ========== کامپوننت پخش ویدیو ==========
const VideoPlayer = ({ url, type }: { url: string; type: string }) => {
    if (!url) return null;

    // آپارات
    if (type === 'aparat' || url.includes('aparat.com')) {
        let videoId = '';
        if (url.includes('embed/')) {
            videoId = url.split('embed/')[1]?.split('?')[0] || '';
        } else if (url.includes('/v/')) {
            videoId = url.split('/v/')[1]?.split('/')[0] || '';
        } else {
            videoId = url.split('/').pop() || '';
        }
        return (
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                <iframe
                    src={`https://www.aparat.com/video/video/embed/videohash/${videoId}/vt/frame`}
                    className="w-full h-full"
                    allowFullScreen
                    title="آپارات"
                />
            </div>
        );
    }

    // یوتیوب
    if (type === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1]?.split('&')[0] || '';
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
        }
        return (
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    className="w-full h-full"
                    allowFullScreen
                    title="یوتیوب"
                />
            </div>
        );
    }

    // لوکال
    return (
        <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
            <video controls className="w-full h-full">
                <source src={url} type="video/mp4" />
            </video>
        </div>
    );
};

// ========== کامپوننت اصلی ==========
export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = params.id as string;

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [userNote, setUserNote] = useState<string>("");
    const [watchSeconds, setWatchSeconds] = useState<number>(0);

    // ========== 1. دریافت اطلاعات درس ==========
    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await api.get<Lesson>(`/lessons/${lessonId}`);
                setLesson(response.data);
            } catch (err: unknown) {
                const error = err as ApiError;
                if (error.response?.status === 403) {
                    toast.error("این درس قفل است. ابتدا درس قبلی را کامل کنید.");
                    router.push("/courses");
                } else {
                    toast.error("خطا در دریافت اطلاعات درس");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [lessonId, router]);

    // ========== 2. یادداشت‌ها در localStorage ==========
    useEffect(() => {
        const saved = localStorage.getItem(`lesson-note-${lessonId}`);
        if (saved) setUserNote(saved);
    }, [lessonId]);

    useEffect(() => {
        localStorage.setItem(`lesson-note-${lessonId}`, userNote);
    }, [userNote, lessonId]);

    // ========== 3. تایمر زمان مطالعه ==========
    useEffect(() => {
        const timer = setInterval(() => {
            setWatchSeconds((prev: number) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const clearNote = () => {
        setUserNote("");
        localStorage.removeItem(`lesson-note-${lessonId}`);
        toast.success("یادداشت پاک شد");
    };

    // ========== 4. علامت‌گذاری به عنوان گذرانده شده ==========
    const handleComplete = async (): Promise<void> => {
        if (isSubmitting) return;
    
        // ✅ این خط رو اضافه کن (بعد از if)
        console.log("📤 Sending complete request for lesson:", lessonId);
        
        setIsSubmitting(true);
        try {
            const response = await api.post("/progress", {
                lesson_id: lessonId,
                is_completed: true,
            });
                        

            toast.success("✅ درس با موفقیت تکمیل شد!");
            window.dispatchEvent(new Event("progress-updated"));
            
            setTimeout(() => {
                router.push("/courses");
                router.refresh();  // ✅ این خط رو عوض کن (قبلاً نبود)
            }, 2000);
        } catch (err: unknown) {
            const error = err as ApiError;
            console.error("❌ Error saving progress:", error);  // ✅ این خط رو اضافه کن
            toast.error(error.response?.data?.message || "خطا در ثبت پیشرفت");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-stone-950">
                <Loader2 className="animate-spin text-sage-600" size={48} />
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-stone-500">درس یافت نشد</p>
                    <Link href="/courses" className="text-sage-600 inline-block mt-4">
                        بازگشت به دوره‌ها
                    </Link>
                </div>
            </div>
        );
    }

    if (lesson.is_locked) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <Lock size={48} className="mx-auto text-stone-400 mb-4" />
                    <h1 className="text-2xl font-bold mb-4">این درس قفل است</h1>
                    <p className="text-stone-500 mb-6">برای دسترسی به این درس، ابتدا درس قبلی را کامل کنید.</p>
                    <Link href="/courses" className="text-sage-600 font-bold">
                        بازگشت به دوره‌ها
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-stone-950 text-right pb-20" dir="rtl">
            {/* هدر */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/courses" className="flex items-center gap-2 text-stone-500 hover:text-sage-600">
                        <ChevronRight size={20} />
                        <span>بازگشت به دوره</span>
                    </Link>
                    <span className="text-sm text-stone-400">
                        {lesson.category?.title} / {lesson.title}
                    </span>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 mt-8">
                {/* عنوان و توضیحات */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-stone-900 dark:text-white mb-3">
                        {lesson.title}
                    </h1>
                    <p className="text-stone-600 dark:text-stone-400 text-lg">
                        {lesson.description}
                    </p>
                </div>

                {/* وضعیت تکمیل درس */}
                {lesson.is_completed && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 flex items-center gap-3">
                        <CheckCircle2 className="text-green-600" size={24} />
                        <span className="text-green-700 dark:text-green-400 font-medium">
                            ✅ شما این درس را قبلاً گذرانده‌اید
                        </span>
                    </div>
                )}

                {/* ویدیو */}
                {lesson.video_url && (
                    <div className="mb-10">
                        <VideoPlayer url={lesson.video_url} type={lesson.video_type || 'local'} />
                    </div>
                )}

                {/* تصویر شاخص */}
                {lesson.featured_image_url && (
                    <div className="mb-10">
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                            <Image
                                src={lesson.featured_image_url}
                                alt={lesson.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                            />
                        </div>
                    </div>
                )}

                {/* پادکست */}
                {lesson.podcast_url && (
                    <div className="mb-10 p-6 bg-stone-50 dark:bg-stone-900/50 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4 text-sage-600">
                            <Mic size={24} />
                            <h3 className="font-bold text-lg">🎙 پادکست این درس</h3>
                        </div>
                        <audio controls className="w-full" src={lesson.podcast_url} />
                    </div>
                )}

                {/* محتوای متنی */}
                {lesson.content_text && (
                    <div className="prose prose-stone dark:prose-invert max-w-none mb-10">
                        <div dangerouslySetInnerHTML={{ __html: lesson.content_text }} />
                    </div>
                )}

                {/* بخش یادداشت‌ها */}
                <div className="mt-10 p-6 bg-sage-50 dark:bg-stone-900/40 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200">
                            📝 یادداشت‌های من
                        </h3>
                        <button
                            onClick={clearNote}
                            className="text-stone-500 hover:text-red-500 transition-colors"
                        >
                            <Trash size={20} />
                        </button>
                    </div>
                    <textarea
                        value={userNote}
                        onChange={(e) => setUserNote(e.target.value)}
                        placeholder="نکات مهم این درس را اینجا بنویسید..."
                        className="w-full h-32 p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 resize-none focus:ring-2 focus:ring-sage-500 transition-all"
                    />
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-sage-600">
                            تعداد کاراکترها: {userNote.length}
                        </p>
                        <div className="flex items-center gap-2 px-4 py-2 bg-sage-600 text-white rounded-xl">
                            <Clock size={18} />
                            <span className="font-mono">{formatTime(watchSeconds)}</span>
                            <span className="text-xs">زمان مطالعه</span>
                        </div>
                    </div>
                </div>

                {/* دکمه اتمام درس */}
                {!lesson.is_completed && (
                    <button
                        onClick={handleComplete}
                        disabled={isSubmitting}
                        className="mt-8 w-full py-4 bg-sage-600 hover:bg-sage-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <CheckCircle2 size={20} />
                                <span>علامت‌گذاری به عنوان تکمیل شده</span>
                            </>
                        )}
                    </button>
                )}
            </main>
        </div>
    );
}
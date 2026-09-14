"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ChevronRight,
    Loader2,
    Lock,
    CheckCircle2,
    Clock,
    Trash,
    Mic,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";

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

const VideoPlayer = ({ url, type }: { url: string; type: string }) => {
    if (!url) return null;

    if (type === "aparat" || url.includes("aparat.com")) {
        let videoId = "";

        if (url.includes("embed/")) {
            videoId = url.split("embed/")[1]?.split("?")[0] || "";
        } else if (url.includes("/v/")) {
            videoId = url.split("/v/")[1]?.split("/")[0] || "";
        } else {
            videoId = url.split("/").pop() || "";
        }

        return (
            <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                <iframe
                    src={`https://www.aparat.com/video/video/embed/videohash/${videoId}/vt/frame`}
                    className="w-full h-full"
                    allowFullScreen
                    title="ویدیوی آپارات"
                />
            </div>
        );
    }

    if (
        type === "youtube" ||
        url.includes("youtube.com") ||
        url.includes("youtu.be")
    ) {
        let videoId = "";

        if (url.includes("youtube.com/watch?v=")) {
            videoId = url.split("v=")[1]?.split("&")[0] || "";
        } else if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
        }

        return (
            <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    className="w-full h-full"
                    allowFullScreen
                    title="ویدیوی یوتیوب"
                />
            </div>
        );
    }

    return (
        <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-black">
            <video
                controls
                controlsList="nodownload"
                disablePictureInPicture
                className="w-full h-full"
            >
                <source src={url} type="video/mp4" />
                مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
            </video>
        </div>
    );
};

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = params.id as string;

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userNote, setUserNote] = useState("");
    const [watchSeconds, setWatchSeconds] = useState(0);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await api.get<Lesson>(
                    `/lessons/${lessonId}`
                );

                setLesson(response.data);
            } catch (err: unknown) {
                const error = err as ApiError;

                if (error.response?.status === 403) {
                    toast.error(
                        "این درس قفل است. ابتدا درس قبلی را کامل کنید."
                    );

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

    useEffect(() => {
        const saved = localStorage.getItem(`lesson-note-${lessonId}`);

        if (saved) {
            setUserNote(saved);
        }
    }, [lessonId]);

    useEffect(() => {
        localStorage.setItem(`lesson-note-${lessonId}`, userNote);
    }, [userNote, lessonId]);

    useEffect(() => {
        const timer = setInterval(() => {
            setWatchSeconds((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    const clearNote = () => {
        setUserNote("");
        localStorage.removeItem(`lesson-note-${lessonId}`);
        toast.success("یادداشت پاک شد");
    };

    const handleComplete = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            await api.post("/progress", {
                lesson_id: lessonId,
                is_completed: true,
            });

            toast.success("درس با موفقیت تکمیل شد!");

            window.dispatchEvent(new Event("progress-updated"));

            setTimeout(() => {
                router.push("/courses");
                router.refresh();
            }, 2000);
        } catch (err: unknown) {
            const error = err as ApiError;

            console.error("Error saving progress:", error);

            toast.error(
                error.response?.data?.message ||
                    "خطا در ثبت پیشرفت"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-stone-950">
                <Loader2
                    className="animate-spin text-sage-600"
                    size={40}
                />
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-stone-500">
                        درس یافت نشد
                    </p>

                    <Link
                        href="/courses"
                        className="text-sage-600 inline-block mt-4"
                    >
                        بازگشت به دوره‌ها
                    </Link>
                </div>
            </div>
        );
    }

    if (lesson.is_locked) {
        return (
            <div
                className="min-h-screen flex items-center justify-center px-4"
                dir="rtl"
            >
                <div className="text-center max-w-md">
                    <Lock
                        size={42}
                        className="mx-auto text-stone-400 mb-4"
                    />

                    <h1 className="text-xl sm:text-2xl font-bold mb-3">
                        این درس قفل است
                    </h1>

                    <p className="text-sm sm:text-base text-stone-500 mb-6 leading-6">
                        برای دسترسی به این درس، ابتدا درس قبلی را کامل کنید.
                    </p>

                    <Link
                        href="/courses"
                        className="text-sage-600 font-bold"
                    >
                        بازگشت به دوره‌ها
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen w-full max-w-full overflow-x-hidden bg-white dark:bg-stone-950 text-right pb-16 sm:pb-20"
            dir="rtl"
        >
            <nav className="sticky top-0 z-50 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-100 dark:border-stone-800">
                <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-4 flex justify-between items-center gap-3">
                    <Link
                        href="/courses"
                        className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-stone-500 hover:text-sage-600 transition-colors shrink-0"
                    >
                        <ChevronRight size={17} />
                        <span>بازگشت به دوره</span>
                    </Link>

                    <span className="text-[10px] sm:text-sm text-stone-400 truncate max-w-[48%]">
                        <span className="hidden sm:inline">
                            {lesson.category?.title} /
                        </span>{" "}
                        {lesson.title}
                    </span>
                </div>
            </nav>

            <main className="w-full max-w-4xl mx-auto px-3 sm:px-6 mt-4 sm:mt-8">
                <div className="mb-5 sm:mb-8">
                    <h1 className="text-[21px] sm:text-3xl font-black text-stone-900 dark:text-white mb-2.5 sm:mb-3 leading-8 sm:leading-tight">
                        {lesson.title}
                    </h1>

                    {lesson.description && (
                        <p className="text-[12px] sm:text-lg text-stone-600 dark:text-stone-400 leading-6 sm:leading-8">
                            {lesson.description}
                        </p>
                    )}
                </div>

                {lesson.is_completed && (
                    <div className="mb-4 sm:mb-6 px-3 py-2.5 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-xl sm:rounded-2xl border border-green-200 dark:border-green-800 flex items-center gap-2.5 sm:gap-3">
                        <CheckCircle2
                            className="text-green-600 shrink-0"
                            size={19}
                        />

                        <span className="text-[11px] sm:text-sm text-green-700 dark:text-green-400 font-medium">
                            شما این درس را قبلاً گذرانده‌اید
                        </span>
                    </div>
                )}

                {/* تصویر درس */}
                {lesson.featured_image_url && (
                    <div className="mb-5 sm:mb-10">
                        <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
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

                {/* ویدیوی درس */}
                {lesson.video_url && (
                    <div className="mb-5 sm:mb-10">
                        <VideoPlayer
                            url={lesson.video_url}
                            type={lesson.video_type || "local"}
                        />
                    </div>
                )}

                {/* پادکست درس */}
                {lesson.podcast_url && (
                    <div className="mb-5 sm:mb-10 p-3 sm:p-6 bg-stone-50 dark:bg-stone-900/50 rounded-xl sm:rounded-2xl">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2.5 sm:mb-4 text-sage-600">
                            <Mic size={19} />

                            <h2 className="font-bold text-sm sm:text-lg">
                                پادکست این درس
                            </h2>
                        </div>

                        <audio
                            controls
                            controlsList="nodownload"
                            className="w-full h-9 sm:h-auto"
                            src={lesson.podcast_url}
                        />
                    </div>
                )}

                {/* محتوای متنی درس */}
                {lesson.content_text && (
                    <section className="prose prose-stone dark:prose-invert max-w-none mb-6 sm:mb-10 text-[13px] sm:text-base leading-7 sm:leading-8">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: lesson.content_text,
                            }}
                        />
                    </section>
                )}

                {/* یادداشت‌ها */}
                <section className="mt-6 sm:mt-10 p-3 sm:p-6 bg-sage-50 dark:bg-stone-900/40 rounded-xl sm:rounded-2xl">
                    <div className="flex justify-between items-center mb-2.5 sm:mb-4 gap-3">
                        <h2 className="text-sm sm:text-lg font-bold text-stone-800 dark:text-stone-200">
                            📝 یادداشت‌های من
                        </h2>

                        <button
                            type="button"
                            onClick={clearNote}
                            className="text-stone-500 hover:text-red-500 transition-colors p-1"
                            aria-label="پاک کردن یادداشت"
                        >
                            <Trash size={17} />
                        </button>
                    </div>

                    <textarea
                        value={userNote}
                        onChange={(e) => setUserNote(e.target.value)}
                        placeholder="نکات مهم این درس را اینجا بنویسید..."
                        className="w-full h-28 sm:h-32 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 resize-none focus:ring-2 focus:ring-sage-500 transition-colors text-[11px] sm:text-sm"
                    />

                    <div className="flex justify-between items-center mt-2.5 sm:mt-4 gap-3">
                        <p className="text-[10px] sm:text-sm text-sage-600">
                            تعداد کاراکترها: {userNote.length}
                        </p>

                        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-sage-600 text-white rounded-lg sm:rounded-xl">
                            <Clock size={15} />

                            <span className="font-mono text-xs sm:text-sm">
                                {formatTime(watchSeconds)}
                            </span>

                            <span className="text-[9px] sm:text-xs">
                                زمان مطالعه
                            </span>
                        </div>
                    </div>
                </section>

                {!lesson.is_completed && (
                    <button
                        type="button"
                        onClick={handleComplete}
                        disabled={isSubmitting}
                        className="mt-5 sm:mt-8 w-full min-h-11 sm:py-4 bg-sage-600 hover:bg-sage-700 text-white rounded-xl sm:rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Loader2
                                className="animate-spin"
                                size={19}
                            />
                        ) : (
                            <>
                                <CheckCircle2 size={19} />

                                <span className="text-xs sm:text-base">
                                    علامت‌گذاری به عنوان تکمیل شده
                                </span>
                            </>
                        )}
                    </button>
                )}

                <div className="h-4 sm:h-0" />
            </main>
        </div>
    );
}
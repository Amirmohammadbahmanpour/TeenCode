"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Award, Star, Share2, Download, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/axios";

interface ExamResult {
    id: string;
    score: number;
    is_passed: boolean;
    exam_type: string;
    created_at: string;
}

export default function PosttestResultPage() {
    const router = useRouter();
    const [result, setResult] = useState<ExamResult | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await api.get('/user-exams/latest?exam_type=posttest');
                setResult(response.data);
            } catch (error) {
                console.error("Error fetching result:", error);
                toast.error("خطا در دریافت نتیجه آزمون");
                router.push("/dashboard");
            } finally {
                setLoading(false);
            }
        };
        
        fetchResult();
    }, [router]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'تین کد - نتیجه آزمون نهایی',
                text: `من با موفقیت دوره تحول رو با نمره ${result?.score} به پایان رساندم!`,
                url: window.location.href,
            }).catch(() => console.log("Share cancelled"));
        } else {
            toast.success("لینک صفحه کپی شد");
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sage-50 to-white dark:from-stone-900 dark:to-stone-950">
                <Loader2 className="animate-spin text-sage-600" size={48} />
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sage-50 to-white dark:from-stone-900 dark:to-stone-950">
                <div className="text-center">
                    <p className="text-stone-500">نتیجه‌ای یافت نشد</p>
                    <Link href="/courses" className="text-sage-600 mt-4 inline-block">
                        بازگشت به دوره‌ها
                    </Link>
                </div>
            </div>
        );
    }

    const isPassed = result.is_passed && result.score >= 60;
    const formattedDate = new Date(result.created_at).toLocaleDateString("fa-IR");

    return (
        <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white dark:from-stone-900 dark:to-stone-950 py-20 px-4" dir="rtl">
            <div className="max-w-2xl mx-auto">
                
                {/* کارت نتیجه */}
                <div className="bg-white dark:bg-stone-900 rounded-[3rem] shadow-2xl overflow-hidden">
                    
                    {/* هدر با رنگ موفقیت/عدم موفقیت */}
                    <div className={`p-8 text-center ${isPassed ? 'bg-sage-600' : 'bg-amber-500'}`}>
                        <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                            {isPassed ? (
                                <Trophy size={48} className="text-sage-600" />
                            ) : (
                                <Award size={48} className="text-amber-500" />
                            )}
                        </div>
                        <h1 className="text-2xl font-black text-white">
                            {isPassed ? "تبریک! 🎉" : "درود بر تلاشت 💪"}
                        </h1>
                        <p className="text-sage-100 mt-2">
                            {isPassed 
                                ? "شما با موفقیت دوره را به پایان رساندید" 
                                : "می‌توانید دوباره تلاش کنید"}
                        </p>
                    </div>

                    {/* جزئیات نمره */}
                    <div className="p-8 text-center border-b border-stone-100 dark:border-stone-800">
                        <div className="inline-flex items-baseline gap-2">
                            <span className={`text-6xl font-black ${isPassed ? 'text-sage-600' : 'text-amber-500'}`}>
                                {result.score}
                            </span>
                            <span className="text-xl text-stone-400">از ۱۰۰</span>
                        </div>
                        
                        <div className="mt-4 flex justify-center gap-6 text-sm">
                            <div className="text-center">
                                <p className="text-stone-400">تاریخ آزمون</p>
                                <p className="text-base font-bold text-stone-800 dark:text-white">
                                    {formattedDate}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-stone-400">وضعیت</p>
                                <p className={`text-base font-bold ${isPassed ? 'text-sage-600' : 'text-amber-500'}`}>
                                    {isPassed ? "قبول ✅" : "نیازمند تلاش مجدد"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* پیام تشویقی */}
                    <div className="p-6 bg-sage-50 dark:bg-sage-900/20 text-center">
                        <Star className="inline text-sage-500 mb-2" size={24} />
                        <p className="text-stone-600 dark:text-stone-400">
                            {result.score >= 90 && "🌟 عالی! شما یک قهرمان واقعی هستید"}
                            {result.score >= 75 && result.score < 90 && "📚 بسیار خوب! تلاش شما ستودنی است"}
                            {result.score >= 60 && result.score < 75 && "💪 خوب! می‌توانید با مرور دوباره عالی شوید"}
                            {result.score < 60 && "🌱 نگران نباشید! هر شروع سختی دارد. دوباره تلاش کنید"}
                        </p>
                    </div>

                    {/* دکمه‌های اقدام */}
                    <div className="p-8 space-y-3">
                        <div className="flex gap-3">
                            <Link
                                href="/dashboard"
                                className="flex-1 text-center p-4 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-2xl font-bold hover:bg-stone-200 transition-all"
                            >
                                رفتن به داشبورد
                            </Link>
                            
                            {isPassed && (
                                <button
                                    onClick={handleShare}
                                    className="p-4 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-2xl hover:bg-stone-200 transition-all"
                                >
                                    <Share2 size={20} />
                                </button>
                            )}
                        </div>
                        
                        {!isPassed && (
                            <Link
                                href="/quiz/posttest"
                                className="block text-center p-4 border-2 border-sage-600 text-sage-600 rounded-2xl font-bold hover:bg-sage-50 transition-all"
                            >
                                تلاش مجدد
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
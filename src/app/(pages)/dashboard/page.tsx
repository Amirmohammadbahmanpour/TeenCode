"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit2, Bookmark,Sparkles , Heart, FileText, MessageSquare, Lightbulb, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// تعریف دقیق ساختار داده‌ها برای حذف any
interface UserProfile {
    name: string | null;
    age: number | null;
    avatar: string;
}

interface ToolItem {
    id: number;
    title: string;
    icon: React.ReactNode;
    count: number;
}

export default function Dashboard() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const progressPercent: number = 65;

    const tools: ToolItem[] = [
        { id: 1, title: "ذخیره شده‌ها", icon: <Bookmark size={22} />, count: 12 },
        { id: 2, title: "لایک شده‌ها", icon: <Heart size={22} />, count: 5 },
        { id: 3, title: "یادداشت‌ها", icon: <FileText size={22} />, count: 8 },
        { id: 4, title: "پیام‌ها", icon: <MessageSquare size={22} />, count: 2 },
    ];

    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: dbProfile } = await supabase
                    .from('profiles')
                    .select('full_name, age')
                    .eq('id', user.id)
                    .single();

                setProfile({
                    name: dbProfile?.full_name || null,
                    age: dbProfile?.age || null,
                    avatar: user.user_metadata?.avatar_url || "/tem-img.png",
                });
            }
            setLoading(false);
        }
        fetchProfile();
    }, []);

    if (loading) return (
        <div className="h-screen flex justify-center items-center bg-white dark:bg-stone-950 text-sage-600">
            <Loader2 className="animate-spin" size={40} />
        </div>
    );

    // شرط تکمیل پروفایل (فقط نام و سن)
    const isProfileIncomplete = !profile?.name || !profile?.age;

    return (
        <section className="h-full w-full overflow-hidden bg-white dark:bg-stone-950 text-right flex flex-col p-4 md:p-8" dir="rtl">
            <div className="max-w-4xl mx-auto w-full flex flex-col h-full">

                {/* ۱. اعلان (نسخه باریک و مدرن برای موبایل) */}
                {/* ۱. اعلان هوشمند (طراحی جدید و مدرن) */}
                {isProfileIncomplete && (
                    <div className="mb-6 relative overflow-hidden group">
                        {/* پس‌زمینه اصلی با گرادینت ملایم و شیشه‌ای */}
                        <div className="p-4 sm:p-5 bg-gradient-to-r from-sage-50 to-stone-50 dark:from-stone-900 dark:to-stone-800 border border-sage-100 dark:border-sage-900/50 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm transition-all hover:shadow-md">

                            {/* افکت نوری گوشه کارت */}
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-sage-200/30 dark:bg-sage-500/10 blur-2xl rounded-full" />

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-stone-800 rounded-2xl shadow-sm text-sage-600">
                                    <Sparkles size={24} className="animate-pulse" />
                                </div>
                                <div className="text-center sm:text-right">
                                    <h3 className="text-sm font-black text-stone-800 dark:text-stone-100">مسیر شما هنوز کامل نیست!</h3>
                                    <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 font-medium">با تکمیل پروفایل، محتوای اختصاصی خود را آزاد کنید.</p>
                                </div>
                            </div>

                            <Link
                                href="/complete-profile"
                                className="relative z-10 w-full sm:w-auto px-6 py-2.5 bg-sage-600 hover:bg-sage-700 text-white text-[11px] font-bold rounded-xl shadow-lg shadow-sage-600/20 transition-all active:scale-95 text-center"
                            >
                                تکمیل اطلاعات
                            </Link>
                        </div>
                    </div>
                )}

                {/* ۲. کارت پروفایل (استایل فشرده و شیک موبایلی) */}
                <div className="shrink-0 bg-stone-50 dark:bg-stone-900 rounded-[2rem] border border-stone-100 dark:border-stone-800/50 shadow-sm transition-colors">
                    <div className="flex items-center gap-4 p-4 sm:p-6">
                        <div className="relative shrink-0">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                                <Image
                                    src={profile?.avatar || "/tem-img.png"}
                                    fill
                                    className="rounded-full object-cover border-2 border-white dark:border-stone-800"
                                    alt="profile"
                                />
                            </div>
                            <Link href="/complete-profile" className="absolute -bottom-1 -right-1 bg-white dark:bg-stone-800 p-1.5 rounded-full shadow-md border border-stone-100 dark:border-stone-700 active:scale-90 transition-transform">
                                <Edit2 size={12} className="text-sage-600" />
                            </Link>
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 truncate">
                                {profile?.name || "کاربر جدید"}
                            </h1>
                            <p className="text-[10px] text-sage-600 font-bold bg-sage-50 dark:bg-sage-900/30 px-2 py-0.5 rounded-md inline-block mt-1">
                                سطح مقدماتی
                            </p>
                        </div>
                    </div>

                    {/* بخش رشد (متصل به پایین کارت) */}
                    <div className="px-5 pb-5 pt-2 border-t border-stone-200/50 dark:border-stone-800/50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-bold text-stone-400">میزان رشد شما</span>
                            <span className="text-[9px] font-black text-sage-600">{progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-sage-600 rounded-full transition-all duration-1000"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* ۳. گرید ابزارها (فیت شده در فضای باقی‌مانده) */}
                <div className="flex-1 mt-4 sm:mt-6 overflow-hidden">
                    <div className="grid grid-cols-2 gap-3 h-full pb-4 content-start">
                        {tools.map((item) => (
                            <div
                                key={item.id}
                                className="p-4 sm:p-6 rounded-[2rem] bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800/50 flex flex-col items-center justify-center text-center active:bg-stone-100 dark:active:bg-stone-800 active:scale-95 transition-all cursor-pointer"
                            >
                                <div className="mb-2 sm:mb-3 text-sage-600">
                                    {item.icon}
                                </div>
                                <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200">{item.title}</h4>
                                <p className="text-[9px] text-stone-400 mt-1">{item.count} مورد</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
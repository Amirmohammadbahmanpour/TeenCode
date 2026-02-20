"use client"
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import AlreadyLoggedIn from "@/components/AlreadyLoggedIn";
import { User, Mail, Lock, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [isUser, setIsUser] = useState(false);
    const router = useRouter();

    // بررسی وضعیت کاربر در بدو ورود
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setIsUser(true);
            }
            setCheckingAuth(false);
        };
        checkUser();
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        });

        if (error) {
            alert("خطا در ثبت‌نام: " + error.message);
        } else {
            alert("ثبت‌نام موفقیت‌آمیز بود! حالا پروفایل خود را تکمیل کنید.");
            router.push("/complete-profile");
        }
        setLoading(false);
    };

    if (checkingAuth) return null;

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-stone-50 dark:bg-stone-950 font-sans" dir="rtl">
            {isUser ? (
                // اگر کاربر لاگین بود
                <div className="flex-1 flex items-center justify-center p-6">
                    <AlreadyLoggedIn />
                </div>
            ) : (
                <>
                    {/* بخش بنر کناری (هماهنگ با لاگین) */}
                    <div className="hidden md:flex md:w-1/2 bg-sage-600 dark:bg-stone-900 items-center justify-center p-12 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
                        </div>
                        <div className="relative z-10 text-white max-w-md text-right">
                            <h1 className="text-4xl font-black mb-6 leading-tight">شروع تحول</h1>
                            <p className="text-sage-100 text-lg leading-relaxed">
                                به جمع مادران آگاه خوش آمدید. با عضویت در سایت، مسیر اختصاصی رشد خود و فرزندتان را آغاز کنید.
                            </p>
                        </div>
                    </div>

                    {/* بخش فرم ثبت نام */}
                    <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                        <div className="w-full max-w-md space-y-8">
                            <div className="text-right">
                                <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 italic">تین کد</h2>
                                <h2 className="text-xl font-bold text-stone-700 dark:text-stone-300 mt-2">عضویت جدید</h2>
                                <p className="text-stone-500 mt-1">اطلاعات خود را برای ساخت حساب وارد کنید</p>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-4">
                                {/* نام خانوادگی */}
                                <div className="relative">
                                    <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                                        <User size={20} />
                                    </span>
                                    <input
                                        type="text" required placeholder="نام و نام خانوادگی"
                                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right focus:ring-2 focus:ring-sage-500 outline-none transition-all dark:text-white"
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>

                                {/* ایمیل */}
                                <div className="relative">
                                    <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                                        <Mail size={20} />
                                    </span>
                                    <input
                                        type="email" required placeholder="ایمیل"
                                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right focus:ring-2 focus:ring-sage-500 outline-none transition-all dark:text-white"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                {/* رمز عبور */}
                                <div className="relative">
                                    <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                                        <Lock size={20} />
                                    </span>
                                    <input
                                        type="password" required placeholder="رمز عبور (حداقل ۶ کاراکتر)"
                                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right focus:ring-2 focus:ring-sage-500 outline-none transition-all dark:text-white"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <button 
                                    disabled={loading} 
                                    className="w-full bg-sage-600 hover:bg-sage-700 text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-sage-100 dark:shadow-none"
                                >
                                    {loading ? "در حال ثبت‌نام..." : "تأیید و شروع تحول"} 
                                    {!loading && <ArrowLeft size={20} />}
                                </button>
                            </form>

                            <div className="text-center pt-2">
                                <p className="text-stone-500 text-sm mb-4">
                                    قبلاً عضو شده‌اید؟ {" "}
                                    <Link href="/login" className="text-sage-600 font-bold hover:underline">وارد شوید</Link>
                                </p>
                                <Link href="/" className="text-stone-400 hover:text-sage-600 text-sm flex items-center justify-center gap-1 transition-colors">
                                    بازگشت به صفحه اصلی <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
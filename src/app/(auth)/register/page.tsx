"use client"
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import AlreadyLoggedIn from "@/components/AlreadyLoggedIn";
import { User, Mail, Lock, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast"; // ۱. ایمپورت کردن توست

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [isUser, setIsUser] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setIsUser(true);
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
                data: { full_name: fullName }
            }
        });

        if (error) {
            // ۲. نمایش پیام خطا به رنگ قرمز
            toast.error("خطا در ثبت‌نام: " + error.message, {
                style: { borderRadius: '15px', background: '#333', color: '#fff' }
            });
        } else {
            // ۳. نمایش پیام موفقیت به رنگ سبز
            toast.success("ثبت‌نام موفقیت‌آمیز بود! خوش آمدید ❤️");
            
            // یک وقفه کوتاه برای اینکه کاربر پیام را ببیند و سپس انتقال
            setTimeout(() => {
                router.push("/complete-profile");
            }, 1500);
        }
        setLoading(false);
    };

    if (checkingAuth) return null;

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-stone-50 dark:bg-stone-950 font-sans" dir="rtl">
            {isUser ? (
                <div className="flex-1 flex items-center justify-center p-6">
                    <AlreadyLoggedIn />
                </div>
            ) : (
                <>
                    {/* بخش بنر کناری */}
                    <div className="hidden md:flex md:w-1/2 bg-sage-600 dark:bg-stone-900 items-center justify-center p-12 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
                        </div>
                        <div className="relative z-10 text-white max-w-md text-right">
                            <h1 className="text-4xl font-bold mb-6 leading-tight">شروع تحول</h1>
                            <p className="text-sage-100 text-lg leading-relaxed italic">
                                به جمع مادران آگاه خوش آمدید. با عضویت در سایت، مسیر اختصاصی رشد خود و فرزندتان را آغاز کنید.
                            </p>
                        </div>
                    </div>

                    {/* بخش فرم ثبت نام */}
                    <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                        <div className="w-full max-w-md space-y-8">
                            <div className="text-right">
                                <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 tracking-tighter">تین کد</h2>
                                <h2 className="text-xl font-bold text-stone-700 dark:text-stone-300 mt-2">عضویت جدید</h2>
                                <p className="text-stone-500 mt-1">اطلاعات خود را برای ساخت حساب وارد کنید</p>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="relative">
                                    <span className="absolute inset-y-0 right-4 flex items-center text-stone-400 border-l border-stone-100 pl-3 ml-3">
                                        <User size={18} />
                                    </span>
                                    <input
                                        type="text" required placeholder="نام و نام خانوادگی"
                                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-14 pl-4 text-right focus:ring-4 focus:ring-sage-500/5 outline-none transition-all dark:text-white font-medium"
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>

                                <div className="relative">
                                    <span className="absolute inset-y-0 right-4 flex items-center text-stone-400 border-l border-stone-100 pl-3 ml-3">
                                        <Mail size={18} />
                                    </span>
                                    <input
                                        type="email" required placeholder="ایمیل"
                                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-14 pl-4 text-right focus:ring-4 focus:ring-sage-500/5 outline-none transition-all dark:text-white font-medium"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="relative">
                                    <span className="absolute inset-y-0 right-4 flex items-center text-stone-400 border-l border-stone-100 pl-3 ml-3">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type="password" required placeholder="رمز عبور (حداقل ۶ کاراکتر)"
                                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-14 pl-4 text-right focus:ring-4 focus:ring-sage-500/5 outline-none transition-all dark:text-white font-medium"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <button 
                                    disabled={loading} 
                                    className="w-full bg-sage-600 hover:bg-sage-700 active:scale-95 text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-sage-600/20 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            در حال ثبت‌نام...
                                        </span>
                                    ) : (
                                        <>تأیید و شروع تحول <ArrowLeft size={20} /></>
                                    )}
                                </button>
                            </form>

                            <div className="text-center pt-2">
                                <p className="text-stone-500 text-sm mb-4">
                                    قبلاً عضو شده‌اید؟ {" "}
                                    <Link href="/login" className="text-sage-600 font-bold hover:text-sage-700 transition-colors">وارد شوید</Link>
                                </p>
                                <Link href="/" className="text-stone-400 hover:text-stone-600 text-xs font-bold flex items-center justify-center gap-1 transition-colors">
                                    بازگشت به صفحه اصلی <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
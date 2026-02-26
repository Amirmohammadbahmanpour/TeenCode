"use client"
import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Lock, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import AlreadyLoggedIn from "@/components/AlreadyLoggedIn";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // برای دکمه فرم
    const [checkingAuth, setCheckingAuth] = useState(true); // برای لودینگ اولیه صفحه
    const [isUser, setIsUser] = useState(false);
    const router = useRouter();

    // ۱. بررسی وضعیت لاگین به محض لود شدن صفحه
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

    // ۲. منطق هوشمند ورود و ثبت‌نام همزمان
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // تلاش برای ورود
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (!signInError) {
            router.push("/complete-profile");
            return;
        }

        // اگر کاربر وجود نداشت، ثبت‌نام کن
        if (signInError.message.includes("Invalid login credentials")) {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signUpError) {
                alert("خطا: " + signUpError.message);
            } else {
                alert("حساب کاربری جدید ساخته شد.");
                router.push("/complete-profile");
            }
        } else {
            alert("خطا در ورود: " + signInError.message);
        }
        setLoading(false);
    };

    // اگر در حال چک کردن وضعیت کاربریم، چیزی نشان نده (یا اسپینر بگذار)
    if (checkingAuth) return null;

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-stone-950 font-sans" dir="rtl">
            {isUser ? (
                // اگر کاربر لاگین بود، فقط کادر پیام را نشان بده
                <div className="flex-1 flex items-center justify-center p-6">
                    <AlreadyLoggedIn />
                </div>
            ) : (
                // اگر لاگین نبود، فرم را نشان بده
                <>
                    {/* بخش سمت چپ - بنر */}
                    <div className="hidden md:flex md:w-1/2 bg-sage-600 dark:bg-stone-900 items-center justify-center p-12 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
                        </div>
                        <div className="relative z-10 text-white max-w-md text-right">
                            <h1 className="text-4xl font-black mb-6 leading-tight">خوش آمدید</h1>
                            <p className="text-sage-100 text-lg leading-relaxed">
                                برای دسترسی به پنل و مسیر تحول اختصاصی خود، وارد شوید یا حساب جدید بسازید.
                            </p>
                        </div>
                    </div>

                    {/* بخش سمت راست - فرم */}
                    <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                        <div className="w-full max-w-md space-y-8">
                            <div className="text-right">
                                <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 italic">تین کد</h2>
                                <h2 className="text-xl font-bold text-stone-700 dark:text-stone-300 mt-2">ورود / ثبت‌نام</h2>
                                <p className="text-stone-500 mt-1">ایمیل و رمز عبور خود را وارد کنید</p>
                            </div>

                            <form onSubmit={handleAuth} className="space-y-4">
                                <div className="relative">
                                    <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                                        <Mail size={20} />
                                    </span>
                                    <input
                                        type="email" required placeholder="ایمیل"
                                        className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right focus:ring-2 focus:ring-sage-500 outline-none transition-all dark:text-white"
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="relative">
                                    <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                                        <Lock size={20} />
                                    </span>
                                    <input
                                        type="password" required placeholder="رمز عبور"
                                        className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right focus:ring-2 focus:ring-sage-500 outline-none transition-all dark:text-white"
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button 
                                    disabled={loading} 
                                    className="w-full bg-sage-600 hover:bg-sage-700 text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-sage-200/50 dark:shadow-none"
                                >
                                    {loading ? "در حال بررسی..." : "ورود یا ثبت‌نام"} 
                                    {!loading && <ArrowLeft size={20} />}
                                </button>
                            </form>

                            <div className="text-center pt-4">
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
"use client"
import { useState , useEffect } from "react";
import { ArrowLeft, Mail, Lock, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // ۱. ابتدا تلاش برای ورود (Login)
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (!signInError) {
            // ورود موفقیت‌آمیز بود -> انتقال به صفحه تکمیل مشخصات
            router.push("/complete-profile");
            return;
        }

        // ۲. اگر یوزر پیدا نشد، تلاش برای ثبت‌نام (Sign Up)
        if (signInError.message.includes("Invalid login credentials")) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signUpError) {
                alert("خطا در ثبت‌نام: " + signUpError.message);
            } else {
                // ثبت‌نام موفق بود
                alert("حساب کاربری ساخته شد.");
                router.push("/complete-profile");
            }
        } else {
            // اگر رمز اشتباه بود یا خطای دیگری وجود داشت
            alert("خطا در ورود: " + signInError.message);
        }
        setLoading(false);
    };
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push("/dashboard"); // اگر لاگین بود، بفرستش داشبورد
            }
        };
        checkUser();
    }, []);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-stone-950 font-[vazir]" dir="rtl">
            <div className="hidden md:flex md:w-1/2 bg-sage-600 dark:bg-stone-900 items-center justify-center p-12 relative overflow-hidden">
                <div className="relative z-10 text-white max-w-md text-right">
                    <h1 className="text-4xl font-black mb-6 leading-tight">خوش آمدید</h1>
                    <p className="text-sage-100 text-lg leading-relaxed">برای دسترسی به پنل و آزمون‌ها، وارد حساب خود شوید یا حساب جدید بسازید.</p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100">ورود / ثبت‌نام</h2>
                        <p className="text-stone-500 mt-2">ایمیل و رمز عبور خود را وارد کنید</p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="relative">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Mail size={20} /></span>
                            <input 
                                type="email" required placeholder="ایمیل"
                                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right focus:ring-2 focus:ring-sage-500 outline-none transition-all"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Lock size={20} /></span>
                            <input 
                                type="password" required placeholder="رمز عبور"
                                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right focus:ring-2 focus:ring-sage-500 outline-none transition-all"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button disabled={loading} className="w-full bg-sage-600 hover:bg-sage-700 text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                            {loading ? "در حال بررسی..." : "ورود یا ثبت‌نام"} <ArrowLeft size={20} />
                        </button>
                    </form>

                    <div className="text-center pt-4">
                        <Link href="/" className="text-stone-400 hover:text-sage-600 text-sm flex items-center justify-center gap-1">
                            بازگشت به صفحه اصلی <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
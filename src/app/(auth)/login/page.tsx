"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Smartphone, Lock, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AlreadyLoggedIn from "@/components/AlreadyLoggedIn";
import Link from "next/link";
import api from "@/lib/axios";
import { auth } from "@/lib/auth";

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [isUser, setIsUser] = useState(false);
    const router = useRouter();

    // بررسی وضعیت لاگین
    useEffect(() => {
        const checkUser = async () => {
            const token = auth.getToken();
            if (token) {
                try {
                    const response = await api.get('/user');
                    if (response.data) {
                        setIsUser(true);
                    }
                } catch (error) {
                    auth.logout();
                }
            }
            setCheckingAuth(false);
        };
        checkUser();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phone || phone.length !== 11 || !phone.startsWith("09")) {
            toast.error("شماره موبایل نامعتبر است");
            return;
        }

        if (!password || password.length < 6) {
            toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/login", { phone, password });
            auth.setToken(response.data.token);
            auth.setUser(response.data.user);
            
            toast.success("خوش آمدید!");
            
            // بررسی آیا پروفایل کامل است
            if (!response.data.profile?.full_name) {
                router.push("/complete-profile");
            } else {
                router.push("/dashboard");
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                toast.error("شماره یا رمز عبور اشتباه است");
            } else {
                toast.error("خطا در ارتباط با سرور");
            }
        } finally {
            setLoading(false);
        }
    };

    if (checkingAuth) return null;

    if (isUser) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <AlreadyLoggedIn />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-stone-950 font-sans" dir="rtl">
            {/* بخش بنر */}
            <div className="hidden md:flex md:w-1/2 bg-sage-600 dark:bg-stone-900 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 text-white max-w-md text-right">
                    <h1 className="text-4xl font-black mb-6 leading-tight">خوش آمدید</h1>
                    <p className="text-sage-100 text-lg leading-relaxed">
                        برای دسترسی به پنل و مسیر تحول اختصاصی خود، وارد شوید.
                    </p>
                </div>
            </div>

            {/* بخش فرم */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 italic">نوجوانه</h2>
                        <h2 className="text-xl font-bold text-stone-700 dark:text-stone-300 mt-2">ورود</h2>
                        <p className="text-stone-500 mt-1">شماره موبایل و رمز عبور خود را وارد کنید</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                                <Smartphone size={20} />
                            </span>
                            <input
                                type="tel"
                                required
                                placeholder="شماره موبایل"
                                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right focus:ring-2 focus:ring-sage-500 outline-none transition-all dark:text-white"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                dir="ltr"
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                                <Lock size={20} />
                            </span>
                            <input
                                type="password"
                                required
                                placeholder="رمز عبور"
                                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right focus:ring-2 focus:ring-sage-500 outline-none transition-all dark:text-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="text-left">
                            <Link href="/forget-password" className="text-sm text-sage-600 hover:underline">
                رمز عبور خود را فراموش کرده‌اید؟
                            </Link>
                        </div>
                        <button
                            disabled={loading}
                            className="w-full bg-sage-600 hover:bg-sage-700 text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-sage-200/50 dark:shadow-none"
                        >
                            {loading ? "در حال بررسی..." : "ورود"}
                            {!loading && <ArrowLeft size={20} />}
                        </button>
                    </form>

                    <div className="text-center pt-2">
                        <p className="text-stone-500 text-sm">
                            حساب کاربری ندارید؟{" "}
                            <Link href="/register" className="text-sage-600 font-bold hover:text-sage-700 transition-colors">
                                ثبت نام کنید
                            </Link>
                        </p>
                        <Link href="/" className="text-stone-400 hover:text-sage-600 text-sm flex items-center justify-center gap-1 mt-4 transition-colors">
                            بازگشت به صفحه اصلی <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
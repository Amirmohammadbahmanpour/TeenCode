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

    useEffect(() => {
        const checkUser = async () => {
            const token = auth.getToken();

            if (token) {
                try {
                    const response = await api.get("/user");

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
            const response = await api.post("/login", {
                phone,
                password,
            });

            auth.setToken(response.data.token);
            auth.setUser(response.data.user);

            toast.success("خوش آمدید!");

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

    if (checkingAuth) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-white dark:bg-stone-950"
                dir="rtl"
            >
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-sage-600 dark:border-stone-700 dark:border-t-sage-400" />
            </div>
        );
    }

    if (isUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-4 dark:bg-stone-950 sm:p-6">
                <AlreadyLoggedIn />
            </div>
        );
    }

    return (
        <div
            className="min-h-screen w-full bg-white font-sans dark:bg-stone-950"
            dir="rtl"
        >
            <div className="min-h-screen flex flex-col md:flex-row">
                {/* بخش بنر */}
                <div className="relative hidden overflow-hidden bg-sage-600 p-10 md:flex md:w-1/2 md:items-center md:justify-center md:p-12 dark:bg-stone-900 lg:p-16">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-white blur-3xl" />
                        <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-white blur-3xl" />
                    </div>

                    <div className="relative z-10 w-full max-w-md text-right text-white">
                        <h1 className="mb-5 text-3xl font-black leading-tight lg:text-4xl">
                            خوش آمدید
                        </h1>

                        <p className="text-base leading-8 text-sage-100 lg:text-lg">
                            برای دسترسی به پنل و مسیر تحول اختصاصی خود، وارد شوید.
                        </p>
                    </div>
                </div>

                {/* بخش فرم */}
                <div className="flex min-h-screen flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:min-h-0 md:p-10 lg:p-12">
                    <div className="w-full max-w-md space-y-6 sm:space-y-8">
                        <div className="text-right">
                            <h2 className="text-2xl font-bold italic text-stone-800 sm:text-3xl dark:text-stone-100">
                                نوجوانه
                            </h2>

                            <h2 className="mt-1.5 text-lg font-bold text-stone-700 sm:mt-2 sm:text-xl dark:text-stone-300">
                                ورود
                            </h2>

                            <p className="mt-1.5 text-xs leading-6 text-stone-500 sm:text-sm">
                                شماره موبایل و رمز عبور خود را وارد کنید
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-3.5 sm:space-y-4">
                            {/* شماره موبایل */}
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-stone-400">
                                    <Smartphone size={19} />
                                </span>

                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    required
                                    maxLength={11}
                                    placeholder="شماره موبایل"
                                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-4 pr-12 text-sm text-stone-800 outline-none transition-all focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 sm:rounded-2xl sm:py-4 sm:text-base dark:border-stone-800 dark:bg-stone-900 dark:text-white"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target.value.replace(/\D/g, "")
                                        )
                                    }
                                    dir="ltr"
                                />
                            </div>

                            {/* رمز عبور */}
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-stone-400">
                                    <Lock size={19} />
                                </span>

                                <input
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="رمز عبور"
                                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-4 pr-12 text-sm text-stone-800 outline-none transition-all focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 sm:rounded-2xl sm:py-4 sm:text-base dark:border-stone-800 dark:bg-stone-900 dark:text-white"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>

                            {/* فراموشی رمز */}
                            <div className="text-left">
                                <Link
                                    href="/forget-password"
                                    className="text-xs text-sage-600 hover:underline sm:text-sm"
                                >
                                    رمز عبور خود را فراموش کرده‌اید؟
                                </Link>
                            </div>

                            {/* ورود */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-sage-200/40 transition-all hover:bg-sage-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:py-4 sm:text-lg dark:shadow-none"
                            >
                                {loading ? "در حال بررسی..." : "ورود"}

                                {!loading && <ArrowLeft size={19} />}
                            </button>
                        </form>

                        <div className="pt-1 text-center">
                            <p className="text-xs text-stone-500 sm:text-sm">
                                حساب کاربری ندارید؟{" "}
                                <Link
                                    href="/register"
                                    className="font-bold text-sage-600 transition-colors hover:text-sage-700"
                                >
                                    ثبت نام کنید
                                </Link>
                            </p>

                            <Link
                                href="/"
                                className="mt-3 flex items-center justify-center gap-1 text-xs text-stone-400 transition-colors hover:text-sage-600 sm:mt-4 sm:text-sm"
                            >
                                بازگشت به صفحه اصلی
                                <ChevronRight size={15} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

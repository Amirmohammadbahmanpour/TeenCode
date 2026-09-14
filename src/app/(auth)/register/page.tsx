"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AlreadyLoggedIn from "@/components/AlreadyLoggedIn";
import { Smartphone, Lock, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { auth } from "@/lib/auth";
import api from "@/lib/axios";

export default function RegisterPage() {
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState<"phone" | "code">("phone");
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [isUser, setIsUser] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [phoneError, setPhoneError] = useState("");
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

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();

        if (phone.length !== 11 || !phone.startsWith("09")) {
            setPhoneError("شماره موبایل باید 11 رقم و با 09 شروع شود");
            return;
        }

        setPhoneError("");
        setLoading(true);

        try {
            await api.post("/send-otp", { phone });

            toast.success("کد تایید ارسال شد");
            setStep("code");
            setCountdown(60);
        } catch (error: any) {
            console.error(error);

            if (
                error.response?.status === 422 &&
                error.response?.data?.message?.includes("قبلاً ثبت‌نام کرده")
            ) {
                toast.error("این شماره قبلاً ثبت‌نام کرده است. لطفاً وارد شوید");

                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                toast.error("خطا در ارسال کد");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();

        if (code.length !== 6) {
            toast.error("کد باید 6 رقم باشد");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/register-otp", {
                phone,
                code,
            });

            auth.setToken(response.data.token);
            auth.setUser(response.data.user);

            toast.success(
                "شماره شما تأیید شد! لطفاً اطلاعات خود را کامل کنید"
            );

            router.push("/complete-profile");
        } catch (error: any) {
            console.error("Verify error:", error);

            if (error.response?.status === 422) {
                toast.error(
                    error.response?.data?.message || "کد نامعتبر است"
                );
            } else {
                toast.error("خطا در تأیید کد");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (countdown > 0) return;

        setLoading(true);

        try {
            await api.post("/send-otp", { phone });

            toast.success("کد تایید مجدد ارسال شد");
            setCountdown(60);
        } catch (error) {
            toast.error("خطا در ارسال کد");
        } finally {
            setLoading(false);
        }
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-stone-50 dark:bg-stone-950">
                <Loader2 className="animate-spin text-sage-600" size={28} />
            </div>
        );
    }

    if (isUser) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center px-4 py-6">
                <AlreadyLoggedIn />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-stone-50 dark:bg-stone-950 font-sans" dir="rtl">
            <div className="min-h-screen w-full flex flex-col md:flex-row">

                {/* Banner - فقط دسکتاپ */}
                <div className="hidden md:flex md:w-1/2 bg-sage-600 dark:bg-stone-900 items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 text-white max-w-md text-right">
                        <h1 className="text-4xl font-bold mb-6 leading-tight">
                            {step === "phone" ? "شروع تحول" : "تأیید شماره"}
                        </h1>

                        <p className="text-sage-100 text-lg leading-relaxed italic">
                            {step === "phone"
                                ? "به جمع مادران آگاه خوش آمدید. با عضویت در سایت، مسیر اختصاصی رشد خود و فرزندتان را آغاز کنید."
                                : "کد ارسال شده را وارد کنید"}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:p-12">
                    <div className="w-full max-w-md">

                        <div className="text-right mb-7 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 tracking-tighter">
                                نوجوانه
                            </h2>

                            <h2 className="text-lg sm:text-xl font-bold text-stone-700 dark:text-stone-300 mt-1.5 sm:mt-2">
                                {step === "phone" ? "عضویت جدید" : "تأیید کد"}
                            </h2>

                            <p className="text-stone-500 text-sm sm:text-base mt-1 leading-6">
                                {step === "phone"
                                    ? "با شماره موبایل ثبت‌نام کنید"
                                    : `کد ارسال شده به شماره ${phone} را وارد کنید`}
                            </p>
                        </div>

                        {step === "phone" ? (
                            <form
                                onSubmit={handleSendCode}
                                className="space-y-3.5 sm:space-y-4"
                            >
                                <div className="relative">
                                    <span className="absolute inset-y-0 right-3.5 sm:right-4 flex items-center text-stone-400 border-l border-stone-100 pl-2.5 sm:pl-3 ml-2.5 sm:ml-3">
                                        <Smartphone size={18} />
                                    </span>

                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        autoComplete="tel"
                                        required
                                        placeholder="شماره موبایل"
                                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pr-12 sm:pr-14 pl-3.5 sm:pl-4 text-right text-sm sm:text-base focus:ring-4 focus:ring-sage-500/5 outline-none transition-all dark:text-white font-medium"
                                        value={phone}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "").slice(0, 11);
                                            setPhone(value);
                                        }}
                                        dir="ltr"
                                    />
                                </div>

                                {phoneError && (
                                    <p className="text-red-500 text-xs sm:text-sm pr-3">
                                        {phoneError}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-sage-600 hover:bg-sage-700 active:scale-[0.98] text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-sage-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={19} className="animate-spin" />
                                            در حال ارسال...
                                        </>
                                    ) : (
                                        <>
                                            ارسال کد تایید
                                            <ArrowLeft size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form
                                onSubmit={handleVerifyCode}
                                className="space-y-3.5 sm:space-y-4"
                            >
                                <div className="relative">
                                    <span className="absolute inset-y-0 right-3.5 sm:right-4 flex items-center text-stone-400 border-l border-stone-100 pl-2.5 sm:pl-3 ml-2.5 sm:ml-3">
                                        <Lock size={18} />
                                    </span>

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        required
                                        placeholder="کد 6 رقمی"
                                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pr-12 sm:pr-14 pl-3.5 sm:pl-4 text-center focus:ring-4 focus:ring-sage-500/5 outline-none transition-all dark:text-white font-medium text-xl sm:text-2xl tracking-[0.35em]"
                                        value={code}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                                            setCode(value);
                                        }}
                                        maxLength={6}
                                        dir="ltr"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-sage-600 hover:bg-sage-700 active:scale-[0.98] text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-sage-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={19} className="animate-spin" />
                                            در حال تأیید...
                                        </>
                                    ) : (
                                        <>
                                            تأیید و ادامه
                                            <ArrowLeft size={20} />
                                        </>
                                    )}
                                </button>

                                <div className="text-center pt-1">
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={countdown > 0 || loading}
                                        className="text-sage-600 text-xs sm:text-sm hover:underline disabled:opacity-50"
                                    >
                                        {countdown > 0
                                            ? `ارسال مجدد کد پس از ${countdown} ثانیه`
                                            : "ارسال مجدد کد"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep("phone");
                                            setCode("");
                                        }}
                                        className="block w-full text-stone-400 text-xs sm:text-sm mt-2 hover:text-sage-600 transition-colors"
                                    >
                                        ویرایش شماره موبایل
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="text-center mt-7 sm:mt-8">
                            <p className="text-stone-500 text-xs sm:text-sm">
                                قبلاً عضو شده‌اید؟{" "}
                                <Link
                                    href="/login"
                                    className="text-sage-600 font-bold hover:text-sage-700 transition-colors"
                                >
                                    وارد شوید
                                </Link>
                            </p>

                            <Link
                                href="/"
                                className="text-stone-400 hover:text-sage-600 text-xs font-bold flex items-center justify-center gap-1 mt-3.5 sm:mt-4 transition-colors"
                            >
                                بازگشت به صفحه اصلی
                                <ChevronRight size={14} />
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}


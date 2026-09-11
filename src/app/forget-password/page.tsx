"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Lock, ArrowLeft, ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/axios";

export default function ForgetPasswordPage() {
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [step, setStep] = useState<"phone" | "code" | "success">("phone");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // ارسال کد
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (phone.length !== 11 || !phone.startsWith("09")) {
            toast.error("شماره موبایل باید 11 رقم و با 09 شروع شود");
            return;
        }

        setLoading(true);
        try {
            await api.post("/send-reset-code", { phone });
            toast.success("کد بازنشانی ارسال شد");
            setStep("code");
            setCountdown(60);
        } catch (error) {
            toast.error("شماره موبایل یافت نشد");
        } finally {
            setLoading(false);
        }
    };

    // تأیید کد و تغییر رمز
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (code.length !== 6) {
            toast.error("کد باید 6 رقم باشد");
            return;
        }

        if (password.length < 6) {
            toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد");
            return;
        }

        if (password !== passwordConfirm) {
            toast.error("رمز عبور با تکرار آن مطابقت ندارد");
            return;
        }

        setLoading(true);
        try {
            await api.post("/reset-password", { phone, code, password, password_confirmation: passwordConfirm });
            toast.success("رمز عبور با موفقیت تغییر کرد");
            setStep("success");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error) {
            toast.error("کد نامعتبر است");
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (countdown > 0) return;
        
        setLoading(true);
        try {
            await api.post("/send-reset-code", { phone });
            toast.success("کد مجدد ارسال شد");
            setCountdown(60);
        } catch (error) {
            toast.error("خطا در ارسال کد");
        } finally {
            setLoading(false);
        }
    };

    if (step === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4" dir="rtl">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">رمز عبور تغییر کرد</h1>
                    <p className="text-stone-500 mb-6">رمز عبور شما با موفقیت تغییر کرد. می‌توانید وارد شوید.</p>
                    <Link href="/login" className="block w-full bg-sage-600 text-white py-3 rounded-xl font-bold hover:bg-sage-700">
                        ورود به حساب کاربری
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4" dir="rtl">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-stone-800">فراموشی رمز عبور</h1>
                    <p className="text-stone-500 text-sm mt-2">
                        {step === "phone" 
                            ? "شماره موبایل خود را وارد کنید، کد تأیید برای شما ارسال می‌شود"
                            : "کد ارسال شده و رمز عبور جدید را وارد کنید"
                        }
                    </p>
                </div>

                {step === "phone" ? (
                    <form onSubmit={handleSendCode} className="space-y-4">
                        <div className="relative">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                                <Smartphone size={20} />
                            </span>
                            <input
                                type="tel"
                                required
                                placeholder="شماره موبایل"
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pr-12 pl-4 outline-none focus:ring-2 focus:ring-sage-500"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                dir="ltr"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sage-600 text-white py-3 rounded-xl font-bold hover:bg-sage-700 transition-all disabled:opacity-50"
                        >
                            {loading ? "در حال ارسال..." : "ارسال کد تأیید"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="relative">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                                <Lock size={20} />
                            </span>
                            <input
                                type="text"
                                required
                                placeholder="کد 6 رقمی"
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pr-12 pl-4 text-center tracking-widest outline-none focus:ring-2 focus:ring-sage-500"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                maxLength={6}
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
                                placeholder="رمز عبور جدید (حداقل ۶ کاراکتر)"
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pr-12 pl-4 outline-none focus:ring-2 focus:ring-sage-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                                <Lock size={20} />
                            </span>
                            <input
                                type="password"
                                required
                                placeholder="تکرار رمز عبور جدید"
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pr-12 pl-4 outline-none focus:ring-2 focus:ring-sage-500"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sage-600 text-white py-3 rounded-xl font-bold hover:bg-sage-700 transition-all disabled:opacity-50"
                        >
                            {loading ? "در حال تغییر..." : "تغییر رمز عبور"}
                        </button>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={countdown > 0}
                                className="text-sage-600 text-sm hover:underline disabled:opacity-50"
                            >
                                {countdown > 0 
                                    ? `ارسال مجدد کد پس از ${countdown} ثانیه`
                                    : "ارسال مجدد کد"
                                }
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center mt-6">
                    <Link href="/login" className="text-stone-500 text-sm hover:text-sage-600">
                        بازگشت به صفحه ورود
                    </Link>
                </div>
            </div>
        </div>
    );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Smartphone,
    Lock,
    CheckCircle,
    ArrowRight,
    Loader2,
} from "lucide-react";
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
        if (countdown <= 0) return;

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    // ارسال کد بازنشانی
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();

        const normalizedPhone = phone.trim();

        if (
            normalizedPhone.length !== 11 ||
            !normalizedPhone.startsWith("09")
        ) {
            toast.error("شماره موبایل باید 11 رقم و با 09 شروع شود");
            return;
        }

        setLoading(true);

        try {
            await api.post("/send-reset-code", {
                phone: normalizedPhone,
            });

            toast.success("کد بازنشانی برای شما ارسال شد");

            setPhone(normalizedPhone);
            setStep("code");
            setCountdown(60);
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "ارسال کد انجام نشد. لطفاً دوباره تلاش کنید.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // تأیید کد و تغییر رمز
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        const normalizedCode = code.trim();

        if (normalizedCode.length !== 6) {
            toast.error("کد تأیید باید 6 رقم باشد");
            return;
        }

        if (!/^\d{6}$/.test(normalizedCode)) {
            toast.error("کد تأیید باید فقط شامل عدد باشد");
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
            await api.post("/reset-password", {
                phone,
                code: normalizedCode,
                password,
                password_confirmation: passwordConfirm,
            });

            toast.success("رمز عبور با موفقیت تغییر کرد");

            setStep("success");

            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "کد تأیید نامعتبر است یا تغییر رمز انجام نشد.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // ارسال مجدد کد
    const handleResendCode = async () => {
        if (countdown > 0 || loading) return;

        setLoading(true);

        try {
            await api.post("/send-reset-code", {
                phone,
            });

            toast.success("کد جدید برای شما ارسال شد");
            setCountdown(60);
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "خطا در ارسال مجدد کد";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // صفحه موفقیت
    if (step === "success") {
        return (
            <main
                className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-8 transition-colors dark:bg-zinc-950"
                dir="rtl"
            >
                <div className="w-full max-w-md overflow-hidden rounded-3xl border border-stone-200 bg-white p-7 text-center shadow-xl transition-colors dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
                        <CheckCircle
                            size={34}
                            className="text-green-600 dark:text-green-400"
                        />
                    </div>

                    <h1 className="mb-2 text-2xl font-bold text-stone-800 dark:text-white">
                        رمز عبور تغییر کرد
                    </h1>

                    <p className="mb-6 text-sm leading-7 text-stone-500 dark:text-zinc-400">
                        رمز عبور شما با موفقیت تغییر کرد.
                        <br />
                        اکنون می‌توانید وارد حساب کاربری خود شوید.
                    </p>

                    <Link
                        href="/login"
                        className="block w-full rounded-xl bg-sage-600 py-3.5 font-bold text-white transition-all hover:bg-sage-700 active:scale-[0.98] dark:bg-sage-500 dark:hover:bg-sage-600"
                    >
                        ورود به حساب کاربری
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main
            className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-8 transition-colors dark:bg-zinc-950"
            dir="rtl"
        >
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-xl transition-colors dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
                {/* Header */}
                <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-100 dark:bg-sage-950/40">
                        {step === "phone" ? (
                            <Smartphone
                                size={27}
                                className="text-sage-600 dark:text-sage-400"
                            />
                        ) : (
                            <Lock
                                size={27}
                                className="text-sage-600 dark:text-sage-400"
                            />
                        )}
                    </div>

                    <h1 className="text-2xl font-bold text-stone-800 dark:text-white">
                        فراموشی رمز عبور
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-zinc-400">
                        {step === "phone"
                            ? "شماره موبایل خود را وارد کنید تا کد تأیید برای شما ارسال شود."
                            : "کد ارسال‌شده و رمز عبور جدید خود را وارد کنید."}
                    </p>
                </div>

                {/* Step 1 */}
                {step === "phone" ? (
                    <form onSubmit={handleSendCode} className="space-y-4">
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-stone-400 dark:text-zinc-500">
                                <Smartphone size={20} />
                            </span>

                            <input
                                type="tel"
                                inputMode="numeric"
                                autoComplete="tel"
                                required
                                maxLength={11}
                                placeholder="شماره موبایل"
                                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-4 pr-12 text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-sage-500"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                                dir="ltr"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage-600 py-3.5 font-bold text-white transition-all hover:bg-sage-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sage-500 dark:hover:bg-sage-600"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={19}
                                        className="animate-spin"
                                    />
                                    در حال ارسال...
                                </>
                            ) : (
                                "ارسال کد تأیید"
                            )}
                        </button>
                    </form>
                ) : (
                    <form
                        onSubmit={handleResetPassword}
                        className="space-y-4"
                    >
                        {/* OTP */}
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-stone-400 dark:text-zinc-500">
                                <Lock size={20} />
                            </span>

                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                required
                                maxLength={6}
                                placeholder="کد 6 رقمی"
                                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-4 pr-12 text-center text-lg font-semibold tracking-[0.35em] text-stone-800 outline-none transition-all placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-stone-400 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-sage-500"
                                value={code}
                                onChange={(e) =>
                                    setCode(
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                                dir="ltr"
                            />
                        </div>

                        {/* New Password */}
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-stone-400 dark:text-zinc-500">
                                <Lock size={20} />
                            </span>

                            <input
                                type="password"
                                required
                                autoComplete="new-password"
                                placeholder="رمز عبور جدید (حداقل ۶ کاراکتر)"
                                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-4 pr-12 text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-sage-500"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-stone-400 dark:text-zinc-500">
                                <Lock size={20} />
                            </span>

                            <input
                                type="password"
                                required
                                autoComplete="new-password"
                                placeholder="تکرار رمز عبور جدید"
                                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-4 pr-12 text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-sage-500"
                                value={passwordConfirm}
                                onChange={(e) =>
                                    setPasswordConfirm(e.target.value)
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage-600 py-3.5 font-bold text-white transition-all hover:bg-sage-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sage-500 dark:hover:bg-sage-600"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={19}
                                        className="animate-spin"
                                    />
                                    در حال تغییر...
                                </>
                            ) : (
                                "تغییر رمز عبور"
                            )}
                        </button>

                        {/* Resend */}
                        <div className="pt-1 text-center">
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={countdown > 0 || loading}
                                className="text-sm font-medium text-sage-600 transition-colors hover:text-sage-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-sage-400 dark:hover:text-sage-300"
                            >
                                {countdown > 0
                                    ? `ارسال مجدد کد پس از ${countdown} ثانیه`
                                    : "ارسال مجدد کد"}
                            </button>
                        </div>
                    </form>
                )}

                {/* Back */}
                <div className="mt-7 border-t border-stone-100 pt-5 text-center dark:border-zinc-800">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-sage-600 dark:text-zinc-400 dark:hover:text-sage-400"
                    >
                        <ArrowRight size={16} />
                        بازگشت به صفحه ورود
                    </Link>
                </div>
            </div>
        </main>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function VerifyCodePage() {
    const router = useRouter();
    const [code, setCode] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedPhone = localStorage.getItem("verify_phone");
        if (savedPhone) {
            setPhone(savedPhone);
        } else {
            router.push("/send-code");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) {
            toast.error("کد باید 6 رقم باشد");
            return;
        }

        setLoading(true);
        try {
            await api.post("/verify-code", { phone, code });
            toast.success("شماره شما تأیید شد!");
            localStorage.removeItem("verify_phone");
            router.push("/login");
        } catch (error) {
            toast.error("کد نامعتبر است");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4" dir="rtl">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-center mb-6">تأیید کد</h1>
                <p className="text-stone-500 text-center mb-4">
                    کد ارسال شده به شماره {phone} را وارد کنید
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="کد 6 رقمی"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-sage-500 outline-none text-center text-2xl tracking-widest"
                        dir="ltr"
                        maxLength={6}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sage-600 text-white py-3 rounded-xl font-bold hover:bg-sage-700 transition-all disabled:opacity-50"
                    >
                        {loading ? "در حال تأیید..." : "تأیید کد"}
                    </button>
                </form>
            </div>
        </div>
    );
}
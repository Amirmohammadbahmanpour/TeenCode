"use client"
import { useState } from "react";
import { ArrowLeft, User, Mail, Phone, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [step, setStep] = useState(1);
    const [identifier, setIdentifier] = useState(""); // ایمیل یا شماره

    const nextStep = (e: React.FormEvent) => {
        e.preventDefault();
        // اینجا در آینده چک می‌کنیم که آیا کاربر وجود دارد یا نه
        setStep(2);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-stone-950">
            
            {/* سمت چپ: بخش محتوای بصری (در موبایل مخفی یا در بالا) */}
            <div className="hidden md:flex md:w-1/2 bg-sage-600 dark:bg-stone-900 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sage-500 rounded-full blur-[100px] opacity-40 -mr-20 -mt-20"></div>
                <div className="relative z-10 text-white max-w-md">
                    <h1 className="text-4xl font-black mb-6 leading-tight">
                        سفر تحول تو از اینجا شروع میشه...
                    </h1>
                    <p className="text-sage-100 text-lg leading-relaxed italic">
                        اولین قدم برای تغییر، آگاهیه. خوشحالیم که برای این آگاهی وقت می‌ذاری.
                    </p>
                </div>
            </div>

            {/* سمت راست: فرم لاگین */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    
                    {/* Header فرم */}
                    <div className="text-center md:text-right">
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100">
                            {step === 1 ? "ورود یا ثبت‌نام" : "تکمیل اطلاعات"}
                        </h2>
                        <p className="text-stone-500 mt-2">
                            {step === 1 
                                ? "لطفاً ایمیل یا شماره موبایل خود را وارد کنید" 
                                : "چند قدم تا شروع اولین آزمون فاصله داری"}
                        </p>
                    </div>

                    <form onSubmit={step === 1 ? nextStep : (e) => e.preventDefault()} className="space-y-5">
                        {step === 1 ? (
                            /* مرحله اول: شناسایی */
                            <div className="space-y-4">
                                <div className="relative">
                                    <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                                        <Mail size={20} />
                                    </span>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="ایمیل یا شماره موبایل"
                                        className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-sage-500 outline-none transition-all text-right"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full bg-sage-600 hover:bg-sage-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    ادامه
                                    <ArrowLeft size={20} />
                                </button>
                            </div>
                        ) : (
                            /* مرحله دوم: اطلاعات تکمیلی */
                            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className="relative">
                                    <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                                        <User size={20} />
                                    </span>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="نام و نام خانوادگی"
                                        className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-sage-500 outline-none transition-all text-right"
                                    />
                                </div>
                                
                                <select className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-sage-500 outline-none transition-all text-right appearance-none">
                                    <option value="">هدف شما از این دوره؟</option>
                                    <option value="growth">رشد فردی</option>
                                    <option value="career">پیشرفت شغلی</option>
                                    <option value="other">سایر موارد</option>
                                </select>

                                <button 
                                    className="w-full bg-sage-600 hover:bg-sage-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg"
                                >
                                    تایید و ورود به پنل
                                </button>

                                <button 
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-stone-400 text-sm hover:text-stone-600 transition-colors"
                                >
                                    ویرایش شماره یا ایمیل
                                </button>
                            </div>
                        )}
                    </form>

                    {/* Footer زیر فرم */}
                    <div className="text-center pt-4">
                        <Link href="/" className="text-stone-400 hover:text-sage-600 text-sm transition-colors flex items-center justify-center gap-1">
                            بازگشت به صفحه اصلی
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
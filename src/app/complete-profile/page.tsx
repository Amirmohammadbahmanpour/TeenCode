"use client"
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Vazirmatn } from "next/font/google";
import { User, Calendar, GraduationCap, Banknote, Users, Baby, ArrowLeft } from "lucide-react";

export default function CompleteProfile() {
    const [fullName, setFullName] = useState("");
    const [age, setAge] = useState("");
    const [education, setEducation] = useState("");
    const [economic, setEconomic] = useState("");
    const [childrenCount, setChildrenCount] = useState("");
    const [childAge, setChildAge] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkOnboarding = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_onboarded')
                .eq('id', user.id)
                .single();
            if (profile?.is_onboarded) {
                router.push("/dashboard");
            }
        };
        checkOnboarding();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("ابتدا باید وارد شوید");
            router.push("/login");
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                age: parseInt(age),
                education_level: education,
                economic_status: economic,
                children_count: parseInt(childrenCount),
                teen_age: parseInt(childAge),
                is_onboarded: true
            })
            .eq('id', user.id);

        if (error) {
            alert("خطا در ذخیره: " + error.message);
        } else {
            alert("اطلاعات با موفقیت ثبت شد!");
            router.push("/dashboard");
        }
        setLoading(false);
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 font-[vazir] p-6" dir="rtl">
            <div className="w-full max-w-xl bg-white dark:bg-stone-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-stone-200/50 dark:border-stone-800/50 relative overflow-hidden">
                {/* دکوراسیون پس‌زمینه کارت */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-sage-500/10 rounded-full blur-3xl -ml-16 -mt-16"></div>

                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-stone-800 dark:text-stone-100">تکمیل پروفایل</h2>
                        <p className="text-stone-500 dark:text-stone-400 mt-2">لطفاً اطلاعات زیر را برای شخصی‌سازی مسیر تحول خود تکمیل کنید</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* نام و نام خانوادگی */}
                        <div className="relative md:col-span-2">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><User size={20} /></span>
                            <input 
                                type="text" required placeholder="نام و نام خانوادگی"
                                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right focus:ring-2 focus:ring-sage-500 outline-none transition-all dark:text-white"
                                onChange={e => setFullName(e.target.value)}
                            />
                        </div>

                        {/* سن */}
                        <div className="relative">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Calendar size={20} /></span>
                            <input 
                                type="number" required placeholder="سن شما"
                                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right focus:ring-2 focus:ring-sage-500 outline-none transition-all dark:text-white"
                                onChange={e => setAge(e.target.value)}
                            />
                        </div>

                        {/* سطح تحصیلات */}
                        <div className="relative">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><GraduationCap size={20} /></span>
                            <select 
                                required className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right focus:ring-2 focus:ring-sage-500 outline-none transition-all dark:text-white appearance-none"
                                onChange={e => setEducation(e.target.value)}
                            >
                                <option value="">سطح تحصیلات</option>
                                <option value="diploma">دیپلم</option>
                                <option value="bachelor">کارشناسی</option>
                                <option value="master">ارشد و بالاتر</option>
                            </select>
                        </div>

                        {/* وضعیت اقتصادی */}
                        <div className="relative">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Banknote size={20} /></span>
                            <select 
                                required className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right focus:ring-2 focus:ring-sage-500 outline-none transition-all dark:text-white appearance-none"
                                onChange={e => setEconomic(e.target.value)}
                            >
                                <option value="">وضعیت اقتصادی</option>
                                <option value="average">متوسط</option>
                                <option value="good">خوب</option>
                                <option value="excellent">عالی</option>
                            </select>
                        </div>

                        {/* تعداد فرزندان */}
                        <div className="relative">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Users size={20} /></span>
                            <input 
                                type="number" required placeholder="تعداد فرزندان"
                                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right focus:ring-2 focus:ring-sage-500 outline-none transition-all dark:text-white"
                                onChange={e => setChildrenCount(e.target.value)}
                            />
                        </div>

                        {/* سن فرزند (بزرگترین یا کوچکترین - طبق نیاز سایتت) */}
                        <div className="relative md:col-span-2">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Baby size={20} /></span>
                            <input 
                                type="number" required placeholder="سن فرزند (یا فرزندان)"
                                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right focus:ring-2 focus:ring-sage-500 outline-none transition-all dark:text-white"
                                onChange={e => setChildAge(e.target.value)}
                            />
                        </div>

                        {/* دکمه ثبت نهایی */}
                        <div className="md:col-span-2 pt-4">
                            <button 
                                disabled={loading} 
                                className="w-full bg-sage-600 hover:bg-sage-700 text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-sage-200/50 dark:shadow-none"
                            >
                                {loading ? "در حال ذخیره اطلاعات..." : "تایید و ورود به پنل"}
                                {!loading && <ArrowLeft size={20} />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
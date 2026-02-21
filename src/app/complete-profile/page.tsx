"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User, Calendar, GraduationCap, Banknote, Users, Baby, ArrowLeft, Loader2 } from "lucide-react";

export default function CompleteProfile() {
    const [fullName, setFullName] = useState("");
    const [age, setAge] = useState("");
    const [education, setEducation] = useState("");
    const [economic, setEconomic] = useState("");
    const [childrenCount, setChildrenCount] = useState("");
    const [childAge, setChildAge] = useState("");

    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchExistingProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profile) {
                setFullName(profile.full_name || "");
                setAge(profile.age?.toString() || "");
                setEducation(profile.education_level || "");
                setEconomic(profile.economic_status || "");
                setChildrenCount(profile.children_count?.toString() || "");
                setChildAge(profile.teen_age?.toString() || "");
            }
            setCheckingAuth(false);
        };

        fetchExistingProfile();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                age: age ? parseInt(age) : null,
                education_level: education,
                economic_status: economic,
                children_count: childrenCount ? parseInt(childrenCount) : 0,
                teen_age: childAge ? parseInt(childAge) : null,
                is_onboarded: true
            })
            .eq('id', user.id);

        if (error) {
            alert("خطا در ذخیره: " + error.message);
        } else {
            router.push("/dashboard");
        }
        setLoading(false);
    };

    if (checkingAuth) return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
            <Loader2 className="animate-spin text-sage-600" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 p-6" dir="rtl">
            <div className="w-full max-w-xl bg-white dark:bg-stone-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-stone-200/50 dark:border-stone-800/50 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-stone-800 dark:text-stone-100 italic">تین کد</h2>
                        <h2 className="text-2xl font-bold text-stone-700 dark:text-stone-200 mt-2">تکمیل اطلاعات پروفایل</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative md:col-span-2">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><User size={20} /></span>
                            <input type="text" required placeholder="نام و نام خانوادگی" value={fullName} onChange={e => setFullName(e.target.value)}
                                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm" />
                        </div>

                        <div className="relative">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Calendar size={20} /></span>
                            <input type="number" required placeholder="سن شما" value={age} onChange={e => setAge(e.target.value)}
                                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm" />
                        </div>

                        <div className="relative">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><GraduationCap size={20} /></span>
                            <select required value={education} onChange={e => setEducation(e.target.value)}
                                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white appearance-none text-sm">
                                <option value="">سطح تحصیلات</option>
                                <option value="diploma">دیپلم</option>
                                <option value="bachelor">کارشناسی</option>
                                <option value="master">ارشد و بالاتر</option>
                            </select>
                        </div>

                        <div className="relative">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Banknote size={20} /></span>
                            <select required value={economic} onChange={e => setEconomic(e.target.value)}
                                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white appearance-none text-sm">
                                <option value="">وضعیت اقتصادی</option>
                                <option value="average">متوسط</option>
                                <option value="good">خوب</option>
                                <option value="excellent">عالی</option>
                            </select>
                        </div>

                        <div className="relative">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Users size={20} /></span>
                            <input type="number" required placeholder="تعداد فرزندان" value={childrenCount} onChange={e => setChildrenCount(e.target.value)}
                                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm" />
                        </div>

                        <div className="relative md:col-span-2">
                            <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Baby size={20} /></span>
                            <input type="number" required placeholder="سن بزرگترین فرزند" value={childAge} onChange={e => setChildAge(e.target.value)}
                                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm" />
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button disabled={loading} className="w-full bg-sage-600 hover:bg-sage-700 text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : "ذخیره و ورود به داشبورد"}
                                {!loading && <ArrowLeft size={20} />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
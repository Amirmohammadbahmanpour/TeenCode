"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { User, Calendar, GraduationCap, Banknote, Users, Baby, ArrowLeft, Loader2, Mail, Lock } from "lucide-react";
import { auth } from "@/lib/auth";
import api from "@/lib/axios";

interface Profile {
    full_name: string | null;
    age: number | null;
    education: string | null;
    economic_status: string | null;
    number_of_children: number | null;
    children_ages: number | null;
    email: string | null;
}

export default function CompleteProfile() {
    const router = useRouter();
    
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [age, setAge] = useState("");
    const [education, setEducation] = useState("");
    const [economicStatus, setEconomicStatus] = useState("");
    const [numberOfChildren, setNumberOfChildren] = useState("");
    const [childrenAges, setChildrenAges] = useState("");

    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchProfile = async () => {
            const token = auth.getToken();
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const userRes = await api.get('/user');
                const userData = userRes.data;
                setUserId(userData.user.id);
                
                const profileRes = await api.get(`/profiles/${userData.user.id}`);
                const profile = profileRes.data;
                
                if (profile) {
                    setFullName(profile.full_name || "");
                    setEmail(profile.email || "");
                    setAge(profile.age?.toString() || "");
                    setEducation(profile.education || "");
                    setEconomicStatus(profile.economic_status || "");
                    setNumberOfChildren(profile.number_of_children?.toString() || "");
                    setChildrenAges(profile.children_ages?.toString() || "");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setCheckingAuth(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            toast.error("لطفاً نام و نام خانوادگی خود را وارد کنید");
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

        if (!userId) {
            toast.error("اطلاعات کاربر یافت نشد");
            return;
        }

        setLoading(true);

        try {
            await api.post("/complete-profile", {
                full_name: fullName,
                email: email,
                password: password,
                age: age ? parseInt(age) : null,
                education: education,
                economic_status: economicStatus,
                number_of_children: numberOfChildren ? parseInt(numberOfChildren) : 0,
                children_ages: childrenAges ? parseInt(childrenAges) : null,
            });
        
            // ✅ ارسال رویداد به سایدبار برای به‌روزرسانی
            window.dispatchEvent(new Event('profile-updated'));
            
            // ✅ به‌روزرسانی نام کاربر در auth
            const user = auth.getUser();
            if (user) {
                user.name = fullName;
                auth.setUser(user);
            }
            
            toast.success("پروفایل شما با موفقیت تکمیل شد! ✨");
            
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "خطا در ذخیره اطلاعات");
        } finally {
            setLoading(false);
        }
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
                <Loader2 className="animate-spin text-sage-600" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 p-6" dir="rtl">
            <div className="w-full max-w-xl bg-white dark:bg-stone-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-stone-200/50 dark:border-stone-800/50">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-stone-800 dark:text-stone-100 italic">نوجوانه</h2>
                    <h2 className="text-2xl font-bold text-stone-700 dark:text-stone-200 mt-2">تکمیل اطلاعات پروفایل</h2>
                    <p className="text-stone-500 text-sm mt-1">لطفاً اطلاعات خود را کامل کنید</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative md:col-span-2">
                        <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><User size={20} /></span>
                        <input 
                            type="text" 
                            required 
                            placeholder="نام و نام خانوادگی" 
                            value={fullName} 
                            onChange={e => setFullName(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm" 
                        />
                    </div>

                    <div className="relative md:col-span-2">
                        <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Mail size={20} /></span>
                        <input 
                            type="email" 
                            placeholder="ایمیل (اختیاری)" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm" 
                        />
                    </div>

                    <div className="relative md:col-span-2">
                        <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Lock size={20} /></span>
                        <input 
                            type="password" 
                            required 
                            placeholder="رمز عبور (حداقل ۶ کاراکتر)" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm" 
                        />
                    </div>

                    <div className="relative md:col-span-2">
                        <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Lock size={20} /></span>
                        <input 
                            type="password" 
                            required 
                            placeholder="تکرار رمز عبور" 
                            value={passwordConfirm} 
                            onChange={e => setPasswordConfirm(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm" 
                        />
                    </div>

                    <div className="relative">
                        <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Calendar size={20} /></span>
                        <input 
                            type="number" 
                            placeholder="سن شما" 
                            value={age} 
                            onChange={e => setAge(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm" 
                        />
                    </div>

                    <div className="relative">
                        <select 
                            value={education} 
                            onChange={e => setEducation(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white appearance-none text-sm">
                            <option value="">سطح تحصیلات</option>
                            <option value="diploma">دیپلم</option>
                            <option value="bachelor">کارشناسی</option>
                            <option value="master">ارشد و بالاتر</option>
                        </select>
                    </div>

                    <div className="relative">
                        <select 
                            value={economicStatus} 
                            onChange={e => setEconomicStatus(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white appearance-none text-sm">
                            <option value="">وضعیت اقتصادی</option>
                            <option value="average">متوسط</option>
                            <option value="good">خوب</option>
                            <option value="excellent">عالی</option>
                        </select>
                    </div>

                    <div className="relative">
                        <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Users size={20} /></span>
                        <input 
                            type="number" 
                            placeholder="تعداد فرزندان" 
                            value={numberOfChildren} 
                            onChange={e => setNumberOfChildren(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm" 
                        />
                    </div>

                    <div className="relative md:col-span-2">
                        <span className="absolute inset-y-0 right-4 flex items-center text-stone-400"><Baby size={20} /></span>
                        <input 
                            type="number" 
                            placeholder="سن بزرگترین فرزند" 
                            value={childrenAges} 
                            onChange={e => setChildrenAges(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm" 
                        />
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button 
                            disabled={loading} 
                            className="w-full bg-sage-600 hover:bg-sage-700 text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "ذخیره و ورود به داشبورد"}
                            {!loading && <ArrowLeft size={20} />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
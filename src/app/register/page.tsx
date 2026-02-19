"use client"
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // ۱. ثبت‌نام در Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        });

        if (error) {
            alert("خطا در ثبت‌نام: " + error.message);
        } else {
            alert("ایول! ثبت‌نام موفقیت‌آمیز بود.");
            // هدایت به صفحه لاگین (که بعدا می‌سازیم)
            router.push("/login");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen text-black flex items-center justify-center bg-[#fdfcf9] p-4 font-[vazir]">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-stone-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-stone-800">عضویت جدید</h2>
                    <p className="text-stone-500 mt-2">به جمع مادران آگاه خوش آمدید</p>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-4">
                    <input 
                        type="text" placeholder="نام و نام خانوادگی" 
                        className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-100 focus:ring-2 focus:ring-sage-500 outline-none transition-all"
                        onChange={(e) => setFullName(e.target.value)} required
                    />
                    <input 
                        type="email" placeholder="ایمیل" 
                        className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-100 focus:ring-2 focus:ring-sage-500 outline-none transition-all"
                        onChange={(e) => setEmail(e.target.value)} required
                    />
                    <input 
                        type="password" placeholder="رمز عبور (حداقل ۶ کاراکتر)" 
                        className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-100 focus:ring-2 focus:ring-sage-500 outline-none transition-all"
                        onChange={(e) => setPassword(e.target.value)} required
                    />
                    
                    <button 
                        disabled={loading}
                        className="w-full bg-[#5b7c61] hover:bg-[#4a6650] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-sage-100 active:scale-95"
                    >
                        {loading ? "در حال ثبت اطلاعات..." : "تأیید و شروع تحول"}
                    </button>
                </form>
            </div>
        </div>
    );
}
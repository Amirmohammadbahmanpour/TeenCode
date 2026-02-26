import { supabase } from "@/lib/supabase";
import { User } from "lucide-react";
import { UserActions } from "@/components/admin/UserActions";

interface Profile {
    id: string;
    full_name: string | null;
    role: string; // اضافه کردن رول به اینترفیس
}

export default async function AdminUsers() {
    // حتماً ستون role را اینجا اضافه کن
    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, full_name, role");

    if (error) {
        return (
            <div className="p-8 text-red-500 bg-red-50 rounded-2xl border border-red-100">
                خطا در دریافت دیتابیس: {error.message}
            </div>
        );
    }

    if (!profiles || profiles.length === 0) {
        return (
            <div className="p-10 text-center border-2 border-dashed border-stone-200 rounded-[2rem]">
                <p className="text-stone-500 font-bold text-lg">جدول پروفایل‌ها خالی است!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-right" dir="rtl">
            <h1 className="text-2xl font-black text-stone-800 dark:text-stone-100">مدیریت کاربران</h1>

            <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
                        <tr>
                            <th className="px-6 py-5 text-sm font-bold text-stone-600 dark:text-stone-300 text-right">نام و نام خانوادگی</th>
                            <th className="px-6 py-5 text-sm font-bold text-stone-600 dark:text-stone-300 text-right">نقش</th>
                            <th className="px-6 py-5 text-sm font-bold text-stone-600 dark:text-stone-300 text-right">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {profiles.map((user: Profile) => (
                            <tr key={user.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-stone-800 dark:text-stone-200 text-right">
                                    {user.full_name || "بدون نام"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        user.role === 'admin' 
                                        ? 'bg-sage-100 text-sage-700' 
                                        : 'bg-stone-100 text-stone-600'
                                    }`}>
                                        {user.role === 'admin' ? 'مدیر' : 'کاربر'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {/* حالا role به درستی به کامپوننت پاس داده می‌شود */}
                                    <UserActions userId={user.id} currentRole={user.role || 'user'} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
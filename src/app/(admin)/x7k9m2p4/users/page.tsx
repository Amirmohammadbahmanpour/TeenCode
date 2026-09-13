import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserActions } from "@/components/admin/UserActions";

export const dynamic = "force-dynamic";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000/api";

interface Profile {
    id: string;
    full_name: string | null;
    role: string;
    email?: string;
}

async function getUsers(token: string): Promise<Profile[]> {
    try {
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

async function checkAdmin(token: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) return false;

        const userData = await response.json();

        return userData.profile?.role === "admin";
    } catch {
        return false;
    }
}

export default async function AdminUsers() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        redirect("/login");
    }

    const isAdmin = await checkAdmin(token);

    if (!isAdmin) {
        redirect("/dashboard");
    }

    const users = await getUsers(token);

    if (!users || users.length === 0) {
        return (
            <div
                className="p-6 md:p-10 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-[2rem]"
                dir="rtl"
            >
                <p className="text-stone-500 font-bold text-base md:text-lg">
                    هیچ کاربری یافت نشد!
                </p>
            </div>
        );
    }

    return (
        <div
            className="w-full space-y-5 md:space-y-6 text-right"
            dir="rtl"
        >
            {/* Header */}
            <div>
                <h1 className="text-xl md:text-2xl font-black text-stone-800 dark:text-stone-100">
                    مدیریت کاربران
                </h1>

                <p className="text-xs md:text-sm text-stone-500 mt-1">
                    مدیریت کاربران و نقش‌های آن‌ها
                </p>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
                            <tr>
                                <th className="px-6 py-5 text-sm font-bold text-stone-600 dark:text-stone-300 text-right">
                                    نام و نام خانوادگی
                                </th>

                                <th className="px-6 py-5 text-sm font-bold text-stone-600 dark:text-stone-300 text-right">
                                    ایمیل
                                </th>

                                <th className="px-6 py-5 text-sm font-bold text-stone-600 dark:text-stone-300 text-right">
                                    نقش
                                </th>

                                <th className="px-6 py-5 text-sm font-bold text-stone-600 dark:text-stone-300 text-right">
                                    عملیات
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                            {users.map((user: Profile) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-stone-800 dark:text-stone-200 text-right">
                                        {user.full_name || "بدون نام"}
                                    </td>

                                    <td className="px-6 py-4 font-medium text-stone-500 dark:text-stone-400 text-right break-all">
                                        {user.email || "-"}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <span
                                            className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                                                user.role === "admin"
                                                    ? "bg-sage-100 text-sage-700"
                                                    : "bg-stone-100 text-stone-600"
                                            }`}
                                        >
                                            {user.role === "admin"
                                                ? "مدیر"
                                                : "کاربر"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <UserActions
                                            userId={user.id}
                                            currentRole={
                                                user.role || "user"
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {users.map((user: Profile) => (
                    <div
                        key={user.id}
                        className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm"
                    >
                        {/* User info */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-stone-800 dark:text-stone-100 text-sm">
                                    {user.full_name || "بدون نام"}
                                </p>

                                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 break-all">
                                    {user.email || "-"}
                                </p>
                            </div>

                            {/* Role */}
                            <span
                                className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                    user.role === "admin"
                                        ? "bg-sage-100 text-sage-700"
                                        : "bg-stone-100 text-stone-600"
                                }`}
                            >
                                {user.role === "admin"
                                    ? "مدیر"
                                    : "کاربر"}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                            <UserActions
                                userId={user.id}
                                currentRole={user.role || "user"}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
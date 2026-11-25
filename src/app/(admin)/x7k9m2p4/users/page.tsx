import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminUsersTable, UserItem } from "@/components/admin/AdminUsersTable";
import { Users as UsersIcon } from "lucide-react";

export const dynamic = "force-dynamic";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000/api";

async function getUsers(token: string): Promise<UserItem[]> {
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

    return (
        <div
            className="w-full space-y-5 md:space-y-6 text-right"
            dir="rtl"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-stone-800 dark:text-stone-100 flex items-center gap-2.5">
                        <UsersIcon className="text-sage-600" size={26} />
                        مدیریت کاربران و کارنامه‌ها
                    </h1>

                    <p className="text-xs md:text-sm text-stone-500 mt-1">
                        مشاهده کارنامه آزمون‌های اول و آخر، وضعیت پیشرفت در دوره و مدیریت دسترسی کاربران (روی هر کاربر برای مشاهده جزئیات کلیک کنید)
                    </p>
                </div>
            </div>

            {/* Interactive Users Table with Modal */}
            <AdminUsersTable initialUsers={users || []} />
        </div>
    );
}

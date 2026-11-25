import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { Users as UsersIcon } from "lucide-react";

export default function AdminUsers() {
    return (
        <AdminGuard>
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
                <AdminUsersTable initialUsers={[]} autoFetch />
            </div>
        </AdminGuard>
    );
}

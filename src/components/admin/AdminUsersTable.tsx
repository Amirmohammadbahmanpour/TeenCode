"use client";

import { useState } from "react";
import {
    Search,
    User,
    Award,
    BookOpen,
    GraduationCap,
    CheckCircle2,
    Clock,
    X,
    Phone,
    Mail,
    Calendar,
    Users as UsersIcon,
    ShieldCheck,
    Trash2,
    Eye,
    TrendingUp,
    Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export interface UserItem {
    id: string | number;
    full_name: string | null;
    email?: string | null;
    phone?: string | null;
    role: string;
    created_at?: string;
    pretest_score?: number | null;
    pretest_date?: string | null;
    posttest_score?: number | null;
    posttest_date?: string | null;
    completed_lessons?: number;
    total_lessons?: number;
    learning_status?: string;
    learning_status_key?: string;
    profile_details?: {
        age?: number | null;
        mother_age?: number | null;
        mother_education?: string | null;
        father_education?: string | null;
        mother_employment_status?: string | null;
        family_income_status?: string | null;
        number_of_children?: number | null;
        number_of_teenagers?: number | null;
        teenager_gender?: string | null;
        teenager_age_range?: string | null;
        has_attended_parenting_course?: boolean | null;
        teenager_phone_internet_usage?: string | null;
        teenager_living_with?: string | null;
    };
}

interface AdminUsersTableProps {
    initialUsers: UserItem[];
    initialError?: string | null;
}

function formatDate(dateStr?: string | null) {
    if (!dateStr) return "-";
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    } catch {
        return dateStr;
    }
}

export function AdminUsersTable({ initialUsers, initialError = null }: AdminUsersTableProps) {
    const router = useRouter();
    const [users, setUsers] = useState<UserItem[]>(initialUsers);
    const [fetchError, setFetchError] = useState<string | null>(initialError);
    const [reloading, setReloading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const handleReloadUsers = async () => {
        try {
            setReloading(true);
            setFetchError(null);
            const res = await api.get<UserItem[]>("/admin/users");
            if (Array.isArray(res.data)) {
                setUsers(res.data);
            }
        } catch (err: any) {
            setFetchError(
                err?.response?.data?.message ||
                    err?.message ||
                    "خطا در دریافت لیست کاربران"
            );
        } finally {
            setReloading(false);
        }
    };

    // تغییر نقش
    const handleToggleRole = async (user: UserItem, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const newRole = user.role === "admin" ? "user" : "admin";
        if (
            !confirm(
                `آیا مطمئن هستید که می‌خواهید نقش ${user.full_name || "کاربر"} را به ${
                    newRole === "admin" ? "مدیر" : "کاربر عادی"
                } تغییر دهید؟`
            )
        )
            return;

        try {
            setActionLoading(true);
            await api.put(`/admin/users/${user.id}/role`, { role: newRole });
            toast.success("نقش کاربر با موفقیت تغییر کرد");
            
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
            );
            if (selectedUser?.id === user.id) {
                setSelectedUser({ ...selectedUser, role: newRole });
            }
            router.refresh();
        } catch (error) {
            toast.error("خطا در تغییر نقش کاربر");
        } finally {
            setActionLoading(false);
        }
    };

    // حذف کاربر
    const handleDeleteUser = async (user: UserItem, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (
            !confirm(
                `آیا مطمئن هستید که می‌خواهید ${
                    user.full_name || "این کاربر"
                } را حذف کنید؟ این عملیات غیرقابل بازگشت است.`
            )
        )
            return;

        try {
            setActionLoading(true);
            await api.delete(`/admin/users/${user.id}`);
            toast.success("کاربر با موفقیت حذف شد");
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
            if (selectedUser?.id === user.id) {
                setSelectedUser(null);
            }
            router.refresh();
        } catch (error) {
            toast.error("خطا در حذف کاربر");
        } finally {
            setActionLoading(false);
        }
    };

    // فیلتر جستجو
    const filteredUsers = users.filter((u) => {
        const matchesQuery =
            !searchQuery.trim() ||
            (u.full_name && u.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (u.phone && u.phone.includes(searchQuery));

        if (!matchesQuery) return false;

        if (statusFilter === "all") return true;
        if (statusFilter === "graduated") return u.learning_status_key === "graduated";
        if (statusFilter === "learning") return u.learning_status_key === "learning";
        if (statusFilter === "not_started") return u.learning_status_key === "not_started";
        if (statusFilter === "admin") return u.role === "admin";

        return true;
    });

    return (
        <div className="space-y-4">
            {fetchError && (
                <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-red-700 dark:text-red-300">
                    <div className="break-all">
                        <span className="font-bold">خطا در دریافت کاربران از سرور: </span>
                        <span dir="ltr">{fetchError}</span>
                    </div>
                    <button
                        onClick={handleReloadUsers}
                        disabled={reloading}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shrink-0 disabled:opacity-50"
                    >
                        {reloading ? "در حال تلاش..." : "تلاش مجدد"}
                    </button>
                </div>
            )}

            {/* نوار جستجو و فیلتر */}
            <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
                <div className="flex-1 relative">
                    <Search
                        size={18}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                    <input
                        type="text"
                        placeholder="جستجو بر اساس نام، ایمیل، شماره موبایل..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pr-10 pl-4 py-2.5 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-stone-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 dark:text-white"
                    >
                        <option value="all">همه کاربران ({users.length})</option>
                        <option value="graduated">🎓 فارغ‌التحصیلان</option>
                        <option value="learning">📚 در حال یادگیری</option>
                        <option value="not_started">⏳ شروع نکرده</option>
                        <option value="admin">🛡️ مدیران</option>
                    </select>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px] text-right">
                        <thead className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-stone-600 dark:text-stone-300">
                                    کاربر
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-600 dark:text-stone-300">
                                    آزمون اول (ورودی)
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-600 dark:text-stone-300">
                                    آزمون آخر (نهایی)
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-600 dark:text-stone-300">
                                    وضعیت فعلی
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-600 dark:text-stone-300">
                                    نقش
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-600 dark:text-stone-300 text-center">
                                    عملیات
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs sm:text-sm">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-stone-400">
                                        کاربری با این مشخصات یافت نشد.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors cursor-pointer group"
                                        title="برای مشاهده کارنامه و جزئیات کلیک کنید"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-sage-100 dark:bg-sage-900/40 flex items-center justify-center text-sage-600 dark:text-sage-400 font-bold text-xs shrink-0">
                                                    {user.full_name ? user.full_name[0] : "ک"}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-stone-800 dark:text-stone-100 group-hover:text-sage-600 transition-colors">
                                                        {user.full_name || "بدون نام"}
                                                    </div>
                                                    <div className="text-[11px] text-stone-400 font-mono">
                                                        {user.phone || user.email || "-"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* نمره آزمون اول */}
                                        <td className="px-6 py-4">
                                            {user.pretest_score !== null && user.pretest_score !== undefined ? (
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200/60 dark:border-blue-800">
                                                    <span>{user.pretest_score}</span>
                                                    <span className="text-[10px] text-blue-500 font-normal">/ ۱۰۰</span>
                                                </div>
                                            ) : (
                                                <span className="text-stone-400 text-xs">-</span>
                                            )}
                                        </td>

                                        {/* نمره آزمون آخر */}
                                        <td className="px-6 py-4">
                                            {user.posttest_score !== null && user.posttest_score !== undefined ? (
                                                <div
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs border ${
                                                        user.posttest_score >= 60
                                                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800"
                                                            : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800"
                                                    }`}
                                                >
                                                    <Award size={13} />
                                                    <span>{user.posttest_score}</span>
                                                    <span className="text-[10px] font-normal">/ ۱۰۰</span>
                                                </div>
                                            ) : (
                                                <span className="text-stone-400 text-xs">-</span>
                                            )}
                                        </td>

                                        {/* وضعیت فعلی */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    user.learning_status_key === "graduated"
                                                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                                                        : user.learning_status_key === "learning"
                                                        ? "bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300"
                                                        : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                                                }`}
                                            >
                                                {user.learning_status || "شروع نکرده"}
                                            </span>
                                        </td>

                                        {/* نقش */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                    user.role === "admin"
                                                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                                        : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                                                }`}
                                            >
                                                {user.role === "admin" ? "مدیر" : "کاربر"}
                                            </span>
                                        </td>

                                        {/* عملیات */}
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    title="مشاهده کارنامه و پرونده"
                                                    className="p-1.5 text-sage-600 hover:bg-sage-50 dark:hover:bg-sage-900/30 rounded-lg transition-colors"
                                                >
                                                    <Eye size={17} />
                                                </button>

                                                <button
                                                    onClick={(e) => handleToggleRole(user, e)}
                                                    title="تغییر سطح دسترسی"
                                                    disabled={actionLoading}
                                                    className={`p-1.5 rounded-lg transition-colors ${
                                                        user.role === "admin"
                                                            ? "text-purple-600 bg-purple-50 dark:bg-purple-900/20"
                                                            : "text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                                                    }`}
                                                >
                                                    <ShieldCheck size={17} />
                                                </button>

                                                <button
                                                    onClick={(e) => handleDeleteUser(user, e)}
                                                    title="حذف کاربر"
                                                    disabled={actionLoading}
                                                    className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {filteredUsers.length === 0 ? (
                    <div className="p-8 text-center text-stone-400 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
                        کاربری یافت نشد.
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm active:scale-[0.99] transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div>
                                    <div className="font-bold text-stone-800 dark:text-stone-100 text-sm">
                                        {user.full_name || "بدون نام"}
                                    </div>
                                    <div className="text-xs text-stone-400 font-mono mt-0.5">
                                        {user.phone || user.email || "-"}
                                    </div>
                                </div>
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                        user.role === "admin"
                                            ? "bg-purple-100 text-purple-700"
                                            : "bg-stone-100 text-stone-600"
                                    }`}
                                >
                                    {user.role === "admin" ? "مدیر" : "کاربر"}
                                </span>
                            </div>

                            {/* نمرات و وضعیت در موبایل */}
                            <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-stone-100 dark:border-stone-800 text-xs">
                                <div className="bg-stone-50 dark:bg-stone-800/50 p-2 rounded-xl">
                                    <div className="text-[10px] text-stone-400 mb-0.5">آزمون اول:</div>
                                    <div className="font-bold text-blue-600 dark:text-blue-400">
                                        {user.pretest_score !== null && user.pretest_score !== undefined
                                            ? `${user.pretest_score} از ۱۰۰`
                                            : "شرکت نکرده"}
                                    </div>
                                </div>

                                <div className="bg-stone-50 dark:bg-stone-800/50 p-2 rounded-xl">
                                    <div className="text-[10px] text-stone-400 mb-0.5">آزمون آخر:</div>
                                    <div className="font-bold text-emerald-600 dark:text-emerald-400">
                                        {user.posttest_score !== null && user.posttest_score !== undefined
                                            ? `${user.posttest_score} از ۱۰۰`
                                            : "شرکت نکرده"}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2.5 flex items-center justify-between">
                                <span className="text-xs font-bold text-stone-600 dark:text-stone-300">
                                    {user.learning_status || "شروع نکرده"}
                                </span>

                                <span className="text-xs text-sage-600 font-bold flex items-center gap-1">
                                    <span>مشاهده کارنامه</span>
                                    <Eye size={14} />
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ================= پاپ‌آپ (مودال) کارنامه و مشخصات کاربر ================= */}
            {selectedUser && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
                    dir="rtl"
                >
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* هدر مودال */}
                        <div className="p-4 sm:p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-800/40">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-sage-100 dark:bg-sage-900/40 flex items-center justify-center text-sage-600 dark:text-sage-400 font-bold text-lg shrink-0">
                                    {selectedUser.full_name ? selectedUser.full_name[0] : "ک"}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base sm:text-lg font-bold text-stone-800 dark:text-white">
                                            {selectedUser.full_name || "کاربر سایت"}
                                        </h3>
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                selectedUser.role === "admin"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-stone-100 text-stone-600"
                                            }`}
                                        >
                                            {selectedUser.role === "admin" ? "مدیر" : "کاربر"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-stone-400 mt-0.5">
                                        عضویت: {formatDate(selectedUser.created_at)}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* محتوای مودال */}
                        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
                            {/* وضعیت فعلی دوره */}
                            <div className="bg-sage-50 dark:bg-sage-950/40 border border-sage-200 dark:border-sage-800/60 rounded-2xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                                        وضعیت فعلی در دوره
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            selectedUser.learning_status_key === "graduated"
                                                ? "bg-emerald-500 text-white"
                                                : selectedUser.learning_status_key === "learning"
                                                ? "bg-sage-600 text-white"
                                                : "bg-stone-400 text-white"
                                        }`}
                                    >
                                        {selectedUser.learning_status || "شروع نکرده"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300 mt-2">
                                    <span>دروس گذرانده شده:</span>
                                    <span className="font-bold">
                                        {selectedUser.completed_lessons || 0} از {selectedUser.total_lessons || 0} درس
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full mt-1.5 overflow-hidden">
                                    <div
                                        className="h-full bg-sage-600 rounded-full transition-all"
                                        style={{
                                            width: `${
                                                selectedUser.total_lessons
                                                    ? Math.round(
                                                          ((selectedUser.completed_lessons || 0) /
                                                              selectedUser.total_lessons) *
                                                              100
                                                      )
                                                    : 0
                                            }%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* کارت‌های نمرات آزمون اول و آخر */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {/* آزمون اول */}
                                <div className="bg-white dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/70 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                <TrendingUp size={18} />
                                            </div>
                                            <span className="text-xs font-bold text-stone-700 dark:text-stone-200">
                                                نمره آزمون اول (ارزیابی اولیه)
                                            </span>
                                        </div>
                                    </div>

                                    {selectedUser.pretest_score !== null && selectedUser.pretest_score !== undefined ? (
                                        <div>
                                            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                                                {selectedUser.pretest_score}
                                                <span className="text-sm font-normal text-stone-400 mr-1.5">
                                                    از ۱۰۰
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-stone-400 mt-1">
                                                تاریخ شرکت: {formatDate(selectedUser.pretest_date)}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="py-2 text-stone-400 text-xs">
                                            کاربر هنوز در آزمون اولیه شرکت نکرده است.
                                        </div>
                                    )}
                                </div>

                                {/* آزمون آخر */}
                                <div className="bg-white dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/70 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                                <Award size={18} />
                                            </div>
                                            <span className="text-xs font-bold text-stone-700 dark:text-stone-200">
                                                نمره آزمون آخر (ارزیابی نهایی)
                                            </span>
                                        </div>
                                    </div>

                                    {selectedUser.posttest_score !== null && selectedUser.posttest_score !== undefined ? (
                                        <div>
                                            <div
                                                className={`text-3xl font-black ${
                                                    selectedUser.posttest_score >= 60
                                                        ? "text-emerald-600 dark:text-emerald-400"
                                                        : "text-amber-600 dark:text-amber-400"
                                                }`}
                                            >
                                                {selectedUser.posttest_score}
                                                <span className="text-sm font-normal text-stone-400 mr-1.5">
                                                    از ۱۰۰
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-stone-400 mt-1">
                                                {selectedUser.posttest_score >= 60
                                                    ? "قبول شده در آزمون نهایی"
                                                    : "نیاز به تلاش مجدد"} • {formatDate(selectedUser.posttest_date)}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="py-2 text-stone-400 text-xs">
                                            کاربر هنوز به آزمون نهایی نرسیده یا شرکت نکرده است.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* اطلاعات تماس */}
                            <div className="bg-stone-50 dark:bg-stone-800/40 rounded-2xl p-4 border border-stone-200/60 dark:border-stone-800 space-y-2 text-xs">
                                <div className="font-bold text-stone-700 dark:text-stone-200 mb-2">
                                    اطلاعات تماس و حساب:
                                </div>
                                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                                    <Phone size={14} className="text-stone-400" />
                                    <span>شماره همراه:</span>
                                    <span className="font-mono font-bold" dir="ltr">
                                        {selectedUser.phone || "ثبت نشده"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                                    <Mail size={14} className="text-stone-400" />
                                    <span>ایمیل:</span>
                                    <span className="font-mono">{selectedUser.email || "ثبت نشده"}</span>
                                </div>
                            </div>

                            {/* جزئیات تکمیلی پرونده کاربر/مادر */}
                            {selectedUser.profile_details && (
                                <div className="bg-stone-50 dark:bg-stone-800/40 rounded-2xl p-4 border border-stone-200/60 dark:border-stone-800 space-y-2.5 text-xs">
                                    <div className="font-bold text-stone-700 dark:text-stone-200 mb-2">
                                        مشخصات خانوادگی و فرزند:
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-stone-600 dark:text-stone-300">
                                        {selectedUser.profile_details.mother_age && (
                                            <div>سن مادر: <span className="font-bold">{selectedUser.profile_details.mother_age} سال</span></div>
                                        )}
                                        {selectedUser.profile_details.mother_education && (
                                            <div>تحصیلات مادر: <span className="font-bold">{selectedUser.profile_details.mother_education}</span></div>
                                        )}
                                        {selectedUser.profile_details.father_education && (
                                            <div>تحصیلات پدر: <span className="font-bold">{selectedUser.profile_details.father_education}</span></div>
                                        )}
                                        {selectedUser.profile_details.number_of_children !== null && selectedUser.profile_details.number_of_children !== undefined && (
                                            <div>تعداد فرزندان: <span className="font-bold">{selectedUser.profile_details.number_of_children}</span></div>
                                        )}
                                        {selectedUser.profile_details.number_of_teenagers !== null && selectedUser.profile_details.number_of_teenagers !== undefined && (
                                            <div>فرزندان نوجوان: <span className="font-bold">{selectedUser.profile_details.number_of_teenagers}</span></div>
                                        )}
                                        {selectedUser.profile_details.teenager_gender && (
                                            <div>جنسیت نوجوان: <span className="font-bold">{selectedUser.profile_details.teenager_gender === 'boy' ? 'پسر' : selectedUser.profile_details.teenager_gender === 'girl' ? 'دختر' : selectedUser.profile_details.teenager_gender}</span></div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* فوتر مودال */}
                        <div className="p-4 sm:p-5 border-t border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleToggleRole(selectedUser)}
                                    disabled={actionLoading}
                                    className="px-3.5 py-2 rounded-xl text-xs font-bold border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 transition-colors"
                                >
                                    {selectedUser.role === "admin" ? "تغییر به کاربر عادی" : "ارتقا به مدیر"}
                                </button>
                            </div>

                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-5 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                            >
                                بستن
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

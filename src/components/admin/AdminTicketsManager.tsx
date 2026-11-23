"use client";

import { useState, useEffect } from "react";
import {
    LifeBuoy,
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    Send,
    Trash2,
    RefreshCw,
    X,
    Filter,
    MessageSquare,
    AlertTriangle,
    User,
    Phone,
    Mail,
    ChevronDown,
} from "lucide-react";
import api from "@/lib/axios";

interface TicketMessage {
    id: number;
    ticket_id: number;
    user_id: number;
    message: string;
    is_admin: boolean;
    created_at: string;
    user?: {
        name: string;
    };
}

interface Ticket {
    id: number;
    user_id: number;
    subject: string;
    category: string;
    status: "pending" | "answered" | "closed";
    priority: "low" | "medium" | "high";
    created_at: string;
    updated_at: string;
    messages_count?: number;
    user?: {
        id: number;
        name: string;
        phone?: string;
        email?: string;
        profile?: {
            full_name?: string;
            role?: string;
        };
    };
    messages?: TicketMessage[];
}

interface Stats {
    total: number;
    pending: number;
    answered: number;
    closed: number;
}

const CATEGORY_MAP: Record<string, string> = {
    technical: "مشکل فنی سایت",
    course: "سوال آموزشی دوره",
    account: "مشکل حساب کاربری",
    suggestion: "انتقاد یا پیشنهاد",
    other: "سایر موارد",
};

const PRIORITY_MAP: Record<string, { label: string; bg: string; text: string }> = {
    high: {
        label: "فوری",
        bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
        text: "text-red-700 dark:text-red-400",
    },
    medium: {
        label: "متوسط",
        bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
        text: "text-amber-700 dark:text-amber-400",
    },
    low: {
        label: "عادی",
        bg: "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700",
        text: "text-stone-600 dark:text-stone-400",
    },
};

const STATUS_MAP: Record<string, { label: string; bg: string; text: string; icon: any }> = {
    pending: {
        label: "در انتظار پاسخ",
        bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
        text: "text-amber-700 dark:text-amber-400",
        icon: Clock,
    },
    answered: {
        label: "پاسخ داده شده",
        bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
        text: "text-emerald-700 dark:text-emerald-400",
        icon: CheckCircle2,
    },
    closed: {
        label: "بسته شده",
        bg: "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700",
        text: "text-stone-600 dark:text-stone-400",
        icon: XCircle,
    },
};

function formatDate(dateStr: string) {
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    } catch {
        return dateStr;
    }
}

export default function AdminTicketsManager() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        pending: 0,
        answered: 0,
        closed: 0,
    });
    const [loading, setLoading] = useState(true);

    // فیلترها
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // تیکت انتخاب شده برای گفتگو
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [ticketDetailsLoading, setTicketDetailsLoading] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replySubmitting, setReplySubmitting] = useState(false);
    const [nextStatus, setNextStatus] = useState<"answered" | "closed" | "pending">("answered");

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const params: Record<string, string> = {};
            if (statusFilter !== "all") params.status = statusFilter;
            if (categoryFilter !== "all") params.category = categoryFilter;
            if (searchQuery.trim()) params.search = searchQuery.trim();

            const res = await api.get<{
                success: boolean;
                tickets: Ticket[];
                stats: Stats;
            }>("/admin/tickets", { params });

            if (res.data.success) {
                setTickets(res.data.tickets);
                if (res.data.stats) {
                    setStats(res.data.stats);
                }
            }
        } catch (err: any) {
            console.error("Error fetching admin tickets:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [statusFilter, categoryFilter]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchTickets();
    };

    const openTicketModal = async (ticketId: number) => {
        try {
            setTicketDetailsLoading(true);
            const res = await api.get<{ success: boolean; ticket: Ticket }>(
                `/admin/tickets/${ticketId}`
            );
            if (res.data.success) {
                setSelectedTicket(res.data.ticket);
                setNextStatus("answered");
            }
        } catch (err: any) {
            console.error("Error loading ticket:", err);
            alert("خطا در بارگذاری اطلاعات تیکت.");
        } finally {
            setTicketDetailsLoading(false);
        }
    };

    const handleAdminReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket || !replyText.trim()) return;

        try {
            setReplySubmitting(true);
            const res = await api.post(`/admin/tickets/${selectedTicket.id}/reply`, {
                message: replyText,
                status: nextStatus,
            });

            if (res.data.success) {
                setReplyText("");
                openTicketModal(selectedTicket.id);
                fetchTickets();
            }
        } catch (err: any) {
            console.error("Error sending admin reply:", err);
            alert(err.response?.data?.message || "خطا در ارسال پاسخ.");
        } finally {
            setReplySubmitting(false);
        }
    };

    const handleQuickStatusChange = async (ticketId: number, newStatus: string) => {
        try {
            const res = await api.put(`/admin/tickets/${ticketId}/status`, {
                status: newStatus,
            });

            if (res.data.success) {
                if (selectedTicket?.id === ticketId) {
                    setSelectedTicket({
                        ...selectedTicket,
                        status: newStatus as any,
                    });
                }
                fetchTickets();
            }
        } catch (err: any) {
            console.error("Error changing ticket status:", err);
            alert("خطا در تغییر وضعیت تیکت.");
        }
    };

    const handleDeleteTicket = async (ticketId: number) => {
        if (!confirm("آیا از حذف کامل این تیکت و تمام پیام‌های آن اطمینان دارید؟")) return;

        try {
            const res = await api.delete(`/admin/tickets/${ticketId}`);
            if (res.data.success) {
                if (selectedTicket?.id === ticketId) {
                    setSelectedTicket(null);
                }
                fetchTickets();
            }
        } catch (err: any) {
            console.error("Error deleting ticket:", err);
            alert("خطا در حذف تیکت.");
        }
    };

    return (
        <div className="space-y-6 text-right" dir="rtl">
            {/* عنوان صفحه */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-stone-800 dark:text-white flex items-center gap-3">
                        <LifeBuoy className="text-sage-600" size={32} />
                        مدیریت تیکت‌ها و پشتیبانی
                    </h1>
                    <p className="text-stone-500 mt-1.5 text-xs sm:text-sm font-medium">
                        پاسخگویی به مشکلات کاربران، سوالات دوره‌ها و پیام‌های ارسالی
                    </p>
                </div>

                <button
                    onClick={fetchTickets}
                    className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    <span>بروزرسانی لیست</span>
                </button>
            </div>

            {/* کارت‌های آمار */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div
                    onClick={() => setStatusFilter("all")}
                    className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                        statusFilter === "all"
                            ? "bg-sage-50/70 border-sage-500 dark:bg-sage-950/40"
                            : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300"
                    }`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                            کل تیکت‌ها
                        </span>
                        <MessageSquare className="text-stone-400" size={18} />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-stone-800 dark:text-white">
                        {stats.total}
                    </div>
                </div>

                <div
                    onClick={() => setStatusFilter("pending")}
                    className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                        statusFilter === "pending"
                            ? "bg-amber-50/80 border-amber-500 dark:bg-amber-950/40"
                            : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300"
                    }`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                            در انتظار پاسخ
                        </span>
                        <Clock className="text-amber-500" size={18} />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                        {stats.pending}
                    </div>
                </div>

                <div
                    onClick={() => setStatusFilter("answered")}
                    className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                        statusFilter === "answered"
                            ? "bg-emerald-50/80 border-emerald-500 dark:bg-emerald-950/40"
                            : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300"
                    }`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            پاسخ داده شده
                        </span>
                        <CheckCircle2 className="text-emerald-500" size={18} />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                        {stats.answered}
                    </div>
                </div>

                <div
                    onClick={() => setStatusFilter("closed")}
                    className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                        statusFilter === "closed"
                            ? "bg-stone-100 border-stone-500 dark:bg-stone-800"
                            : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300"
                    }`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-stone-500">بسته شده</span>
                        <XCircle className="text-stone-400" size={18} />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-stone-600 dark:text-stone-400">
                        {stats.closed}
                    </div>
                </div>
            </div>

            {/* بخش فیلتر و جستجو */}
            <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex-1 relative flex items-center"
                >
                    <Search
                        size={18}
                        className="absolute right-3.5 text-stone-400 pointer-events-none"
                    />
                    <input
                        type="text"
                        placeholder="جستجو در موضوع، نام کاربر، شماره موبایل..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pr-10 pl-24 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 dark:text-white"
                    />
                    <button
                        type="submit"
                        className="absolute left-1.5 px-3 py-1 bg-sage-600 hover:bg-sage-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                        جستجو
                    </button>
                </form>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500">
                        <Filter size={15} />
                        <span>دسته:</span>
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 dark:text-white"
                    >
                        <option value="all">همه دسته‌ها</option>
                        <option value="technical">مشکل فنی سایت</option>
                        <option value="course">سوال آموزشی</option>
                        <option value="account">حساب کاربری</option>
                        <option value="suggestion">انتقاد یا پیشنهاد</option>
                        <option value="other">سایر موارد</option>
                    </select>
                </div>
            </div>

            {/* جدول و لیست تیکت‌ها */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="py-16 text-center text-stone-400 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-2 border-sage-500 border-t-transparent rounded-full animate-spin mb-3" />
                        <span className="text-xs sm:text-sm">در حال بارگذاری لیست تیکت‌ها...</span>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="py-16 text-center text-stone-400">
                        <MessageSquare className="mx-auto mb-3 opacity-40" size={40} />
                        <p className="text-sm font-bold text-stone-600 dark:text-stone-300">
                            تیکتی با این مشخصات یافت نشد
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right text-xs sm:text-sm">
                            <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-500 font-bold">
                                <tr>
                                    <th className="py-3.5 px-4">شناسه</th>
                                    <th className="py-3.5 px-4">کاربر</th>
                                    <th className="py-3.5 px-4">موضوع تیکت</th>
                                    <th className="py-3.5 px-4">دسته‌بندی</th>
                                    <th className="py-3.5 px-4">اولویت</th>
                                    <th className="py-3.5 px-4">وضعیت</th>
                                    <th className="py-3.5 px-4">آخرین تغییر</th>
                                    <th className="py-3.5 px-4 text-center">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                                {tickets.map((t) => {
                                    const statusInfo = STATUS_MAP[t.status] || STATUS_MAP.pending;
                                    const priorityInfo = PRIORITY_MAP[t.priority] || PRIORITY_MAP.medium;
                                    const userName =
                                        t.user?.profile?.full_name ||
                                        t.user?.name ||
                                        "کاربر سایت";
                                    const userContact = t.user?.phone || t.user?.email || "-";

                                    return (
                                        <tr
                                            key={t.id}
                                            className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors"
                                        >
                                            <td className="py-4 px-4 font-bold text-stone-400">
                                                #{t.id}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="font-bold text-stone-800 dark:text-stone-100">
                                                    {userName}
                                                </div>
                                                <div className="text-[11px] text-stone-400">
                                                    {userContact}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 font-semibold text-stone-800 dark:text-white max-w-[200px] truncate">
                                                {t.subject}
                                            </td>
                                            <td className="py-4 px-4 text-stone-600 dark:text-stone-300">
                                                <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-[11px] font-medium">
                                                    {CATEGORY_MAP[t.category] || t.category}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[11px] font-bold border ${priorityInfo.bg} ${priorityInfo.text}`}
                                                >
                                                    {priorityInfo.label}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <select
                                                    value={t.status}
                                                    onChange={(e) =>
                                                        handleQuickStatusChange(t.id, e.target.value)
                                                    }
                                                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer focus:outline-none ${statusInfo.bg} ${statusInfo.text}`}
                                                >
                                                    <option value="pending">در انتظار پاسخ</option>
                                                    <option value="answered">پاسخ داده شده</option>
                                                    <option value="closed">بسته شده</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-4 text-[11px] text-stone-500 dark:text-stone-400">
                                                {formatDate(t.updated_at || t.created_at)}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openTicketModal(t.id)}
                                                        className="px-3 py-1.5 bg-sage-600 hover:bg-sage-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                                                    >
                                                        <MessageSquare size={14} />
                                                        <span>مشاهده و پاسخ</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteTicket(t.id)}
                                                        title="حذف تیکت"
                                                        className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ================= مودال گفتگو و پاسخ ادمین ================= */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[750px]">
                        {/* هدر گفتگو */}
                        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <span className="text-xs font-bold text-stone-400">
                                        #{selectedTicket.id}
                                    </span>
                                    <h2 className="text-sm sm:text-base font-bold text-stone-800 dark:text-white truncate">
                                        {selectedTicket.subject}
                                    </h2>
                                    <span
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${STATUS_MAP[selectedTicket.status]?.bg} ${STATUS_MAP[selectedTicket.status]?.text}`}
                                    >
                                        {STATUS_MAP[selectedTicket.status]?.label}
                                    </span>
                                </div>

                                {/* اطلاعات کاربر */}
                                <div className="mt-2 flex items-center gap-4 flex-wrap text-xs text-stone-500 dark:text-stone-400">
                                    <div className="flex items-center gap-1">
                                        <User size={13} className="text-stone-400" />
                                        <span className="font-semibold text-stone-700 dark:text-stone-200">
                                            {selectedTicket.user?.profile?.full_name ||
                                                selectedTicket.user?.name ||
                                                "کاربر"}
                                        </span>
                                    </div>
                                    {selectedTicket.user?.phone && (
                                        <div className="flex items-center gap-1">
                                            <Phone size={13} className="text-stone-400" />
                                            <span dir="ltr">{selectedTicket.user.phone}</span>
                                        </div>
                                    )}
                                    {selectedTicket.user?.email && (
                                        <div className="flex items-center gap-1">
                                            <Mail size={13} className="text-stone-400" />
                                            <span>{selectedTicket.user.email}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* تاریخچه پیام‌ها */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-100/50 dark:bg-stone-950/50">
                            {ticketDetailsLoading ? (
                                <div className="py-12 flex justify-center">
                                    <div className="w-8 h-8 border-2 border-sage-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                                selectedTicket.messages.map((msg) => {
                                    const isAdmin = msg.is_admin;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col ${isAdmin ? "items-start" : "items-end"}`}
                                        >
                                            <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mb-1 px-1">
                                                {isAdmin ? (
                                                    <span className="font-bold text-sage-600 dark:text-sage-400 bg-sage-50 dark:bg-sage-900/40 px-2 py-0.5 rounded">
                                                        پاسخ شما (پشتیبانی)
                                                    </span>
                                                ) : (
                                                    <span className="font-semibold text-stone-700 dark:text-stone-300">
                                                        کاربر (
                                                        {selectedTicket.user?.name || "کاربر"}
                                                        )
                                                    </span>
                                                )}
                                                <span>•</span>
                                                <span>{formatDate(msg.created_at)}</span>
                                            </div>

                                            <div
                                                className={`max-w-[85%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                                                    isAdmin
                                                        ? "bg-sage-600 text-white rounded-tl-none shadow-sm"
                                                        : "bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-tr-none border border-stone-200/80 dark:border-stone-700 shadow-sm"
                                                }`}
                                            >
                                                {msg.message}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center text-xs text-stone-400 py-6">
                                    پیامی ثبت نشده است.
                                </div>
                            )}
                        </div>

                        {/* فرم ارسال پاسخ ادمین */}
                        <form
                            onSubmit={handleAdminReply}
                            className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
                                    پاسخ شما به کاربر:
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-stone-400">وضعیت بعد از ارسال:</span>
                                    <select
                                        value={nextStatus}
                                        onChange={(e) => setNextStatus(e.target.value as any)}
                                        className="text-xs px-2.5 py-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none dark:text-white"
                                    >
                                        <option value="answered">پاسخ داده شده</option>
                                        <option value="closed">بستن تیکت</option>
                                        <option value="pending">در انتظار پاسخ</option>
                                    </select>
                                </div>
                            </div>

                            <textarea
                                required
                                rows={3}
                                placeholder="متن پاسخ پشتیبانی را بنویسید..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="w-full p-3 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 dark:text-white resize-none"
                            />

                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="submit"
                                    disabled={replySubmitting || !replyText.trim()}
                                    className="px-5 py-2.5 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                                >
                                    {replySubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>در حال ارسال...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={15} />
                                            <span>ارسال پاسخ به کاربر</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

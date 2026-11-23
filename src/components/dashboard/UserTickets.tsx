"use client";

import { useState, useEffect } from "react";
import {
    LifeBuoy,
    Plus,
    MessageSquare,
    Clock,
    CheckCircle2,
    XCircle,
    Send,
    ChevronLeft,
    AlertCircle,
    RefreshCw,
    X,
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
    messages?: TicketMessage[];
}

const CATEGORY_MAP: Record<string, string> = {
    technical: "مشکل فنی یا خطای سایت",
    course: "سوال درباره محتوای دروس",
    account: "مشکل حساب کاربری",
    suggestion: "انتقاد یا پیشنهاد",
    other: "سایر موارد",
};

const STATUS_MAP: Record<string, { label: string; bg: string; text: string; icon: any }> = {
    pending: {
        label: "در انتظار بررسی",
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

export default function UserTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // مودال تیکت جدید
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newSubject, setNewSubject] = useState("");
    const [newCategory, setNewCategory] = useState("technical");
    const [newPriority, setNewPriority] = useState("medium");
    const [newMessage, setNewMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // تیکت انتخاب شده برای مشاهده پیام‌ها
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [ticketDetailsLoading, setTicketDetailsLoading] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replySubmitting, setReplySubmitting] = useState(false);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get<{ success: boolean; tickets: Ticket[] }>("/tickets");
            if (res.data.success) {
                setTickets(res.data.tickets);
            }
        } catch (err: any) {
            console.error("Error fetching tickets:", err);
            setError("خطا در دریافت لیست تیکت‌ها.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const openTicketDetails = async (ticketId: number) => {
        try {
            setTicketDetailsLoading(true);
            const res = await api.get<{ success: boolean; ticket: Ticket }>(`/tickets/${ticketId}`);
            if (res.data.success) {
                setSelectedTicket(res.data.ticket);
            }
        } catch (err: any) {
            console.error("Error fetching ticket details:", err);
            alert("خطا در باز کردن تیکت.");
        } finally {
            setTicketDetailsLoading(false);
        }
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubject.trim() || !newMessage.trim()) {
            alert("لطفاً عنوان و متن تیکت را کامل وارد کنید.");
            return;
        }

        try {
            setSubmitting(true);
            const res = await api.post("/tickets", {
                subject: newSubject,
                category: newCategory,
                priority: newPriority,
                message: newMessage,
            });

            if (res.data.success) {
                setIsCreateOpen(false);
                setNewSubject("");
                setNewMessage("");
                setNewCategory("technical");
                setNewPriority("medium");
                fetchTickets();
            }
        } catch (err: any) {
            console.error("Error creating ticket:", err);
            alert(err.response?.data?.message || "خطا در ثبت تیکت.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket || !replyText.trim()) return;

        try {
            setReplySubmitting(true);
            const res = await api.post(`/tickets/${selectedTicket.id}/reply`, {
                message: replyText,
            });

            if (res.data.success) {
                setReplyText("");
                // رفرش پیام‌های تیکت فعلی
                openTicketDetails(selectedTicket.id);
                // رفرش لیست کل تیکت‌ها
                fetchTickets();
            }
        } catch (err: any) {
            console.error("Error sending reply:", err);
            alert(err.response?.data?.message || "خطا در ارسال پاسخ.");
        } finally {
            setReplySubmitting(false);
        }
    };

    const handleCloseTicket = async (ticketId: number) => {
        if (!confirm("آیا از بستن این تیکت مطمئن هستید؟")) return;

        try {
            const res = await api.put(`/tickets/${ticketId}/close`);
            if (res.data.success) {
                if (selectedTicket?.id === ticketId) {
                    setSelectedTicket({ ...selectedTicket, status: "closed" });
                }
                fetchTickets();
            }
        } catch (err: any) {
            console.error("Error closing ticket:", err);
            alert("خطا در بستن تیکت.");
        }
    };

    return (
        <section className="bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-lg border border-stone-100 dark:border-stone-800 overflow-hidden mb-6 sm:mb-8">
            {/* هدر بخش تیکت‌ها */}
            <div className="p-4 sm:p-6 lg:p-8 border-b border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center shrink-0">
                        <LifeBuoy className="text-sage-600 dark:text-sage-400" size={22} />
                    </div>
                    <div>
                        <h2 className="text-base sm:text-xl font-bold text-stone-800 dark:text-white">
                            پشتیبانی و تیکت‌ها
                        </h2>
                        <p className="text-[11px] sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                            گزارش هرگونه مشکل، انتقاد، پیشنهاد یا سوال درباره دوره‌ها
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                        onClick={fetchTickets}
                        title="بروزرسانی"
                        className="p-2 sm:p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                        <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
                    </button>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-sage-600/20 transition-all hover:shadow-md"
                    >
                        <Plus size={18} />
                        <span>ثبت تیکت جدید</span>
                    </button>
                </div>
            </div>

            {/* محتوا و لیست تیکت‌ها */}
            <div className="p-4 sm:p-6 lg:p-8">
                {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center text-stone-400">
                        <div className="w-8 h-8 border-2 border-sage-500 border-t-transparent rounded-full animate-spin mb-3" />
                        <span className="text-xs sm:text-sm">در حال بارگذاری تیکت‌ها...</span>
                    </div>
                ) : error ? (
                    <div className="py-8 text-center text-red-500 flex flex-col items-center gap-2">
                        <AlertCircle size={24} />
                        <span className="text-xs sm:text-sm">{error}</span>
                        <button
                            onClick={fetchTickets}
                            className="text-xs text-sage-600 underline font-semibold mt-1"
                        >
                            تلاش مجدد
                        </button>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="py-10 sm:py-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-6">
                        <MessageSquare className="text-stone-300 dark:text-stone-700 mb-3" size={36} />
                        <h3 className="text-sm sm:text-base font-bold text-stone-700 dark:text-stone-300">
                            تاکنون تیکتی ثبت نکرده‌اید
                        </h3>
                        <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm">
                            در صورتی که با هر مشکلی در سایت مواجه شدید، روی دکمه «ثبت تیکت جدید» بزنید تا تیم پشتیبانی شما را راهنمایی کند.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tickets.map((ticket) => {
                            const statusInfo = STATUS_MAP[ticket.status] || STATUS_MAP.pending;
                            const StatusIcon = statusInfo.icon;

                            return (
                                <div
                                    key={ticket.id}
                                    onClick={() => openTicketDetails(ticket.id)}
                                    className="p-3.5 sm:p-4 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-sage-300 dark:hover:border-sage-700 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                                                #{ticket.id}
                                            </span>
                                            <h3 className="text-xs sm:text-sm font-bold text-stone-800 dark:text-white truncate">
                                                {ticket.subject}
                                            </h3>
                                            <span className="text-[10px] bg-stone-200/70 dark:bg-stone-700 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-md font-medium">
                                                {CATEGORY_MAP[ticket.category] || ticket.category}
                                            </span>
                                        </div>

                                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                            آخرین به‌روزرسانی: {formatDate(ticket.updated_at || ticket.created_at)}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                        <div
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${statusInfo.bg} ${statusInfo.text}`}
                                        >
                                            <StatusIcon size={14} />
                                            <span>{statusInfo.label}</span>
                                        </div>

                                        <div className="flex items-center gap-1 text-sage-600 dark:text-sage-400 text-xs font-semibold">
                                            <span>مشاهده پیام‌ها</span>
                                            <ChevronLeft size={16} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ================= مودال ثبت تیکت جدید ================= */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <LifeBuoy className="text-sage-600" size={20} />
                                <h3 className="text-sm sm:text-base font-bold text-stone-800 dark:text-white">
                                    ثبت تیکت جدید
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTicket} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
                            <div>
                                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                                    موضوع تیکت <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="مثلاً: مشکل در باز شدن ویدیوهای فصل دوم"
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                                        دسته‌بندی <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 dark:text-white"
                                    >
                                        <option value="technical">مشکل فنی سایت</option>
                                        <option value="course">سوال آموزشی دوره</option>
                                        <option value="account">مشکل حساب کاربری</option>
                                        <option value="suggestion">انتقاد یا پیشنهاد</option>
                                        <option value="other">سایر موارد</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                                        اولویت
                                    </label>
                                    <select
                                        value={newPriority}
                                        onChange={(e) => setNewPriority(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 dark:text-white"
                                    >
                                        <option value="low">عادی</option>
                                        <option value="medium">متوسط</option>
                                        <option value="high">فوری</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                                    متن پیام و شرح مشکل <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="لطفاً مشکل یا سوال خود را با جزئیات کامل بنویسید..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="w-full p-3.5 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 dark:text-white resize-none"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                                >
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold disabled:opacity-50 transition-colors"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>در حال ارسال...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={15} />
                                            <span>ارسال تیکت</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= مودال جزئیات و گفتگوی تیکت ================= */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[700px]">
                        {/* هدر مودال تیکت */}
                        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-800/40">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-stone-400">
                                        #{selectedTicket.id}
                                    </span>
                                    <h3 className="text-xs sm:text-base font-bold text-stone-800 dark:text-white truncate">
                                        {selectedTicket.subject}
                                    </h3>
                                    <span
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${STATUS_MAP[selectedTicket.status]?.bg} ${STATUS_MAP[selectedTicket.status]?.text}`}
                                    >
                                        {STATUS_MAP[selectedTicket.status]?.label}
                                    </span>
                                </div>
                                <p className="text-[10px] sm:text-xs text-stone-400 mt-1">
                                    دسته‌بندی: {CATEGORY_MAP[selectedTicket.category] || selectedTicket.category} • تاریخ: {formatDate(selectedTicket.created_at)}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                {selectedTicket.status !== "closed" && (
                                    <button
                                        onClick={() => handleCloseTicket(selectedTicket.id)}
                                        className="text-[11px] font-bold text-stone-500 hover:text-red-500 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-red-200 transition-colors"
                                    >
                                        بستن تیکت
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* بخش چت و پیام‌ها */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-100/40 dark:bg-stone-950/40">
                            {ticketDetailsLoading ? (
                                <div className="py-12 flex justify-center">
                                    <div className="w-7 h-7 border-2 border-sage-500 border-t-transparent rounded-full animate-spin" />
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
                                                        پشتیبانی نوآر
                                                    </span>
                                                ) : (
                                                    <span className="font-semibold text-stone-600 dark:text-stone-300">
                                                        شما
                                                    </span>
                                                )}
                                                <span>•</span>
                                                <span>{formatDate(msg.created_at)}</span>
                                            </div>

                                            <div
                                                className={`max-w-[85%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                                                    isAdmin
                                                        ? "bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-tl-none border border-stone-200/80 dark:border-stone-700 shadow-sm"
                                                        : "bg-sage-600 text-white rounded-tr-none shadow-sm"
                                                }`}
                                            >
                                                {msg.message}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center text-xs text-stone-400 py-6">
                                    هیچ پیامی در این تیکت ثبت نشده است.
                                </div>
                            )}
                        </div>

                        {/* فرم ارسال پاسخ */}
                        {selectedTicket.status === "closed" ? (
                            <div className="p-4 bg-stone-100 dark:bg-stone-800/80 text-center text-xs text-stone-500 border-t border-stone-200 dark:border-stone-700">
                                این تیکت بسته شده است و امکان ارسال پاسخ جدید وجود ندارد. در صورت نیاز می‌توانید یک تیکت جدید ثبت کنید.
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSendReply}
                                className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    required
                                    placeholder="پاسخ خود را اینجا بنویسید..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 dark:text-white"
                                />
                                <button
                                    type="submit"
                                    disabled={replySubmitting || !replyText.trim()}
                                    className="px-4 py-2.5 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 disabled:opacity-50 transition-colors shrink-0"
                                >
                                    {replySubmitting ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={15} />
                                            <span className="hidden sm:inline">ارسال پاسخ</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

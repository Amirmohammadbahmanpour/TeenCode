// app/(admin)/admin/comments/page.tsx

import { supabase } from "@/lib/supabase";
import { MessageSquare, User, FileText, Clock } from "lucide-react";
import { CommentActions } from "@/components/admin/CommentActions";

// برای حل مشکل نمایش ندادن داده‌های جدید
export const dynamic = 'force-dynamic';

interface CommentItem {
    id: string;
    content: string;
    is_approved: boolean;
    created_at: string;
    profiles: { full_name: string | null } | null;
    posts: { title: string | null } | null;
}

export default async function AdminComments() {
    const { data, error } = await supabase
        .from("comments")
        .select(`
          id, 
          content, 
          is_approved, 
          created_at,
          profiles:user_id (full_name),
          posts:post_id (title)
        `)
        .order("created_at", { ascending: false });
    // برای دیباگ: اگر دیتایی نمی‌بینی، کنسول ترمینال را چک کن
    if (error) {
        console.error("Supabase Error:", error);
    }

    const comments = (data as unknown as CommentItem[]) || [];

    return (
        <div className="space-y-8 text-right" dir="rtl">
            <div>
                <h1 className="text-3xl font-black text-stone-800 dark:text-white flex items-center gap-3">
                    <MessageSquare className="text-sage-600" size={32} />
                    نظرات وبلاگ ({comments.length})
                </h1>
                <p className="text-stone-500 mt-2 font-medium">مدیریت نظرات کاربران</p>
            </div>

            <div className="grid gap-4">
                {comments.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-[3rem] text-stone-400">
                        <p className="text-lg">هنوز هیچ نظری پیدا نشد.</p>
                        {/* نمایش خطای احتمالی برای ادمین */}
                        {error && <p className="text-red-400 mt-2 text-sm">{error.message}</p>}
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                        >
                            <div className="flex-1 space-y-4 text-right">
                                <div className="flex flex-wrap gap-4 items-center justify-start">
                                    <div className="flex items-center gap-1.5 text-sage-700 bg-sage-50 px-3 py-1 rounded-full text-xs font-bold">
                                        <User size={14} />
                                        <span>{comment.profiles?.full_name || "کاربر ناشناس"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-stone-500 text-xs font-bold">
                                        <FileText size={14} />
                                        <span>مقاله: {comment.posts?.title || "نامشخص"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-stone-400 text-xs font-medium">
                                        <Clock size={14} />
                                        <span dir="ltr">{new Date(comment.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                <p className="text-stone-700 dark:text-stone-300 text-lg leading-relaxed font-medium">
                                    {comment.content}
                                </p>
                            </div>

                            <div className="shrink-0">
                                <CommentActions commentId={comment.id} isApproved={comment.is_approved} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
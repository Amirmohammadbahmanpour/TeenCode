"use client";
import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import api from '@/lib/axios';
import toast from "react-hot-toast";

interface CommentFormProps {
  postId: string;
  parentId?: string | null; 
}

export function CommentForm({ postId, parentId = null }: CommentFormProps) {
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setLoading(true);
        
        const token = auth.getToken();
        if (!token) {
            const currentPath = window.location.pathname;
            router.push(`/login?returnTo=${currentPath}`);
            setLoading(false);
            return;
        }

        try {
            await api.post('/comments', {
                post_id: postId,
                content: comment,
                parent_id: parentId,
            });
            
            setSent(true);
            setComment('');
            toast.success("نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود");
            setTimeout(() => {
                router.refresh();
            }, 1500);
        } catch (error) {
            console.error(error);
            toast.error("خطا در ثبت نظر");
        }
        setLoading(false);
    }

    if (sent) {
        return (
            <div className="bg-sage-50 border border-sage-100 p-8 rounded-[2.5rem] text-center animate-in fade-in zoom-in duration-300">
                <p className="text-sage-700 font-black text-lg">سپاس از نگاهت! ❤️</p>
                <p className="text-sage-600 text-sm mt-2 font-medium">نظر شما پس از تایید مدیریت، در اینجا نمایش داده خواهد شد.</p>
                <button onClick={() => setSent(false)} className="mt-4 text-xs text-sage-500 font-bold underline">ارسال نظر دیگر</button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="relative group">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={parentId ? "پاسخ خود را اینجا بنویس..." : "نظر خود را اینجا بنویس..."}
                className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-8 pb-20 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-4 focus:ring-sage-500/5 transition-all min-h-[200px] font-medium text-right"
                dir="rtl"
            />
            <button
                type="submit"
                disabled={loading || !comment.trim()}
                className="absolute bottom-6 left-6 bg-sage-600 text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-sage-700 transition-all shadow-xl shadow-sage-600/20 disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                <span>{parentId ? "ارسال پاسخ" : "ارسال دیدگاه"}</span>
            </button>
        </form>
    )
}
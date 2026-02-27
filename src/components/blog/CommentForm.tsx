"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

// اضافه کردن parentId به اینترفیس برای رفع ارور TS
interface CommentFormProps {
  postId: string;
  parentId?: string | null; 
}

export function CommentForm({ postId, parentId = null }: CommentFormProps) {
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!comment.trim()) return

        setLoading(true)
        
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            const currentPath = window.location.pathname;
            router.push(`/login?returnTo=${currentPath}`);
            setLoading(false)
            return
        }

        const { error } = await supabase
            .from('comments')
            .insert([
                { 
                    post_id: postId, 
                    user_id: user.id, 
                    content: comment,
                    parent_id: parentId, // این فیلد برای ساختار درختی حیاتی است
                    is_approved: false 
                }
            ])

        if (!error) {
            setSent(true)
            setComment('')
        } else {
            console.error(error)
            alert('خطا در ثبت نظر')
        }
        setLoading(false)
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
                placeholder={parentId ? "پاسخ خود را اینجا بنویس..." : "اینجا بنویس..."}
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
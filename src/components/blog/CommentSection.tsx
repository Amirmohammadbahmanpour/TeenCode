"use client";
import { useState } from 'react';
import { User, Reply, X } from 'lucide-react';
import { CommentForm } from './CommentForm';
import { LikeButton } from './LikeButton';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

interface Profile {
    name: string | null;
}

interface LikeCount {
    count: number;
}

interface CommentWithLikes {
    id: string;
    content: string;
    created_at: string;
    is_approved: boolean;
    parent_id: string | null;
    user: Profile | null;
    comment_likes: LikeCount[];
    replies?: CommentWithLikes[];
}

interface CommentSectionProps {
    comments: CommentWithLikes[];
    postId: string;
    userId: string | null;
}

// کامپوننت داخلی برای رندر بازگشتی نظرات و ریپلای‌ها
const RenderComments = ({ 
    comments, 
    level = 0,
    setReplyTo,
    userId
}: { 
    comments: CommentWithLikes[];
    level: number;
    setReplyTo: (val: {id: string, name: string}) => void;
    userId: string | null;
}) => {
    const router = useRouter();

    if (comments.length === 0) return null;

    return (
        <div className={`${level > 0 ? "mr-4 md:mr-10 border-r-2 border-stone-200 dark:border-stone-800 pr-4 mt-4 space-y-4" : "space-y-6"}`}>
            {comments.map((comment) => (
                <div key={comment.id} className="group/item">
                    {/* کارت نظر */}
                    <div className={`bg-white dark:bg-stone-900/50 p-5 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm transition-all hover:shadow-md ${level > 0 ? 'bg-stone-50/40 dark:bg-stone-800/20' : ''}`}>
                        {/* هدر نظر: کاربر و تاریخ */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-sage-100 dark:bg-sage-900/50 flex items-center justify-center">
                                    <User size={14} className="text-sage-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-stone-800 dark:text-stone-200">
                                        {comment.user?.name || "کاربر ناشناس"}
                                    </p>
                                    <p className="text-[9px] text-stone-400">
                                        {new Date(comment.created_at).toLocaleDateString('fa-IR')}
                                    </p>
                                </div>
                            </div>
                            
                            {/* دکمه‌های لایک و پاسخ */}
                            <div className="flex items-center gap-2">
                                <LikeButton 
                                    id={comment.id} 
                                    type="comment" 
                                    initialLikes={comment.comment_likes?.[0]?.count || 0} 
                                    userId={userId} 
                                />
                                <button 
                                    onClick={() => {
                                        const token = auth.getToken();
                                        if (!token) {
                                            router.push('/login');
                                            return;
                                        }
                                        setReplyTo({ id: comment.id, name: comment.user?.name || "کاربر" });
                                        document.getElementById('comment-form-container')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="text-sage-600 hover:text-sage-700 flex items-center gap-1 text-xs font-black transition-colors"
                                >
                                    <Reply size={12} /> پاسخ
                                </button>
                            </div>
                        </div>
                        
                        {/* متن نظر */}
                        <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed pr-8">
                            {comment.content}
                        </p>
                    </div>

                    {/* نمایش ریپلای‌ها (پاسخ‌ها) */}
                    {comment.replies && comment.replies.length > 0 && (
                        <RenderComments 
                            comments={comment.replies}
                            level={level + 1}
                            setReplyTo={setReplyTo}
                            userId={userId}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

// کامپوننت اصلی
export function CommentSection({ comments, postId, userId }: CommentSectionProps) {
    const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);

    return (
        <div className="space-y-8">
            {/* بخش پاسخ به نظر (که بالای فرم نمایش داده میشه) */}
            <div id="comment-form-container" className="scroll-mt-32">
                {replyTo && (
                    <div className="mb-4 flex items-center justify-between bg-sage-50 dark:bg-sage-900/20 p-3 rounded-xl border border-sage-200 dark:border-sage-800">
                        <div className="flex items-center gap-2 text-sage-700 dark:text-sage-400">
                            <Reply size={14} className="rotate-180" />
                            <span className="text-sm font-black">پاسخ به: {replyTo.name}</span>
                        </div>
                        <button 
                            onClick={() => setReplyTo(null)}
                            className="p-1 hover:bg-sage-200 dark:hover:bg-sage-800 rounded-full transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
                <CommentForm postId={postId} parentId={replyTo?.id || null} />
            </div>

            {/* لیست نظرات اصلی */}
            <div className="mt-8">
                {comments.length > 0 ? (
                    <RenderComments 
                        comments={comments}
                        level={0}
                        setReplyTo={setReplyTo}
                        userId={userId}
                    />
                ) : (
                    <div className="py-16 text-center bg-stone-50/50 dark:bg-stone-900/10 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800">
                        <p className="text-stone-400 font-medium">اولین نفری باش که نظر میده...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
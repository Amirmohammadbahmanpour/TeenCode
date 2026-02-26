"use client"
import { useState } from 'react'
import { User, Reply, X } from 'lucide-react'
import { CommentForm } from './CommentForm'
import { LikeButton } from './LikeButton'

// --- تعاریف تایپ‌ها ---
interface Profile {
  full_name: string | null;
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
  profiles: Profile | null;
  comment_likes: LikeCount[];
}

interface CommentSectionProps {
  comments: CommentWithLikes[];
  postId: string;
  userId: string | null;
}

// --- کامپوننت داخلی برای رندر بازگشتی (Nested) ---
const RenderComments = ({ 
  allComments, 
  parentId, 
  setReplyTo, 
  userId, 
  level = 0 
}: { 
  allComments: CommentWithLikes[], 
  parentId: string | null, 
  setReplyTo: (val: {id: string, name: string}) => void,
  userId: string | null,
  level?: number
}) => {
  // فیلتر کردن کامنت‌هایی که پدرشان ID مشخص شده است
  const children = allComments.filter(c => c.parent_id === parentId);

  if (children.length === 0) return null;

  return (
    <div className={`${level > 0 ? "mr-4 md:mr-10 border-r-2 border-stone-100 dark:border-stone-800 pr-4 mt-4" : "space-y-8"}`}>
      {children.map((comment) => (
        <div key={comment.id} className="group/item">
          <div className={`bg-white dark:bg-stone-900/50 p-6 rounded-[2rem] border border-stone-100 dark:border-stone-800 shadow-sm transition-all hover:shadow-md ${level > 0 ? 'bg-stone-50/40 dark:bg-stone-800/20' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-400 border border-stone-100 dark:border-stone-700">
                  <User size={16} />
                </div>
                <div>
                  <p className="font-black text-sm text-stone-900 dark:text-stone-100">
                    {comment.profiles?.full_name || "کاربر ناشناس"}
                  </p>
                  <p className="text-[9px] text-stone-400 font-bold uppercase">
                    {new Date(comment.created_at).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <LikeButton 
                  id={comment.id} 
                  type="comment" 
                  initialLikes={comment.comment_likes?.[0]?.count || 0} 
                  userId={userId} 
                />
                <button 
                  onClick={() => {
                    setReplyTo({ id: comment.id, name: comment.profiles?.full_name || "کاربر" });
                    document.getElementById('comment-form-container')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sage-600 hover:text-sage-700 flex items-center gap-1 text-xs font-black transition-colors"
                >
                  <Reply size={14} /> پاسخ
                </button>
              </div>
            </div>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed pr-2 font-medium">
              {comment.content}
            </p>
          </div>

          {/* فراخوانی مجدد برای پیدا کردن ریپلای‌هایِ این ریپلای */}
          <RenderComments 
            allComments={allComments} 
            parentId={comment.id} 
            setReplyTo={setReplyTo} 
            userId={userId} 
            level={level + 1} 
          />
        </div>
      ))}
    </div>
  );
};

// --- کامپوننت اصلی ---
export function CommentSection({ comments, postId, userId }: CommentSectionProps) {
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);

  return (
    <div className="space-y-12">
      {/* فرم ثبت نظر با قابلیت تشخیص ریپلای */}
      <div id="comment-form-container" className="scroll-mt-32">
        {replyTo && (
          <div className="mb-4 flex items-center justify-between bg-sage-50 dark:bg-sage-900/20 p-4 rounded-2xl border border-sage-200 dark:border-sage-800 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 text-sage-700 dark:text-sage-400">
              <Reply size={16} className="rotate-180" />
              <span className="text-sm font-black">پاسخ به: {replyTo.name}</span>
            </div>
            <button 
              onClick={() => setReplyTo(null)}
              className="p-1 hover:bg-sage-200 dark:hover:bg-sage-800 rounded-full transition-colors text-sage-500"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <CommentForm postId={postId} parentId={replyTo?.id || null} />
      </div>

      {/* شروع رندر از سطح صفر (بدون parentId) */}
      <div className="mt-16">
        {comments.length > 0 ? (
          <RenderComments 
            allComments={comments} 
            parentId={null} 
            setReplyTo={setReplyTo} 
            userId={userId} 
          />
        ) : (
          <div className="py-20 text-center bg-stone-50/50 dark:bg-stone-900/10 rounded-[3.5rem] border-2 border-dashed border-stone-100 dark:border-stone-800">
            <p className="text-stone-400 font-black italic">اولین نفری باش که نظر میده...</p>
          </div>
        )}
      </div>
    </div>
  );
}
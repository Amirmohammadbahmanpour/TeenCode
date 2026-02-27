"use client"
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
  id: string;          // آیدی پست یا کامنت
  initialLikes: number; // تعداد لایک اولیه از سرور
  type: 'post' | 'comment';
  userId?: string | null;
}

export function LikeButton({ id, initialLikes, type, userId: initialUserId }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const router = useRouter()

  const table = type === 'post' ? 'post_likes' : 'comment_likes';
  const column = type === 'post' ? 'post_id' : 'comment_id';

  // چک کردن وضعیت لایک کاربر هنگام لود شدن
  useEffect(() => {
    const checkInitialStatus = async () => {
      // اگر آیدی از سرور نیامده، یکبار کلاینتی چک می‌کنیم
      let activeUserId = initialUserId;
      if (!activeUserId) {
        const { data: { session } } = await supabase.auth.getSession();
        activeUserId = session?.user?.id;
      }

      if (activeUserId) {
        const { data, error } = await supabase
        .from(table)
        .select('id')
        .eq(column, id)
        .eq('user_id', activeUserId)
        .maybeSingle(); // حتماً maybeSingle باشد // استفاده از maybeSingle برای جلوگیری از ارور 406

        if (data) setHasLiked(true);
      }
    };
    
    checkInitialStatus();
  }, [id, initialUserId, table, column]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // گرفتن سشن لحظه‌ای برای اطمینان
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      const currentPath = window.location.pathname;
      router.push(`/login?returnTo=${currentPath}`);
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    if (hasLiked) {
      // حذف لایک (Unlike)
      const { error } = await supabase
        .from(table)
        .delete()
        .eq(column, id)
        .eq('user_id', currentUserId);

      if (!error) {
        setLikes(prev => Math.max(0, prev - 1));
        setHasLiked(false);
      }
    } else {
      // ثبت لایک (Like)
      const { error } = await supabase
        .from(table)
        .insert([{ [column]: id, user_id: currentUserId }]);

      if (!error) {
        setLikes(prev => prev + 1);
        setHasLiked(true);
      }
    }

    setIsLiking(false);
  };

  return (
    <button 
      onClick={handleLike}
      disabled={isLiking}
      className="flex items-center gap-1.5 group transition-all active:scale-90 disabled:opacity-50"
    >
      <div className={`p-2 rounded-full transition-colors ${hasLiked ? 'bg-red-50 dark:bg-red-500/10' : 'group-hover:bg-stone-100 dark:group-hover:bg-stone-800'}`}>
        <Heart 
          size={18} 
          className={`transition-all duration-300 ${
            hasLiked 
              ? 'fill-red-500 text-red-500 scale-110' 
              : 'text-stone-400 group-hover:text-red-400'
          }`} 
        />
      </div>
      <span className={`text-sm font-[1000] ${hasLiked ? 'text-red-600' : 'text-stone-500'}`}>
        {likes}
      </span>
    </button>
  );
}
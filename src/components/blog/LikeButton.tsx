"use client";
import { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import api from '@/lib/axios';
import toast from "react-hot-toast";

interface LikeButtonProps {
  id: string;
  initialLikes: number;
  type: 'post' | 'comment';
  userId?: string | null;
}

export function LikeButton({ id, initialLikes, type }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const router = useRouter();

  // انتخاب endpoint بر اساس type
  const getEndpoint = () => {
    return type === 'post' ? '/like/post' : '/like/comment';
  };

  const getCheckEndpoint = () => {
    return type === 'post' ? '/like/post/check' : '/like/comment/check';
  };

  const getParamName = () => {
    return type === 'post' ? 'post_id' : 'comment_id';
  };

  useEffect(() => {
    const fetchLikeStatus = async () => {
        const token = auth.getToken();
        if (!token) return;

        try {
            const checkEndpoint = type === 'post' 
                ? `/like/post/check?post_id=${id}` 
                : `/like/comment/check?comment_id=${id}`;
            
            const countEndpoint = type === 'post' 
                ? `/posts/${id}/likes-count` 
                : `/comments/${id}/likes-count`;
            
            const [statusRes, countRes] = await Promise.all([
                api.get(checkEndpoint),
                api.get(countEndpoint)
            ]);
            
            setHasLiked(statusRes.data.liked);
            setLikes(countRes.data.count);
        } catch (error) {
            console.error("Error fetching like data:", error);
        }
    };
    
    fetchLikeStatus();
}, [id, type]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = auth.getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      const paramName = getParamName();
      // ✅ ارسال درخواست لایک
      const response = await api.post(getEndpoint(), { [paramName]: id });
      
      // ✅ به روز رسانی مستقیم با پاسخ سرور
      setHasLiked(response.data.liked);
      setLikes(response.data.count);
      
      console.log("✅ Like toggled:", { liked: response.data.liked, count: response.data.count });
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("خطا در ثبت لایک");
    }

    setIsLiking(false);
  };

  return (
    <button 
      onClick={handleLike}
      disabled={isLiking}
      className="flex items-center gap-1.5 group transition-all active:scale-90 disabled:opacity-50"
    >
      <div className={`p-1.5 rounded-full transition-colors ${hasLiked ? 'bg-red-50 dark:bg-red-500/10' : 'group-hover:bg-stone-100 dark:group-hover:bg-stone-800'}`}>
        {isLiking ? (
          <Loader2 size={16} className="animate-spin text-red-500" />
        ) : (
          <Heart 
            size={16} 
            className={`transition-all duration-300 ${
              hasLiked 
                ? 'fill-red-500 text-red-500 scale-110' 
                : 'text-stone-400 group-hover:text-red-400'
            }`} 
          />
        )}
      </div>
      <span className={`text-xs font-bold ${hasLiked ? 'text-red-600' : 'text-stone-500'}`}>
        {likes}
      </span>
    </button>
  );
}
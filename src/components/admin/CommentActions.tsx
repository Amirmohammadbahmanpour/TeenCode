"use client"
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Check, Trash2, Loader2 } from "lucide-react";

interface CommentActionsProps {
  commentId: string;
  isApproved: boolean;
}

export function CommentActions({ commentId, isApproved }: CommentActionsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // تایید نظر
  const handleApprove = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("comments")
      .update({ is_approved: true })
      .eq("id", commentId);
    
    if (!error) {
      router.refresh(); // بروزرسانی لیست بدون رفرش کل صفحه
    } else {
      alert("خطا در تایید نظر: " + error.message);
    }
    setLoading(false);
  };

  // حذف نظر
  const handleDelete = async () => {
    if (!confirm("آیا از حذف این نظر مطمئن هستید؟")) return;
    
    setLoading(true);
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);
    
    if (!error) {
      router.refresh();
    } else {
      alert("خطا در حذف نظر: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      {/* دکمه تایید فقط اگر نظر تایید نشده باشد نمایش داده می‌شود */}
      {!isApproved && (
        <button 
          onClick={handleApprove}
          disabled={loading}
          className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl hover:bg-emerald-200 transition-all disabled:opacity-50 flex items-center justify-center"
          title="تایید نظر"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
        </button>
      )}
      
      <button 
        onClick={handleDelete}
        disabled={loading}
        className="p-3 bg-red-100 text-red-600 rounded-2xl hover:bg-red-100 transition-all disabled:opacity-50 flex items-center justify-center"
        title="حذف نظر"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
      </button>
    </div>
  );
}
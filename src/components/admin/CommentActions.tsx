"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Trash2, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

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
    try {
      await api.put(`/admin/comments/${commentId}/approve`);
      toast.success("نظر با موفقیت تایید شد");
      router.refresh();
    } catch (error) {
      toast.error("خطا در تایید نظر");
      console.error(error);
    }
    setLoading(false);
  };

  // حذف نظر
  const handleDelete = async () => {
    if (!confirm("آیا از حذف این نظر مطمئن هستید؟")) return;
    
    setLoading(true);
    try {
      await api.delete(`/admin/comments/${commentId}`);
      toast.success("نظر با موفقیت حذف شد");
      router.refresh();
    } catch (error) {
      toast.error("خطا در حذف نظر");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
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
        className="p-3 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition-all disabled:opacity-50 flex items-center justify-center"
        title="حذف نظر"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
      </button>
    </div>
  );
}
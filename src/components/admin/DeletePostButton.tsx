"use client";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface DeleteProps {
  id: string;
  title: string;
}

export function DeletePostButton({ id, title }: DeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm(`آیا از حذف مقاله "${title}" مطمئن هستید؟`)) {
      setIsDeleting(true);
      try {
        await api.delete(`/admin/posts/${id}`);
        toast.success("مقاله با موفقیت حذف شد");
        router.refresh();
      } catch (error) {
        toast.error("خطا در حذف مقاله");
        console.error(error);
      }
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-stone-400 hover:text-red-500 transition-colors disabled:opacity-50"
    >
      {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}
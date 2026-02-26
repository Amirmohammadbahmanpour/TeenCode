"use client"
import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      const { error } = await supabase.from("posts").delete().eq("id", id);
      
      if (!error) {
        router.refresh(); // بروزرسانی لیست بدون رفرش کل صفحه
      } else {
        alert("خطا در حذف: " + error.message);
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
      <Trash2 size={18} />
    </button>
  );
}
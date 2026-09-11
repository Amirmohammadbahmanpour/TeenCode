"use client";
import { useState } from "react";
import { ShieldCheck, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface UserActionsProps {
  userId: string;
  currentRole: string;
}

export function UserActions({ userId, currentRole }: UserActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // تغییر نقش
  const toggleRole = async () => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`آیا مطمئن هستید که می‌خواهید نقش این کاربر را به ${newRole === 'admin' ? 'مدیر' : 'کاربر عادی'} تغییر دهید؟`)) return;

    setLoading(true);

    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success("نقش کاربر با موفقیت تغییر کرد");
      router.refresh();
    } catch (error) {
      toast.error("خطا در تغییر نقش کاربر");
      console.error(error);
    }

    setLoading(false);
  };

  // حذف کاربر
  const deleteUser = async () => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟ این عملیات غیرقابل بازگشت است.")) return;

    setLoading(true);

    try {
      // توجه: حذف کاربر از طریق API مخصوص ادمین
      await api.delete(`/admin/users/${userId}`);
      toast.success("کاربر با موفقیت حذف شد");
      router.refresh();
    } catch (error) {
      toast.error("خطا در حذف کاربر");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={toggleRole}
        disabled={loading}
        title="تغییر سطح دسترسی"
        className={`p-2 rounded-lg transition-colors ${
          currentRole === 'admin' 
            ? 'text-sage-600 bg-sage-50 hover:bg-sage-100' 
            : 'text-stone-400 hover:bg-stone-100'
        }`}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
      </button>

      <button 
        onClick={deleteUser}
        disabled={loading}
        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="حذف کاربر"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
      </button>
    </div>
  );
}
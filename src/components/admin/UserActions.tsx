"use client"
import { useState } from "react";
import { ShieldCheck, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
    if (!confirm(`آیا مطمئن هستید که می‌خواهید نقش این کاربر را به ${newRole} تغییر دهید؟`)) return;

    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (!error) {
      router.refresh();
    } else {
      alert("خطا در تغییر نقش کاربر");
    }

    setLoading(false);
  };

  // ✅ حذف کاربر
  const deleteUser = async () => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟ این عملیات غیرقابل بازگشت است.")) return;

    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (!error) {
      router.refresh();
    } else {
      alert("خطا در حذف کاربر");
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
        <ShieldCheck size={18} />
      </button>

      <button 
        onClick={deleteUser}
        disabled={loading}
        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="حذف کاربر"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
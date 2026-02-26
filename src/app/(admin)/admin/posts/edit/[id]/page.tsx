"use client"
import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface PostData {
  title: string;
  description: string;
  image_url: string;
  content: string; // اگر متن کامل مقاله را هم داری
}

export default function EditPost() {
  const router = useRouter();
  const { id } = useParams(); // گرفتن آی‌دی از آدرس
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<PostData>({
    title: "",
    description: "",
    image_url: "",
    content: ""
  });

  useEffect(() => {
    // لود کردن اطلاعات قبلی پست
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setFormData({
          title: data.title,
          description: data.description,
          image_url: data.image_url,
          content: data.content || ""
        });
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("posts")
      .update(formData)
      .eq("id", id);

    if (!error) {
      router.push("/admin/posts");
      router.refresh();
    }
  };

  if (loading) return <div className="p-10 text-center">در حال بارگذاری اطلاعات...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <h1 className="text-2xl font-black">ویرایش مقاله</h1>
      <form onSubmit={handleUpdate} className="space-y-6 bg-white dark:bg-stone-900 p-8 rounded-[2rem] shadow-sm">
        <input 
          value={formData.title} 
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border-none"
          placeholder="عنوان"
        />
        <textarea 
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border-none h-32"
          placeholder="توضیحات کوتاه"
        />
        <ImageUploader 
          onUploadSuccess={(url) => setFormData({...formData, image_url: url})} 
        />
        <button className="w-full bg-sage-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-sage-600/20">
          بروزرسانی مقاله
        </button>
      </form>
    </div>
  );
}
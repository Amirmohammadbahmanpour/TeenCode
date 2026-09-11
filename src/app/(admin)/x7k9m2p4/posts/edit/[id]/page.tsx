"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface PostData {
    title: string;
    description: string;
    image_url: string;
    content: string;
}

export default function EditPost() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState<PostData>({
        title: "",
        description: "",
        image_url: "",
        content: "",
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/admin/posts/${id}`);
                const data = response.data;
                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    image_url: data.image_url || "",
                    content: data.content || "",
                });
            } catch (error) {
                console.error("Error fetching post:", error);
                toast.error("خطا در دریافت اطلاعات پست");
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchPost();
        }
    }, [id]);

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            await api.put(`/admin/posts/${id}`, formData);
            toast.success("پست با موفقیت بروزرسانی شد");
            router.push("/admin/posts");
            router.refresh();
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error("خطا در بروزرسانی پست");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center">در حال بارگذاری اطلاعات...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
            <h1 className="text-2xl font-black">ویرایش مقاله</h1>
            <form onSubmit={handleUpdate} className="space-y-6 bg-white dark:bg-stone-900 p-8 rounded-[2rem] shadow-sm">
                <input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border-none"
                    placeholder="عنوان"
                    required
                />
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border-none h-32"
                    placeholder="توضیحات کوتاه"
                    required
                />
                <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border-none h-48"
                    placeholder="متن کامل مقاله..."
                />
                <input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border-none"
                    placeholder="لینک تصویر"
                />
                <ImageUploader
                    onUploadSuccess={(url: string) => setFormData({ ...formData, image_url: url })}
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-sage-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-sage-600/20 disabled:opacity-50"
                >
                    {submitting ? "در حال بروزرسانی..." : "بروزرسانی مقاله"}
                </button>
            </form>
        </div>
    );
}
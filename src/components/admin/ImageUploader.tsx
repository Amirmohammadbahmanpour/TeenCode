"use client";
import { useState, ChangeEvent } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
}

export function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "success">("idle");

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setStatus("uploading");

      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUploadSuccess(response.data.url);
      setStatus("success");
      toast.success("تصویر با موفقیت آپلود شد");
    } catch (error) {
      toast.error("خطا در آپلود عکس");
      console.error(error);
      setStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-[2rem] cursor-pointer bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 transition-all">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {status === "uploading" ? (
            <Loader2 className="w-8 h-8 text-sage-600 animate-spin" />
          ) : status === "success" ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          ) : (
            <Upload className="w-8 h-8 text-stone-400 mb-2" />
          )}
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
            {status === "success" ? "عکس با موفقیت آپلود شد" : "انتخاب تصویر شاخص مقاله"}
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={loading} 
        />
      </label>
    </div>
  );
}
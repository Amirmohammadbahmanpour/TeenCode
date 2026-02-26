// app/(admin)/admin/posts/new/page.tsx
"use client"
import { useState, ChangeEvent, FormEvent } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface PostFormData {
  title: string;
  description: string;
  image_url: string;
}

export default function NewPost() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    description: "",
    image_url: ""
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from("posts")
      .insert([formData])

    if (!error) {
      router.push("/admin/posts")
      router.refresh()
    } else {
      alert(error.message)
    }
    setLoading(false)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">ایجاد مقاله جدید</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-stone-900 p-8 rounded-[2rem] border border-stone-200 dark:border-stone-800">
        <div>
          <label className="block text-sm font-medium mb-2">عنوان مقاله</label>
          <input
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-stone-50 dark:bg-stone-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-sage-500"
            placeholder="مثال: آموزش نکست جی اس"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">توضیحات کوتاه</label>
          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full bg-stone-50 dark:bg-stone-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-sage-500"
            placeholder="خلاصه‌ای از مقاله..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">لینک تصویر (URL)</label>
          <input
            required
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full bg-stone-50 dark:bg-stone-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-sage-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sage-600 text-white py-4 rounded-xl font-bold hover:bg-sage-700 disabled:opacity-50 transition-all shadow-lg shadow-sage-600/20"
        >
          {loading ? "در حال ثبت..." : "انتشار مقاله"}
        </button>
      </form>
    </div>
  )
}
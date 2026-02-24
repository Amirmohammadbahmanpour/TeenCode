import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
    // باید await کنی تا مقدار واقعی آی‌دی رو بگیری
    const { id } = await params;
    console.log("ID from URL:", id);
  
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    
  if (error || !post) {
    return <div className="p-10 text-center">پست مورد نظر پیدا نشد!</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6 py-12">
      <Link href="/blog" className="text-blue-600 mb-8 inline-block hover:underline">
        ← بازگشت به وبلاگ
      </Link>
      
      <img 
        src={post.image_url} 
        alt={post.title} 
        className="w-full h-80 object-cover rounded-3xl mb-8 shadow-lg"
      />
      
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
      
      <div className="text-sm text-gray-400 mb-8">
        منتشر شده در: {new Date(post.created_at).toLocaleDateString('fa-IR')}
      </div>
      
      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
        {post.content}
      </div>
    </div>
  )
}
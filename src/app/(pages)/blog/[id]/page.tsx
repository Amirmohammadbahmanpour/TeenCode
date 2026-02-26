import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowRight, MessageCircle, User, Reply } from 'lucide-react'
import { CommentForm } from '@/components/blog/CommentForm'
import { LikeButton } from '@/components/blog/LikeButton'
import { CommentSection } from '@/components/blog/CommentSection'

// --- تعاریف تایپ‌ها برای امنیت کامل کد ---
interface Profile {
  full_name: string | null;
}

interface LikeCount {
  count: number;
}

interface CommentWithLikes {
  id: string;
  content: string;
  created_at: string;
  is_approved: boolean;
  parent_id: string | null;
  profiles: Profile | null;
  comment_likes: LikeCount[];
}

interface PostWithLikes {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  post_likes: LikeCount[];
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // ۱. تشخیص کاربر با استفاده از getUser (دقیق‌تر از getSession)
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  // ۲. دریافت اطلاعات پست و آمار لایک‌ها
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .select('*, post_likes(count)')
    .eq('id', id)
    .single();

  const post = postData as unknown as PostWithLikes | null;

  // ۳. دریافت نظرات و آمار لایک‌های هر نظر
  const { data: commentsData } = await supabase
    .from('comments')
    .select(`
      id, 
      content, 
      created_at, 
      is_approved, 
      parent_id,
      profiles (full_name),
      comment_likes(count)
    `)
    .eq('post_id', id)
    .eq('is_approved', true)
    .order('created_at', { ascending: true });

  const allComments = (commentsData as unknown as CommentWithLikes[]) || [];

  // فیلتر کردن نظرات به صورت درختی
  const mainComments = allComments.filter((c) => !c.parent_id);
  const replies = allComments.filter((c) => c.parent_id);

  if (postError || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="text-center p-12 bg-white rounded-[3rem] border border-stone-100 shadow-sm">
          <p className="text-stone-400 font-black text-2xl">این مقاله پیدا نشد!</p>
          <Link href="/blog" className="mt-6 inline-block text-sage-600 font-black">بازگشت به لیست</Link>
        </div>
      </div>
    );
  }

// ... (بخش ایمپورت‌ها و کوئری‌ها ثابت بماند)

return (
  <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] pb-10 text-right" dir="rtl">
    <div className="max-w-5xl mx-auto p-4 md:p-6 pt-8 md:pt-12">
      
      {/* هدر: در موبایل کمی جمع‌وجورتر */}
      <Link href="/blog" className="group flex items-center gap-2 text-stone-400 hover:text-sage-600 mb-6 md:mb-8 font-bold text-xs md:text-sm transition-colors">
        <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
        <span>بازگشت به وبلاگ</span>
      </Link>

      {/* بخش تصویر اصلی: ارتفاع داینامیک و فونت منعطف */}
      <div className="relative h-[40vh] md:h-[60vh] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl mb-10 md:mb-16 group">
        <img 
          src={post.image_url} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        {/* لایک روی تصویر: در موبایل کمی کوچک‌تر */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 scale-90 md:scale-100">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-1.5 md:p-2 px-3 md:px-4 rounded-2xl md:rounded-3xl">
            <LikeButton 
              id={post.id} 
              type="post" 
              initialLikes={post.post_likes?.[0]?.count || 0} 
              userId={userId} 
            />
          </div>
        </div>

        {/* عنوان پست: استفاده از text-balance برای جلوگیری از تک‌کلمه‌ای شدن خط آخر */}
        <div className="absolute bottom-6 right-6 left-6 md:bottom-12 md:right-12 text-white">
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-[1000] tracking-tighter leading-tight md:leading-[1.1] text-balance">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-2 md:px-0">
        {/* متن مقاله: تنظیم اندازه فونت برای خوانایی بیشتر در موبایل */}
        <article className="prose dark:prose-invert prose-stone max-w-none mb-16 md:mb-24 
          prose-headings:font-black prose-headings:tracking-tighter
          prose-p:text-base md:prose-p:text-xl prose-p:leading-[1.8] md:prose-p:leading-[2.2] 
          prose-p:text-stone-700 dark:prose-p:text-stone-300">
          {post.content}
        </article>

        <div className="h-px bg-stone-200 dark:bg-stone-800 my-16 md:my-24" />

        {/* بخش دیدگاه‌ها */}
        <section className="space-y-8 md:space-y-12">
          <div className="flex items-center gap-3 md:gap-4 mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-sage-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg">
              <MessageCircle size={20} className="md:size-6" />
            </div>
            <h2 className="text-2xl md:text-4xl font-[1000] tracking-tighter">دیدگاه‌ها</h2>
          </div>

          <CommentSection 
            comments={allComments}
            postId={id}
            userId={userId || null}
          />
        </section>
      </div>
    </div>
  </div>
);
}

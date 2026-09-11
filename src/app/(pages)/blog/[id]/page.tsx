import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/blog/CommentForm";
import { LikeButton } from "@/components/blog/LikeButton";
import { CommentSection } from "@/components/blog/CommentSection";
import { Metadata } from "next";

// تابع برای گرفتن متادیتا از پست
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    
    try {
        const res = await fetch(`${API_URL}/blog/${id}`, {
            cache: "no-store",
        });
        
        if (!res.ok) return { title: "پست یافت نشد" };
        
        const post = await res.json();
        
        return {
            title: `${post.title} | تین کد`,
            description: post.description?.substring(0, 160) || "مطلب آموزشی از تین کد",
            keywords: `${post.title}, تربیت نوجوان, آموزش والدین, فرزندپروری`,
            authors: [{ name: post.author?.name || "تین کد" }],
            openGraph: {
                title: post.title,
                description: post.description?.substring(0, 160),
                url: `https://teencode.ir/blog/${post.id}`,
                siteName: "تین کد",
                images: [
                    {
                        url: post.image_url || "/default-og-image.jpg",
                        width: 1200,
                        height: 630,
                        alt: post.title,
                    },
                ],
                locale: "fa_IR",
                type: "article",
                publishedTime: post.created_at,
                authors: [post.author?.name || "تین کد"],
            },
            twitter: {
                card: "summary_large_image",
                title: post.title,
                description: post.description?.substring(0, 160),
                images: [post.image_url || "/default-og-image.jpg"],
            },
            robots: {
                index: true,
                follow: true,
            },
        };
    } catch (error) {
        return { title: "پست یافت نشد" };
    }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

interface BlogPostPageProps {
    params: Promise<{ id: string }>;
}

interface Post {
    id: string;
    title: string;
    content: string;
    description: string;
    image_url: string;
    created_at: string;
    author: {
        name: string;
    };
    post_likes: { count: number }[];
}

// جایگزین تایپ Comment با این:
interface Comment {
  id: string;
  content: string;
  created_at: string;
  is_approved: boolean;
  parent_id: string | null;
  user: {
      name: string | null;  // تغییر از full_name به name
  };
  comment_likes: { count: number }[];
  replies?: Comment[];
}

async function getPost(id: string, token?: string): Promise<Post | null> {
  try {
      const res = await fetch(`${API_URL}/blog/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
      });
      
      if (!res.ok) return null;
      
      const data = await res.json();
      console.log("📌 Post data from API:", data);  // ✅ این خط رو اضافه کن
      
      return data;
  } catch (error) {
      console.error("Error fetching post:", error);
      return null;
  }
}

async function getComments(postId: string, token?: string): Promise<Comment[]> {
  try {
      const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
      });
      
      if (!res.ok) return [];
      
      const comments = await res.json();
      
      // سازماندهی نظرات به صورت درختی
      const mainComments = comments.filter((c: Comment) => !c.parent_id);
      const replies = comments.filter((c: Comment) => c.parent_id);
      
      mainComments.forEach((comment: Comment) => {
          comment.replies = replies.filter((reply: Comment) => reply.parent_id === comment.id);
      });
      
      return mainComments;
  } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
  }
}

async function getUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    if (!token) return null;
    
    try {
        const res = await fetch(`${API_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        
        if (!res.ok) return null;
        
        const data = await res.json();
        return data.user?.id || data.id;
    } catch (error) {
        return null;
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    const [post, comments, userId] = await Promise.all([
        getPost(id, token),
        getComments(id, token),
        getUserId(),
    ]);
    
    if (!post) {
        notFound();
    }
    
    const formattedDate = new Date(post.created_at).toLocaleDateString("fa-IR");

    return (
        <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] pb-10 text-right" dir="rtl">
            <div className="max-w-5xl mx-auto p-4 md:p-6 pt-8 md:pt-12">
                
                {/* Back Button */}
                <Link
                    href="/blog"
                    className="group inline-flex items-center gap-2 text-stone-400 hover:text-sage-600 mb-6 md:mb-8 font-bold text-xs md:text-sm transition-colors"
                >
                    <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    <span>بازگشت به وبلاگ</span>
                </Link>

                {/* Header Image */}
                <div className="relative h-[40vh] md:h-[60vh] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl mb-10 md:mb-16 group">
                    {post.image_url ? (
                        <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
                            <MessageCircle size={60} className="text-stone-400" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    {/* Like Button on Image */}
                    <div className="absolute top-4 left-4 md:top-8 md:left-8">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-1.5 md:p-2 px-3 md:px-4 rounded-2xl md:rounded-3xl">
                            <LikeButton 
                                id={post.id} 
                                type="post" 
                                initialLikes={post.post_likes?.[0]?.count || 0} 
                                userId={userId} 
                            />
                        </div>
                    </div>
                    
                    {/* Title */}
                    <div className="absolute bottom-6 right-6 left-6 md:bottom-12 md:right-12 text-white">
                        <h1 className="text-3xl md:text-6xl lg:text-7xl font-[1000] tracking-tighter leading-tight md:leading-[1.1] text-balance">
                            {post.title}
                        </h1>
                    </div>
                </div>

                {/* Post Meta */}
                <div className="max-w-3xl mx-auto px-2 md:px-0 mb-8">
                    <div className="flex items-center justify-between gap-4 text-stone-500 dark:text-stone-400 text-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                <span>{post.author?.name || "نویسنده"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{formattedDate}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageCircle size={16} />
                            <span>{comments.length} دیدگاه</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-3xl mx-auto px-2 md:px-0">
                    <article className="prose dark:prose-invert prose-stone max-w-none mb-16 md:mb-24 
                        prose-headings:font-black prose-headings:tracking-tighter
                        prose-p:text-base md:prose-p:text-xl prose-p:leading-[1.8] md:prose-p:leading-[2.2] 
                        prose-p:text-stone-700 dark:prose-p:text-stone-300">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </article>

                    <div className="h-px bg-stone-200 dark:bg-stone-800 my-16 md:my-24" />

                    {/* Comment Section - با فرم و لیست نظرات */}
                    <CommentSection 
                        comments={comments}
                        postId={post.id}
                        userId={userId}
                    />
                </div>
            </div>
        </div>
    );
}
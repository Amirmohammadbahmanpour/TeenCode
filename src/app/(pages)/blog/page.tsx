import { supabase } from '@/lib/supabase'
import Link from 'next/link';
import { Calendar, ArrowLeft, BookOpen, Sparkles } from 'lucide-react';

export interface Post {
    id: string;
    title: string;
    description: string;
    image_url: string;
    created_at: string;
}

export const revalidate = 3600;

export default async function BlogPage() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px] px-6">
                <div className="bg-red-50/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-red-100 dark:border-red-900/20 text-red-600 max-w-md w-full text-center">
                    <p className="font-bold text-lg mb-2">اوه! مشکلی پیش آمد</p>
                    <p className="text-sm opacity-80">{error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] pb-32">
            {/* Hero Section - متمایز و جذاب */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                    <div className="absolute top-[-10%] left-[10%] w-[400px] h-[400px] bg-sage-200/30 dark:bg-sage-900/10 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-0 right-[10%] w-[300px] h-[300px] bg-blue-100/20 dark:bg-blue-900/10 blur-[100px] rounded-full" />
                </div>

                <div className="relative max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm mb-8 animate-bounce">
                        <Sparkles size={16} className="text-sage-500" />
                        <span className="text-stone-600 dark:text-stone-300 text-xs font-bold tracking-widest uppercase">Exploration & Growth</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-[1000] text-stone-900 dark:text-white mb-8 tracking-tighter leading-[1.1]">
                        روایتگری در <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-600 to-emerald-500">تین کد</span>
                    </h1>
                    
                    <p className="text-stone-500 dark:text-stone-400 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                        جایی برای به اشتراک گذاشتن تجربه‌های واقعی، از دنیای کدنویسی تا لایه‌های عمیق توسعه فردی.
                    </p>
                </div>
            </section>

            {/* Main Feed */}
            <main className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {posts?.map((post) => (
                        <article 
                            key={post.id} 
                            className="group relative flex flex-col h-full bg-white dark:bg-stone-900/50 rounded-[3rem] border border-stone-200/50 dark:border-stone-800/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(115,138,123,0.15)]"
                        >
                            {/* Image Container */}
                            <div className="relative p-3 h-72">
                                <div className="relative h-full w-full overflow-hidden rounded-[2.2rem]">
                                    <img
                                        src={post.image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'}
                                        alt={post.title}
                                        className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    {/* Glass Overlay Date */}
                                    <div className="absolute top-4 right-4 backdrop-blur-md bg-black/30 border border-white/10 text-white px-4 py-2 rounded-2xl text-[10px] font-black tracking-tighter uppercase">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} className="text-sage-300" />
                                            {new Date(post.created_at).toLocaleDateString('fa-IR')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="p-8 pt-4 flex flex-col flex-1">
                                <h2 className="text-2xl font-black mb-4 text-stone-800 dark:text-stone-100 leading-tight group-hover:text-sage-600 transition-colors">
                                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                                </h2>
                                
                                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                                    {post.description}
                                </p>

                                {/* Footer Card */}
                                <div className="mt-auto flex items-center justify-between">
                                    <Link
                                        href={`/blog/${post.id}`}
                                        className="relative overflow-hidden group/btn px-6 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 text-stone-800 dark:text-stone-200 font-black text-xs transition-all hover:bg-sage-600 hover:text-white"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            بیشتر بخوانید
                                            <ArrowLeft size={16} className="group-hover/btn:-translate-x-1 transition-transform" />
                                        </span>
                                    </Link>
                                    
                                    <div className="w-8 h-8 rounded-full border border-stone-100 dark:border-stone-800 flex items-center justify-center">
                                        <BookOpen size={14} className="text-stone-300" />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Empty State */}
                {(!posts || posts.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-40 bg-white dark:bg-stone-900/30 rounded-[4rem] border border-dashed border-stone-200 dark:border-stone-800">
                        <div className="w-20 h-20 bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 text-stone-300">
                            <BookOpen size={40} />
                        </div>
                        <p className="text-stone-400 font-black text-xl">هنوز هیچ داستانی نوشته نشده است...</p>
                    </div>
                )}
            </main>
        </div>
    )
}
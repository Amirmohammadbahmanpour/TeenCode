import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link';

export interface Post {
    id: string;
    title: string;
    description: string;
    image_url: string;
    created_at: string;
}

export default async function BlogPage() {
    // گرفتن داده‌ها از سوپابیس
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return <div className="p-10 text-red-500">خطا در بارگذاری پست‌ها: {error.message}</div>
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-10 text-center">وبلاگ تین کد</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts?.map((post) => (
                    <div key={post.id} className="border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
                        <div className="relative h-48 w-full">
                            <img
                                src={post.image_url || 'https://via.placeholder.com/400x200'}
                                alt={post.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="p-5">
                            <h2 className="text-xl font-bold mb-3 text-gray-800">{post.title}</h2>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {post.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">
                                    {new Date(post.created_at).toLocaleDateString('fa-IR')}
                                </span>

                                <Link
                                    href={`/blog/${post.id}`}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                >
                                    مطالعه بیشتر
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
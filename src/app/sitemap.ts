import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    
    // دریافت همه پست‌های وبلاگ
    let posts: { id: string; updated_at: string }[] = [];
    try {
        const res = await fetch(`${API_URL}/blog`, { cache: "no-store" });
        posts = await res.json();
    } catch (error) {
        console.error(error);
    }
    
    const blogPosts = posts.map((post) => ({
        url: `https://teencode.ir/blog/${post.id}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));
    
    return [
        {
            url: 'https://teencode.ir',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://teencode.ir/blog',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: 'https://teencode.ir/courses',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        ...blogPosts,
    ];
}
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noojavaneh.ir';
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    
    // دریافت همه پست‌های وبلاگ
    let blogPosts: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${API_URL}/blog`, { cache: "no-store" });
        if (res.ok) {
            const posts = await res.json();
            if (Array.isArray(posts)) {
                blogPosts = posts.map((post: any) => ({
                    url: `${siteUrl}/blog/${post.id}`,
                    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                }));
            }
        }
    } catch (error) {
        console.error("Error fetching blog posts for sitemap:", error);
    }

    // دریافت همه درس‌های منتشر شده جهت ایندکس در گوگل
    let lessonPages: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${API_URL}/lessons`, { cache: "no-store" });
        if (res.ok) {
            const lessons = await res.json();
            if (Array.isArray(lessons)) {
                lessonPages = lessons.map((lesson: any) => ({
                    url: `${siteUrl}/courses/lesson/${lesson.id}`,
                    lastModified: lesson.updated_at ? new Date(lesson.updated_at) : new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.7,
                }));
            }
        }
    } catch (error) {
        console.error("Error fetching lessons for sitemap:", error);
    }
    
    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${siteUrl}/courses`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${siteUrl}/quiz/pretest`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        ...blogPosts,
        ...lessonPages,
    ];
}
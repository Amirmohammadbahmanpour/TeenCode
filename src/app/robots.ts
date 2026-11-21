import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noojavaneh.ir';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/x7k9m2p4/',
                    '/admin/',
                    '/dashboard/',
                    '/complete-profile/',
                    '/api/',
                    '/forget-password/',
                    '/verify-code/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/x7k9m2p4/',
                    '/admin/',
                    '/dashboard/',
                    '/api/',
                ],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
    };
}
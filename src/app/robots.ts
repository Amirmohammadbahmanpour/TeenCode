import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/dashboard/',
                '/admin/',
                '/complete-profile/',
                '/api/',
            ],
        },
        sitemap: 'https://teencode.ir/sitemap.xml',
    };
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '3000',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**',  // برای توسعه، همه دامنه‌ها رو قبول کن
            },
            // اگر از دامنه دیگری هم استفاده می‌کنید، آن را اینجا اضافه کنید
        ],
    },
};

module.exports = nextConfig;
module.exports = nextConfig;
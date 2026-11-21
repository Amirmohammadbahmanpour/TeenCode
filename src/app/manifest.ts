import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'نوجوان | پلتفرم تخصصی آموزش و رشد نوجوانان',
        short_name: 'نوجوان',
        description: 'پلتفرم جامع آموزش، رشد فردی، مدیریت عادات و تحول نوجوانان و راهنمای مادران',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#7a9179',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}

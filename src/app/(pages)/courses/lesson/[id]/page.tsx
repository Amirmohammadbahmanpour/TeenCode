import type { Metadata } from "next";
import LessonPage from "./LessonPage";

interface Lesson {
    id: string;
    title: string;
    description?: string;
    featured_image_url?: string;
    is_locked?: boolean;
}

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getLesson(id: string): Promise<Lesson | null> {
    try {
        const response = await fetch(
            `https://api.noojavaneh.ir/api/lessons/${id}`,
            {
                next: {
                    revalidate: 300,
                },
            }
        );

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch {
        return null;
    }
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { id } = await params;
    const lesson = await getLesson(id);

    if (!lesson) {
        return {
            title: "درس پیدا نشد | نوجوانه",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title = `${lesson.title} | نوجوانه`;

    const description =
        lesson.description ||
        `مشاهده درس ${lesson.title} در سامانه آموزشی نوجوانه.`;

    return {
        title,
        description,

        alternates: {
            canonical: `https://www.noojavaneh.ir/lessons/${id}`,
        },

        openGraph: {
            title,
            description,
            url: `https://www.noojavaneh.ir/lessons/${id}`,
            siteName: "نوجوانه",
            locale: "fa_IR",
            type: "article",

            ...(lesson.featured_image_url
                ? {
                      images: [
                          {
                              url: lesson.featured_image_url,
                              width: 1200,
                              height: 630,
                              alt: lesson.title,
                          },
                      ],
                  }
                : {}),
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,

            ...(lesson.featured_image_url
                ? {
                      images: [lesson.featured_image_url],
                  }
                : {}),
        },
    };
}

export default async function Page({
    params,
}: PageProps) {
    const { id } = await params;

    return <LessonPage />;
}
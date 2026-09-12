import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DeletePostButton } from "@/components/admin/DeletePostButton";

export const dynamic = "force-dynamic";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

interface Post {
    id: string;
    title: string;
    description: string;
    is_published: boolean;
    created_at: string;
}

async function getPosts(token: string): Promise<Post[]> {
    try {
        const response = await fetch(`${API_URL}/admin/posts`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

async function checkAdmin(token: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });

        if (!response.ok) return false;

        const userData = await response.json();
        return userData.profile?.role === "admin";
    } catch {
        return false;
    }
}

export default async function AdminPosts() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        redirect("/login");
    }

    const isAdmin = await checkAdmin(token);

    if (!isAdmin) {
        redirect("/dashboard");
    }

    const posts = await getPosts(token);

    return (
        <div className="space-y-6 text-right" dir="rtl">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-black text-stone-800 dark:text-stone-100">
                    مدیریت مقالات
                </h1>

                <Link
                    href="/admin/posts/new"
                    className="w-full sm:w-auto text-center bg-sage-600 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-sage-700 transition-all"
                >
                    + مقاله جدید
                </Link>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200 dark:border-stone-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
                            <tr>
                                <th className="px-6 py-4 text-right text-sm font-bold text-stone-600">
                                    عنوان
                                </th>

                                <th className="px-6 py-4 text-right text-sm font-bold text-stone-600">
                                    تاریخ
                                </th>

                                <th className="px-6 py-4 text-right text-sm font-bold text-stone-600">
                                    وضعیت
                                </th>

                                <th className="px-6 py-4 text-right text-sm font-bold text-stone-600">
                                    عملیات
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                            {posts.map((post) => (
                                <tr
                                    key={post.id}
                                    className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/blog/${post.id}`}
                                            className="font-medium text-stone-800 dark:text-stone-100 hover:text-sage-600 transition-colors"
                                        >
                                            {post.title}
                                        </Link>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-stone-500 dark:text-stone-400 whitespace-nowrap">
                                        {new Date(post.created_at).toLocaleDateString("fa-IR")}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                                                post.is_published
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {post.is_published
                                                ? "منتشر شده"
                                                : "پیش‌نویس"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <Link
                                                href={`/admin/posts/edit/${post.id}`}
                                                className="text-sage-600 hover:text-sage-700 text-sm font-bold transition-colors"
                                            >
                                                ویرایش
                                            </Link>

                                            <DeletePostButton
                                                id={post.id}
                                                title={post.title}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm"
                    >
                        {/* Title */}
                        <div className="mb-4">
                            <p className="text-xs text-stone-400 mb-1">
                                عنوان مقاله
                            </p>

                            <Link
                                href={`/blog/${post.id}`}
                                className="block font-bold text-base text-stone-800 dark:text-stone-100 hover:text-sage-600 transition-colors leading-7"
                            >
                                {post.title}
                            </Link>
                        </div>

                        {/* Info */}
                        <div className="flex flex-wrap items-center gap-3 text-sm mb-4">

                            <span className="text-stone-500 dark:text-stone-400">
                                {new Date(post.created_at).toLocaleDateString("fa-IR")}
                            </span>

                            <span
                                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    post.is_published
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                                {post.is_published
                                    ? "منتشر شده"
                                    : "پیش‌نویس"}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                            <Link
                                href={`/admin/posts/edit/${post.id}`}
                                className="text-sage-600 hover:text-sage-700 text-sm font-bold transition-colors"
                            >
                                ویرایش
                            </Link>

                            <DeletePostButton
                                id={post.id}
                                title={post.title}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {posts.length === 0 && (
                <div className="text-center py-16 sm:py-20 text-stone-400">
                    <p className="text-sm sm:text-base">
                        هیچ مقاله‌ای یافت نشد.
                    </p>
                </div>
            )}
        </div>
    );
}


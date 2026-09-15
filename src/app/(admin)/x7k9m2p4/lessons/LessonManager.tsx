"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    BookOpen,
    Eye,
    EyeOff,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Category {
    id: string;
    title: string;
}

interface Lesson {
    id: string;
    category_id: string;
    title: string;
    description: string | null;
    content_text: string | null;
    featured_image_url: string | null;
    video_url: string | null;
    podcast_url: string | null;
    video_type: string | null;
    order_index: number;
    estimated_time: number | null;
    prerequisite_id: string | null;
    is_published: boolean;
    category?: Category;
}

interface LessonForm {
    title: string;
    category_id: string;
    description: string;
    content_text: string;
    featured_image_url: string;
    video_url: string;
    podcast_url: string;
    video_type: string;
    order_index: string;
    estimated_time: string;
    prerequisite_id: string;
    is_published: boolean;
}

const emptyForm: LessonForm = {
    title: "",
    category_id: "",
    description: "",
    content_text: "",
    featured_image_url: "",
    video_url: "",
    podcast_url: "",
    video_type: "aparat",
    order_index: "0",
    estimated_time: "",
    prerequisite_id: "",
    is_published: true,
};

export default function LessonManager() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

    const [form, setForm] = useState<LessonForm>(emptyForm);

    // فیلتر فصل
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);

            const [lessonsResponse, categoriesResponse] = await Promise.all([
                api.get("/admin/lessons"),
                api.get("/categories"),
            ]);

            setLessons(lessonsResponse.data);
            setCategories(categoriesResponse.data);
        } catch (error) {
            console.error(error);
            toast.error("خطا در دریافت اطلاعات");
        } finally {
            setLoading(false);
        }
    }

    function openCreateModal() {
        setEditingLesson(null);
        setForm({ ...emptyForm });
        setShowModal(true);
    }

    function openEditModal(lesson: Lesson) {
        setEditingLesson(lesson);

        setForm({
            title: lesson.title || "",
            category_id: lesson.category_id || "",
            description: lesson.description || "",
            content_text: lesson.content_text || "",
            featured_image_url: lesson.featured_image_url || "",
            video_url: lesson.video_url || "",
            podcast_url: lesson.podcast_url || "",
            video_type: lesson.video_type || "aparat",
            order_index: String(lesson.order_index ?? 0),
            estimated_time:
                lesson.estimated_time !== null
                    ? String(lesson.estimated_time)
                    : "",
            prerequisite_id: lesson.prerequisite_id || "",
            is_published: lesson.is_published,
        });

        setShowModal(true);
    }

    function closeModal() {
        if (saving) return;

        setShowModal(false);
        setEditingLesson(null);
        setForm({ ...emptyForm });
    }

    function updateField(
        field: keyof LessonForm,
        value: string | boolean
    ) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.title.trim()) {
            toast.error("عنوان درس را وارد کنید");
            return;
        }

        if (!form.category_id) {
            toast.error("دسته‌بندی را انتخاب کنید");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                title: form.title.trim(),
                category_id: form.category_id,
                description: form.description || null,
                content_text: form.content_text || null,
                featured_image_url: form.featured_image_url || null,
                video_url: form.video_url || null,
                podcast_url: form.podcast_url || null,
                video_type: form.video_type || null,
                order_index: Number(form.order_index) || 0,
                estimated_time: form.estimated_time
                    ? Number(form.estimated_time)
                    : null,
                prerequisite_id: form.prerequisite_id || null,
                is_published: form.is_published,
            };

            if (editingLesson) {
                const response = await api.put(
                    `/admin/lessons/${editingLesson.id}`,
                    payload
                );

                setLessons((prev) =>
                    prev.map((lesson) =>
                        lesson.id === editingLesson.id
                            ? response.data
                            : lesson
                    )
                );

                toast.success("درس با موفقیت ویرایش شد");
            } else {
                const response = await api.post(
                    "/admin/lessons",
                    payload
                );

                setLessons((prev) => [
                    ...prev,
                    response.data,
                ]);

                toast.success("درس با موفقیت ایجاد شد");
            }

            setShowModal(false);
            setEditingLesson(null);
            setForm({ ...emptyForm });
        } catch (error: any) {
            console.error(error);

            const message =
                error?.response?.data?.message ||
                "عملیات با خطا مواجه شد";

            toast.error(message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(lesson: Lesson) {
        const confirmed = window.confirm(
            `آیا از حذف درس «${lesson.title}» مطمئن هستید؟`
        );

        if (!confirmed) return;

        try {
            setDeletingId(lesson.id);

            await api.delete(`/admin/lessons/${lesson.id}`);

            setLessons((prev) =>
                prev.filter((item) => item.id !== lesson.id)
            );

            toast.success("درس با موفقیت حذف شد");
        } catch (error: any) {
            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                    "حذف درس با خطا مواجه شد"
            );
        } finally {
            setDeletingId(null);
        }
    }

    // درس‌های قابل نمایش بر اساس فصل و ترتیب
    const filteredLessons = [...lessons]
        .filter(
            (lesson) =>
                selectedCategory === "all" ||
                lesson.category_id === selectedCategory
        )
        .sort(
            (a, b) =>
                a.order_index - b.order_index
        );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-gray-50 p-4 md:p-6"
        >
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            مدیریت درس‌ها
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            ایجاد، ویرایش و مدیریت درس‌های سایت
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-800 transition"
                    >
                        <Plus className="w-5 h-5" />
                        افزودن درس
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">

                    <div className="bg-white border rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                <BookOpen className="w-5 h-5" />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    کل درس‌ها
                                </p>

                                <p className="text-xl font-bold">
                                    {lessons.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Eye className="w-5 h-5" />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    منتشر شده
                                </p>

                                <p className="text-xl font-bold">
                                    {
                                        lessons.filter(
                                            (lesson) =>
                                                lesson.is_published
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border rounded-2xl p-4 col-span-2 md:col-span-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                <EyeOff className="w-5 h-5" />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    پیش‌نویس
                                </p>

                                <p className="text-xl font-bold">
                                    {
                                        lessons.filter(
                                            (lesson) =>
                                                !lesson.is_published
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lessons */}
                <div className="bg-white border rounded-2xl overflow-hidden">

                    {/* Filter */}
                    <div className="p-4 border-b bg-gray-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h2 className="font-bold text-sm text-gray-900">
                                لیست درس‌ها
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">
                                {selectedCategory === "all"
                                    ? `${lessons.length} درس`
                                    : `${filteredLessons.length} درس در این فصل`}
                            </p>
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="w-full sm:w-64 border rounded-xl px-4 py-2.5 bg-white outline-none text-sm"
                        >
                            <option value="all">
                                همه فصل‌ها
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {filteredLessons.length === 0 ? (
                        <div className="py-16 text-center">
                            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />

                            <p className="text-gray-500">
                                در این فصل هنوز درسی ثبت نشده است
                            </p>

                            <button
                                onClick={openCreateModal}
                                className="mt-4 text-sm font-medium underline"
                            >
                                اولین درس را ایجاد کنید
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredLessons.map(
                                (lesson, index) => (
                                    <div
                                        key={lesson.id}
                                        className="p-4 hover:bg-gray-50 transition"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">

                                            {/* Number */}
                                            <div className="hidden md:flex w-10 h-10 rounded-xl bg-gray-100 items-center justify-center font-bold text-sm shrink-0">
                                                {index + 1}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <h2 className="font-bold text-gray-900">
                                                        {lesson.title}
                                                    </h2>

                                                    {lesson.is_published ? (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                                            منتشر شده
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                                                            پیش‌نویس
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                                                    <span>
                                                        دسته‌بندی:{" "}
                                                        {lesson.category?.title ||
                                                            "بدون دسته‌بندی"}
                                                    </span>

                                                    <span>
                                                        ترتیب:{" "}
                                                        {lesson.order_index}
                                                    </span>

                                                    {lesson.estimated_time && (
                                                        <span>
                                                            زمان:{" "}
                                                            {
                                                                lesson.estimated_time
                                                            }{" "}
                                                            دقیقه
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(
                                                            lesson
                                                        )
                                                    }
                                                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-sm"
                                                >
                                                    <Pencil className="w-4 h-4" />

                                                    <span className="hidden sm:inline">
                                                        ویرایش
                                                    </span>
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            lesson
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        lesson.id
                                                    }
                                                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition text-sm disabled:opacity-50"
                                                >
                                                    {deletingId ===
                                                    lesson.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}

                                                    <span className="hidden sm:inline">
                                                        حذف
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 md:p-6">

                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div>
                                <h2 className="font-bold text-lg">
                                    {editingLesson
                                        ? "ویرایش درس"
                                        : "افزودن درس جدید"}
                                </h2>

                                <p className="text-xs text-gray-500 mt-1">
                                    اطلاعات درس را وارد کنید
                                </p>
                            </div>

                            <button
                                onClick={closeModal}
                                disabled={saving}
                                className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="overflow-y-auto p-4 space-y-5"
                        >

                            {/* Basic */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-sm">
                                    اطلاعات اصلی
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        عنوان درس
                                    </label>

                                    <input
                                        value={form.title}
                                        onChange={(e) =>
                                            updateField(
                                                "title",
                                                e.target.value
                                            )
                                        }
                                        placeholder="مثلاً: شناخت احساسات نوجوان"
                                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            دسته‌بندی
                                        </label>

                                        <select
                                            value={
                                                form.category_id
                                            }
                                            onChange={(e) =>
                                                updateField(
                                                    "category_id",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border rounded-xl px-4 py-3 bg-white outline-none"
                                        >
                                            <option value="">
                                                انتخاب دسته‌بندی
                                            </option>

                                            {categories.map(
                                                (category) => (
                                                    <option
                                                        key={
                                                            category.id
                                                        }
                                                        value={
                                                            category.id
                                                        }
                                                    >
                                                        {
                                                            category.title
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            درس پیش‌نیاز
                                        </label>

                                        <select
                                            value={
                                                form.prerequisite_id
                                            }
                                            onChange={(e) =>
                                                updateField(
                                                    "prerequisite_id",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border rounded-xl px-4 py-3 bg-white outline-none"
                                        >
                                            <option value="">
                                                بدون پیش‌نیاز
                                            </option>

                                            {lessons
                                                .filter(
                                                    (lesson) =>
                                                        lesson.id !==
                                                        editingLesson?.id
                                                )
                                                .map(
                                                    (
                                                        lesson
                                                    ) => (
                                                        <option
                                                            key={
                                                                lesson.id
                                                            }
                                                            value={
                                                                lesson.id
                                                            }
                                                        >
                                                            {
                                                                lesson.title
                                                            }
                                                        </option>
                                                    )
                                                )}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        توضیحات کوتاه
                                    </label>

                                    <textarea
                                        value={
                                            form.description
                                        }
                                        onChange={(e) =>
                                            updateField(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows={3}
                                        placeholder="توضیح کوتاه درباره درس..."
                                        className="w-full border rounded-xl px-4 py-3 outline-none resize-none"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-sm">
                                    محتوای درس
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        متن درس
                                    </label>

                                    <textarea
                                        value={
                                            form.content_text
                                        }
                                        onChange={(e) =>
                                            updateField(
                                                "content_text",
                                                e.target.value
                                            )
                                        }
                                        rows={8}
                                        placeholder="متن کامل درس..."
                                        className="w-full border rounded-xl px-4 py-3 outline-none resize-y"
                                    />
                                </div>
                            </div>

                            {/* Media */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-sm">
                                    رسانه
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        تصویر شاخص
                                    </label>

                                    <input
                                        type="url"
                                        value={
                                            form.featured_image_url
                                        }
                                        onChange={(e) =>
                                            updateField(
                                                "featured_image_url",
                                                e.target.value
                                            )
                                        }
                                        placeholder="https://..."
                                        className="w-full border rounded-xl px-4 py-3 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            لینک ویدیو
                                        </label>

                                        <input
                                            type="url"
                                            value={
                                                form.video_url
                                            }
                                            onChange={(e) =>
                                                updateField(
                                                    "video_url",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="https://..."
                                            className="w-full border rounded-xl px-4 py-3 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            نوع ویدیو
                                        </label>

                                        <select
                                            value={
                                                form.video_type
                                            }
                                            onChange={(e) =>
                                                updateField(
                                                    "video_type",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border rounded-xl px-4 py-3 bg-white outline-none"
                                        >
                                            <option value="aparat">
                                                Aparat
                                            </option>

                                            <option value="youtube">
                                                YouTube
                                            </option>

                                            <option value="local">
                                                Local
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        لینک پادکست
                                    </label>

                                    <input
                                        type="url"
                                        value={
                                            form.podcast_url
                                        }
                                        onChange={(e) =>
                                            updateField(
                                                "podcast_url",
                                                e.target.value
                                            )
                                        }
                                        placeholder="https://..."
                                        className="w-full border rounded-xl px-4 py-3 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-sm">
                                    تنظیمات
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            ترتیب نمایش
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={
                                                form.order_index
                                            }
                                            onChange={(e) =>
                                                updateField(
                                                    "order_index",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border rounded-xl px-4 py-3 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            زمان تقریبی (دقیقه)
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={
                                                form.estimated_time
                                            }
                                            onChange={(e) =>
                                                updateField(
                                                    "estimated_time",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="مثلاً 15"
                                            className="w-full border rounded-xl px-4 py-3 outline-none"
                                        />
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={
                                            form.is_published
                                        }
                                        onChange={(e) =>
                                            updateField(
                                                "is_published",
                                                e.target.checked
                                            )
                                        }
                                        className="w-5 h-5"
                                    />

                                    <div>
                                        <p className="text-sm font-medium">
                                            انتشار درس
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            اگر خاموش باشد درس به کاربران نمایش داده نمی‌شود.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2 border-t">

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white rounded-xl py-3 hover:bg-gray-800 transition disabled:opacity-50"
                                >
                                    {saving ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Save className="w-5 h-5" />
                                    )}

                                    {editingLesson
                                        ? "ذخیره تغییرات"
                                        : "ایجاد درس"}
                                </button>

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                                >
                                    انصراف
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

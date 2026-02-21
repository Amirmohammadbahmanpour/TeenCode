"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Sprout, CheckCircle2, Lock, GraduationCap } from "lucide-react";
import { Chapter } from "./page";

interface Props {
    chapters: Chapter[];
    completedLessonIds: number[];
    entranceExamPassed: boolean; // آیا آزمون ورودی را داده؟
    finalExamPassed: boolean;    // آیا آزمون نهایی را داده؟
}

export default function ChapterList({ chapters, completedLessonIds, entranceExamPassed, finalExamPassed }: Props) {
    const [openChapterId, setOpenChapterId] = useState<number | null>(chapters[0]?.id || null);

    return (
        <section className="max-w-3xl" dir="rtl">
            {chapters.map((chapter, index) => {
                const isOpen = openChapterId === chapter.id;

                // --- منطق جدید و دقیق قفل‌ها ---

                let isLocked = false;
                const isFirstItem = index === 0; // این همان ردیف "آزمون ورودی" است

                if (isFirstItem) {
                    // آزمون ورودی هیچ‌وقت قفل نیست! همیشه باید باز باشد تا کاربر شروع کند
                    isLocked = false;
                } else if (index === 1) {
                    // فصل اول (index 1) فقط زمانی باز می‌شود که آزمون ورودی (pretest) پاس شده باشد
                    isLocked = !entranceExamPassed;
                } else {
                    // فصل‌های بعدی (۲ به بعد) زمانی باز می‌شوند که تمام دروس فصل قبلی تمام شده باشد
                    const prevChapter = chapters[index - 1];
                    const isPrevChapterDone = prevChapter.lessons.every(l => completedLessonIds.includes(l.id));

                    // شرط اضافه: اگر کاربر آزمون نهایی (Post-test) را پاس کرده باشد، همه چیز باز شود (میان‌بر)
                    isLocked = !isPrevChapterDone && !finalExamPassed;
                }

                // تشخیص اینکه این ردیف، ردیف آزمون است یا فصل آموزشی
                const isExamRow = chapter.id === 1;

                return (
                    <div key={chapter.id} className={`relative ...`}>
                        {/* ... بقیه کدهای استایل ... */}

                        {/* تغییر محتوا: اگر ردیف آزمون بود، به جای لیست دروس، دکمه آزمون نشان بده */}
                        <div className={`grid ... ${isOpen && !isLocked ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                            <div className="min-h-0">
                                {isExamRow ? (
                                    <div className="p-6 bg-sage-50 dark:bg-sage-900/20 rounded-3xl border border-sage-100 dark:border-sage-800 text-center">
                                        <p className="text-stone-600 dark:text-stone-400 mb-4 text-sm">
                                            برای باز کردن فصل اول و شروع مسیر تحول، ابتدا باید این ارزیابی اولیه را انجام دهید.
                                        </p>
                                        <Link
                                            href="/quiz/pretest"
                                            className="inline-flex items-center gap-2 bg-sage-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-sage-700 transition-all shadow-lg shadow-sage-200"
                                        >
                                            <Sprout size={20} />
                                            شروع آزمون ورودی
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {/* همان کد قبلی برای رندر کردن lessonها اینجا باشد */}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Sprout, CheckCircle2, Lock, PlayCircle, ChevronLeft, Sparkles } from "lucide-react";
import { Chapter } from "./page";

interface Props {
    chapters: Chapter[];
    completedLessonIds: string[];
    entranceExamPassed: boolean;
    finalExamPassed: boolean;
}

export default function ChapterList({ chapters, completedLessonIds, entranceExamPassed, finalExamPassed }: Props) {
    // باز کردن فصل اول یا فصلی که کاربر در آن قرار دارد
    const [openChapterId, setOpenChapterId] = useState<number | null>(
        entranceExamPassed && chapters.length > 1 ? chapters[1].id : chapters[0]?.id || null
    );

    return (
        <section className="space-y-4" dir="rtl">
            {chapters.map((chapter, index) => {
                const isOpen = openChapterId === chapter.id;
                const isFirstItem = index === 0;
                const isFinalExamRow = chapter.slug === 'final-test';
                
                // منطق داینامیک قفل‌ها
                let isLocked = false;
                if (isFirstItem) {
                    isLocked = false; // آزمون ورودی همیشه باز است
                } else if (index === 1) {
                    isLocked = !entranceExamPassed;
                } else if (isFinalExamRow) {
                    // آزمون نهایی فقط وقتی باز می‌شود که تمام دروس تمام فصل‌های آموزشی قبل از آن تکمیل شده باشند
                    const educationChapters = chapters.slice(1, index);
                    const allLessonsDone = educationChapters.every(ch => 
                        ch.lessons.every(l => completedLessonIds.includes(l.id))
                    );
                    isLocked = !allLessonsDone;
                } else {
                    // فصل‌های معمولی: اگر فصل قبلی تمام شده باشد باز می‌شوند
                    const prevChapter = chapters[index - 1];
                    const isPrevChapterDone = prevChapter.lessons.every(l => completedLessonIds.includes(l.id));
                    isLocked = !isPrevChapterDone && !finalExamPassed;
                }

                // ردیف‌هایی که استایل "باکس آزمون" دارند (اولین و آخرین)
                const isSpecialRow = isFirstItem || isFinalExamRow;

                return (
                    <div
                        key={chapter.id}
                        className={`rounded-[2.5rem] border-2 transition-all duration-300 overflow-hidden 
                        ${isLocked
                                ? "bg-stone-100/50 dark:bg-stone-900/20 opacity-60 border-stone-200 dark:border-stone-800"
                                : "bg-white dark:bg-stone-900 border-white dark:border-stone-800 shadow-xl shadow-stone-200/40 dark:shadow-none"}`}
                    >
                        <button
                            onClick={() => !isLocked && setOpenChapterId(isOpen ? null : chapter.id)}
                            className="w-full p-6 flex items-center justify-between transition-colors hover:bg-stone-50/50 dark:hover:bg-stone-800/50"
                            disabled={isLocked}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all 
                                    ${isLocked
                                        ? "bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600"
                                        : "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-lg"}`}>
                                    {isLocked ? (
                                        <Lock size={20} />
                                    ) : (isFirstItem && entranceExamPassed ? (
                                        <CheckCircle2 size={22} className="text-sage-500" />
                                    ) : isFinalExamRow && finalExamPassed ? (
                                        <Sparkles size={22} className="text-amber-500" />
                                    ) : (
                                        <span className="font-black text-lg">{index + 1}</span>
                                    ))}
                                </div>
                                <h3 className={`font-black text-lg transition-colors 
                                    ${isLocked ? "text-stone-400 dark:text-stone-600" : "text-stone-800 dark:text-stone-100"}`}>
                                    {chapter.title}
                                </h3>
                            </div>
                            {!isLocked && (
                                <ChevronDown
                                    className={`text-stone-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                />
                            )}
                        </button>

                        <div className={`grid transition-all duration-300 ease-in-out ${isOpen && !isLocked ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                            <div className="min-h-0">
                                <div className="p-6 pt-0 space-y-3">
                                    {isSpecialRow ? (
                                        /* بخش آزمون (ورودی یا نهایی) */
                                        <div className={`p-8 rounded-[2rem] border-2 text-center space-y-4 ${isFinalExamRow ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100/50' : 'bg-sage-50 dark:bg-sage-900/10 border-sage-100'}`}>
                                            {((isFirstItem && entranceExamPassed) || (isFinalExamRow && finalExamPassed)) ? (
                                                <>
                                                    <div className="w-16 h-16 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                                        <CheckCircle2 size={32} className={isFinalExamRow ? "text-amber-600" : "text-sage-600"} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-stone-900 dark:text-stone-100 mb-1">
                                                            {isFinalExamRow ? "دوره با موفقیت به پایان رسید" : "ارزیابی با موفقیت انجام شد"}
                                                        </h4>
                                                        <p className="text-stone-500 text-sm max-w-[250px] mx-auto">
                                                            {isFinalExamRow ? "شما تمام مراحل را پشت سر گذاشتید." : "فصل اول باز شد. می‌توانید یادگیری را شروع کنید."}
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                                        {isFinalExamRow ? <Sparkles size={32} className="text-amber-600" /> : <Sprout size={32} className="text-sage-600" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-stone-900 dark:text-stone-100 mb-2">
                                                            {isFinalExamRow ? "شروع آزمون نهایی" : "شروع ارزیابی اولیه"}
                                                        </h4>
                                                        <p className="text-stone-500 text-sm leading-relaxed max-w-sm mx-auto">
                                                            {isFinalExamRow 
                                                                ? "حالا وقت آن است که تغییرات خود را بعد از گذراندن دوره بسنجید." 
                                                                : "برای باز کردن فصل اول و شروع مسیر تحول، ابتدا این ارزیابی را انجام دهید."}
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href={isFinalExamRow ? "/quiz/posttest" : "/quiz/pretest"}
                                                        className={`inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-white transition-all active:scale-95 mx-auto ${isFinalExamRow ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' : 'bg-sage-600 hover:bg-sage-700 shadow-sage-200'}`}
                                                    >
                                                        شروع آزمون <ChevronLeft size={20} />
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        /* لیست دروس فصل */
                                        <div className="grid gap-3">
                                            {chapter.lessons.map((lesson) => {
                                                const isCompleted = completedLessonIds.includes(lesson.id);
                                                return (
                                                    <Link
                                                        key={lesson.id}
                                                        href={`/courses/lesson/${lesson.id}`}
                                                        className="flex items-center justify-between p-5 rounded-2xl bg-stone-50/50 dark:bg-stone-800/30 hover:bg-white dark:hover:bg-stone-800 border-2 border-transparent hover:border-sage-500 transition-all group"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors 
                                                                ${isCompleted
                                                                    ? "bg-sage-100 dark:bg-sage-900/50 text-sage-600 dark:text-sage-400"
                                                                    : "bg-white dark:bg-stone-800 text-stone-400 dark:text-stone-500 group-hover:text-sage-500 shadow-sm"}`}>
                                                                {isCompleted ? <CheckCircle2 size={20} /> : <PlayCircle size={20} />}
                                                            </div>
                                                            <span className={`font-bold transition-colors 
                                                                ${isCompleted
                                                                    ? "text-stone-400 dark:text-stone-500 line-through"
                                                                    : "text-stone-700 dark:text-stone-300 group-hover:text-sage-700 dark:group-hover:text-sage-400"}`}>
                                                                {lesson.title}
                                                            </span>
                                                        </div>
                                                        <ChevronLeft size={18} className="text-stone-300 dark:text-stone-600 group-hover:text-sage-500 group-hover:translate-x-[-4px] transition-all" />
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // مسیر فایل supabase.ts خودت رو چک کن
import { pretestQuestions } from "@/constans/quizData"; // مسیر سوالات
import { CheckCircle2, ChevronRight, ChevronLeft, Send, Sparkles } from "lucide-react";

export default function QuizClient({ userId }: { userId: string }) {
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // انتخاب گزینه
    const handleSelect = (optionIndex: number) => {
        setAnswers({ ...answers, [pretestQuestions[currentStep].id]: optionIndex });
    };

    const nextStep = () => {
        if (currentStep < pretestQuestions.length - 1) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    // ثبت نهایی در دیتابیس
    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        let correctCount = 0;
        pretestQuestions.forEach((q) => {
            if (answers[q.id] === q.correctAnswer) {
                correctCount++;
            }
        });

        // اصلاح این خط:
        const finalScore = Math.round((correctCount / pretestQuestions.length) * 100);

        try {
            const { error } = await supabase
                .from("user_exams")
                .insert([
                    {
                        user_id: userId,
                        exam_type: "pretest",
                        score: finalScore,
                        is_passed: true
                    }
                ]);

            if (error) throw error;

            router.refresh();
            router.push("/courses");

        } catch (err) {
            console.error(err);
            alert("خطا در ثبت نهایی نمره");
            setIsSubmitting(false);
        }
    };
    const currentQuestion = pretestQuestions[currentStep];
    const isLastStep = currentStep === pretestQuestions.length - 1;
    const progress = ((currentStep + 1) / pretestQuestions.length) * 100;
    const isOptionSelected = answers[currentQuestion.id] !== undefined;

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-stone-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-stone-200/50 dark:shadow-none border-2 border-stone-50 dark:border-stone-800" dir="rtl">

            {/* Header & Progress */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4 px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-sage-100 dark:bg-sage-900 flex items-center justify-center text-sage-600">
                            <Sparkles size={18} />
                        </div>
                        <span className="text-stone-500 dark:text-stone-400 font-bold text-sm">ارزیابی اولیه</span>
                    </div>
                    <span className="text-sage-600 font-black text-sm">سوال {currentStep + 1} از {pretestQuestions.length}</span>
                </div>
                <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-sage-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question Section */}
            <div className="mb-10 min-h-[100px]">
                <h2 className="text-2xl md:text-3xl font-black text-stone-800 dark:text-stone-100 leading-snug">
                    {currentQuestion.text}
                </h2>
            </div>

            {/* Options Grid */}
            <div className="grid gap-3 mb-12">
                {currentQuestion.options.map((option, index) => {
                    const isSelected = answers[currentQuestion.id] === index;
                    return (
                        <button
                            key={index}
                            onClick={() => handleSelect(index)}
                            className={`group flex items-center justify-between p-5 rounded-2xl text-right font-bold transition-all border-2 
                            ${isSelected
                                    ? "border-sage-500 bg-sage-50 dark:bg-sage-900/20 text-sage-700 dark:text-sage-400 shadow-md"
                                    : "border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 text-stone-600 dark:text-stone-400 hover:border-stone-200 dark:hover:border-stone-700"
                                }`}
                        >
                            <span className="text-lg">{option}</span>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                ${isSelected ? "border-sage-500 bg-sage-500 shadow-inner" : "border-stone-300 dark:border-stone-600"}
                            `}>
                                {isSelected && <CheckCircle2 size={14} className="text-white" />}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Footer Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-stone-100 dark:border-stone-800">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0 || isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 disabled:opacity-0 transition-all"
                >
                    <ChevronRight size={20} /> مرحله قبل
                </button>

                {isLastStep ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!isOptionSelected || isSubmitting}
                        className="flex items-center gap-3 px-10 py-4 bg-sage-600 text-white rounded-[1.5rem] font-black hover:bg-sage-700 shadow-xl shadow-sage-200 dark:shadow-none disabled:opacity-40 disabled:grayscale transition-all active:scale-95"
                    >
                        {isSubmitting ? "در حال ثبت..." : "پایان ارزیابی"}
                        {!isSubmitting && <Send size={18} />}
                    </button>
                ) : (
                    <button
                        onClick={nextStep}
                        disabled={!isOptionSelected}
                        className="flex items-center gap-3 px-10 py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-[1.5rem] font-black hover:opacity-90 disabled:opacity-30 transition-all active:scale-95 shadow-lg"
                    >
                        بعدی <ChevronLeft size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
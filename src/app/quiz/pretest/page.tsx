import { createClient } from "@/lib/supabaseServer";
import { posttestQuestions } from "@/constans/quizData"; // فرض بر این است که سوالات پس‌آزمون با این نام در فایل دیتا هستند
import { redirect } from "next/navigation";
import QuizClient from "../pretest/QuizClient"; // استفاده از کامپوننت مشترک کوئیز

export default async function PosttestPage() {
    const supabase = await createClient();

    // ۱. احراز هویت کاربر
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // ۲. بررسی وضعیت دیتابیس
    // آیا این کاربر قبلاً آزمون نهایی (posttest) را ثبت کرده است؟
    const { data: existingExam } = await supabase
        .from("user_exams")
        .select("id")
        .eq("user_id", user.id)
        .eq("exam_type", "posttest")
        .maybeSingle();

    // ۳. اگر قبلاً آزمون داده، اجازه دسترسی مجدد نده و به داشبورد بفرست
    if (existingExam) {
        redirect("/dashboard");
    }

    return (
        <main className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 px-6 flex items-center justify-center">
            <div className="w-full max-w-4xl">
                {/* userId: برای ثبت در جدول user_exams
                  questions: سوالات تستی مخصوص پس‌آزمون
                  examType: تعیین نوع آزمون برای تفکیک در دیتابیس
                */}
                <QuizClient
                    userId={user.id}
                    questions={posttestQuestions}
                    examType="posttest"
                />
            </div>
        </main>
    );
}
import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import QuizClient from "./QuizClient";

export default async function PretestPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // چک کردن دیتابیس: آیا قبلاً پاس شده؟
    const { data: existingExam } = await supabase
        .from("user_exams")
        .select("id")
        .eq("user_id", user.id)
        .eq("exam_type", "pretest")
        .maybeSingle();

    if (existingExam) {
        redirect("/courses"); // اگر قبلا داده بود برگرده به لیست دروس
    }

    return (
        <main className="min-h-screen bg-stone-50 py-12 px-6">
            <QuizClient userId={user.id} />
        </main>
    );
}
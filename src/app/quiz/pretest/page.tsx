import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import QuizClient from "./QuizClient";
import { pretestQuestions } from "@/data/question";

export const dynamic = "force-dynamic";

interface ExamCheckResponse {
    exists: boolean;
}

async function checkExistingExam(token: string, userId: number): Promise<boolean> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    
    try {
        const response = await fetch(`${API_URL}/user-exams/check?user_id=${userId}&exam_type=pretest`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        
        if (!response.ok) return false;
        
        const data: ExamCheckResponse = await response.json();
        return data.exists;
        
    } catch (error) {
        console.error("Error checking exam:", error);
        return false;
    }
}

async function getUser(token: string) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    
    const response = await fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    
    if (!response.ok) return null;
    return response.json();
}

export default async function PretestPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    if (!token) {
        redirect("/login");
    }
    
    const userData = await getUser(token);
    
    if (!userData) {
        redirect("/login");
    }
    
    const userId = userData.user.id;
    const hasExam = await checkExistingExam(token, userId);
    
    // اگر قبلاً آزمون ورودی داده، به صفحه دوره‌ها برو
    if (hasExam) {
        redirect("/courses");
    }
    
    return (
        <main className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 px-6 flex items-center justify-center">
            <div className="w-full max-w-4xl">
                <QuizClient
                    userId={userId}
                    questions={pretestQuestions}
                    examType="pretest"
                />
            </div>
        </main>
    );
}
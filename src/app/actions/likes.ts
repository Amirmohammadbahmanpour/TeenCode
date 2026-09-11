"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function togglePostLike(postId: string) {
    // دریافت توکن از کوکی
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    if (!token) {
        throw new Error("Unauthorized");
    }
    
    try {
        const response = await fetch(`${API_URL}/like/post`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ post_id: postId }),
        });
        
        if (!response.ok) {
            throw new Error("Failed to toggle like");
        }
        
        revalidatePath("/blog");
        return { success: true };
        
    } catch (error) {
        console.error("Error toggling like:", error);
        return { success: false, error: "خطا در ثبت لایک" };
    }
}
"use server"
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function togglePostLike(postId: string, userId: string) {
  // ۱. چک کردن اینکه لایک وجود دارد یا نه
  const { data: existingLike } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single();

  if (existingLike) {
    // Unlike
    await supabase.from("post_likes").delete().eq("id", existingLike.id);
  } else {
    // Like
    await supabase.from("post_likes").insert([{ post_id: postId, user_id: userId }]);
  }
  
  revalidatePath("/blog"); // یا آدرس صفحه پست
}
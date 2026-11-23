import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminTicketsManager from "@/components/admin/AdminTicketsManager";

export const dynamic = "force-dynamic";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

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

export default async function AdminTicketsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        redirect("/login");
    }

    const isAdmin = await checkAdmin(token);
    if (!isAdmin) {
        redirect("/dashboard");
    }

    return <AdminTicketsManager />;
}

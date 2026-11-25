"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        let mounted = true;

        const verifyAdmin = async () => {
            const token = auth.getToken();
            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                const res = await api.get("/user");
                if (!mounted) return;

                if (res.data?.profile?.role === "admin") {
                    setAuthorized(true);
                } else {
                    router.replace("/dashboard");
                }
            } catch (err) {
                if (!mounted) return;
                router.replace("/dashboard");
            }
        };

        verifyAdmin();

        return () => {
            mounted = false;
        };
    }, [router]);

    if (!authorized) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-stone-500">
                <Loader2 className="animate-spin text-sage-600" size={32} />
                <span className="text-xs sm:text-sm font-medium">
                    در حال بررسی دسترسی مدیریت...
                </span>
            </div>
        );
    }

    return <>{children}</>;
}

import { AdminGuard } from "@/components/admin/AdminGuard";
import AdminTicketsManager from "@/components/admin/AdminTicketsManager";

export default function AdminTicketsPage() {
    return (
        <AdminGuard>
            <AdminTicketsManager />
        </AdminGuard>
    );
}


import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-stone-100 dark:bg-stone-950">
            
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 min-w-0 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
                {children}
            </main>

        </div>
    );
}

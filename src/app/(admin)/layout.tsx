// app/(admin)/layout.tsx
import Link from "next/link";
import { LayoutDashboard, FileText, Users, Settings, LogOut, LucideIcon } from "lucide-react";

interface AdminNavLinkProps {
  href: string;
  icon: LucideIcon; // به جای any از تایپ خود Lucide استفاده می‌کنیم
  label: string;
}

function AdminNavLink({ href, icon: Icon, label }: AdminNavLinkProps) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 text-stone-600 dark:text-stone-400 hover:bg-sage-50 dark:hover:bg-sage-900/20 hover:text-sage-600 rounded-xl transition-all font-medium"
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone-100 dark:bg-stone-950">
      <aside className="w-64 bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 p-6 flex flex-col shrink-0">
        <div className="mb-10 px-2">
          <h2 className="text-xl font-black text-sage-600">پنل مدیریت</h2>
          <p className="text-xs text-stone-500 mt-1">تین کد | کنترل پنل</p>
        </div>

        <nav className="space-y-2 flex-1">
          <AdminNavLink href="/admin" icon={LayoutDashboard} label="داشبورد" />
          <AdminNavLink href="/admin/posts" icon={FileText} label="مدیریت پست‌ها" />
          <AdminNavLink href="/admin/users" icon={Users} label="کاربران" />
          <AdminNavLink href="/admin/comments" icon={Settings} label="کامنت ها" />
        </nav>

        <div className="pt-6 border-t border-stone-100 dark:border-stone-800">
          <Link href="/" className="flex items-center gap-3 text-stone-500 hover:text-red-500 transition-colors text-sm font-medium px-2">
            <LogOut size={18} />
            <span>خروج به سایت</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
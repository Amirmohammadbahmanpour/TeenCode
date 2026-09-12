"use client";

import Link from "next/link";
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    LogOut,
    X,
    Menu,
    LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface AdminNavLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
}

function AdminNavLink({
    href,
    icon: Icon,
    label,
    onClick,
}: AdminNavLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 text-stone-600 dark:text-stone-400 hover:bg-sage-50 dark:hover:bg-sage-900/20 hover:text-sage-600 rounded-xl transition-all font-medium"
        >
            <Icon size={20} />
            <span>{label}</span>
        </Link>
    );
}

export default function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const closeSidebar = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 right-4 z-40 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-3 rounded-xl shadow-md text-stone-700 dark:text-stone-200"
                aria-label="باز کردن منوی مدیریت"
            >
                <Menu size={22} />
            </button>

            {/* Overlay */}
            {isOpen && (
                <button
                    onClick={closeSidebar}
                    className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    aria-label="بستن منو"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:static
                    top-0 right-0
                    z-50
                    h-screen
                    w-72 md:w-64
                    bg-white dark:bg-stone-900
                    border-l border-stone-200 dark:border-stone-800
                    p-6
                    flex flex-col
                    shrink-0
                    transition-transform duration-300 ease-in-out

                    ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
                `}
            >
                {/* Header */}
                <div className="mb-10 px-2 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-black text-sage-600">
                            پنل مدیریت
                        </h2>

                        <p className="text-xs text-stone-500 mt-1">
                            تین کد | کنترل پنل
                        </p>
                    </div>

                    {/* Close button - Mobile */}
                    <button
                        onClick={closeSidebar}
                        className="md:hidden p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
                        aria-label="بستن منو"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 flex-1">
                    <AdminNavLink
                        href="/x7k9m2p4"
                        icon={LayoutDashboard}
                        label="داشبورد"
                        onClick={closeSidebar}
                    />

                    <AdminNavLink
                        href="/x7k9m2p4/posts"
                        icon={FileText}
                        label="مدیریت پست‌ها"
                        onClick={closeSidebar}
                    />

                    <AdminNavLink
                        href="/x7k9m2p4/users"
                        icon={Users}
                        label="کاربران"
                        onClick={closeSidebar}
                    />

                    <AdminNavLink
                        href="/x7k9m2p4/comments"
                        icon={Settings}
                        label="کامنت ها"
                        onClick={closeSidebar}
                    />
                </nav>

                {/* Exit */}
                <div className="pt-6 border-t border-stone-100 dark:border-stone-800">
                    <Link
                        href="/"
                        onClick={closeSidebar}
                        className="flex items-center gap-3 text-stone-500 hover:text-red-500 transition-colors text-sm font-medium px-2"
                    >
                        <LogOut size={18} />
                        <span>خروج به سایت</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}

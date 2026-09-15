"use client";

import {
  LogOut,
  BookOpen,
  LayoutDashboard,
  Podcast,
  BarChart3,
  MessageSquare,
  Home,
  UserCircle,
  AlertCircle,
  BotMessageSquare,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import api from "@/lib/axios";

interface User {
  id: number;
  name: string;
  email: string;
  profile?: {
    full_name?: string | null;
    role?: string;
  };
}

export function AppSidebar() {
  const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || "x7k9m2p4";

  const router = useRouter();
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const [user, setUser] = useState<User | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    const token = auth.getToken();

    // اگر توکن وجود نداشته باشد، کاربر مهمان است
    if (!token) {
      setUser(null);
      setIsProfileComplete(false);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      // اعتبار واقعی توکن توسط سرور بررسی می‌شود
      const response = await api.get("/user");
      const userData = response.data;

      setUser(userData);

      const hasFullName = !!(
        userData.profile?.full_name &&
        userData.profile.full_name.trim() !== ""
      );

      setIsProfileComplete(hasFullName);

      const isUserAdmin = userData.profile?.role === "admin";
      setIsAdmin(isUserAdmin);
    } catch (error: any) {
      console.error("Error fetching user:", error);

      const status = error?.response?.status;

      /*
       * فقط در صورتی که سرور صراحتاً session را رد کرده باشد
       * کاربر را logout می‌کنیم.
       *
       * 401 = توکن نامعتبر یا منقضی
       * 403 = دسترسی/session رد شده
       */
      if (status === 401 || status === 403) {
        try {
          await auth.logout();
        } catch (logoutError) {
          console.error("Auth logout error:", logoutError);
        }

        setUser(null);
        setIsProfileComplete(false);
        setIsAdmin(false);

        return;
      }

      /*
       * خطاهای موقتی مثل:
       * 500، خطای شبکه و ...
       * نباید باعث logout شدن کاربر شوند.
       */
      setUser(null);
      setIsProfileComplete(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // بررسی اولیه وضعیت ورود
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // بعد از تکمیل یا تغییر پروفایل، اطلاعات کاربر دوباره دریافت شود
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchUserData();
    };

    window.addEventListener("profile-updated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, [fetchUserData]);

  const handleSignOut = async () => {
    await auth.logout();
    router.push("/login");
    router.refresh();
  };

  const handleItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const publicItems = [
    {
      title: "خانه",
      url: "/",
      icon: Home,
    },
    {
      title: "بلاگ",
      url: "/blog",
      icon: MessageSquare,
    },
  ];

  const privateItems = [
    {
      title: "داشبورد",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "مطالب آموزشی",
      url: "/courses",
      icon: BookOpen,
    },
    {
      title: "نمودار رشد",
      url: "/grow",
      icon: BarChart3,
    },
  ];

  const adminItems = [
    {
      title: "پنل ادمین",
      url: `/${adminSecret}`,
      icon: BotMessageSquare,
    },
  ];

  const renderMenuItems = (items: typeof publicItems) =>
    items.map((item) => {
      const isActive = pathname === item.url;

      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            className={cn(
              "py-6 transition-all duration-200",
              isActive
                ? "bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-300 font-bold"
                : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"
            )}
            onClick={handleItemClick}
          >
            <Link
              href={item.url}
              className="flex items-center gap-3 w-full"
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive
                    ? "text-sage-600 dark:text-sage-400"
                    : "text-stone-400 dark:text-stone-500"
                )}
              />

              <span>{item.title}</span>

              {isActive && (
                <div className="absolute left-2 w-1.5 h-1.5 rounded-full bg-sage-600 dark:bg-sage-400" />
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  if (loading) {
    return (
      <Sidebar
        side="right"
        collapsible="offcanvas"
        className="border-none bg-sidebar"
      >
        <SidebarContent>
          <div className="p-4 text-center text-stone-400 dark:text-stone-500">
            در حال بارگذاری...
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  const isLoggedIn = !!user;

  return (
    <Sidebar
      side="right"
      collapsible="offcanvas"
      className="border-none bg-sidebar"
    >
      <SidebarContent>
        {user && (
          <div className="p-4 mb-2 bg-sage-50/50 dark:bg-white/5 mx-2 mt-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="bg-sage-100 dark:bg-sage-900/40 rounded-full p-2">
                <UserCircle className="text-sage-600 dark:text-sage-400 h-6 w-6" />
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-stone-400 dark:text-stone-500">
                  خوش آمدی،
                </span>

                <span className="text-sm font-bold text-stone-700 dark:text-stone-200 truncate max-w-[120px]">
                  {user.profile?.full_name ||
                    user.name ||
                    user.email?.split("@")[0]}
                </span>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-sm mb-2 px-4 text-stone-600 dark:text-stone-300">
            منوی دسترسی
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(publicItems)}

              {isLoggedIn && renderMenuItems(privateItems)}

              {isLoggedIn && isAdmin && renderMenuItems(adminItems)}

              {!isLoggedIn && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="py-6 bg-sage-600 text-white hover:bg-sage-700"
                    onClick={handleItemClick}
                  >
                    <Link
                      href="/login"
                      className="flex items-center gap-3 justify-center"
                    >
                      <Podcast className="h-5 w-5" />

                      <span className="font-bold">
                        ورود / ثبت‌نام
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isLoggedIn && !isProfileComplete && (
          <div className="mx-4 mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Link
              href="/complete-profile"
              onClick={handleItemClick}
              className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold"
            >
              <AlertCircle className="h-4 w-4 text-amber-500" />
              تکمیل اطلاعات پروفایل
            </Link>
          </div>
        )}
      </SidebarContent>

      {user && (
        <SidebarFooter className="p-4 border-t border-stone-200/50 dark:border-stone-800/50">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleSignOut}
                className="py-6 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />

                <span className="font-bold">
                  خروج از حساب
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}

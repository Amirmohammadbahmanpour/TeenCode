"use client"
import { usePathname } from "next/navigation";
import Footer from "./contact-us"; // همان فوتری که کدش را بالا داریم

export function SmartFooter() {
  const pathname = usePathname();

  // لیست صفحاتی که فوتر نباید در آن‌ها باشد
  const hideFooterRoutes = [
    "/login", 
    "/register", 
    "/complete-profile", 
    "/dashboard", 
    "/grow",
    "/admin"
  ];

  // چک کردن اینکه آیا آدرس فعلی جزو لیست حذفیات هست یا نه
  const shouldHide = hideFooterRoutes.some(route => pathname.startsWith(route));

  if (shouldHide) return null;

  return <Footer />;
}
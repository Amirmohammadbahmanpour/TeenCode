"use client"
import { useState } from "react";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import Image from "next/image";
import Link from "next/link";
import { Lightbulb, Target, Rocket , Plus , X } from "lucide-react";
import AboutUs from "@/components/about-us";
import FinalCTA from "@/components/final-cta";
import Footer from "@/components/contact-us";
import LoginPage from "./pages/login/page";
const stepsData = [
  { 
    title: "کشف استعداد", 
    icon: Lightbulb, 
    desc: "در این مرحله با استفاده از تست‌های تخصصی و جلسات مشاوره، نقاط قوت پنهان تو را شناسایی می‌کنیم تا مسیر آینده‌ات شفاف‌تر شود. ما معتقدیم هر نوجوان یک کد منحصر به فرد دارد که باید رمزگشایی شود." 
  },
  { 
    title: "نقشه راه اختصاصی", 
    icon: Target, 
    desc: "بعد از شناسایی استعداد، یک برنامه گام به گام متناسب با علایق و توانایی‌هایت طراحی می‌شود. این برنامه شامل دوره‌های آموزشی، پروژه‌های عملی و معرفی منتورهای متخصص در همان حوزه است." 
  },
  { 
    title: "شکوفایی و اجرا", 
    icon: Rocket, 
    desc: "در مرحله آخر، تو وارد دنیای واقعی می‌شوی. با حمایت تیم متخصصین ما، اولین پروژه‌های خودت را استارت می‌زنی و مهارت‌هایی که یاد گرفته‌ای را به دستاوردهای واقعی و رزومه‌ای درخشان تبدیل می‌کنی." 
  }
];
export default function Home() {
  return (
    <>
      {/* بخش بنر (Hero) - فقط در صفحه اصلی دیده می‌شود */}
      <section className="bg-cream-soft dark:bg-cream-dark pt-6 pb-12 lg:pt-10 lg:pb-24 border-b border-stone-200/20 px-6 md:px-12 lg:px-16 scroll-smooth">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-y-10 lg:gap-x-16 xl:gap-x-24">

          <div className="text-center lg:text-right space-y-6 flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-stone-800 dark:text-white leading-[1.2]">
              تین کد، شناسایی بیشتر <br />
              <span className="text-sage-600">جوانان و نوجوانان</span>
            </h1>

            <p className="text-stone-500 dark:text-stone-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto lg:mr-0 leading-relaxed">
              مسیر تحول شخصی و رشد آگاهی با متدهای نوین آموزشی برای نسل جدید.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <Link href="pages/login" className="bg-sage-600 hover:bg-sage-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg shadow-sage-200/50 hover:-translate-y-1">
                شروع کنید
              </Link>
              <button className="border-2 border-stone-300 dark:border-stone-700 px-10 py-4 rounded-full font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900 transition-all">
                مشاوره رایگان
              </button>
            </div>
          </div>

          <div className="w-full lg:flex-1 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[280px] md:max-w-[400px] lg:max-w-[480px] xl:max-w-[550px]">
              <div className="absolute -inset-10 bg-sage-200/40 blur-[80px] rounded-full opacity-60" />
              <Image
                src="/banner-img.webp"
                alt="کتاب تحول"
                width={600}
                height={600}
                className="relative w-full h-auto rounded-[2.5rem] drop-shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* بقیه محتوای صفحه اصلی */}
      <main className="p-6 md:p-12">
        <div className="max-w-6xl mx-auto text-center py-20">
          {/* بخش چطور کار می‌کنیم؟ */}
          <HowItWorks steps={stepsData}/>
          <AboutUs />
          <FAQ />
          <FinalCTA />
        </div>
      </main>
    </>
  );
}
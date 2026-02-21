import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Image from "next/image"
import Link from "next/link"
import HowItWorks from "@/components/HowItWorks"
import FAQ from "@/components/FAQ"
import AboutUs from "@/components/about-us"
import FinalCTA from "@/components/final-cta"
import { User } from '@supabase/supabase-js'

// تعریف تایپ‌های دقیق برای داده‌های دیتابیس
export interface UserProfile {
  full_name: string | null;
  // سایر فیلدهایی که در جدول پروفایل داری را اینجا اضافه کن
}

export interface UserProgress {
  id: string;
  is_completed: boolean;
  lesson_id: string;
}

// اینترفیسی که به کامپوننت‌های Child پاس می‌دهیم
export interface InitialDataProps {
  user: User | null;
  profile: UserProfile | null;
  progress: UserProgress[] | null;
}

export default async function Home() {
  // ۱. تنظیمات سرور کلاینت سوبابیس
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
      },
    }
  )

  // ۲. دریافت اطلاعات کاربر در سمت سرور
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile: UserProfile | null = null;
  let progress: UserProgress[] | null = null;

  if (user) {
    const [profileRes, progressRes] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', user.id).single(),
      supabase.from('user_progress').select('*').eq('user_id', user.id)
    ]);
    
    profile = profileRes.data as UserProfile;
    progress = progressRes.data as UserProgress[];
  }

  const isLoggedIn = !!user;
  const userData: InitialDataProps = { user, profile, progress };

  return (
    <>
      {/* بخش Hero - با استایل اصلی شما */}
      <section className="bg-cream-soft dark:bg-stone-950 pt-6 pb-12 lg:pt-10 lg:pb-24 border-b border-stone-200/20 px-6 md:px-12 lg:px-16 scroll-smooth">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-y-10 lg:gap-x-16 xl:gap-x-24">

          <div className="text-center lg:text-right space-y-6 flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-stone-800 dark:text-white leading-[1.2]">
              تین کد، شناسایی بیشتر <br />
              <span className="text-sage-600">جوانان و نوجوانان</span>
            </h1>

            <p className="text-stone-500 dark:text-stone-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto lg:mr-0 leading-relaxed">
              {isLoggedIn 
                ? `خوش آمدی ${profile?.full_name?.split(' ')[0] || 'تین‌کدی عزیز'}! بیا مسیر یادگیری‌ات را ادامه دهیم.`
                : "مسیر تحول شخصی و رشد آگاهی با متدهای نوین آموزشی برای نسل جدید."}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className="bg-sage-600 hover:bg-sage-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg shadow-sage-200/50 hover:-translate-y-1"
              >
                {isLoggedIn ? "ورود به داشبورد" : "شروع کنید"}
              </Link>

              <Link
                href={isLoggedIn ? "/courses" : "/consulting"}
                className="border-2 border-stone-300 dark:border-stone-700 px-10 py-4 rounded-full font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900 transition-all text-center"
              >
                {isLoggedIn ? "مشاهده دوره‌ها" : "مشاوره رایگان"}
              </Link>
            </div>
          </div>

          <div className="w-full lg:flex-1 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[280px] md:max-w-[400px] lg:max-w-[480px] xl:max-w-[550px]">
              <div className="absolute -inset-10 bg-sage-200/40 blur-[80px] rounded-full opacity-60" />
              <Image
                src="/banner-img.webp"
                alt="تین کد"
                width={600}
                height={600}
                className="relative w-full h-auto rounded-[2.5rem] drop-shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <main className="p-6 md:p-12">
        <div className="max-w-6xl mx-auto text-center py-20">
          {/* پاس دادن دیتا به صورت SSR به کامپوننت کلاینتی */}
          <HowItWorks initialData={userData} />
          <AboutUs profile={profile}/>
          <FAQ isLoggedIn={isLoggedIn}/>
          <FinalCTA isLoggedIn={isLoggedIn} profile={profile}/>
        </div>
      </main>
    </>
  );
}
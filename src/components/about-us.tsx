// pages/about-us.tsx (یا هر فایل دیگری که این بخش را قرار می‌دهی)
"use client"
import Image from "next/image"; // برای بهینه‌سازی تصاویر در Next.js

export default function AboutUs() {
  return (
    <section id="about-us" className="py-24 bg-white dark:bg-stone-950 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* تیتر اصلی بخش - ساده و با ابهت */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-stone-800 dark:text-white leading-tight">
            داستان ما؛ <br />
            <span className="text-sage-600"> فراتر از یک آموزش ساده.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* بخش تصویر - ۷ ستون از ۱۲ ستون */}
          <div className="lg:col-span-7 relative group px-4 md:px-0">

            {/* لایه تزیینی پشت عکس برای ایجاد عمق و حرکت بصری */}
            <div className="absolute -inset-4 bg-sage-50/50 dark:bg-stone-900/50 rounded-[4rem] -rotate-2 transition-transform group-hover:rotate-0 duration-700 pointer-events-none"></div>

            {/* محفظه اصلی تصویر */}
            <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900">
              <Image
                src="/tem-img.png"
                alt="تیم ما"
                width={1000}
                height={700}
                priority
                className="w-full h-[400px] md:h-[550px] object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              {/* یک لایه پوششی بسیار ظریف که فقط در هاور فعال می‌شود */}
              <div className="absolute inset-0 bg-sage-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            </div>
          </div>

          {/* بخش متن - ۵ ستون از ۱۲ ستون */}
          <div className="lg:col-span-5 space-y-8 pr-4">
            <div>
              <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                ما کی هستیم؟
              </h3>
              <p className="text-stone-600 dark:text-stone-400 leading-loose text-lg">
                ما معتقدیم یادگیری نباید خسته‌کننده باشد. در اینجا، ما بستری فراهم کرده‌ایم که در آن دانش تخصصی با طراحی مدرن گره خورده تا تجربه‌ای متفاوت از رشد شخصی را رقم بزنیم.
              </p>
            </div>

            <div className="border-r-4 border-sage-100 pr-6 py-2">
              <p className="text-stone-500 dark:text-stone-400 italic">
                هدف ما فقط انتقال اطلاعات نیست، بلکه ایجاد تغییری پایدار در سبک زندگی و دیدگاه شماست.
              </p>
            </div>

            {/* یک آمار کوچک برای اعتماد سازی */}
            <div className="flex gap-10 pt-4 justify-between">
              <div>
                <span className="block text-3xl font-black text-sage-600">+۵۰۰</span>
                <span className="text-sm text-stone-400">دانشجو</span>
              </div>
              <div>
                <span className="block text-3xl font-black text-sage-600">+۱۲</span>
                <span className="text-sm text-stone-400">دوره تخصصی</span>
              </div>
              <div>
                <span className="block text-3xl font-black text-sage-600">+۱۲</span>
                <span className="text-sm text-stone-400">دوره تخصصی</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
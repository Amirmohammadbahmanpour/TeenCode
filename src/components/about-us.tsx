import Image from "next/image";

// تعریف اینترفیس برای تایپ‌بندی دقیق
interface UserProfile {
  full_name: string | null;
}

interface AboutUsProps {
  profile: UserProfile | null;
}

export default function AboutUs({ profile }: AboutUsProps) {
  const isLoggedIn = !!profile;

  return (
    <section id="about-us" className="py-24 bg-white dark:bg-stone-950 px-6 overflow-hidden text-right" dir="rtl">
      <div className="max-w-7xl mx-auto">

        {/* تیتر اصلی - هوشمند بر اساس وضعیت لاگین */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-stone-800 dark:text-white leading-tight">
            {isLoggedIn ? (
              <>
                داستان ما؛ <br />
                <span className="text-sage-600"> با حضور تو، فصل جدیدی رقم خورد.</span>
              </>
            ) : (
              <>
                داستان ما؛ <br />
                <span className="text-sage-600"> فراتر از یک آموزش ساده.</span>
              </>
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* بخش تصویر - ۷ ستون */}
          <div className="lg:col-span-7 relative group px-4 md:px-0">
            {/* لایه تزیینی پشت عکس */}
            <div className="absolute -inset-4 bg-sage-50/50 dark:bg-stone-900/50 rounded-[4rem] -rotate-2 transition-transform duration-700 pointer-events-none"></div>

            <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900">
              <Image
                src="/tem-img.png"
                alt="تیم ما"
                width={1000}
                height={700}
                priority
                className="w-full h-[400px] md:h-[550px] object-cover transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-sage-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            </div>
          </div>

          {/* بخش متن - ۵ ستون */}
          <div className="lg:col-span-5 space-y-8 pr-4">
            <div>
              <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                {isLoggedIn ? `خوش برگشتی، ${profile?.full_name?.split(' ')[0] ?? 'دوست من'}` : "ما کی هستیم؟"}
              </h3>
              <p className="text-stone-600 dark:text-stone-400 leading-loose text-lg font-medium">
                {isLoggedIn 
                  ? "تو حالا بخشی از جامعه‌ تین‌کد هستی. تمام تلاش ما این است که با ارائه محتوای عمیق و نقشه‌های راه دقیق، مسیر رشد و تحول شخصی تو را هموارتر کنیم. تداوم تو، سوخت موتور ماست."
                  : "ما معتقدیم یادگیری نباید خسته‌کننده باشد. در اینجا، ما بستری فراهم کرده‌ایم که در آن دانش تخصصی با طراحی مدرن گره خورده تا تجربه‌ای متفاوت از رشد شخصی را رقم بزنیم."
                }
              </p>
            </div>

            <div className="border-r-4 border-sage-100 pr-6 py-2">
              <p className="text-stone-500 dark:text-stone-400 italic font-medium">
                {isLoggedIn
                  ? "هر جلسه آموزشی که می‌بینی، یک کد جدید در ذهن تو برای ساختن زندگی بهتر اجرا می‌شود. هوشمندانه ادامه بده."
                  : "هدف ما فقط انتقال اطلاعات نیست، بلکه ایجاد تغییری پایدار در سبک زندگی و دیدگاه شماست."
                }
              </p>
            </div>

            {/* بخش آمار - ثابت برای هر دو حالت */}
            <div className="flex gap-10 pt-4 justify-between">
              <div>
                <span className="block text-3xl font-black text-sage-600">+۵۰۰</span>
                <span className="text-sm text-stone-400 font-bold">دانشجو</span>
              </div>
              <div>
                <span className="block text-3xl font-black text-sage-600">+۱۲</span>
                <span className="text-sm text-stone-400 font-bold">دوره تخصصی</span>
              </div>
              <div>
                <span className="block text-3xl font-black text-sage-600">۲۴/۷</span>
                <span className="text-sm text-stone-400 font-bold">پشتیبانی</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
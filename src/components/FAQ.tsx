import FaqAccordion from "./FAQAccordion";

interface FAQProps {
    isLoggedIn: boolean;
}

export default function FAQ({ isLoggedIn }: FAQProps) {
    const guestFaqs = [
        {
            question: "آیا برای شرکت در دوره نیاز به پیش نیاز خاصی وجود دارد؟",
            answer: "خیر، در این دوره آموزشی شما نیاز به هیچ پیش نیازی ندارید و با گذراندن آزمون مقدماتی وارد دوره می‌شوید.",
        },
        {
            question: "دوره ۳۰ روزه شامل چه مباحثی است؟",
            answer: "این دوره شامل تغییر ذهنیت، عادات روزانه و مهارت‌های پایه برای تحول شخصی است.",
        },
        {
            question: "چطور می‌توانم در دوره ثبت‌نام کنم؟",
            answer: "پس از ثبت‌نام در سایت، می‌توانید آزمون مقدماتی را انجام دهید و مراحل ورود به دوره را ادامه دهید.",
        },
        {
            question: "آیا بعد از پایان دوره پشتیبانی داریم؟",
            answer: "بله، اعضای دوره می‌توانند برای دریافت راهنمایی و پاسخ به سوالات خود از بخش پشتیبانی استفاده کنند.",
        },
    ];

    const userFaqs = [
        {
            question: "چطور می‌توانم سوالات درسی‌ام را بپرسم؟",
            answer: "شما می‌توانید از طریق پنل کاربری و بخش پشتیبانی، سوالات خود را با منتورها مطرح کنید.",
        },
        {
            question: "آیا محتوای دوره آپدیت می‌شود؟",
            answer: "بله، تمام آپدیت‌های جدید برای دانش‌جویان فعلی به صورت رایگان در دسترس خواهد بود.",
        },
        {
            question: "چطور میزان پیشرفت خودم را ببینم؟",
            answer: "در پنل کاربری می‌توانید میزان پیشرفت، درس‌های تکمیل‌شده و وضعیت دوره‌های خود را مشاهده کنید.",
        },
    ];

    const currentFaqs = isLoggedIn ? userFaqs : guestFaqs;

    return (
        <section id="FAQ" className="w-full max-w-full overflow-hidden bg-cream-soft dark:bg-stone-950 px-3 sm:px-5 lg:px-6 py-8 sm:py-12 lg:py-20 my-5 sm:my-8 lg:my-12 transition-colors duration-300">
            <div className="w-full max-w-4xl mx-auto" dir="rtl">

                <div className="text-center mb-5 sm:mb-8 lg:mb-10">
                    <span className="inline-block text-[9px] sm:text-xs font-bold text-sage-600 dark:text-sage-400 bg-sage-50 dark:bg-sage-950/40 border border-sage-100 dark:border-sage-900 px-2.5 py-1 rounded-full mb-2 sm:mb-3 transition-colors duration-300">
                        راهنمای نوجوانه
                    </span>

                    <h2 className="text-[21px] sm:text-3xl md:text-4xl lg:text-5xl font-black text-stone-800 dark:text-white leading-tight transition-colors duration-300">
                        سوالات متداول
                    </h2>

                    <p className="mt-2 text-[10px] sm:text-sm lg:text-base text-stone-500 dark:text-stone-400 max-w-xl mx-auto leading-5 sm:leading-7 transition-colors duration-300">
                        پاسخ سوالاتی که ممکن است قبل یا هنگام استفاده از نوجوانه برایتان پیش بیاید.
                    </p>
                </div>

                <div className="w-full bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-sm overflow-hidden transition-colors duration-300">
                    <div className="p-1.5 sm:p-2.5 lg:p-4">
                        <FaqAccordion items={currentFaqs} />
                    </div>
                </div>

                <div className="mt-3 sm:mt-5 text-center">
                    <p className="text-[9px] sm:text-xs lg:text-sm text-stone-400 dark:text-stone-500">
                        سوال دیگری دارید؟ از بخش پشتیبانی با ما در ارتباط باشید.
                    </p>
                </div>

            </div>
        </section>
    );
}

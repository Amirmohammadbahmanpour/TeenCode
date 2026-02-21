import FaqAccordion from "./FAQAccordion";

interface FAQProps {
  isLoggedIn: boolean;
}

export default function FAQ({ isLoggedIn }: FAQProps) {
  // سوالات مخصوص کاربر مهمان
  const guestFaqs = [
    { question: "آیا برای شرکت در دوره نیاز به پیش نیاز خاصی وجود دارد؟", answer: "خیر، در این دوره آموزشی شما نیاز به هیچ پیش نیازی ندارید و با گذراندن آزمون مقدماتی وارد دوره می‌شوید." },
    { question: "دوره ۳۰ روزه شامل چه مباحثی است؟", answer: "این دوره شامل تغییر ذهنیت، عادات روزانه و مهارت‌های پایه برای تحول شخصی است." },
    { question: "دوره ۳۰ روزه شامل چه مباحثی است؟", answer: "این دوره شامل تغییر ذهنیت، عادات روزانه و مهارت‌های پایه برای تحول شخصی است." },
    { question: "دوره ۳۰ روزه شامل چه مباحثی است؟", answer: "این دوره شامل تغییر ذهنیت، عادات روزانه و مهارت‌های پایه برای تحول شخصی است." }
  ];

  // سوالات مخصوص کاربر لاگین شده
  const userFaqs = [
    { question: "چطور می‌توانم سوالات درسی‌ام را بپرسم؟", answer: "شما می‌توانید از طریق پنل کاربری و بخش پشتیبانی، سوالات خود را با منتورها مطرح کنید." },
    { question: "آیا محتوای دوره آپدیت می‌شود؟", answer: "بله، تمام آپدیت‌های جدید برای دانش‌جویان فعلی به صورت رایگان در دسترس خواهد بود." },
    { question: "آیا محتوای دوره آپدیت می‌شود؟", answer: "بله، تمام آپدیت‌های جدید برای دانش‌جویان فعلی به صورت رایگان در دسترس خواهد بود." }
  ];

  const currentFaqs = isLoggedIn ? userFaqs : guestFaqs;

  return (
    <section id="FAQ" className="md:py-24 pb-10 my-10 py-14 bg-cream-soft dark:bg-black px-6">
      <div className="max-w-3xl mx-auto text-right" dir="rtl">
        <h2 className="text-3xl md:text-4xl font-black text-stone-800 text-center mb-16 dark:text-white">
          سوالات متداول
        </h2>

        {/* بخش کلاینت را اینجا فراخوانی می‌کنیم و سوالات را به آن پاس می‌دهیم */}
        <FaqAccordion items={currentFaqs} />
      </div>
    </section>
  );
}
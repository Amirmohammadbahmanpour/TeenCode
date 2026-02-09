export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-sage-200 text-center">
        <h1 className="text-3xl font-bold text-sage-700 mb-4">
          سلام! به پروژه کتاب تحول خوش اومدی
        </h1>
        <p className="text-stone-800 mb-6">
          این یک تست برای اطمینان از رنگ‌های Sage و راست‌چین بودن صفحه است.
        </p>
        <button className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all">
          تایید و ادامه
        </button>
      </div>
    </div>
  );
}
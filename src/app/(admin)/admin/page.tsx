import { supabase } from "@/lib/supabase";
import { FileText, Users, MessageSquare, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
// تایپ برای کارت‌های داشبورد
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-stone-900 p-6 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-stone-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-black mt-2 text-stone-800 dark:text-stone-100">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // ۲. چک کردن نقش کاربر (Role)
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // ۳. اگر پروفایل یافت نشد یا نقش کاربر admin نبود
  if (error || profile?.role !== 'admin') {
    redirect('/') // ریدایرکت به صفحه اصلی
  }
  // گرفتن آمار از سوبابیس (به صورت موازی برای سرعت بیشتر)
  const [postsCount, profilesCount] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true })
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-stone-800 dark:text-stone-100">سلام، مدیر عزیز 👋</h1>
        <p className="text-stone-500 mt-2">خلاصه وضعیت پلتفرم تین کد در یک نگاه</p>
      </div>

      {/* Grid کارت‌های آماری */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="کل مقالات"
          value={postsCount.count || 0}
          icon={FileText}
          color="bg-sage-600"
        />
        <StatCard
          title="تعداد کاربران"
          value={profilesCount.count || 0}
          icon={Users}
          color="bg-blue-600"
        />
        <StatCard
          title="نظرات جدید"
          value="۱۲"
          icon={MessageSquare}
          color="bg-amber-500"
        />
        <StatCard
          title="رشد ماهانه"
          value="+۱۵٪"
          icon={TrendingUp}
          color="bg-emerald-500"
        />
      </div>

      {/* اینجا می‌توانی در آینده لیست آخرین کاربران یا پست‌ها را اضافه کنی */}
      <div className="bg-sage-50 dark:bg-sage-900/10 border border-sage-200 dark:border-sage-800/50 p-8 rounded-[2.5rem] mt-10">
        <h4 className="font-bold text-sage-800 dark:text-sage-300">نکته روز:</h4>
        <p className="text-sage-700 dark:text-sage-400 mt-2 leading-relaxed">
          امروز ۳ مقاله جدید منتشر شده است. پاسخ به نظرات کاربران می‌تواند تعامل سایت را تا ۴۰٪ افزایش دهد.
        </p>
      </div>
    </div>
  );
}
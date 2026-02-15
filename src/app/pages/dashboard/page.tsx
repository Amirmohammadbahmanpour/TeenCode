import Image from "next/image"
import { Edit2 } from "lucide-react"

export default function Dashboard() {
    const progressPercent: number = 60;
    const isFinished = progressPercent === 100;

    return (
        <section className="p-8 bg-white dark:bg-cream-dark">
            {/* بخش پروفایل*/}
            <div className="flex items-center gap-6 p-5 bg-cream-soft rounded-t-3xl dark:bg-cream-dark dark:border">
                <div className="relative">
                    <Image
                        src="/tem-img.png"
                        className="w-20 h-20 rounded-full" width={80} height={80} alt="profile" />
                    <button className="absolute bottom-0 right-0 bg-stone-100 p-1 rounded-full">
                        <Edit2 size={15} className="cursor-pointer dark:text-sage-600" />
                    </button>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">
                        Zahra Bahmanpour
                    </h1>
                    <button className="text-sage-600 text-sm">Edit Profile</button>
                </div>
            </div>
            {/* بخش پیشرفت*/}
            <div className="mt-4 max-w-2xl mx-auto">
                <div className="bg-cream-soft p-8  border border-stone-100 shadow-sm dark:bg-cream-dark">
                    <h3 className="text-2xl font-bold">دوره جامع تحول فردی</h3>

                    {/* بخش نمایش رشد */}
                    <div className="mt-6 mb-8">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-stone-500">روند یادگیری:</span>
                            <span className="font-bold text-sage-600">
                                {isFinished ? "تکمیل شده" : `${progressPercent}%`}
                            </span>
                        </div>

                        {/* نوار پیشرفت (Progress Bar) */}
                        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-sage-600 transition-all duration-700"
                                style={{ width: `${progressPercent}%` }} // تنظیم عرض به صورت پویا
                            ></div>
                        </div>
                    </div>

                    {/* دکمه غیرفعال یا نمایشگر وضعیت */}
                    <div className={`text-center py-4 rounded-2xl font-bold ${isFinished ? "bg-sage-100 text-sage-700" : "bg-stone-50 text-stone-400 dark:bg-sage-600 dark:text-white"
                        }`}>
                        {isFinished ? "شما این دوره را با موفقیت گذراندید" : "در حال یادگیری... هنوز تکمیل نشده"}
                    </div>
                </div>
            </div>
        </section>
    )
}
import Image from "next/image";
import { Edit2, Bookmark, Heart, FileText, MessageSquare, Lightbulb } from "lucide-react";

export default function Dashboard() {
    const progressPercent: number = 60;
    const isFinished = progressPercent === 100;

    const tools = [
        { id: 1, title: "ذخیره شده‌ها", icon: <Bookmark size={20} />, count: 12 },
        { id: 2, title: "لایک شده‌ها", icon: <Heart size={20} />, count: 5 },
        { id: 3, title: "یادداشت‌ها", icon: <FileText size={20} />, count: 8 },
        { id: 4, title: "پیام‌ها", icon: <MessageSquare size={20} />, count: 2 },
    ];

    const userProfile = {
        name: "Zahra Bahmanpour",
        bio: "",
        avatar: "/tem-img.png",
    };

    const isProfileIncomplete = userProfile.bio === "";

    return (
        <section className="min-h-full p-4 md:p-8 bg-white dark:bg-stone-950 transition-colors">
            <div className="max-w-5xl mx-auto">

                {/* ۱. اعلان تکمیل پروفایل (واکنش‌گرا) */}
                {isProfileIncomplete && (
                    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-center sm:text-right">
                            <Lightbulb className="text-amber-500 shrink-0" />
                            <div>
                                <p className="font-bold text-amber-900 dark:text-amber-200 text-sm md:text-base">پروفایلت هنوز کامل نیست!</p>
                                <p className="text-xs md:text-sm text-amber-700 dark:text-amber-400">با تکمیل اطلاعات، تجربه بهتری داشته باش.</p>
                            </div>
                        </div>
                        <button className="w-full sm:w-auto bg-amber-500 text-white px-6 py-2 rounded-xl text-xs md:text-sm font-bold hover:bg-amber-600 transition-all">
                            تکمیل پروفایل
                        </button>
                    </div>
                )}

                {/* ۲. بخش پروفایل (اصلاح فونت و چیدمان موبایل) */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 bg-stone-50 dark:bg-stone-900 rounded-t-3xl border-x border-t border-stone-100 dark:border-stone-800">
                    <div className="relative">
                        <div className="w-20 h-20 md:w-24 md:h-24 relative">
                            <Image
                                src={userProfile.avatar}
                                fill
                                className="rounded-full object-cover border-4 border-white dark:border-stone-800 shadow-sm"
                                alt="profile"
                            />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-white dark:bg-stone-800 p-1.5 rounded-full shadow-md border border-stone-100 dark:border-stone-700">
                            <Edit2 size={14} className="text-sage-600" />
                        </button>
                    </div>
                    <div className="text-center sm:text-right">
                        <h1 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-stone-100">
                            {userProfile.name}
                        </h1>
                        <span className="inline-block mt-1 px-3 py-1 bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400 text-xs font-medium rounded-full">
                            کاربر عادی
                        </span>
                    </div>
                </div>

                {/* ۳. بخش پیشرفت (کارت اصلی) */}
                <div className="bg-stone-50 dark:bg-stone-900 p-6 md:p-8 border-x border-b border-stone-100 dark:border-stone-800 shadow-sm rounded-b-3xl">
                    <h3 className="text-lg md:text-xl font-bold text-stone-800 dark:text-stone-200">دوره جامع تحول فردی</h3>

                    <div className="mt-6 mb-8">
                        <div className="flex justify-between text-xs md:text-sm mb-2">
                            <span className="text-stone-500 dark:text-stone-400">روند یادگیری:</span>
                            <span className="font-bold text-sage-600 dark:text-sage-400">
                                {isFinished ? "تکمیل شده" : `${progressPercent}%`}
                            </span>
                        </div>
                        <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-sage-600 rounded-full transition-all duration-1000"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className={`text-center py-4 rounded-2xl text-sm md:text-base font-bold transition-colors ${isFinished
                            ? "bg-sage-100 text-sage-700 dark:bg-sage-900/40 dark:text-sage-300"
                            : "bg-white dark:bg-stone-800 text-stone-400 dark:text-stone-500 border border-stone-100 dark:border-stone-700"
                        }`}>
                        {isFinished ? "شما این دوره را با موفقیت گذراندید ✅" : "در حال یادگیری... هنوز تکمیل نشده"}
                    </div>
                </div>

                {/* ۴. گرید ابزارها (۴ باکس) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {tools.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 md:p-6 rounded-[2rem] bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 cursor-pointer hover:scale-[1.03] hover:shadow-md transition-all group"
                        >
                            <div className="mb-3 text-sage-600 dark:text-sage-500 group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h4 className="text-sm md:text-base font-bold text-stone-800 dark:text-stone-200">
                                {item.title}
                            </h4>
                            <p className="text-[10px] md:text-xs text-stone-500 dark:text-stone-400 mt-1">
                                {item.count} مورد ذخیره شده
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
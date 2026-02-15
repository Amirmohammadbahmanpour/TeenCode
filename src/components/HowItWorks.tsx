"use client";
import { useState } from "react";
import { Plus, X, LucideIcon } from "lucide-react";

interface StepProps {
    title: string;
    desc: string;
    icon: LucideIcon;
}

// کامپوننت داخلی برای هر کارت
const StepCard = ({ title, desc, icon: IconComponent }: StepProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`bg-white dark:bg-stone-900 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-stone-50 dark:border-stone-800 flex flex-col items-center text-center group transition-all duration-500 relative h-full
            ${isExpanded ? 'z-20 scale-[1.02]' : 'z-10'} 
        `}>
            {/* بخش آیکون متحرک */}
            <div className="w-20 h-20 mb-6 flex items-center justify-center relative shrink-0">
                <div className={`absolute inset-0 bg-sage-100 dark:bg-sage-900/30 rounded-3xl rotate-6 group-hover:rotate-0 transition-all duration-500 ${isExpanded ? 'bg-sage-600 rotate-0 shadow-lg shadow-sage-200' : ''}`}></div>
                <IconComponent
                    size={32}
                    strokeWidth={1.5}
                    className={`relative z-10 transition-colors duration-500 ${isExpanded ? 'text-white' : 'text-sage-600'}`}
                />
            </div>

            {/* تیتر */}
            <h3 className="text-xl font-bold mb-4 text-stone-800 dark:text-white">
                {title}
            </h3>

            {/* بخش محتوا با افکت محو شدن در انتها */}
            <div
                className={`relative transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-[80px]'
                    }`}
            >
                <p className="text-stone-500 dark:text-stone-400 text-sm md:text-base leading-relaxed">
                    {desc}
                </p>

                {/* افکت گرادینت برای ترغیب به کلیک - فقط وقتی بسته است دیده می‌شود */}
                {!isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-stone-900 to-transparent pointer-events-none" />
                )}
            </div>

            {/* دکمه مثبت/منفی */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`mt-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${isExpanded
                    ? 'bg-sage-600 text-white shadow-md'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-sage-600 hover:text-white'
                    }`}
            >
                {isExpanded ? <X size={18} /> : <Plus size={18} />}
            </button>
        </div>
    );
};

// کامپوننت اصلی که در پیج استفاده می‌شود
export default function HowItWorks({ steps }: { steps: StepProps[] }) {
    return (
        <section className="py-24 pt-8 bg-cream-soft dark:bg-stone-950 px-6">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-stone-800 dark:text-white leading-tight">
                        مسیر <span className="text-sage-600">تحول</span> تو چطور رقم می‌خورد؟
                    </h2>
                    <p className="text-stone-500 dark:text-stone-400 max-w-2xl mx-auto text-lg italic font-medium">
                        سه گام ساده برای رسیدن به بهترین نسخه از خودت
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 items-stretch">
                    {steps.map((item, index) => (
                        <StepCard key={index} {...item} />
                    ))}
                </div>

            </div>
        </section>
    );
}
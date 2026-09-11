"use client"
import { useState } from "react"
import { Plus, X } from "lucide-react"

// تعریف اینترفیس دقیق برای پراپ‌ها (حذف any)
interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setisOpen] = useState(false);

  return (
    <div className="dark:border-stone-800 last:border-0 py-2">
      <button
        onClick={() => setisOpen(!isOpen)}
        className={`p-6 w-full flex items-start justify-between text-right transition-all duration-300 group
          ${isOpen
            ? 'bg-stone-50 dark:bg-stone-800/50 rounded-t-[1.5rem]'
            : 'bg-white dark:bg-stone-900 rounded-[1.5rem]'
          }`}
      >
        <span className={`text-base md:text-lg font-bold transition-colors flex-1 ml-4 
          ${isOpen ? 'text-sage-600' : 'text-stone-700 dark:text-stone-200 group-hover:text-sage-500'}`}>
          {question}
        </span>

        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 
          ${isOpen
            ? 'bg-sage-600 text-white rotate-180'
            : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'}`}>
          {isOpen ? <X size={16} /> : <Plus size={16} />}
        </div>
      </button>

      <div className={`grid transition-all duration-500 ease-in-out ${isOpen
          ? 'grid-rows-[1fr] opacity-100 pb-6 px-6 bg-stone-50 dark:bg-stone-800/50 rounded-b-[1.5rem]'
          : 'grid-rows-[0fr] opacity-0'
        }`}>
        <div className="overflow-hidden">
          <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-sm md:text-base pr-4 border-r-2 border-sage-200 dark:border-sage-800">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FaqAccordion({ items }: { items: FaqItemProps[] }) {
  return (
    <div className="rounded-[2.5rem] p-8 md:p-12">
      {items.map((item, index) => (
        <FaqItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}
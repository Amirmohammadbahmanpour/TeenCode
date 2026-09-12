"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

interface FaqAccordionProps {
    items: FAQItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setOpenIndex((current) => (current === index ? null : index));
    };

    return (
        <div className="w-full space-y-1 sm:space-y-1.5">
            {items.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                    <div key={index} className={`w-full overflow-hidden rounded-lg sm:rounded-xl border transition-all duration-300 ${isOpen ? "border-sage-200 bg-sage-50/50 dark:border-sage-900 dark:bg-sage-950/20" : "border-stone-100 bg-white dark:border-stone-800 dark:bg-stone-900"}`}>

                        <button type="button" onClick={() => toggleItem(index)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-2 sm:gap-3 px-2.5 py-2.5 sm:px-4 sm:py-3.5 text-right">

                            <span className={`min-w-0 flex-1 text-[11px] sm:text-sm lg:text-base font-bold leading-5 sm:leading-6 transition-colors duration-200 ${isOpen ? "text-sage-700 dark:text-sage-400" : "text-stone-700 dark:text-stone-200"}`}>
                                {item.question}
                            </span>

                            <span className={`flex h-5 w-5 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isOpen ? "rotate-180 bg-sage-100 text-sage-600 dark:bg-sage-900/50 dark:text-sage-400" : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400"}`}>
                                <ChevronDown size={12} strokeWidth={2.5} className="sm:w-3.5 sm:h-3.5" />
                            </span>

                        </button>

                        <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                            <div className="min-h-0 overflow-hidden">
                                <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-4">
                                    <div className="border-t border-stone-200/70 dark:border-stone-800 pt-2 sm:pt-3">
                                        <p className="text-[10px] sm:text-xs lg:text-sm text-stone-500 dark:text-stone-400 leading-5 sm:leading-6 font-medium">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                );
            })}
        </div>
    );
}

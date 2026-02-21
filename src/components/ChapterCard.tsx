// components/ChapterCard.tsx
import { Lock, Play, CheckCircle, GraduationCap } from "lucide-react";

interface ChapterCardProps {
  title: string;
  chapterNumber: number;
  status: 'locked' | 'available' | 'completed';
  isFinalExamChapter?: boolean;
}

export default function ChapterCard({ title, chapterNumber, status, isFinalExamChapter }: ChapterCardProps) {
  const isLocked = status === 'locked';

  return (
    <div className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 
      ${isLocked 
        ? 'bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 opacity-70' 
        : 'bg-white dark:bg-stone-900 border-sage-100 dark:border-sage-900/50 shadow-xl hover:border-sage-300'}`}>
      
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${isLocked ? 'bg-stone-200 dark:bg-stone-800' : 'bg-sage-100 dark:bg-sage-900/50 text-sage-600'}`}>
          {status === 'completed' ? <CheckCircle size={24} /> : isLocked ? <Lock size={24} /> : <Play size={24} />}
        </div>
        <span className="text-stone-400 font-black text-4xl opacity-20">0{chapterNumber}</span>
      </div>

      <h3 className={`text-xl font-bold mb-4 ${isLocked ? 'text-stone-400' : 'text-stone-800 dark:text-white'}`}>
        {title}
      </h3>

      {/* اگر فصل ۳ بود و آزمون هم باز شده بود */}
      {isFinalExamChapter && !isLocked && (
        <div className="mt-6 pt-6 border-t border-sage-50 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sage-600">
            <GraduationCap size={20} />
            <span className="text-sm font-bold">آزمون جامع در دسترس است</span>
          </div>
          <button className="text-xs bg-sage-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sage-700 transition-colors">
            شروع آزمون
          </button>
        </div>
      )}
    </div>
  );
}
export default function Loading() {
    return (
      <div className="min-h-screen bg-white dark:bg-stone-950 p-6 md:p-12 space-y-12" dir="rtl">
        
        {/* اسکلتون بخش هدر / بنر */}
        <div className="max-w-6xl mx-auto w-full h-[35vh] md:h-[45vh] bg-stone-100 dark:bg-stone-900 rounded-[3rem] animate-pulse" />
  
        {/* بخش متون تایتل و توضیحات */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-10 md:h-14 bg-stone-100 dark:bg-stone-900 rounded-2xl w-3/4 mx-auto animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 bg-stone-50 dark:bg-stone-900/50 rounded-full w-full animate-pulse" />
            <div className="h-4 bg-stone-50 dark:bg-stone-900/50 rounded-full w-5/6 mx-auto animate-pulse" />
          </div>
        </div>
  
        {/* اسکلتون سه تا باکس (کارت‌ها) */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-stone-50 dark:bg-stone-900/40 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 animate-pulse relative overflow-hidden">
              {/* افکت درخشندگی داخلی */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-100/50 dark:from-stone-800/20 to-transparent" />
            </div>
          ))}
        </div>
  
        {/* اسکلتون لیست دروس یا سوالات */}
        <div className="max-w-3xl mx-auto space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-stone-50 dark:bg-stone-900/30 rounded-3xl w-full animate-pulse" />
          ))}
        </div>
  
      </div>
    );
  }
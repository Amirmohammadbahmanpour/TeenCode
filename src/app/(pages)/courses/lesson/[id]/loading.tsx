export default function CoursesLoading() {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 p-6 md:p-12" dir="rtl">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* اسکلتون بنر */}
                <div className="h-[300px] md:h-[400px] bg-stone-200 dark:bg-stone-800 rounded-3xl animate-pulse" />
                
                {/* اسکلتون عنوان */}
                <div className="space-y-4">
                    <div className="h-10 bg-stone-200 dark:bg-stone-800 rounded-xl w-3/4 animate-pulse" />
                    <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded-lg w-1/2 animate-pulse" />
                </div>
                
                {/* اسکلتون لیست فصل‌ها */}
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-stone-200 dark:bg-stone-800 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
}
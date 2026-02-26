export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="min-h-screen bg-cream-soft dark:bg-stone-950 flex flex-col items-center justify-center p-4">
        {/* اینجا می‌تونی یک لوگوی کوچک یا دکمه بازگشت به خانه بذاری */}
        <div className="w-full ">
          {children}
        </div>
      </div>
    )
  }
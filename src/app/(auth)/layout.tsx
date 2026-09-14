export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="min-h-screen w-full bg-cream-soft px-3 py-4 sm:px-4 sm:py-6 dark:bg-stone-950"
            dir="rtl"
        >
            <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full items-center justify-center sm:min-h-[calc(100vh-3rem)]">
                <div className="w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}


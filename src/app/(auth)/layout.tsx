export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="w-full h-full min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden"
            dir="rtl"
        >
            <div className="w-full h-full">
                {children}
            </div>
        </div>
    );
}


export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="w-full min-h-full flex flex-col justify-start"
            dir="rtl"
        >
            <div className="w-full flex-1">
                {children}
            </div>
        </div>
    );
}


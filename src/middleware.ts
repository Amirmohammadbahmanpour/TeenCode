import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("auth_token")?.value;
    const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || "x7k9m2p4";

    const isProtectedRoute =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/grow") ||
        pathname.startsWith("/courses");

    const isAdminRoute =
        pathname.startsWith(`/${adminSecret}`) ||
        pathname.startsWith("/admin");

    if (isProtectedRoute || isAdminRoute) {
        if (!token) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("returnTo", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};

// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token as any;

    // Admin gate
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // public pages
        if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/forgot-password")) {
          return true;
        }

        // protect LMS + admin
        const isProtected =
          pathname.startsWith("/welcome") ||
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/catalog") ||
          pathname.startsWith("/courses") ||
          pathname.startsWith("/lessons") ||
          pathname.startsWith("/quiz") ||
          pathname.startsWith("/settings") ||
          pathname.startsWith("/certificates") ||
          pathname.startsWith("/admin");

        if (!isProtected) return true;
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

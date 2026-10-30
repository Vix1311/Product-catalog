import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Thêm dòng này để test
  console.log(
    "🔥 MIDDLEWARE ĐANG CHẠY TẠI ĐƯỜNG DẪN:",
    request.nextUrl.pathname,
  );

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get("accessToken")?.value;
    const isLoggedIn = request.cookies.get("isLoggedIn")?.value;

    if (!token || isLoggedIn !== "true") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // /admin/:path* đã bao gồm cả /admin
};

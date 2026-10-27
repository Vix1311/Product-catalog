import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Nếu đường dẫn bắt đầu bằng /admin
  if (pathname.startsWith("/admin")) {
    // Kiểm tra token hoặc trạng thái đăng nhập từ Cookie
    // (Lưu ý: Nếu bạn lưu token bằng localStorage thì middleware của Next.js không đọc được localStorage vì chạy ở server.
    // Do đó, khi đăng nhập thành công ở Backend, bạn nên lưu token vào cả Cookies bên cạnh localStorage).
    const token = request.cookies.get("accessToken")?.value;
    const isLoggedIn = request.cookies.get("isLoggedIn")?.value;

    // Nếu không có token hoặc chưa đăng nhập, đá về trang chủ
    if (!token || isLoggedIn !== "true") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Cấu hình các route để middleware quét
export const config = {
  matcher: "/admin/:path*",
};

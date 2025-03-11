import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register");

    // 已登录用户访问登录/注册页面，重定向到首页
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return null;
    }

    // 未登录用户访问需要认证的页面，重定向到登录页
    if (!isAuth && req.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 检查管理员权限
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// 配置需要保护的路由
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}; 
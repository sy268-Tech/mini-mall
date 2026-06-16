// 路由保护 — Next.js 16 proxy 替代 middleware
// 页面级重定向，Server Component/Action 内部还需二次校验
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  // 后台管理 → 需 ADMIN 角色
  if (pathname.startsWith("/admin") && user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 已登录用户访问登录/注册 → 跳转首页
  if ((pathname.startsWith("/login") || pathname.startsWith("/register")) && user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 受保护页面 → 需登录
  const protectedPaths = ["/cart", "/checkout", "/orders", "/profile"];
  if (protectedPaths.some((p) => pathname.startsWith(p)) && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // 匹配所有路由，排除 Next.js 内部路径和静态资源
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};

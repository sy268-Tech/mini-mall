// Auth.js v5 基础配置 — 可被 proxy.ts 导入（无 Prisma 依赖）
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  // JWT 策略 — 无状态、边缘兼容
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // 登录时持久化 id, role, tier, totalSpent 到 JWT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tier = user.tier;
        token.totalSpent = user.totalSpent;
      }
      return token;
    },
    // 每次请求从 JWT 暴露到 session
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.tier = token.tier;
        session.user.totalSpent = token.totalSpent;
      }
      return session;
    },
    // 路由权限校验
    authorized({ auth, request: { nextUrl } }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = (auth?.user ?? {}) as any;
      const pathname = nextUrl.pathname;

      // 后台管理 → 需 ADMIN
      if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
        return Response.redirect(new URL("/login", nextUrl));
      }

      // 已登录用户访问登录/注册 → 重定向到首页
      if ((pathname.startsWith("/login") || pathname.startsWith("/register")) && auth?.user) {
        return Response.redirect(new URL("/", nextUrl));
      }

      // 受保护页面 → 需登录
      const protectedPaths = ["/cart", "/checkout", "/orders", "/profile"];
      if (protectedPaths.some((p) => pathname.startsWith(p)) && !auth?.user) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
  },
  providers: [], // 在 auth.ts 中填充
};

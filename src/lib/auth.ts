// Auth.js v5 完整配置 — 含 Credentials provider（需 Prisma 依赖）
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      // 登录表单字段
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        // Zod 校验输入
        const parsed = z
          .object({
            email: z.string().email("邮箱格式不正确"),
            password: z.string().min(1, "请输入密码"),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // 查找用户
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) return null;

        // 验证密码
        const match = await bcrypt.compare(password, user.password);
        if (!match) return null;

        // 返回用户信息（存入 JWT）
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tier: user.tier,
          totalSpent: user.totalSpent,
        };
      },
    }),
  ],
});

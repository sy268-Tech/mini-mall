// 认证相关 Server Actions — 注册、登录、登出
"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthError } from "next-auth";

// ── 类型定义 ───────────────────────────────────────────

export type AuthActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

// ── 注册表单校验 schema ────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(2, "昵称至少 2 个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少 6 个字符"),
});

// ── 注册 ───────────────────────────────────────────────

export async function registerUser(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  // 校验表单
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    return { success: false, fieldErrors };
  }

  const { name, email, password } = parsed.data;

  try {
    // 检查邮箱是否已注册
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return {
        success: false,
        error: "该邮箱已被注册",
      };
    }

    // 创建用户 — 默认 CUSTOMER 角色、NONE 会员等级
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CUSTOMER",
        tier: "NONE",
        totalSpent: 0,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "注册失败，请稍后重试" };
  }
}

// ── 登录 ───────────────────────────────────────────────

export async function loginUser(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "邮箱或密码错误" };
        default:
          return { success: false, error: "登录失败，请稍后重试" };
      }
    }
    // redirect 不算错误
    throw error;
  }
}

// ── 登出 ───────────────────────────────────────────────

export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}

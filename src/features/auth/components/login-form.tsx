// 登录表单 — 使用 useActionState 处理服务端校验
"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser, type AuthActionResult } from "../actions";
import Link from "next/link";

// 提交按钮（需独立组件以使用 useFormStatus）
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-button bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
    >
      {pending ? "登录中..." : "登录"}
    </button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [state, action] = useActionState<AuthActionResult | null, FormData>(
    loginUser,
    null
  );

  // 登录成功后跳转
  useEffect(() => {
    if (state?.success) {
      router.push(callbackUrl);
      router.refresh();
    }
  }, [state?.success, router, callbackUrl]);

  return (
    <form action={action} className="space-y-4">
      {/* 全局错误提示 */}
      {state?.error && (
        <div className="rounded-button bg-danger-50 px-4 py-2 text-sm text-danger-600">
          {state.error}
        </div>
      )}

      {/* 邮箱 */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          用户名或邮箱
        </label>
        <input
          id="email"
          name="email"
          type="text"
          autoComplete="username"
          placeholder="用户名或邮箱"
          className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500"
        />
        {state?.fieldErrors?.email && (
          <p className="mt-1 text-sm text-danger-500">{state.fieldErrors.email}</p>
        )}
      </div>

      {/* 密码 */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          密码
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500"
        />
        {state?.fieldErrors?.password && (
          <p className="mt-1 text-sm text-danger-500">{state.fieldErrors.password}</p>
        )}
      </div>

      <SubmitButton />

      {/* 跳转注册 */}
      <p className="text-center text-sm text-gray-500">
        还没有账号？{" "}
        <Link href="/register" className="text-primary-600 hover:underline">
          立即注册
        </Link>
      </p>
    </form>
  );
}

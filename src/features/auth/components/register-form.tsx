// 注册表单 — 使用 useActionState 处理服务端校验
"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { registerUser, type AuthActionResult } from "../actions";
import Link from "next/link";

// 提交按钮
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-button bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
    >
      {pending ? "注册中..." : "注册"}
    </button>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [state, action] = useActionState<AuthActionResult | null, FormData>(
    registerUser,
    null
  );

  // 注册成功后跳转到登录页
  useEffect(() => {
    if (state?.success) {
      router.push("/login?registered=true");
    }
  }, [state?.success, router]);

  return (
    <form action={action} className="space-y-4">
      {/* 全局错误提示 */}
      {state?.error && (
        <div className="rounded-button bg-danger-50 px-4 py-2 text-sm text-danger-600">
          {state.error}
        </div>
      )}

      {/* 昵称 */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          昵称
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500"
        />
        {state?.fieldErrors?.name && (
          <p className="mt-1 text-sm text-danger-500">{state.fieldErrors.name}</p>
        )}
      </div>

      {/* 邮箱 */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          邮箱
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
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
          autoComplete="new-password"
          className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500"
        />
        {state?.fieldErrors?.password && (
          <p className="mt-1 text-sm text-danger-500">{state.fieldErrors.password}</p>
        )}
      </div>

      <SubmitButton />

      {/* 跳转登录 */}
      <p className="text-center text-sm text-gray-500">
        已有账号？{" "}
        <Link href="/login" className="text-primary-600 hover:underline">
          立即登录
        </Link>
      </p>
    </form>
  );
}

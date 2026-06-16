// 移动端导航菜单（客户端组件）
"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  } | null;
};

export function MobileMenu({ user }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* 汉堡按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className="rounded-button p-2 text-gray-600 hover:bg-gray-100"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* 下拉菜单 */}
      {open && (
        <div className="absolute left-0 right-0 top-full border-b bg-white shadow-lg">
          <nav className="flex flex-col px-4 py-3 space-y-2">
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              全部商品
            </Link>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              购物车
            </Link>
            {user ? (
              <>
                <Link
                  href="/orders"
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  我的订单
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  个人中心
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    后台管理
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-button bg-primary-600 px-3 py-1.5 text-center text-sm text-white"
                >
                  注册
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

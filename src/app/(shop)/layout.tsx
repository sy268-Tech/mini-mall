// 商城布局 — Header + 主体 + Footer
import Link from "next/link";
import { auth } from "@/lib/auth";
import { AuthNav } from "@/features/auth/components/auth-nav";
import { CartSidebar } from "@/features/cart/components/cart-sidebar";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary-600">
            Mini Mall
          </Link>

          {/* 导航 */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/products"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              全部商品
            </Link>
            <Link
              href="/cart"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              购物车
            </Link>
            {user && (
              <Link
                href="/orders"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                我的订单
              </Link>
            )}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-sm text-primary-600 hover:underline"
              >
                后台管理
              </Link>
            )}
          </nav>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-3">
            <CartSidebar />
            <AuthNav user={user ?? null} />
          </div>
        </div>
      </header>

      {/* 主体 */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-6 text-center text-sm text-gray-400">
        <p>Mini Mall 微型电商平台 — 仅供学习演示</p>
      </footer>
    </div>
  );
}

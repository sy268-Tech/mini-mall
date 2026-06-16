// 后台管理布局 — 侧边栏 + 主内容区
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// 侧边栏导航项
const navItems = [
  { href: "/admin", label: "仪表盘", icon: "📊" },
  { href: "/admin/products", label: "商品管理", icon: "📦" },
  { href: "/admin/orders", label: "订单管理", icon: "📋" },
  { href: "/admin/categories", label: "分类管理", icon: "🏷" },
  { href: "/admin/users", label: "用户管理", icon: "👤" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* 侧边栏 */}
      <aside className="w-56 shrink-0 border-r bg-gray-900 text-white">
        <div className="px-4 py-5">
          <Link href="/admin" className="text-lg font-bold">
            Mini Mall 后台
          </Link>
        </div>
        <nav className="px-2 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-300"
          >
            ← 返回商城
          </Link>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}

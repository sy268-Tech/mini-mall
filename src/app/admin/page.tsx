// 后台仪表盘 — 统计卡片 + 最近订单
import { getDashboardStats, getRecentOrders } from "@/services/orders";
import { formatPrice, formatDate } from "@/lib/formatters";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  PENDING: "待付款",
  PAID: "已付款",
  SHIPPED: "已发货",
  DELIVERED: "已签收",
  CANCELLED: "已取消",
};

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const recentOrders = await getRecentOrders(5);

  const statCards = [
    { label: "商品总数", value: stats.totalProducts, href: "/admin/products" },
    { label: "订单总数", value: stats.totalOrders, href: "/admin/orders" },
    { label: "用户总数", value: stats.totalUsers, href: "/admin/users" },
    {
      label: "总收入",
      value: formatPrice(stats.revenue),
      href: "/admin/orders",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">仪表盘</h1>

      {/* 统计卡片 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-card border bg-white p-5 hover:shadow-sm transition-shadow"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      {/* 最近订单 */}
      <div className="rounded-card border bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">最近订单</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-primary-600 hover:underline"
          >
            查看全部 →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 font-medium">订单号</th>
                <th className="pb-3 font-medium">用户</th>
                <th className="pb-3 font-medium">商品数</th>
                <th className="pb-3 font-medium">金额</th>
                <th className="pb-3 font-medium">状态</th>
                <th className="pb-3 font-medium">时间</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs">{order.orderNumber}</td>
                  <td className="py-2">{order.user.name ?? order.user.email}</td>
                  <td className="py-2">{order.items.length} 件</td>
                  <td className="py-2 font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-2">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="py-2 text-gray-400">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    暂无订单
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

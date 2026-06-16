// 订单列表页
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrdersByUser } from "@/services/orders";
import { formatPrice, formatDate } from "@/lib/formatters";
import Link from "next/link";

// 订单状态对应中文
const statusLabels: Record<string, string> = {
  PENDING: "待付款",
  PAID: "已付款",
  SHIPPED: "已发货",
  DELIVERED: "已签收",
  CANCELLED: "已取消",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const orders = await getOrdersByUser(session.user.id);

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">我的订单</h1>
        <p className="mt-4 text-gray-400">暂无订单</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-button bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
        >
          去逛逛
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">我的订单</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block rounded-card border bg-white p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                订单号：{order.orderNumber}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] ?? ""}`}
              >
                {statusLabels[order.status] ?? order.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* 商品缩略图预览 */}
                {order.items.slice(0, 3).map((item) => (
                  <img
                    key={item.id}
                    src={JSON.parse(item.product.images)[0] ?? "/placeholder.svg"}
                    alt={item.product.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ))}
                <span className="text-sm text-gray-500">
                  共 {order.items.length} 件
                </span>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(order.total)}</p>
                <p className="text-xs text-gray-400">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

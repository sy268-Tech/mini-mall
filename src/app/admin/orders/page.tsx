// 后台订单管理页 — 列表 + 状态更新
import { getAllOrders } from "@/services/orders";
import { formatPrice, formatDate } from "@/lib/formatters";
import { updateOrderStatus } from "@/features/admin/actions";

const statusLabels: Record<string, string> = {
  PENDING: "待付款",
  PAID: "已付款",
  SHIPPED: "已发货",
  DELIVERED: "已签收",
  CANCELLED: "已取消",
};

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-700 bg-yellow-100",
  PAID: "text-blue-700 bg-blue-100",
  SHIPPED: "text-purple-700 bg-purple-100",
  DELIVERED: "text-green-700 bg-green-100",
  CANCELLED: "text-gray-500 bg-gray-100",
};

// 当前状态下可切换的目标状态
const nextStatuses: Record<string, string[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">订单管理</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const available = nextStatuses[order.status] ?? [];
          return (
            <div
              key={order.id}
              className="rounded-card border bg-white p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gray-400">
                    {order.orderNumber}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] ?? ""}`}
                  >
                    {statusLabels[order.status] ?? order.status}
                  </span>
                  {order.tier && order.tier !== "NONE" && (
                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs text-primary-700">
                      {order.tier === "XINYUE_1"
                        ? "心悦1"
                        : order.tier === "XINYUE_2"
                          ? "心悦2"
                          : "心悦3"}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-400">
                  {formatDate(order.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span>{order.user.name ?? order.user.email}</span>
                  <span className="mx-2">·</span>
                  <span>{order.items.length} 件商品</span>
                  <span className="mx-2">·</span>
                  <span className="font-semibold">
                    {formatPrice(order.total)}
                  </span>
                  {order.discountAmount > 0 && (
                    <span className="ml-1 text-xs text-danger-500">
                      （已优惠 {formatPrice(order.discountAmount)}）
                    </span>
                  )}
                </div>

                {/* 状态切换按钮 */}
                {available.length > 0 && (
                  <div className="flex items-center gap-1">
                    {available.map((s) => (
                      <form key={s} action={updateOrderStatus}>
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="status" value={s} />
                        <button
                          type="submit"
                          className="rounded border px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
                        >
                          设为{statusLabels[s] ?? s}
                        </button>
                      </form>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="py-16 text-center text-gray-400">暂无订单</div>
        )}
      </div>
    </div>
  );
}

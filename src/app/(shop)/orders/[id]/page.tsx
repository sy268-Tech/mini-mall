// 订单详情页
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrderById } from "@/services/orders";
import { formatPrice, formatDate, parseJsonArray } from "@/lib/formatters";
import { MEMBERSHIP_TIERS } from "@/lib/constants";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  PENDING: "待付款",
  PAID: "已付款",
  SHIPPED: "已发货",
  DELIVERED: "已签收",
  CANCELLED: "已取消",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  // 权限校验 — 只能查看自己的订单
  if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/orders");
  }

  const shippingAddress = JSON.parse(order.shippingAddress) as Record<string, string>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/orders"
        className="text-sm text-primary-600 hover:underline mb-4 inline-block"
      >
        ← 返回订单列表
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">订单详情</h1>

      {/* 订单信息 */}
      <div className="rounded-card border bg-white p-6 mb-6">
        <div className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <span className="text-gray-400">订单号：</span>
            <span className="font-medium">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-gray-400">状态：</span>
            <span className="font-medium">
              {statusLabels[order.status] ?? order.status}
            </span>
          </div>
          <div>
            <span className="text-gray-400">下单时间：</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          {order.tier && (
            <div>
              <span className="text-gray-400">下单时等级：</span>
              <span>
                {MEMBERSHIP_TIERS[order.tier as keyof typeof MEMBERSHIP_TIERS]?.label ?? order.tier}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 商品列表 */}
      <div className="rounded-card border bg-white p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">商品明细</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <img
                src={parseJsonArray<string>(item.product.images)[0] ?? "/placeholder.svg"}
                alt={item.product.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.product.name}</p>
                <p className="text-sm text-gray-400">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 金额明细 */}
      <div className="rounded-card border bg-white p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">金额明细</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">商品小计</span>
            <span>{formatPrice(order.total - (order.discountAmount ?? 0))}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">会员折扣</span>
              <span className="text-danger-500">-{formatPrice(order.discountAmount)}</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between text-lg">
            <span className="font-semibold">实付金额</span>
            <span className="font-bold text-danger-500">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* 收货地址 */}
      <div className="rounded-card border bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-4">收货信息</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            {shippingAddress.name} · {shippingAddress.phone}
          </p>
          <p>
            {shippingAddress.state} {shippingAddress.city} {shippingAddress.street}
          </p>
          <p>邮编：{shippingAddress.zip}</p>
        </div>
      </div>
    </div>
  );
}

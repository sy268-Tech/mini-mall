// 个人中心页 — 会员等级、累计消费、升级进度
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MEMBERSHIP_TIERS, type MembershipTier } from "@/lib/constants";
import { getNextTier } from "@/lib/membership";
import { formatPrice } from "@/lib/formatters";
import { getOrdersByUser } from "@/services/orders";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = session.user;
  const tier = (user.tier ?? "NONE") as MembershipTier;
  const tierConfig = MEMBERSHIP_TIERS[tier] ?? MEMBERSHIP_TIERS.NONE;
  const totalSpent = user.totalSpent ?? 0;
  const nextTier = getNextTier(totalSpent);
  const orders = await getOrdersByUser(user.id!);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">个人中心</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 会员信息卡片 */}
        <div className="rounded-card border bg-white p-6">
          <h2 className="font-semibold text-gray-900 mb-4">会员信息</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">当前等级</span>
              <span className="font-medium text-primary-700">{tierConfig.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">累计消费</span>
              <span className="font-medium">{formatPrice(totalSpent)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">会员折扣</span>
              <span className="font-medium">
                {tierConfig.discount < 1
                  ? `${(tierConfig.discount * 10).toFixed(1)} 折`
                  : "无折扣"}
              </span>
            </div>
          </div>

          {/* 升级进度 */}
          {nextTier && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  距 {nextTier.label} 还需 {formatPrice(nextTier.remaining)}
                </span>
                <span className="text-gray-400">
                  {totalSpent > 0
                    ? Math.round((totalSpent / nextTier.threshold) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-primary-500 transition-all"
                  style={{
                    width: `${Math.min(
                      totalSpent > 0
                        ? (totalSpent / nextTier.threshold) * 100
                        : 0,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {!nextTier && (
            <p className="mt-6 text-sm text-accent-600">
              您已是最高等级会员！
            </p>
          )}
        </div>

        {/* 账号信息卡片 */}
        <div className="rounded-card border bg-white p-6">
          <h2 className="font-semibold text-gray-900 mb-4">账号信息</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">昵称</span>
              <span className="font-medium">{user.name ?? "未设置"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">邮箱</span>
              <span className="font-medium">{user.email ?? "未设置"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">角色</span>
              <span className="font-medium">
                {user.role === "ADMIN" ? "管理员" : "普通用户"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">订单数</span>
              <span className="font-medium">{orders.length} 笔</span>
            </div>
          </div>
        </div>
      </div>

      {/* 最近订单 */}
      {orders.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-gray-900 mb-4">最近订单</h2>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between rounded-card border bg-white p-4 hover:shadow-sm transition-shadow"
              >
                <div>
                  <span className="text-sm text-gray-400">
                    {order.orderNumber}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {order.items.length} 件
                  </span>
                </div>
                <span className="font-semibold">{formatPrice(order.total)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

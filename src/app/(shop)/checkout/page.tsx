// 结算页 — 收获地址表单 + 订单摘要（含会员折扣）
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/formatters";
import { getTierDiscount, calcDiscountedTotal } from "@/lib/membership";
import { MEMBERSHIP_TIERS, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/constants";
import { createOrder } from "@/features/orders/actions";
import { CheckoutForm } from "@/features/orders/components/checkout-form";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = session.user;
  const tier = user.tier ?? "NONE";
  const tierLabel = MEMBERSHIP_TIERS[tier as keyof typeof MEMBERSHIP_TIERS]?.label ?? "普通会员";
  const discount = getTierDiscount(tier);

  // 购物车数据来自客户端 Zustand store —— 这里用占位值
  // 实际由 CheckoutForm 客户端组件来处理 cart 数据

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">结算</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 左 — 收货地址 + 支付 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-card border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              收货信息
            </h2>
            <CheckoutForm />
          </div>
        </div>

        {/* 右 — 订单摘要 */}
        <div className="rounded-card border bg-white p-6 h-fit space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">订单摘要</h2>

          {/* 会员信息 */}
          <div className="rounded bg-primary-50 px-3 py-2 text-sm">
            <span className="text-primary-700">
              当前等级：{tierLabel}
              {discount < 1 && `（${(discount * 10).toFixed(1)}折）`}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">商品小计</span>
              <span id="checkout-subtotal" className="font-medium">--</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">会员折扣</span>
              <span id="checkout-discount" className="text-danger-500">--</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">运费</span>
              <span id="checkout-shipping" className="font-medium">--</span>
            </div>
          </div>

          <div className="border-t pt-3 flex justify-between text-lg">
            <span className="font-semibold">合计</span>
            <span id="checkout-total" className="font-bold text-danger-500">
              --
            </span>
          </div>

          <div className="text-xs text-gray-400">
            满 {formatPrice(FREE_SHIPPING_THRESHOLD)} 免运费
          </div>
        </div>
      </div>
    </div>
  );
}

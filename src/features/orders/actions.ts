// 下单 Server Action — 含会员折扣计算和等级升级
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/formatters";
import { getTierDiscount, getMemberTier, calcDiscountedTotal } from "@/lib/membership";
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 收货地址校验
const addressSchema = z.object({
  name: z.string().min(1, "请输入收货人姓名"),
  phone: z.string().min(1, "请输入手机号"),
  street: z.string().min(1, "请输入详细地址"),
  city: z.string().min(1, "请输入城市"),
  state: z.string().min(1, "请输入省份"),
  zip: z.string().min(1, "请输入邮编"),
});

export async function createOrder(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  // 1. 校验登录态
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "请先登录" };
  }

  const userId = session.user.id;

  // 2. 校验收货地址
  const address = addressSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    street: formData.get("street"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip: formData.get("zip"),
  });

  if (!address.success) {
    return { error: address.error.issues[0]?.message ?? "请填写完整的收货信息" };
  }

  // 3. 获取购物车商品（从数据库或从提交的购物车数据）
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return { error: "购物车为空" };
  }

  // 4. 校验库存
  for (const ci of cartItems) {
    if (ci.product.inventory < ci.quantity) {
      return {
        error: `"${ci.product.name}" 库存不足（仅剩 ${ci.product.inventory} 件）`,
      };
    }
  }

  // 5. 获取用户当前等级和折扣
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tier: true, totalSpent: true },
  });

  const tier = user?.tier ?? "NONE";
  const discount = getTierDiscount(tier);

  // 6. 计算金额
  const subtotal = cartItems.reduce(
    (sum, ci) => sum + ci.product.price * ci.quantity,
    0
  );
  const discountedTotal = calcDiscountedTotal(subtotal, tier);
  const discountAmount = subtotal - discountedTotal;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = discountedTotal + shipping;

  // 7. 事务：创建订单 + 减库存 + 清空购物车 + 更新用户消费
  const orderNumber = generateOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    // 减库存
    for (const ci of cartItems) {
      await tx.product.update({
        where: { id: ci.productId },
        data: { inventory: { decrement: ci.quantity } },
      });
    }

    // 创建订单
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        status: "PAID", // 模拟支付 — 直接标记已付款
        total,
        discountAmount,
        tier, // 快照：下单时的等级
        shippingAddress: JSON.stringify(address.data),
        items: {
          create: cartItems.map((ci) => ({
            productId: ci.productId,
            quantity: ci.quantity,
            price: ci.product.price, // 快照：下单时单价
          })),
        },
      },
    });

    // 清空购物车
    await tx.cartItem.deleteMany({ where: { userId } });

    // 更新累计消费 + 升级会员
    const newTotalSpent = (user?.totalSpent ?? 0) + total;
    const newTier = getMemberTier(newTotalSpent);

    await tx.user.update({
      where: { id: userId },
      data: { totalSpent: newTotalSpent, tier: newTier },
    });

    return newOrder;
  });

  revalidatePath("/orders");
  redirect(`/orders/${order.id}`);
}

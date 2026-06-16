// 订单数据访问层
import { prisma } from "@/lib/prisma";

// 获取用户所有订单
export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// 获取单个订单详情
export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      user: { select: { name: true, email: true } },
    },
  });
}

// 获取所有订单（管理员）
export async function getAllOrders() {
  return prisma.order.findMany({
    include: {
      items: { include: { product: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// 获取仪表盘统计数据（管理员）
export async function getDashboardStats() {
  const [totalProducts, totalOrders, totalUsers, revenueResult] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
  ]);

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    revenue: revenueResult._sum.total ?? 0,
  };
}

// 获取最近订单（管理员仪表盘）
export async function getRecentOrders(limit: number = 5) {
  return prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

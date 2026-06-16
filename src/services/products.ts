// 商品数据访问层
import { prisma } from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import type { Prisma } from "@prisma/client";

// 商品列表查询参数
export type ProductFilters = {
  categorySlug?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "name";
};

export async function getProducts(filters: ProductFilters = {}) {
  const { categorySlug, search, featured, page = 1, sort = "newest" } = filters;

  // 构建 where 条件
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (featured) {
    where.featured = true;
  }

  // 排序映射
  const orderByMap: Record<string, Prisma.ProductOrderByWithRelationInput> = {
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
    newest: { createdAt: "desc" },
    name: { name: "asc" },
  };
  const orderBy = orderByMap[sort] ?? orderByMap.newest;

  // 查询
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    pages: Math.ceil(total / ITEMS_PER_PAGE),
    page,
  };
}

// 根据 slug 获取单个商品
export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

// 获取精选商品（首页使用）
export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true, featured: true },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });
}

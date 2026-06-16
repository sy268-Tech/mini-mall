// 后台管理 Server Actions — 商品/订单/分类 CRUD
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ── 权限校验 ───────────────────────────────────────────

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }
  return session.user;
}

// ── 商品表单校验 ────────────────────────────────────────

const productSchema = z.object({
  name: z.string().min(1, "请输入商品名称"),
  slug: z.string().min(1, "请输入 URL 标识"),
  description: z.string().min(1, "请输入商品描述"),
  price: z.coerce.number().int().min(1, "价格需大于 0"),
  compareAtPrice: z.coerce.number().int().optional(),
  images: z.string().default("[]"),
  categoryId: z.string().min(1, "请选择分类"),
  inventory: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
  featured: z.coerce.boolean().default(false),
});

// ── 商品 CRUD ───────────────────────────────────────────

export async function createProduct(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  await requireAdmin();

  // 价格从用户输入的元转为分
  const raw = Object.fromEntries(formData.entries());
  const priceDollars = Number(raw.price) || 0;
  const compareAtDollars = Number(raw.compareAtPrice) || 0;

  const parsed = productSchema.safeParse({
    ...raw,
    price: Math.round(priceDollars * 100),
    compareAtPrice: compareAtDollars ? Math.round(compareAtDollars * 100) : undefined,
    isActive: raw.isActive === "on",
    featured: raw.featured === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "表单校验失败" };
  }

  await prisma.product.create({ data: parsed.data });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prevState: { error?: string } | null,
  formData: FormData
) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const priceDollars = Number(raw.price) || 0;
  const compareAtDollars = Number(raw.compareAtPrice) || 0;

  const parsed = productSchema.safeParse({
    ...raw,
    price: Math.round(priceDollars * 100),
    compareAtPrice: compareAtDollars ? Math.round(compareAtDollars * 100) : undefined,
    isActive: raw.isActive === "on",
    featured: raw.featured === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "表单校验失败" };
  }

  await prisma.product.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  "use server";
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

// ── 分类 CRUD ───────────────────────────────────────────

export async function createCategory(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!name || !slug) {
    return { error: "名称和标识不能为空" };
  }

  await prisma.category.create({ data: { name, slug } });
  revalidatePath("/admin/categories");
  return { error: undefined };
}

export async function deleteCategory(id: string) {
  "use server";
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

// ── 订单状态更新 ────────────────────────────────────────

export async function updateOrderStatus(formData: FormData) {
  "use server";
  await requireAdmin();

  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as string;
  if (!orderId || !status) return;

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  revalidatePath("/admin/orders");
}

// ── 用户管理 ────────────────────────────────────────────

export async function updateUserTier(formData: FormData) {
  "use server";
  await requireAdmin();

  const userId = formData.get("userId") as string;
  const tier = formData.get("tier") as string;
  if (!userId || !tier) return;

  await prisma.user.update({
    where: { id: userId },
    data: { tier },
  });
  revalidatePath("/admin/users");
}

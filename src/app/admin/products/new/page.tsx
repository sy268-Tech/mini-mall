// 新建商品页
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/features/admin/components/product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">新增商品</h1>
      <div className="max-w-2xl rounded-card border bg-white p-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}

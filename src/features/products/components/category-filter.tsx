// 分类筛选组件 — 从 URL 读取当前分类，高亮激活项
import Link from "next/link";
import { getCategories } from "@/services/categories";

type Props = {
  currentSlug?: string;
  search?: string;
};

export async function CategoryFilter({ currentSlug, search }: Props) {
  const categories = await getCategories();

  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-gray-700 mb-2">商品分类</h3>
      {/* 全部 */}
      <Link
        href={search ? `/products?search=${search}` : "/products"}
        className={`block rounded-button px-3 py-1.5 text-sm transition-colors ${
          !currentSlug
            ? "bg-primary-50 text-primary-700 font-medium"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        全部分类
      </Link>
      {/* 分类列表 */}
      {categories.map((c) => (
        <Link
          key={c.id}
          href={
            search
              ? `/products?category=${c.slug}&search=${search}`
              : `/products?category=${c.slug}`
          }
          className={`flex items-center justify-between rounded-button px-3 py-1.5 text-sm transition-colors ${
            currentSlug === c.slug
              ? "bg-primary-50 text-primary-700 font-medium"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>{c.name}</span>
          <span className="text-xs text-gray-400">({c._count.products})</span>
        </Link>
      ))}
    </div>
  );
}

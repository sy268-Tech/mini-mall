// 商品列表页 — 服务端渲染，读取 searchParams
import { Suspense } from "react";
import { getProducts } from "@/services/products";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductSearch } from "@/features/products/components/product-search";
import { CategoryFilter } from "@/features/products/components/category-filter";
import { Pagination } from "@/components/ui/pagination";
import { ITEMS_PER_PAGE } from "@/lib/constants";

type Props = {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const categorySlug = params.category;
  const search = params.search;
  const page = Number(params.page) || 1;
  const sort = (params.sort as "price_asc" | "price_desc" | "newest" | "name") ?? "newest";

  const { products, total, pages } = await getProducts({
    categorySlug,
    search,
    page,
    sort,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex gap-8">
        {/* 左侧边栏 — 搜索 + 分类筛选 */}
        <aside className="hidden w-56 shrink-0 lg:block space-y-6">
          <Suspense>
            <ProductSearch />
          </Suspense>
          <Suspense>
            <CategoryFilter currentSlug={categorySlug} search={search} />
          </Suspense>
        </aside>

        {/* 右侧主内容 */}
        <div className="flex-1 min-w-0">
          {/* 移动端搜索 */}
          <div className="mb-4 lg:hidden">
            <Suspense>
              <ProductSearch />
            </Suspense>
          </div>

          {/* 顶部栏 — 排序 + 结果数 */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              共 {total} 件商品
              {search && <span> — 搜索：&#34;{search}&#34;</span>}
            </p>
            <select
              defaultValue={sort}
              className="rounded-button border border-gray-300 px-3 py-1.5 text-sm focus:outline-hidden"
              onChange={(e) => {
                const url = new URL(window.location.href);
                url.searchParams.set("sort", e.target.value);
                window.location.href = url.toString();
              }}
            >
              <option value="newest">最新上架</option>
              <option value="price_asc">价格从低到高</option>
              <option value="price_desc">价格从高到低</option>
              <option value="name">按名称排序</option>
            </select>
          </div>

          {/* 商品网格 */}
          <ProductGrid products={products} />

          {/* 分页 */}
          <Pagination currentPage={page} totalPages={pages} />
        </div>
      </div>
    </div>
  );
}

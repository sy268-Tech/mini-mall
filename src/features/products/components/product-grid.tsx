// 商品网格 — 响应式 1/2/3/4 列布局
import { ProductCard } from "./product-card";

type Product = Parameters<typeof ProductCard>[0]["product"];

type Props = {
  products: Product[];
};

export function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-400">
        <p className="text-lg">暂无商品</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

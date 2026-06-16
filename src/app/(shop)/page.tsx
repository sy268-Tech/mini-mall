// 商城首页 — Hero 横幅 + 精选商品
import Link from "next/link";
import { getFeaturedProducts } from "@/services/products";
import { ProductCard } from "@/features/products/components/product-card";

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      {/* Hero 横幅 */}
      <section className="bg-linear-to-br from-primary-600 to-primary-800 py-16 text-center text-white">
        <h1 className="text-4xl font-bold">欢迎来到 Mini Mall</h1>
        <p className="mt-3 text-lg text-primary-100">
          精选好物，品质生活
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-button bg-white px-6 py-2.5 font-medium text-primary-700 hover:bg-primary-50 transition-colors"
        >
          立即选购
        </Link>
      </section>

      {/* 精选商品 */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">精选商品</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

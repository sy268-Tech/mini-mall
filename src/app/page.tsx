// 首页 — Hero 横幅 + 精选商品
import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/services/products";
import { ProductCard } from "@/features/products/components/product-card";

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold text-primary-600">
            Mini Mall
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              全部商品
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              登录
            </Link>
            <Link
              href="/register"
              className="rounded-button bg-primary-600 px-3 py-1.5 text-white hover:bg-primary-700"
            >
              注册
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-linear-to-br from-primary-600 to-primary-800 py-16 text-center text-white">
        <Image
          src="/next.svg"
          alt="Next.js"
          width={80}
          height={16}
          style={{ height: "auto" }}
          className="mx-auto mb-4 invert"
        />
        <h1 className="text-4xl font-bold">欢迎来到 Mini Mall</h1>
        <p className="mt-3 text-lg text-primary-100">
          基于 Next.js 16 + Prisma + Auth.js v5 构建
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

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-2">
          <span>Powered by</span>
          <Image src="/next.svg" alt="Next.js" width={60} height={12} style={{ height: "auto" }} className="dark:invert" />
        </div>
      </footer>
    </div>
  );
}

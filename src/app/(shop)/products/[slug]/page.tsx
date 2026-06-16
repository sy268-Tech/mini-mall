// 商品详情页
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/services/products";
import { parseJsonArray, formatPrice } from "@/lib/formatters";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const images = parseJsonArray<string>(product.images);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const savings = hasDiscount ? product.compareAtPrice! - product.price : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* 左侧 — 图片 */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-card bg-gray-100">
            <Image
              src={images[0] ?? "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          {/* 缩略图 */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.slice(1).map((img, i) => (
                <div
                  key={i}
                  className="relative h-20 w-20 overflow-hidden rounded-lg bg-gray-100"
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 右侧 — 商品信息 */}
        <div className="space-y-4">
          {/* 分类 */}
          <span className="text-sm text-gray-400">
            {product.category.name}
          </span>

          {/* 名称 */}
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

          {/* 价格 */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-danger-500">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
                <span className="rounded-full bg-danger-50 px-2 py-0.5 text-sm text-danger-600">
                  省 {formatPrice(savings)}
                </span>
              </>
            )}
          </div>

          {/* 库存状态 */}
          <p className="text-sm">
            {product.inventory > 0 ? (
              <span className="text-accent-600">
                有货（剩余 {product.inventory} 件）
              </span>
            ) : (
              <span className="text-danger-500">暂时缺货</span>
            )}
          </p>

          {/* 描述 */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-2">商品描述</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* 加入购物车 */}
          <AddToCartButton
            productId={product.id}
            name={product.name}
            price={product.price}
            image={images[0] ?? "/placeholder.svg"}
            disabled={product.inventory <= 0}
          />
        </div>
      </div>
    </div>
  );
}

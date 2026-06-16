// 商品卡片组件
import Image from "next/image";
import Link from "next/link";
import { parseJsonArray, formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    images: string;
    category: { name: string; slug: string };
  };
  className?: string;
};

export function ProductCard({ product, className }: Props) {
  const images = parseJsonArray<string>(product.images);
  const firstImage = images[0] ?? "/placeholder.svg";
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group block rounded-card border border-gray-200 bg-white transition-shadow hover:shadow-md",
        className
      )}
    >
      {/* 商品图片 */}
      <div className="relative aspect-square overflow-hidden rounded-t-card bg-gray-100">
        <Image
          src={firstImage}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-danger-500 px-2 py-0.5 text-xs text-white">
            特价
          </span>
        )}
      </div>

      {/* 商品信息 */}
      <div className="p-3 space-y-1">
        {/* 分类标签 */}
        <span className="text-xs text-gray-400">{product.category.name}</span>

        {/* 名称 */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          {product.name}
        </h3>

        {/* 价格 */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-danger-500">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

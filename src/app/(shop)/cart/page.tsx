// 购物车页面 — 完整视图
"use client";

import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/formatters";
import Link from "next/link";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">购物车</h1>
        <p className="mt-4 text-gray-400">购物车是空的</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-button bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
        >
          去逛逛
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          购物车 ({items.length})
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-gray-400 hover:text-danger-500"
        >
          清空购物车
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 商品列表 */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 rounded-card border bg-white p-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-danger-500">
                  {formatPrice(item.price)}
                </p>
                {/* 数量控制 */}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="rounded border px-2.5 py-1 text-sm hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="rounded border px-2.5 py-1 text-sm hover:bg-gray-100"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="ml-4 text-sm text-gray-400 hover:text-danger-500"
                  >
                    删除
                  </button>
                </div>
              </div>
              {/* 小计 */}
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 订单摘要 */}
        <div className="rounded-card border bg-white p-6 h-fit space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">订单摘要</h2>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">小计</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="border-t pt-4">
            <Link
              href="/checkout"
              className="block w-full rounded-button bg-primary-600 px-6 py-3 text-center font-medium text-white hover:bg-primary-700"
            >
              去结算
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

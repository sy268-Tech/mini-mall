// 购物车侧边栏 — 滑入式面板
"use client";

import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect } from "react";

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, getSubtotal, getTotalItems } =
    useCartStore();
  const total = getTotalItems();
  const subtotal = getSubtotal();

  // 锁定 body 滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* 购物车图标按钮 */}
      <button
        onClick={() => useCartStore.setState({ isOpen: true })}
        className="relative rounded-button p-2 text-gray-600 hover:bg-gray-100"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
          />
        </svg>
        {total > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-danger-500 text-xs text-white">
            {total > 99 ? "99+" : total}
          </span>
        )}
      </button>

      {/* 遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30"
          onClick={closeCart}
        />
      )}

      {/* 侧边栏 */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-96 max-w-[100vw] bg-white shadow-lg transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">
            购物车 ({total})
          </h2>
          <button
            onClick={closeCart}
            className="rounded-button p-1 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 商品列表 */}
        {items.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-gray-400">
            购物车是空的
          </div>
        ) : (
          <div className="flex h-[calc(100%-180px)] flex-col overflow-y-auto p-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-3 border-b py-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-sm text-danger-500">{formatPrice(item.price)}</p>
                  {/* 数量控制 */}
                  <div className="mt-1 flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="rounded border px-2 py-0.5 text-xs hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="min-w-[1.5rem] text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="rounded border px-2 py-0.5 text-xs hover:bg-gray-100"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="ml-auto text-xs text-gray-400 hover:text-danger-500"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 底部结算栏 */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">小计</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full rounded-button bg-primary-600 px-4 py-2 text-center text-white hover:bg-primary-700"
            >
              查看购物车
            </Link>
            <button
              onClick={clearCart}
              className="block w-full text-center text-sm text-gray-400 hover:text-danger-500"
            >
              清空购物车
            </button>
          </div>
        )}
      </div>
    </>
  );
}

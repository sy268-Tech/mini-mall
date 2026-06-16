// 加入购物车按钮（客户端组件）
"use client";

import { useCartStore } from "@/store/cart-store";

type Props = {
  productId: string;
  name: string;
  price: number;
  image: string;
  disabled?: boolean;
};

export function AddToCartButton({ productId, name, price, image, disabled }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button
      onClick={() => addItem({ id: productId, productId, name, price, image })}
      disabled={disabled}
      className="w-full rounded-button bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
    >
      {disabled ? "暂时缺货" : "加入购物车"}
    </button>
  );
}

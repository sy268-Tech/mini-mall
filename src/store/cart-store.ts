// 购物车状态管理 — Zustand + localStorage 持久化
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 购物车商品
export type CartItem = {
  id: string;
  name: string;
  price: number; // 分
  image: string;
  quantity: number;
  productId: string;
};

// Store 状态和方法
type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // 添加商品 — 已存在则加数量
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
              isOpen: true, // 自动打开侧边栏
            };
          }
          return {
            items: [...state.items, { ...item, quantity: 1 }],
            isOpen: true,
          };
        });
      },

      // 移除商品
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      // 更新数量 — 数量 <= 0 则自动移除
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },

      // 清空购物车
      clearCart: () => set({ items: [] }),

      // 侧边栏开关
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // 计算小计（分）
      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      // 计算总数
      getTotalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "mini-mall-cart",
      // 仅持久化 items，不持久化 isOpen
      partialize: (state) => ({ items: state.items }),
    }
  )
);

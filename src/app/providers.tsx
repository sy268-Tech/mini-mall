// 客户端 Provider 包裹器 — SessionProvider + Zustand CartHydration
"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cart-store";

// 购物车水合组件 — 延迟 rehydrate 避免 SSR 水合不一致
function CartHydration({ children }: { children: React.ReactNode }) {
  const rehydrated = useRef(false);

  useEffect(() => {
    if (!rehydrated.current) {
      useCartStore.persist.rehydrate();
      rehydrated.current = true;
    }
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartHydration>{children}</CartHydration>
    </SessionProvider>
  );
}

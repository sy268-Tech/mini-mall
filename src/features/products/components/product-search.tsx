// 商品搜索组件（客户端） — 防抖搜索，更新 URL 参数
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect, useCallback } from "react";

export function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  // 防抖更新 URL
  const debouncedSearch = useCallback(
    (() => {
      let timer: NodeJS.Timeout;
      return (term: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const params = new URLSearchParams(searchParams.toString());
          if (term) {
            params.set("search", term);
          } else {
            params.delete("search");
          }
          params.delete("page"); // 搜索时重置分页
          startTransition(() => {
            router.push(`/products?${params.toString()}`);
          });
        }, 400);
      };
    })(),
    [searchParams, router]
  );

  useEffect(() => {
    debouncedSearch(value);
  }, [value, debouncedSearch]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="搜索商品..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-button border border-gray-300 px-3 py-2 pl-9 text-sm focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500"
      />
      <svg
        className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {isPending && (
        <div className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      )}
    </div>
  );
}

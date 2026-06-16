// 分页组件（客户端） — 保留现有 URL 参数
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
};

export function Pagination({ currentPage, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const searchParams = useSearchParams();

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `/products?${params.toString()}`;
  }

  // 计算显示的页码
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="rounded-button border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
        >
          上一页
        </Link>
      )}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildUrl(p)}
            className={`rounded-button px-3 py-1.5 text-sm ${
              p === currentPage
                ? "bg-primary-600 text-white"
                : "text-gray-600 hover:bg-gray-100 border"
            }`}
          >
            {p}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="rounded-button border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
        >
          下一页
        </Link>
      )}
    </div>
  );
}

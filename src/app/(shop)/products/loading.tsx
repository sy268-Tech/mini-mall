// 商品列表加载骨架屏
export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex gap-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="h-10 animate-pulse rounded bg-gray-200" />
          <div className="mt-6 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
        </aside>
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-square animate-pulse rounded-card bg-gray-200" />
                <div className="h-4 animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

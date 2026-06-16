// 后台分类管理页 — 创建 + 列表 + 删除
import { prisma } from "@/lib/prisma";
import { deleteCategory } from "@/features/admin/actions";
import { CreateCategoryForm } from "@/features/admin/components/create-category-form";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">分类管理</h1>

      {/* 新建分类（客户端表单） */}
      <div className="rounded-card border bg-white p-4 mb-6">
        <CreateCategoryForm />
      </div>

      {/* 分类列表 */}
      <div className="rounded-card border bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-gray-500">
              <th className="px-4 py-3 font-medium">名称</th>
              <th className="px-4 py-3 font-medium">标识</th>
              <th className="px-4 py-3 font-medium">商品数</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">
                  {c.slug}
                </td>
                <td className="px-4 py-3">{c._count.products}</td>
                <td className="px-4 py-3">
                  <form
                    action={deleteCategory.bind(null, c.id)}
                    onSubmit={(e) => {
                      if (!confirm(`确定删除分类"${c.name}"？下有 ${c._count.products} 个商品。`)) e.preventDefault();
                    }}
                  >
                    <button
                      type="submit"
                      className="text-danger-500 hover:underline text-sm"
                    >
                      删除
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  暂无分类
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

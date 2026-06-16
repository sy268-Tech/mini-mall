// 后台用户管理页 — 查看等级、手动调整
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/formatters";
import { MEMBERSHIP_TIERS } from "@/lib/constants";
import { updateUserTier } from "@/features/admin/actions";

const tierLabels: Record<string, string> = {
  NONE: "普通会员",
  XINYUE_1: "心悦1",
  XINYUE_2: "心悦2",
  XINYUE_3: "心悦3",
};

const roleLabels: Record<string, string> = {
  CUSTOMER: "普通用户",
  ADMIN: "管理员",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">用户管理</h1>

      <div className="rounded-card border bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-gray-500">
              <th className="px-4 py-3 font-medium">用户</th>
              <th className="px-4 py-3 font-medium">角色</th>
              <th className="px-4 py-3 font-medium">会员等级</th>
              <th className="px-4 py-3 font-medium">累计消费</th>
              <th className="px-4 py-3 font-medium">调整等级</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium">{user.name ?? "未设置"}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {roleLabels[user.role] ?? user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700">
                    {tierLabels[user.tier] ?? user.tier}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono">
                  {formatPrice(user.totalSpent)}
                </td>
                <td className="px-4 py-3">
                  <form
                    action={updateUserTier}
                    className="flex items-center gap-1"
                  >
                    <input type="hidden" name="userId" value={user.id} />
                    <select
                      name="tier"
                      defaultValue={user.tier}
                      className="rounded border border-gray-300 px-2 py-1 text-xs focus:outline-hidden"
                    >
                      {Object.entries(MEMBERSHIP_TIERS).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200"
                    >
                      更新
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  暂无用户
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

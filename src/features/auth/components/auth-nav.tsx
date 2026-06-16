// 认证导航 — 根据登录状态显示 登录/注册/个人中心/登出
import Link from "next/link";
import { logoutUser } from "../actions";

type Props = {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
    tier?: string;
  } | null;
};

export function AuthNav({ user }: Props) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          登录
        </Link>
        <Link
          href="/register"
          className="rounded-button bg-primary-600 px-3 py-1.5 text-sm text-white hover:bg-primary-700"
        >
          注册
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        {user.name ?? user.email ?? "个人中心"}
      </Link>
      <form action={logoutUser}>
        <button
          type="submit"
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          退出
        </button>
      </form>
    </div>
  );
}

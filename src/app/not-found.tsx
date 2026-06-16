// 404 页面
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="mt-4 text-lg text-gray-500">页面不存在</p>
      <Link
        href="/"
        className="mt-6 rounded-button bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
      >
        返回首页
      </Link>
    </div>
  );
}

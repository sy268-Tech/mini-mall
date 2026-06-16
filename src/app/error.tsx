// 全局错误边界
"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h2 className="text-xl font-semibold text-gray-900">出错了</h2>
      <p className="mt-2 text-gray-500">{error.message ?? "未知错误"}</p>
      <button
        onClick={reset}
        className="mt-4 rounded-button bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
      >
        重试
      </button>
    </div>
  );
}

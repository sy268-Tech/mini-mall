// 创建分类表单（客户端组件）
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createCategory } from "../actions";

// 提交按钮
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-button bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700 disabled:opacity-50"
    >
      {pending ? "创建中..." : "新增分类"}
    </button>
  );
}

export function CreateCategoryForm() {
  const [state, action] = useActionState(createCategory, null);

  return (
    <form action={action} className="flex items-end gap-3">
      <input
        name="name"
        placeholder="分类名称"
        required
        className="rounded-button border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-hidden"
      />
      <input
        name="slug"
        placeholder="URL 标识"
        required
        className="rounded-button border border-gray-300 px-3 py-2 text-sm font-mono focus:border-primary-500 focus:outline-hidden"
      />
      <SubmitButton />
      {state?.error && (
        <span className="text-sm text-danger-500">{state.error}</span>
      )}
    </form>
  );
}

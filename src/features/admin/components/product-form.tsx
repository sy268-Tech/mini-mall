// 商品表单 — 创建/编辑共用，价格元→分自动转换
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createProduct, updateProduct } from "../actions";

type Category = { id: string; name: string };

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  images: string;
  categoryId: string;
  inventory: number;
  isActive: boolean;
  featured: boolean;
};

type Props = {
  categories: Category[];
  product?: Product; // 编辑时传入，创建时为 undefined
};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-button bg-primary-600 px-6 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
    >
      {pending ? "提交中..." : isEdit ? "更新商品" : "创建商品"}
    </button>
  );
}

export function ProductForm({ categories, product }: Props) {
  const isEdit = !!product;
  const action = isEdit
    ? updateProduct.bind(null, product.id)
    : createProduct;

  const [state, formAction] = useActionState<{ error?: string } | null, FormData>(
    action,
    null
  );

  // 分→元 显示
  const defaultPrice = product ? (product.price / 100).toFixed(2) : "";
  const defaultCompare = product?.compareAtPrice
    ? (product.compareAtPrice / 100).toFixed(2)
    : "";

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-button bg-danger-50 px-4 py-2 text-sm text-danger-600">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* 名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            商品名称 *
          </label>
          <input
            name="name"
            defaultValue={product?.name}
            required
            className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden"
          />
        </div>

        {/* URL 标识 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            URL 标识 *
          </label>
          <input
            name="slug"
            defaultValue={product?.slug}
            required
            className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* 分类 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            分类 *
          </label>
          <select
            name="categoryId"
            defaultValue={product?.categoryId}
            required
            className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden"
          >
            <option value="">请选择分类</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* 图片 URL（JSON 数组） */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            图片（JSON 数组）
          </label>
          <input
            name="images"
            defaultValue={product?.images ?? '[""]'}
            className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 font-mono text-sm focus:border-primary-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* 价格（元） */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            价格（元）*
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={defaultPrice}
            required
            className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden"
          />
        </div>

        {/* 原价（元） */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            原价（元）
          </label>
          <input
            name="compareAtPrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultCompare}
            className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden"
          />
        </div>

        {/* 库存 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">库存</label>
          <input
            name="inventory"
            type="number"
            min="0"
            defaultValue={product?.inventory ?? 0}
            className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* 描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          商品描述 *
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description}
          required
          className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden"
        />
      </div>

      {/* 开关 */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={product?.isActive ?? true}
          />
          上架
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured ?? false}
          />
          精选商品
        </label>
      </div>

      <SubmitButton isEdit={isEdit} />
    </form>
  );
}

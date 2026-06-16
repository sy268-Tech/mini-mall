// 结算表单 — 客户端组件，提交到 createOrder Server Action
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createOrder } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-button bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700 disabled:opacity-50"
    >
      {pending ? "提交中..." : "确认下单（模拟支付）"}
    </button>
  );
}

export function CheckoutForm() {
  const [state, action] = useActionState<{ error?: string } | null, FormData>(
    createOrder,
    null
  );

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="rounded-button bg-danger-50 px-4 py-2 text-sm text-danger-600">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            收货人 *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            手机号 *
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            required
            className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700">
          详细地址 *
        </label>
        <input
          id="street"
          name="street"
          type="text"
          required
          className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            省份 *
          </label>
          <input
            id="state"
            name="state"
            type="text"
            required
            className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            城市 *
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
            邮编 *
          </label>
          <input
            id="zip"
            name="zip"
            type="text"
            required
            className="mt-1 block w-full rounded-button border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}

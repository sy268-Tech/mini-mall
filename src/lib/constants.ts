// 全局常量定义
// 分页
export const ITEMS_PER_PAGE = 9;

// 运费（分）
export const FREE_SHIPPING_THRESHOLD = 5000_00; // ¥5,000 免运费
export const SHIPPING_COST = 4_99; // ¥4.99

// 订单状态
export const ORDER_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

// 用户角色
export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
} as const;

// 会员等级定义与折扣映射
export const MEMBERSHIP_TIERS = {
  NONE: { label: "普通会员", discount: 1.0, threshold: 0 },
  XINYUE_1: { label: "心悦1", discount: 0.98, threshold: 8000_00 },
  XINYUE_2: { label: "心悦2", discount: 0.95, threshold: 80000_00 },
  XINYUE_3: { label: "心悦3", discount: 0.90, threshold: 800000_00 },
} as const;

export type MembershipTier = keyof typeof MEMBERSHIP_TIERS;

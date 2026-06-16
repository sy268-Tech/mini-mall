// 心悦会员工具函数 — 纯函数，无副作用
import { MEMBERSHIP_TIERS, type MembershipTier } from "./constants";

// 根据累计消费判定会员等级
export function getMemberTier(totalSpent: number): MembershipTier {
  // 从高到低检查阈值
  if (totalSpent >= MEMBERSHIP_TIERS.XINYUE_3.threshold) return "XINYUE_3";
  if (totalSpent >= MEMBERSHIP_TIERS.XINYUE_2.threshold) return "XINYUE_2";
  if (totalSpent >= MEMBERSHIP_TIERS.XINYUE_1.threshold) return "XINYUE_1";
  return "NONE";
}

// 获取等级的折扣率
export function getTierDiscount(tier: string): number {
  return (MEMBERSHIP_TIERS[tier as MembershipTier] ?? MEMBERSHIP_TIERS.NONE).discount;
}

// 计算折后价（分），四舍五入
export function calcDiscountedTotal(subtotal: number, tier: string): number {
  const discount = getTierDiscount(tier);
  return Math.round(subtotal * discount);
}

// 计算折扣金额
export function calcDiscountAmount(subtotal: number, tier: string): number {
  return subtotal - calcDiscountedTotal(subtotal, tier);
}

// 获取下一等级信息（用于升级进度展示）
export function getNextTier(totalSpent: number): {
  tier: MembershipTier | null;
  label: string;
  remaining: number;
  threshold: number;
} | null {
  const tiers: MembershipTier[] = ["XINYUE_1", "XINYUE_2", "XINYUE_3"];
  for (const t of tiers) {
    if (totalSpent < MEMBERSHIP_TIERS[t].threshold) {
      const config = MEMBERSHIP_TIERS[t];
      return {
        tier: t,
        label: config.label,
        remaining: config.threshold - totalSpent,
        threshold: config.threshold,
      };
    }
  }
  // 已达最高等级
  return null;
}

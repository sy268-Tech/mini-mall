# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 运行命令

```bash
# 开发
npm run dev                  # Next.js dev (Turbopack), http://localhost:3000
npm run build                # 生产构建
npm start                    # 启动生产构建

# 数据库
npx prisma studio            # 数据库可视化管理
npx prisma migrate dev       # 创建并应用迁移
npx prisma db push           # 快速同步 schema (不生成迁移文件)
npx prisma db seed           # 填充种子数据
npx prisma validate          # 校验 schema

# 类型检查
npx tsc --noEmit
```

## 技术栈

Next.js 16 (App Router) + TypeScript strict + Prisma 5 + SQLite + TailwindCSS v4 + Auth.js v5 (Credentials JWT) + Zustand + Zod

## 目录架构

```
src/
├── app/                     # 路由层 — 仅页面和布局，不含业务逻辑
│   ├── (auth)/              # 登录/注册
│   ├── (shop)/              # 商城 (首页/商品/购物车/结算/订单/个人中心)
│   └── admin/               # 后台管理 (需 ADMIN 角色)
├── components/ui/           # 通用 UI 组件
├── features/{domain}/       # 功能模块 — components + actions
├── services/                # 数据访问层 — 封装所有 Prisma 查询
├── store/                   # Zustand stores
├── lib/                     # 纯工具函数
└── types/                   # TypeScript 类型增强
```

## 核心约定

### 价格
- 数据库存储为 **Int（分）**，避免 SQLite 浮点精度问题
- `src/lib/formatters.ts` 的 `formatPrice(cents)` 统一转为 ¥X.XX 显示
- 折扣计算：`Math.round(subtotal * discount)` 四舍五入到分

### 心悦会员
- 等级：NONE → XINYUE_1 (累计¥8k, 9.8折) → XINYUE_2 (累计¥80k, 9.5折) → XINYUE_3 (累计¥800k, 9折)
- `src/lib/membership.ts` 提供：`getMemberTier()`, `getTierDiscount()`, `calcDiscountedTotal()`
- User 模型：`tier` + `totalSpent:Int`，Order 模型：`total` + `discountAmount` + `tier`(快照)
- 升级逻辑：下单时累加 totalSpent → 调用 getMemberTier() → 只升不降

### 认证
- Auth.js v5, Credentials provider (email+password, bcryptjs)
- JWT session 携带 `id, role, tier, totalSpent`
- `proxy.ts` 页面级保护，Server Component/Server Action 内二次校验

### 数据层
- `src/lib/prisma.ts` 导出 Prisma 单例
- 所有数据库操作放在 `src/services/`
- Server Action 调用 service，不直接调 prisma
- Zustand + localStorage persist 管理购物车状态

## 种子数据

| 账号 | 密码 | 角色 | 会员等级 |
|------|------|------|----------|
| admin@minimall.com | admin123 | ADMIN | NONE |
| customer@minimall.com | customer123 | CUSTOMER | NONE |
| vip@minimall.com | vip123 | CUSTOMER | XINYUE_3 |

## 关键文件

- `prisma/schema.prisma` — 数据模型
- `src/lib/auth.ts` — Auth.js v5 配置
- `src/lib/membership.ts` — 会员等级/折扣计算
- `src/store/cart-store.ts` — 购物车状态
- `src/features/admin/actions.ts` — 后台 Server Actions
- `src/features/orders/actions.ts` — 下单核心逻辑
- `proxy.ts` — 路由保护
- `docs/plans/ARCHITECTURE.md` — 完整架构设计文档

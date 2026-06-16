# Mini Mall 架构设计与实现计划

## Context

在空白目录 `F:\AICoding\mini-mall` 从零搭建一个全栈微型电商应用。项目是绿色地带（zero existing code），父仓库 `F:\AICoding\` 下有不相关的 finance_cli 和 HelloWorld 项目。

**目标：** 实现商品浏览（列表/详情/搜索/分类）、用户注册登录、购物车、下单（模拟支付）、心悦会员等级体系、后台管理（商品CRUD/订单管理/分类管理/会员管理）。

### 心悦会员等级体系

| 等级 | 累计消费门槛 | 折扣 | 说明 |
|------|-------------|------|------|
| 普通会员 | 默认 | 无折扣 | 新注册用户 |
| 心悦1 | ¥8,000 (80万分) | 9.8折 | 2% off |
| 心悦2 | ¥80,000 (800万分) | 9.5折 | 5% off |
| 心悦3 | ¥800,000 (8000万分) | 9折 | 10% off |

**升级逻辑：** 每次下单支付完成后，累加 `totalSpent`，根据阈值自动升级到对应等级。等级只升不降。
**折扣应用：** 下单时根据用户当前等级计算折扣后金额。

---

## 技术栈 & 关键决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 框架 | Next.js 16.2 (App Router, TypeScript strict, Turbopack) | 全栈能力，Server Components + Actions |
| 数据库 | Prisma 5 + SQLite | 零配置开发，Prisma 抽象后续可切换到 PostgreSQL |
| 样式 | TailwindCSS v4 (CSS-first @theme) | 无 tailwind.config.js，@import "tailwindcss" 入口 |
| 认证 | Auth.js v5 (Credentials, JWT) | 邮件+密码登录，JWT 无状态，proxy.ts 保护路由 |
| 价格存储 | Int (分) | 避免 SQLite Float 精度问题，折扣计算精确到分 |
| 会员折扣 | `Int * discount` 后 `Math.round()` | 避免浮点误差，折扣四舍五入到分 |
| 数组字段 | JSON String | SQLite 无原生数组，service 层 parse |
| ID 策略 | cuid() | URL安全、可排序、比 UUID 更快的索引 |
| 状态管理 | Zustand + persist | 购物车客户端状态 + localStorage 持久化 |
| 验证 | Zod | 服务端 Action 和表单验证 |
| 目录结构 | Feature Module | 每个功能域独立组件/hooks/actions，app/ 只做路由 |

---

## 实现阶段

### Phase 1: 项目脚手架

**命令：**
```bash
cd F:/AICoding/mini-mall
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*" --no-git --yes
```

**安装依赖：**
```bash
npm install prisma @prisma/client next-auth@beta @auth/prisma-adapter zustand bcryptjs zod clsx tailwind-merge
npm install -D @types/bcryptjs tsx
```

**关键文件：**
- `tsconfig.json` → 确认 `strict: true`，加 `noUncheckedIndexedAccess: true`
- `src/app/globals.css` → 替换为 TailwindCSS v4 `@import "tailwindcss"` + `@theme {}` 块
- `src/lib/utils.ts` → `cn()` 函数 (clsx + tailwind-merge)
- `src/app/layout.tsx` → Inter 字体，基础 HTML 结构
- `prisma/schema.prisma` → `npx prisma init --datasource-provider sqlite`

**验证：** `npm run dev` 启动成功，样式加载正常

---

### Phase 2: 数据库

**Prisma Schema 核心模型：**

```
User (id, name, email, password?, role, tier, totalSpent:Int, createdAt, updatedAt)
  role → CUSTOMER | ADMIN
  tier → NONE | XINYUE_1 | XINYUE_2 | XINYUE_3
  totalSpent → 累计消费金额（分），用于会员升级判定

Account (Auth.js 标准字段)
Session (Auth.js 标准字段)
VerificationToken (Auth.js 标准字段)

Category (id, name, slug, parentId?, products[])
Product (id, name, slug, description, price:Int, compareAtPrice:Int?, images:String{JSON}, categoryId, inventory:Int, isActive, createdAt)
CartItem (id, quantity, userId, productId, @@unique([userId, productId]))
Order (id, orderNumber, userId, status, total:Int, discountAmount:Int, tier:String?, shippingAddress:String{JSON}, createdAt)
  total → 折扣后实付金额（分）
  discountAmount → 折扣减免金额（分）
  tier → 下单时的会员等级快照
OrderItem (id, quantity, price:Int, productId, orderId)
```

**关键文件：**
- `prisma/schema.prisma` → 完整 schema
- `src/lib/prisma.ts` → Prisma Client 单例
- `prisma/seed.ts` → 种子数据：
  - 1 管理员 admin@minimall.com / admin123
  - 1 普通用户 customer@minimall.com / customer123（tier=NONE, totalSpent=0）
  - 1 心悦3 会员 vip@minimall.com / vip123（tier=XINYUE_3, totalSpent=800000_00，用于测试折扣）
  - 4 分类 + 8 商品

**验证：** `npx prisma migrate dev --name init` 成功，`npx prisma db seed` 填充数据

---

### Phase 3: 认证

**Auth.js v5 配置：**

```
src/lib/auth.config.ts   → 基础配置 (JWT, pages, callbacks:
  jwt callback → 持久化 id, role, tier, totalSpent 到 token
  session callback → 暴露 id, role, tier, totalSpent 到 session.user)
src/lib/auth.ts           → 完整 Auth.js 实例 (Credentials provider + bcryptjs)
src/app/api/auth/[...nextauth]/route.ts → 路由处理器
src/types/next-auth.d.ts  → TypeScript 类型增强 (role, id, tier, totalSpent)
```

**认证 UI：**
- `src/features/auth/actions.ts` → `registerUser()`, `loginUser()`, `logoutUser()` Server Actions
- `src/features/auth/components/login-form.tsx` → 登录表单 (useActionState)
- `src/features/auth/components/register-form.tsx` → 注册表单 (useActionState)
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`

**路由保护：**
- `proxy.ts` (项目根) → 三层保护：
  - `/admin/*` → 需 ADMIN 角色
  - `/cart`, `/checkout`, `/orders` → 需登录
  - `/login`, `/register` → 已登录用户重定向
- `src/app/providers.tsx` → SessionProvider + CartHydration

**验证：** 注册→登录→登出流完整，受保护路由正确重定向

---

### Phase 4: 核心功能

#### 4.1 服务层与会员工具
- `src/lib/constants.ts` → 分页常量、订单状态枚举、用户角色枚举、**会员等级定义与折扣映射**
  ```ts
  export const MEMBERSHIP_TIERS = {
    NONE: { label: "普通会员", discount: 1.0, threshold: 0 },
    XINYUE_1: { label: "心悦1", discount: 0.98, threshold: 8000_00 },
    XINYUE_2: { label: "心悦2", discount: 0.95, threshold: 80000_00 },
    XINYUE_3: { label: "心悦3", discount: 0.90, threshold: 800000_00 },
  } as const;
  ```
- `src/lib/formatters.ts` → `formatPrice(cents)`, `parseJsonArray<T>(json)`, `truncate()`, `formatDate()`
- `src/lib/membership.ts` → `getMemberTier(totalSpent)`, `getTierDiscount(tier)`, `calcDiscountedTotal(subtotal, tier)` 纯函数
- `src/services/products.ts` → `getProducts(filters)`, `getProductBySlug(slug)`, `getFeaturedProducts()`
- `src/services/categories.ts` → `getCategories()`, `getCategoryBySlug(slug)`
- `src/services/cart.ts` → `getCartItems(userId)`, `getCartTotal()`, `getCartCount()`
- `src/services/orders.ts` → `getOrdersByUser(userId)`, `getOrderById(id)`, `getAllOrders()`

#### 4.2 商品浏览
- `src/features/products/components/product-card.tsx` → 商品卡片
- `src/features/products/components/product-grid.tsx` → 响应式网格
- `src/features/products/components/product-search.tsx` → 防抖搜索 (Client Component)
- `src/features/products/components/category-filter.tsx` → 分类筛选
- `src/components/ui/pagination.tsx` → 分页组件
- `src/app/(shop)/layout.tsx` → 商城布局 (Header + Footer)
- `src/app/(shop)/page.tsx` → 首页 (Hero + 精选商品)
- `src/app/(shop)/products/page.tsx` → 商品列表页 (Server Component, searchParams)
- `src/app/(shop)/products/loading.tsx` → 骨架屏
- `src/app/(shop)/products/[slug]/page.tsx` → 商品详情页

#### 4.3 购物车
- `src/store/cart-store.ts` → Zustand store with persist
  - State: items[], isOpen
  - Actions: addItem, removeItem, updateQuantity, clearCart, toggleCart
  - Computed: getSubtotal(), getTotalItems()
- `src/features/cart/components/add-to-cart-button.tsx` → 加入购物车按钮
- `src/features/cart/components/cart-sidebar.tsx` → 侧边栏购物车 (slide-in panel)
- `src/app/(shop)/cart/page.tsx` → 购物车页面 (完整视图)

#### 4.4 结算和订单（含会员折扣）
- `src/features/orders/actions.ts` → `createOrder(input)` Server Action:
  1. 校验登录态
  2. 获取用户当前 `tier`，计算折扣率
  3. 事务中：减库存 + 创建 Order（记录 `total` 折扣后实付、`discountAmount` 折扣额、`tier` 快照）+ 创建 OrderItems
  4. 累加用户 `totalSpent`，调用 `getMemberTier()` 判定新等级，如有升级则更新 `tier`
  5. `revalidatePath` + `redirect`
- `src/app/(shop)/checkout/page.tsx` → 结算页:
  - 显示原价、会员等级、折扣金额、折后价
  - 未登录用户折扣区显示"登录后享受会员折扣"
- `src/app/(shop)/orders/page.tsx` → 订单列表
- `src/app/(shop)/orders/[id]/page.tsx` → 订单详情（显示折扣信息 + 下单时等级快照）
- `src/app/(shop)/profile/page.tsx` → 用户中心：显示当前等级、累计消费、距下一等级还差多少、消费进度条
- `src/features/auth/actions.ts` → 注册成功后 `tier` 默认 `NONE`, `totalSpent` 默认 0

**验证：** 下单时正确应用折扣，累计消费达标后自动升级，订单详情记录等级快照

---

### Phase 5: 后台管理

#### 5.1 管理布局
- `src/app/admin/layout.tsx` → 侧边栏导航 (Dashboard/Products/Orders/Categories/Users)
- `src/app/admin/page.tsx` → 仪表盘 (统计卡片 + 最近订单表)

#### 5.2 商品管理
- `src/features/admin/actions.ts` → `requireAdmin()`, `createProduct()`, `updateProduct()`, `deleteProduct()`, `createCategory()`, `deleteCategory()`, `updateOrderStatus()`
- `src/features/admin/components/product-form.tsx` → 商品表单 (创建/编辑共用，价格美元↔分转换)
- `src/app/admin/products/page.tsx` → 商品列表 + 删除
- `src/app/admin/products/new/page.tsx` → 新建商品
- `src/app/admin/products/[id]/edit/page.tsx` → 编辑商品

#### 5.3 订单、分类和会员管理
- `src/app/admin/orders/page.tsx` → 订单列表 + 状态更新
- `src/app/admin/categories/page.tsx` → 分类列表 + 新建/删除
- `src/app/admin/users/page.tsx` → 用户列表（显示等级、累计消费、角色），管理员可手动调整用户等级

**验证：** 管理员可以完整 CRUD 商品、修改订单状态、管理分类、查看用户等级。普通用户无法访问 /admin。

---

### Phase 6: 打磨

#### 6.1 加载和错误处理
- `src/app/(shop)/loading.tsx` → 全局加载动画
- `src/app/error.tsx` → 全局错误边界 (Client Component, reset 按钮)
- `src/app/not-found.tsx` → 404 页面
- `src/components/ui/loading-spinner.tsx` → 可复用加载指示器
- `src/app/(shop)/products/loading.tsx` → 已有 (Phase 4)

#### 6.2 响应式
- `src/components/ui/mobile-menu.tsx` → 移动端菜单
- 更新 `src/app/(shop)/layout.tsx` → 响应式 Header

#### 6.3 最终验证
- `npm run build` → 生产构建成功无错误
- `npx tsc --noEmit` → 无 TypeScript 错误
- `npx prisma validate` → Schema 验证通过
- 全功能测试矩阵：
  - 浏览、搜索、筛选、分页
  - 注册、登录、登出
  - 购物车增删改、持久化
  - 结算时显示会员折扣，下单后确认折扣金额正确
  - 查看订单、订单详情（含折扣信息 + 等级快照）
  - 个人中心显示会员等级、累计消费、升级进度条
  - 累计消费达标后自动升级（下单后等级自动变更）
  - 管理后台 CRUD、状态更新、用户管理
  - 路由保护 (未登录/非管理员)
  - 404/错误页面

---

## 文件清单 (~50 个文件)

### 核心基础设施
- `package.json`, `tsconfig.json`, `next.config.ts` (脚手架生成 + 修改)
- `.env.local` (AUTH_SECRET)
- `proxy.ts` (路由保护)
- `src/app/layout.tsx`, `src/app/globals.css` (根布局，Tailwind v4)
- `src/app/providers.tsx` (SessionProvider + CartHydration)

### Lib & Types
- `src/lib/utils.ts` (cn helper)
- `src/lib/prisma.ts` (Prisma 单例)
- `src/lib/constants.ts` (分页/角色/状态常量 + 会员等级定义)
- `src/lib/formatters.ts` (价格/日期/JSON 格式化)
- `src/lib/membership.ts` (等级判定/折扣计算纯函数)
- `src/types/next-auth.d.ts` (Auth.js 类型增强: id, role, tier, totalSpent)

### 数据库
- `prisma/schema.prisma`
- `prisma/seed.ts`

### 认证 (5 文件)
- `src/lib/auth.config.ts`, `src/lib/auth.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/features/auth/actions.ts`
- `src/features/auth/components/login-form.tsx`, `register-form.tsx`
- `src/app/(auth)/layout.tsx`, `login/page.tsx`, `register/page.tsx`

### 服务层 (5 文件)
- `src/services/products.ts`, `categories.ts`, `cart.ts`, `orders.ts`

### 商品浏览 (6 文件)
- `src/features/products/components/product-card.tsx`, `product-grid.tsx`, `product-search.tsx`, `category-filter.tsx`
- `src/components/ui/pagination.tsx`
- `src/app/(shop)/layout.tsx`, `page.tsx`
- `src/app/(shop)/products/page.tsx`, `loading.tsx`, `[slug]/page.tsx`

### 购物车 (4 文件)
- `src/store/cart-store.ts`
- `src/features/cart/components/add-to-cart-button.tsx`, `cart-sidebar.tsx`
- `src/app/(shop)/cart/page.tsx`

### 结算和订单 (5 文件)
- `src/features/orders/actions.ts`
- `src/app/(shop)/checkout/page.tsx`, `orders/page.tsx`, `orders/[id]/page.tsx`
- `src/app/(shop)/profile/page.tsx` (会员中心：等级、累计消费、进度条)

### 后台管理 (10 文件)
- `src/app/admin/layout.tsx`, `page.tsx`
- `src/features/admin/actions.ts`, `components/product-form.tsx`
- `src/app/admin/products/page.tsx`, `new/page.tsx`, `[id]/edit/page.tsx`
- `src/app/admin/orders/page.tsx`, `categories/page.tsx`, `users/page.tsx`

### 打磨 (5 文件)
- `src/app/(shop)/loading.tsx`, `error.tsx`, `not-found.tsx`
- `src/components/ui/loading-spinner.tsx`, `mobile-menu.tsx`

---

## 实施策略

按 Phase 1→6 顺序执行，每阶段完成后 commit。推荐使用 `subagent-driven-development` skill 逐任务执行，每个任务完成后 review。

**最关键的 4 个文件（贯穿全项目）：**
1. `prisma/schema.prisma` — 所有 feature 依赖的数据模型 (含会员字段)
2. `src/lib/auth.ts` — 认证配置，所有受保护路由的入口 (JWT 携带会员信息)
3. `src/lib/membership.ts` — 会员等级判定与折扣计算，结算核心逻辑
4. `src/store/cart-store.ts` — 购物车状态，客户端购物流程核心

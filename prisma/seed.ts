import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("admin123", 10);
  const hashedPassword2 = await bcrypt.hash("customer123", 10);
  const hashedPassword3 = await bcrypt.hash("vip123", 10);

  // ── Users ────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      name: "管理员",
      email: "admin@minimall.com",
      password: hashedPassword,
      role: "ADMIN",
      tier: "NONE",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "测试用户",
      email: "customer@minimall.com",
      password: hashedPassword2,
      role: "CUSTOMER",
      tier: "NONE",
      totalSpent: 0,
    },
  });

  const vip = await prisma.user.create({
    data: {
      name: "心悦会员",
      email: "vip@minimall.com",
      password: hashedPassword3,
      role: "CUSTOMER",
      tier: "XINYUE_3",
      totalSpent: 800000_00,
    },
  });

  console.log("Created users: admin, customer, vip");

  // ── Categories ───────────────────────────────────────
  const electronics = await prisma.category.create({
    data: { name: "电子产品", slug: "electronics" },
  });
  const clothing = await prisma.category.create({
    data: { name: "服装", slug: "clothing" },
  });
  const home = await prisma.category.create({
    data: { name: "家居生活", slug: "home-garden" },
  });
  const books = await prisma.category.create({
    data: { name: "图书", slug: "books" },
  });

  console.log("Created 4 categories");

  // ── Products ─────────────────────────────────────────
  const products = [
    {
      name: "机械键盘 K8 Pro",
      slug: "mechanical-keyboard-k8-pro",
      description:
        "75% 配列热插拔机械键盘，Gasket 结构，RGB 背光，三模连接（蓝牙/2.4G/有线）。兼容 Windows 和 macOS。",
      price: 399_00,
      compareAtPrice: 499_00,
      images: JSON.stringify([
        "https://picsum.photos/seed/keyboard1/600/600",
        "https://picsum.photos/seed/keyboard2/600/600",
      ]),
      categoryId: electronics.id,
      inventory: 150,
      featured: true,
    },
    {
      name: "无线降噪耳机 Pro",
      slug: "wireless-anc-earbuds-pro",
      description:
        "主动降噪深度达 48dB，Hi-Res 认证音质，续航 40 小时，IPX5 防水，支持无线充电。",
      price: 899_00,
      compareAtPrice: 1299_00,
      images: JSON.stringify([
        "https://picsum.photos/seed/earbuds1/600/600",
        "https://picsum.photos/seed/earbuds2/600/600",
      ]),
      categoryId: electronics.id,
      inventory: 80,
      featured: true,
    },
    {
      name: "轻薄羽绒服 男士冬季",
      slug: "ultralight-down-jacket-men",
      description:
        "90% 白鹅绒填充，防风防泼水面料，可收纳设计，适合城市通勤与户外旅行。",
      price: 699_00,
      compareAtPrice: 999_00,
      images: JSON.stringify([
        "https://picsum.photos/seed/jacket1/600/600",
        "https://picsum.photos/seed/jacket2/600/600",
      ]),
      categoryId: clothing.id,
      inventory: 200,
      featured: false,
    },
    {
      name: "纯棉圆领卫衣",
      slug: "cotton-crewneck-sweatshirt",
      description: "400g 重磅纯棉毛圈面料，宽松版型，不易变形不起球，多色可选。",
      price: 199_00,
      compareAtPrice: null,
      images: JSON.stringify([
        "https://picsum.photos/seed/sweatshirt1/600/600",
      ]),
      categoryId: clothing.id,
      inventory: 500,
      featured: true,
    },
    {
      name: "智能保温杯 500ml",
      slug: "smart-thermos-500ml",
      description:
        "316 不锈钢内胆，12 小时保温，LED 温度显示，触摸屏显，食品级密封圈。",
      price: 159_00,
      compareAtPrice: 199_00,
      images: JSON.stringify([
        "https://picsum.photos/seed/thermos1/600/600",
        "https://picsum.photos/seed/thermos2/600/600",
      ]),
      categoryId: home.id,
      inventory: 300,
      featured: false,
    },
    {
      name: "北欧风格台灯",
      slug: "nordic-style-desk-lamp",
      description:
        "三档色温，无极调光，可折叠设计，USB 充电，适合办公和床头阅读。",
      price: 129_00,
      compareAtPrice: null,
      images: JSON.stringify([
        "https://picsum.photos/seed/lamp1/600/600",
      ]),
      categoryId: home.id,
      inventory: 120,
      featured: false,
    },
    {
      name: "深入理解计算机系统 (原书第3版)",
      slug: "csapp-3rd-edition",
      description:
        "计算机科学经典教材，覆盖计算机系统核心概念，从程序员视角深入理解硬件与软件交互。",
      price: 139_00,
      compareAtPrice: 179_00,
      images: JSON.stringify([
        "https://picsum.photos/seed/csapp1/600/600",
      ]),
      categoryId: books.id,
      inventory: 60,
      featured: true,
    },
    {
      name: "TypeScript 编程实战",
      slug: "typescript-in-practice",
      description:
        "从入门到进阶的 TypeScript 实战指南，涵盖类型系统、泛型、装饰器、声明文件等核心专题。",
      price: 89_00,
      compareAtPrice: null,
      images: JSON.stringify([
        "https://picsum.photos/seed/tsbook1/600/600",
      ]),
      categoryId: books.id,
      inventory: 200,
      featured: false,
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log(`Created ${products.length} products`);
  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

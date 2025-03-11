# ColorfulCard

一个基于Next.js开发的现代电子贺卡和产品展示平台。

## 项目概述

ColorfulCard是一个专注于数字贺卡和定制产品的在线平台，让用户可以浏览、询价和购买创意数字内容。

## 技术栈

- **前端**：Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **后端**：Next.js API Routes, Prisma ORM
- **数据库**：可配置（默认SQLite用于开发）
- **认证**：NextAuth.js

## 功能特点

- 响应式设计，适配各种设备
- 产品分类与搜索
- 用户认证系统
- 产品详情展示
- 在线询价系统
- 管理员面板
  - 产品管理
  - 分类管理
  - 用户管理
  - 询价处理
  - 数据统计

## 快速开始

### 环境要求

- Node.js 18.17.0 或更高版本
- npm 或 yarn 或 pnpm

### 安装与运行

1. 克隆仓库
```bash
git clone https://github.com/Twritetime/colorfulcard.git
cd colorfulcard
```

2. 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 配置环境变量
复制`.env.example`文件为`.env`并更新必要的配置。

4. 初始化数据库
```bash
npx prisma migrate dev
```

5. 运行开发服务器
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

6. 在浏览器中访问 [http://localhost:3000](http://localhost:3000)

## 部署

项目可以部署在Vercel、Netlify或其他支持Next.js的平台上。

## 许可

[MIT](LICENSE)

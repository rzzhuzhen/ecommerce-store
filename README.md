# 🛒 电商商城

[![React](https://img.shields.io/badge/React-18.0-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-green?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-blue?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare_Pages-部署-orange?logo=cloudflare-pages&logoColor=white)](https://pages.cloudflare.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

基于 **React** + **Supabase** 构建的现代化电商应用，提供完整的购物功能、用户认证和后台管理。

## 🚀 在线演示

**电商商城**: https://ecommerce-b8m.pages.dev

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                      Cloudflare Pages                    │
│                    (静态资源托管 + CDN)                    │
├─────────────────────────────────────────────────────────┤
│                      React 前端                          │
│              @supabase/ssr 客户端直连数据库               │
├─────────────────────────────────────────────────────────┤
│                      Supabase                             │
│      PostgreSQL  │  Auth  │  Storage  │  RLS           │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ 技术栈

### 前端
- **React 18** - UI 框架
- **React Router v6** - 路由管理
- **Tailwind CSS** - 样式框架
- **@supabase/ssr** - Supabase 客户端（SSR 支持）
- **Context API** - 状态管理
- **lucide-react** - 图标库

### 后端即服务（Baas）
- **Supabase** - 后端即服务平台
  - PostgreSQL 数据库
  - 用户认证（邮箱/密码）
  - 文件存储（产品图片）
  - Row Level Security (RLS) 数据安全策略

### 部署
- **Cloudflare Pages** - 前端托管
- **GitHub Actions** - CI/CD 自动化部署

## ✨ 主要功能

### 顾客功能
- 🛍️ **商品浏览** - 分类、搜索、筛选
- ❤️ **收藏夹** - 收藏商品
- 🛒 **购物车** - 添加/移除/更新数量
- 💳 **结账流程** - 创建订单
- 📦 **订单历史** - 查看历史订单
- 🔐 **用户认证** - 注册、登录、邮箱验证

### 管理后台
- 📊 **数据面板** - 统计概览
- 📦 **商品管理** - 创建、编辑、删除商品
- 🖼️ **图片上传** - 上传商品图片到 Supabase Storage

### 技术特性
- **邮箱验证** - 注册时发送验证邮件
- **RLS 安全策略** - 行级安全，数据隔离
- **实时响应** - 购物车/收藏夹状态同步
- **移动端适配** - 响应式设计

## 📁 项目结构

```
E-commerce-Store/
├── frontend/                    # React 前端应用
│   ├── src/
│   │   ├── api/
│   │   │   └── supabase.js     # Supabase 服务层
│   │   ├── components/        # 通用组件
│   │   ├── context/           # Context（Auth、Cart、Toast）
│   │   ├── pages/              # 页面组件
│   │   └── utils/
│   │       └── supabase.js     # Supabase 客户端创建
│   └── public/
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # 数据库架构
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署配置
└── README.md
```

## 📊 数据库架构

| 表名 | 说明 |
|------|------|
| `profiles` | 用户信息（角色：customer/admin） |
| `products` | 商品信息 |
| `orders` | 订单主表 |
| `order_items` | 订单商品明细 |
| `cart_items` | 购物车商品 |
| `favorites` | 收藏商品 |

**存储桶**: `product-images` - 存储商品图片

## 🚀 快速开始

### 前置要求
- Node.js 22+
- Supabase 账户
- Cloudflare 账户

### 环境变量

创建 `frontend/.env.local`:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 本地开发

```bash
cd frontend
npm install
npm start
```

访问 http://localhost:3000

### 部署

推送代码到 `main` 分支，GitHub Actions 自动部署到 Cloudflare Pages。

需要配置的 GitHub Secrets:
- `CLOUDFLARE_API_TOKEN` - Cloudflare API 令牌
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare 账户 ID
- `REACT_APP_SUPABASE_URL` - Supabase 项目 URL
- `REACT_APP_SUPABASE_ANON_KEY` - Supabase 匿名密钥

## 🔐 安全策略

| 安全层 | 实现 |
|--------|------|
| **认证** | Supabase Auth（邮箱/密码） |
| **授权** | RLS（行级安全策略） |
| **数据隔离** | 用户只能访问自己的数据 |
| **API 安全** | RLS 策略在数据库层生效 |

## ⚠️ 架构限制与规划

### 当前架构

前端通过 `@supabase/ssr` 直连 Supabase，依赖 RLS 实现数据安全。

**适合场景**：个人项目、Demo、原型

**不适用场景**：涉及真实交易、支付的企业级应用

### 已识别的限制

| 问题 | 影响 | 严重程度 |
|------|------|---------|
| 无后端 API 层 | 业务逻辑暴露在前端，可被绕过 | 高 |
| 数据验证不完整 | 恶意用户可构造任意请求 | 高 |
| 无单元测试 | 无法保证代码质量 | 中 |

### 规划改进

**阶段一：添加 Edge Functions API 层**（推荐）
- 将关键业务逻辑迁移到 Supabase Edge Functions
- 示例：`create-order`（订单创建含库存验证）、`process-payment`
- 前端通过 Edge Functions 间接访问数据库

**阶段二：数据验证增强**
- 添加 TypeScript 类型定义
- 在 Edge Functions 中添加请求验证

**阶段三：测试覆盖**
- 添加 Vitest 单元测试
- 添加 Playwright 集成测试

### Edge Functions 架构预览

```
┌─────────────────────────────────────────────────────────┐
│                   Supabase Edge Functions                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │create-order │  │process-pay   │  │admin-product│    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
├─────────────────────────────────────────────────────────┤
│                 Supabase PostgreSQL + RLS               │
└─────────────────────────────────────────────────────────┘
```

详细设计待实现后更新。

## 📝 主要页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 精选商品、分类导航 |
| 商品列表 | `/products` | 商品搜索、筛选 |
| 商品详情 | `/products/:id` | 商品详情、加入购物车 |
| 购物车 | `/cart` | 购物车管理 |
| 结账 | `/checkout` | 订单确认 |
| 我的订单 | `/orders` | 订单历史 |
| 收藏夹 | `/favorites` | 收藏商品 |
| 登录 | `/login` | 用户登录 |
| 注册 | `/signup` | 用户注册 |
| 管理后台 | `/admin` | 商品管理 |

## 🧪 测试账号

注册后在 Supabase Dashboard 将用户角色改为 `admin`，即可访问管理后台。

## 🙏 致谢

- [Supabase](https://supabase.com/) - 开源 Firebase 替代品
- [React](https://reactjs.org/) - UI 框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Cloudflare Pages](https://pages.cloudflare.com/) - 静态托管
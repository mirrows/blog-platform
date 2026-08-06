# 🌐 个人博客平台

一个基于 **Vue 3 + Nuxt 3 + Koa2 + MySQL** 的现代化个人博客系统。

## ✨ 功能特性

### 📝 内容管理
- Markdown 文章发布与管理（md-editor-v3）
- 文章分类与标签
- 文章全文搜索
- RSS 订阅

### 💬 互动功能
- 游客评论（记录 IP 位置）
- 评论审核管理
- 文章点赞/收藏（登录用户）

### 🎨 用户体验
- 杂志风格 UI 设计
- 响应式布局（移动端/平板/桌面）
- 暗黑模式切换
- 多语言支持（中/英文）
- 社交分享（卡片形式）

### 📊 数据分析
- 实时在线人数
- 月访问总量统计
- 文章阅读量统计

### 🔧 后台管理
- 仪表盘概览
- 文章/分类/标签管理
- 评论审核
- 用户管理
- 文件管理（按时间分组，10G 限制）

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| **前端框架** | Vue 3 + Nuxt 3 (SSG) |
| **构建工具** | Vite |
| **UI 组件库** | Element Plus |
| **CSS 预处理器** | Sass/SCSS |
| **Markdown 编辑器** | md-editor-v3 |
| **状态管理** | Pinia |
| **后端框架** | Node.js + Koa2 |
| **数据库** | MySQL 8 |
| **ORM** | Sequelize |
| **鉴权** | JWT |
| **API 风格** | RESTful |
| **部署** | Docker + 自建服务器 |
| **CI/CD** | GitHub Actions |

## 📁 项目结构

```
blog-platform/
├── docs/                   # 产品文档
│   ├── PRD.md              # 产品需求文档
│   ├── CHANGELOG.md        # 变更日志
│   └── architecture.md     # 架构设计文档
├── ai/                     # AI 辅助开发规范
│   ├── rules/              # 编码规则
│   │   ├── frontend-rules.md
│   │   ├── backend-rules.md
│   │   └── common-rules.md
│   └── skills/             # 技术栈说明
│       ├── frontend-skills.md
│       └── backend-skills.md
├── client/                 # 前端项目 (Nuxt 3)
├── server/                 # 后端项目 (Koa)
├── docker-compose.yml      # Docker 编排
├── .github/workflows/      # CI/CD 配置
└── README.md
```

## 🚀 快速开始

### 前置要求
- Node.js 22.12+ (推荐 22.x LTS)
- MySQL 8.0+
- npm 或 yarn

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd blog-platform
```

### 2. 数据库准备

确保 MySQL 服务已启动，并创建数据库：

```bash
# 方式1：使用初始化脚本（推荐）
cd server
node scripts/init-db.js

# 方式2：手动执行 SQL
mysql -u root -p < server/init-db.sql
```

### 3. 配置后端

```bash
# 进入后端目录
cd server

# 安装依赖
npm install

# 配置环境变量
# 编辑 .env 文件，修改数据库连接信息和管理员账号密码
# 如果使用默认配置，无需修改

# 启动开发服务器
npm run dev
```

后端服务将运行在 `http://localhost:3001`

### 4. 配置前端

```bash
# 进入前端目录（新终端）
cd client

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务将运行在 `http://localhost:3000`

### 5. 访问应用

- 前端首页：http://localhost:3000
- 后端 API：http://localhost:3001/api
- 默认管理员账号：`admin` / `admin123`（可在 `.env` 中修改）

### 6. Docker 部署（可选）

```bash
# 在项目根目录执行
docker-compose up -d

docker tag docker.m.daocloud.io/library/node:20-alpine node:20-alpine
docker tag docker.m.daocloud.io/library/mysql:8.0 mysql:8.0
docker tag docker.m.daocloud.io/library/nginx:alpine nginx:alpine
```

## 📝 首次使用指南

### 1. 登录后台
- 访问 http://localhost:8076/login（Docker 部署）或 http://localhost:3000/login（本地开发）
- 使用默认管理员账号登录：`admin` / `admin123`

### 2. 创建第一篇文章
- 登录后进入后台（点击右上角用户名 → 后台管理）
- 点击"文章管理" → "新建文章"
- 填写标题、内容，选择分类和标签
- 点击"发布"

### 3. 配置说明（重要）

**修改管理员密码**：
1. 编辑 `server/.env` 文件
2. 修改 `ADMIN_PASSWORD` 的值
3. 重启后端服务

**注意**：如果数据库中已存在该管理员账号，修改 `.env` 不会生效，需要直接修改数据库或删除账号后重启。

## 🔧 环境变量配置

### 后端环境变量 (server/.env)

```env
# ============================================
# 数据库配置
# ============================================
DB_HOST=localhost              # 数据库主机
DB_PORT=3306                   # 数据库端口
DB_NAME=blog                   # 数据库名称
DB_USER=root                   # 数据库用户名
DB_PASS=root123                # 数据库密码

# ============================================
# JWT 配置
# ============================================
JWT_SECRET=your-development-jwt-secret-key-change-in-production  # JWT 密钥（生产环境必须修改）

# ============================================
# 域名配置（预留）
# ============================================
FRONTEND_DOMAIN=http://localhost:3000   # 前端域名
BACKEND_DOMAIN=http://localhost:3001    # 后端域名

# ============================================
# 服务配置
# ============================================
PORT=3001                      # 后端服务端口

# ============================================
# 默认管理员账号配置
# ============================================
ADMIN_USERNAME=admin           # 管理员用户名
ADMIN_EMAIL=admin@example.com  # 管理员邮箱
ADMIN_PASSWORD=admin123        # 管理员密码（首次启动时生效）
```

**说明**：
- 如果数据库中已存在 `ADMIN_USERNAME` 对应的用户，则跳过创建
- 如果不存在，则使用配置的账号密码创建管理员账号
- 密码会自动进行 bcrypt 加密后存储

### 前端环境变量 (client/.env)

```env
API_BASE_URL=http://localhost:3001/api  # 后端 API 地址
```

## 🔧 常见问题

### Q1: 数据库连接失败
**A**: 检查以下几点：
1. MySQL 服务是否已启动
2. `server/.env` 中的数据库配置是否正确
3. 数据库 `blog` 是否已创建

### Q2: 端口被占用
**A**: 修改 `server/.env` 中的 `PORT` 值，或停止占用端口的进程

### Q3: 前端页面报错 `Failed to resolve component: el-form`
**A**: 这是 Element Plus 组件未注册的问题，请确保：
1. 已执行 `npm install` 安装所有依赖
2. 前端依赖版本：Element Plus 2.7.0 + Nuxt 3.12.0
3. 清除缓存后重启：`rm -rf .nuxt && npm run dev`

### Q4: 如何升级管理员权限
**A**: 直接修改数据库：
```sql
UPDATE users SET role = 'admin' WHERE username = 'your-username';
```

## 📚 更多文档

- [产品需求文档](docs/PRD.md)
- [架构设计文档](docs/architecture.md)
- [变更日志](docs/CHANGELOG.md)

## 📄 许可证

本项目仅供个人学习和使用。

---

> 💡 **提示**：本项目当前版本为单管理员博客系统，仅管理员可以发布和管理文章。

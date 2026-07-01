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
- Node.js 18+
- MySQL 8.0+
- Docker (可选)

### 1. 后端启动

```bash
# 进入后端目录
cd server

# 安装依赖
npm install

# 配置环境变量（复制并修改）
cp .env.example .env

# 启动开发服务器
npm run dev
```

### 2. 前端启动

```bash
# 进入前端目录
cd client

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 3. Docker 部署

```bash
# 在项目根目录执行
docker-compose up -d
```

## 🔧 环境变量

### 后端 (.env)
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=blog
DB_USER=root
DB_PASS=your-password
JWT_SECRET=your-secure-jwt-secret-key
FRONTEND_DOMAIN=https://your-domain.com
BACKEND_DOMAIN=https://api.your-domain.com
```

### 前端 (.env)
```env
API_BASE_URL=http://localhost:3000/api
```

## 📄 许可证

本项目仅供个人学习和使用。

---

> 更多详情请参阅 [产品需求文档](docs/PRD.md) 和 [架构设计文档](docs/architecture.md)
# 架构设计文档

> 版本：v1.0
> 最后更新：2026-07-01

---

## 1. 系统架构总览

### 1.1 架构模式
采用 **前后端分离** 架构，前端通过 RESTful API 与后端通信。

```
┌─────────────────────────────────────────────────────────────┐
│                       浏览器 (Client)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Nuxt 3 (SSG + SPA Hybrid)               │  │
│  │  Vue 3 + Element Plus + Pinia + md-editor-v3         │  │
│  └──────────────────────┬────────────────────────────────┘  │
│                         │ RESTful API (JSON)                │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                Nginx (反向代理/静态资源)                     │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│          ┌──────────────┴──────────────┐                   │
│          │        Koa2 后端服务         │                   │
│          │  Koa Router / Middleware     │                   │
│          │  JWT Auth / Rate Limiter     │                   │
│          └──────────────┬──────────────┘                   │
│                         │                                   │
│          ┌──────────────┴──────────────┐                   │
│          │       Sequelize ORM         │                   │
│          └──────────────┬──────────────┘                   │
│                         │                                   │
│          ┌──────────────┴──────────────┐                   │
│          │         MySQL 8             │                   │
│          └─────────────────────────────┘                   │
│                                                             │
│          ┌─────────────────────────────┐                   │
│          │    本地文件存储 (uploads/)    │                   │
│          │    koa-static 静态服务       │                   │
│          └─────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 核心架构决策

| 决策项 | 选择 | 理由 |
|--------|------|------|
| 前端框架 | Nuxt 3 | 支持 SSG/SSR，SEO友好，基于Vite |
| UI渲染 | SSG（静态生成） | 博客内容以读为主，SSG性能最优 |
| 后端框架 | Koa2 | 轻量灵活，中间件机制优雅 |
| 数据库 | MySQL 8 | 成熟稳定，关系型数据适合博客场景 |
| ORM | Sequelize | Koa生态最成熟的ORM，文档丰富 |
| 鉴权 | JWT | 无状态，适合前后端分离 |
| API风格 | RESTful | 简单直观，易于理解和使用 |
| 部署方式 | Docker | 环境一致，易于迁移和扩展 |

---

## 2. 前端架构

### 2.1 技术栈

| 技术 | 版本 | 用途 |
|------|:----:|------|
| Nuxt 3 | 3.x | 前端框架（SSG模式） |
| Vue 3 | 3.x | UI框架（Composition API） |
| Vite | 5.x | 构建工具 |
| Element Plus | 2.x | UI组件库 |
| Sass/SCSS | - | CSS预处理器 |
| md-editor-v3 | 4.x | Markdown编辑器 |
| Pinia | 2.x | 状态管理 |
| Vue Router | 4.x | 路由管理 |
| vue-i18n | 9.x | 国际化（后续启用） |

### 2.2 前端目录结构

```
client/
├── app.vue                          # 根组件
├── nuxt.config.ts                   # Nuxt 配置
├── package.json
├── pages/                           # 页面（自动路由）
│   ├── index.vue                    # 首页
│   ├── post/[id].vue                # 文章详情
│   ├── category/[slug].vue          # 分类页
│   ├── tag/[slug].vue               # 标签页
│   ├── search.vue                   # 搜索页
│   ├── archive.vue                  # 归档页
│   ├── about.vue                    # 关于页
│   ├── login.vue                    # 登录
│   ├── register.vue                 # 注册
│   └── admin/                       # 后台管理
│       ├── dashboard.vue
│       ├── posts.vue
│       ├── post-edit.vue
│       ├── categories.vue
│       ├── tags.vue
│       ├── comments.vue
│       ├── users.vue
│       ├── files.vue
│       ├── stats.vue
│       └── settings.vue
├── components/                      # 公共组件
│   ├── Header.vue
│   ├── Footer.vue
│   ├── PostCard.vue
│   ├── Sidebar.vue
│   ├── CommentList.vue
│   ├── ShareButtons.vue
│   ├── ThemeToggle.vue
│   ├── LanguageSwitch.vue
│   └── SiteInfo.vue
├── composables/                     # 组合式函数
│   ├── useAuth.ts
│   ├── useTheme.ts
│   ├── useI18n.ts
│   ├── useStats.ts
│   └── useSiteInfo.ts
├── locales/                         # 国际化文件
│   ├── zh-CN.json
│   └── en.json
├── assets/
│   └── styles/
│       ├── variables.scss           # 变量定义
│       ├── dark.scss                # 暗黑模式样式
│       └── global.scss              # 全局样式
└── public/
    └── images/
        └── placeholder.png          # 图片占位图
```

### 2.3 前端页面路由表

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | index.vue | 首页 |
| `/post/:id` | post/[id].vue | 文章详情 |
| `/category/:slug` | category/[slug].vue | 分类页 |
| `/tag/:slug` | tag/[slug].vue | 标签页 |
| `/search` | search.vue | 搜索页 |
| `/archive` | archive.vue | 归档页 |
| `/about` | about.vue | 关于页 |
| `/login` | login.vue | 登录 |
| `/register` | register.vue | 注册 |
| `/admin` | admin/dashboard.vue | 后台仪表盘 |
| `/admin/posts` | admin/posts.vue | 文章管理 |
| `/admin/post-edit` | admin/post-edit.vue | 文章编辑 |
| `/admin/post-edit/:id` | admin/post-edit.vue | 编辑已有文章 |
| `/admin/categories` | admin/categories.vue | 分类管理 |
| `/admin/tags` | admin/tags.vue | 标签管理 |
| `/admin/comments` | admin/comments.vue | 评论管理 |
| `/admin/users` | admin/users.vue | 用户管理 |
| `/admin/files` | admin/files.vue | 文件管理 |
| `/admin/stats` | admin/stats.vue | 数据统计 |
| `/admin/settings` | admin/settings.vue | 系统设置 |

---

## 3. 后端架构

### 3.1 技术栈

| 技术 | 版本 | 用途 |
|------|:----:|------|
| Node.js | 18+ | 运行时 |
| Koa2 | 2.x | Web框架 |
| Sequelize | 6.x | ORM |
| MySQL2 | - | MySQL驱动 |
| jsonwebtoken | 9.x | JWT生成/验证 |
| bcryptjs | 2.x | 密码加密 |
| koa-body | 6.x | 请求体解析/文件上传 |
| koa-static | 5.x | 静态文件服务 |
| koa-router | 12.x | 路由 |
| koa-cors | - | 跨域支持 |
| koa-helmet | - | 安全头 |
| koa-rate-limit | - | 速率限制 |

### 3.2 后端目录结构

```
server/
├── src/
│   ├── app.js                       # 应用入口
│   │   ├── 初始化Koa实例
│   │   ├── 注册中间件
│   │   ├── 加载路由
│   │   ├── 启动服务器
│   │   └── 同步数据库
│   ├── config/
│   │   ├── index.js                 # 全局配置（含域名预留）
│   │   │   ├── port
│   │   │   ├── database
│   │   │   ├── jwt
│   │   │   ├── domain (预留)
│   │   │   └── upload
│   │   └── database.js             # Sequelize实例
│   ├── models/                      # Sequelize 模型
│   │   ├── User.js                  # 用户
│   │   ├── Post.js                  # 文章
│   │   ├── Category.js             # 分类
│   │   ├── Tag.js                   # 标签
│   │   ├── Comment.js              # 评论
│   │   ├── Like.js                  # 点赞
│   │   ├── Favorite.js             # 收藏
│   │   ├── VisitLog.js             # 访问日志
│   │   └── File.js                  # 文件记录
│   ├── routes/                      # 路由层
│   │   ├── auth.js                  # 认证接口
│   │   ├── posts.js                 # 文章接口
│   │   ├── categories.js           # 分类接口
│   │   ├── tags.js                  # 标签接口
│   │   ├── comments.js             # 评论接口
│   │   ├── likes.js                 # 点赞接口
│   │   ├── favorites.js            # 收藏接口
│   │   ├── stats.js                 # 统计接口
│   │   ├── files.js                 # 文件接口
│   │   └── rss.js                   # RSS订阅
│   ├── middleware/                  # 中间件
│   │   ├── auth.js                  # JWT鉴权
│   │   ├── errorHandler.js         # 全局错误处理
│   │   └── rateLimiter.js          # 速率限制
│   ├── services/                    # 业务逻辑层（TODO）
│   └── utils/                       # 工具函数
│       ├── response.js              # 统一响应格式
│       └── ipLocation.js            # IP定位工具
│   └── uploads/                     # 文件存储（10G限制）
│       └── .gitkeep
├── Dockerfile
├── package.json
└── .gitignore
```

---

## 4. 数据库设计

### 4.1 E-R 关系概览

```
User ──1:N──> Post
User ──1:N──> Comment
User ──1:N──> Like
User ──1:N──> Favorite

Category ──1:N──> Post
Post ──N:M──> Tag (通过 post_tags 关联表)

Post ──1:N──> Comment
Comment ──1:N──> Comment (自关联，实现回复)

Post ──1:N──> Like
Post ──1:N──> Favorite
Post ──1:N──> VisitLog
```

### 4.2 数据表设计

#### users（用户表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|:----:|------|
| id | INT | PK, AUTO_INCREMENT | 用户ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 用户名 |
| email | VARCHAR(100) | UNIQUE, NOT NULL | 邮箱 |
| password | VARCHAR(255) | NOT NULL | 加密密码(bcrypt) |
| avatar | VARCHAR(255) | NULLABLE | 头像URL |
| bio | VARCHAR(500) | NULLABLE | 个人简介 |
| role | ENUM('admin','user') | DEFAULT 'user' | 角色 |
| status | ENUM('active','disabled') | DEFAULT 'active' | 状态 |
| created_at | DATETIME | DEFAULT NOW() | 创建时间 |
| updated_at | DATETIME | DEFAULT NOW() ON UPDATE | 更新时间 |

#### posts（文章表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|:----:|------|
| id | INT | PK, AUTO_INCREMENT | 文章ID |
| title | VARCHAR(200) | NOT NULL | 标题 |
| content | LONGTEXT | NOT NULL | Markdown内容 |
| summary | VARCHAR(500) | NULLABLE | 摘要 |
| cover_image | VARCHAR(255) | NULLABLE | 封面图 |
| status | ENUM('draft','published') | DEFAULT 'draft' | 状态 |
| view_count | INT | DEFAULT 0 | 阅读量 |
| like_count | INT | DEFAULT 0 | 点赞数 |
| favorite_count | INT | DEFAULT 0 | 收藏数 |
| comment_count | INT | DEFAULT 0 | 评论数 |
| category_id | INT | FK -> categories.id | 分类ID |
| author_id | INT | FK -> users.id, NOT NULL | 作者ID |
| published_at | DATETIME | NULLABLE | 发布时间 |
| created_at | DATETIME | DEFAULT NOW() | 创建时间 |
| updated_at | DATETIME | DEFAULT NOW() ON UPDATE | 更新时间 |

#### categories（分类表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|:----:|------|
| id | INT | PK, AUTO_INCREMENT | 分类ID |
| name | VARCHAR(50) | UNIQUE, NOT NULL | 分类名称 |
| slug | VARCHAR(50) | UNIQUE, NOT NULL | URL别名 |
| description | VARCHAR(200) | NULLABLE | 描述 |
| sort_order | INT | DEFAULT 0 | 排序 |
| created_at | DATETIME | DEFAULT NOW() | 创建时间 |

#### tags（标签表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|:----:|------|
| id | INT | PK, AUTO_INCREMENT | 标签ID |
| name | VARCHAR(50) | UNIQUE, NOT NULL | 标签名称 |
| slug | VARCHAR(50) | UNIQUE, NOT NULL | URL别名 |
| created_at | DATETIME | DEFAULT NOW() | 创建时间 |

#### post_tags（文章-标签关联表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|:----:|------|
| post_id | INT | FK, PK(复合) | 文章ID |
| tag_id | INT | FK, PK(复合) | 标签ID |

#### comments（评论表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|:----:|------|
| id | INT | PK, AUTO_INCREMENT | 评论ID |
| content | TEXT | NOT NULL | 评论内容 |
| nickname | VARCHAR(50) | NULLABLE | 游客昵称 |
| ip_address | VARCHAR(45) | NOT NULL | 评论者IP |
| user_agent | VARCHAR(500) | NULLABLE | 浏览器信息 |
| status | ENUM('pending','approved','rejected') | DEFAULT 'pending' | 状态 |
| post_id | INT | FK, NOT NULL | 文章ID |
| user_id | INT | FK, NULLABLE | 用户ID（游客为空） |
| parent_id | INT | FK, NULLABLE | 父评论ID（回复） |
| created_at | DATETIME | DEFAULT NOW() | 创建时间 |

#### likes（点赞表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|:----:|------|
| id | INT | PK, AUTO_INCREMENT | 点赞ID |
| post_id | INT | FK, NOT NULL | 文章ID |
| user_id | INT | FK, NOT NULL | 用户ID |
| created_at | DATETIME | DEFAULT NOW() | 创建时间 |
| 约束 | | UNIQUE(post_id, user_id) | 一篇文章只能点赞一次 |

#### favorites（收藏表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|:----:|------|
| id | INT | PK, AUTO_INCREMENT | 收藏ID |
| post_id | INT | FK, NOT NULL | 文章ID |
| user_id | INT | FK, NOT NULL | 用户ID |
| created_at | DATETIME | DEFAULT NOW() | 创建时间 |
| 约束 | | UNIQUE(post_id, user_id) | 一篇文章只能收藏一次 |

#### visit_logs（访问日志表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|:----:|------|
| id | BIGINT | PK, AUTO_INCREMENT | 日志ID |
| ip_address | VARCHAR(45) | NOT NULL | 访客IP |
| page_url | VARCHAR(500) | NOT NULL | 访问页面 |
| user_agent | VARCHAR(500) | NULLABLE | 浏览器信息 |
| visit_date | DATE | NOT NULL | 访问日期 |
| created_at | DATETIME | DEFAULT NOW() | 创建时间 |

#### files（文件记录表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|:----:|------|
| id | INT | PK, AUTO_INCREMENT | 文件ID |
| filename | VARCHAR(255) | NOT NULL | 存储文件名 |
| original_name | VARCHAR(255) | NOT NULL | 原始文件名 |
| url | VARCHAR(500) | NOT NULL | 访问URL |
| size | BIGINT | NOT NULL | 文件大小(字节) |
| mime_type | VARCHAR(100) | NOT NULL | MIME类型 |
| upload_date | DATE | NOT NULL | 上传日期（用于分组） |
| uploaded_by | INT | FK -> users.id | 上传者 |
| is_deleted | TINYINT(1) | DEFAULT 0 | 是否已删除 |
| created_at | DATETIME | DEFAULT NOW() | 创建时间 |

---

## 5. API 接口设计

### 5.1 统一响应格式

```json
// 成功响应
{
  "code": 200,
  "message": "success",
  "data": { ... }
}

// 错误响应
{
  "code": 400,
  "message": "参数错误",
  "error": "具体错误信息"
}

// 分页响应
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [ ... ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100
    }
  }
}
```

### 5.2 接口列表

#### 公开接口（无需认证）
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/posts | 文章列表（分页） |
| GET | /api/posts/:id | 文章详情 |
| GET | /api/categories | 分类列表 |
| GET | /api/tags | 标签列表 |
| GET | /api/comments?post_id= | 文章评论列表 |
| GET | /api/posts/search?q= | 搜索文章 |
| GET | /api/archive | 文章归档 |
| GET | /api/rss | RSS订阅 |
| GET | /api/ip | 获取当前IP和地理位置 |
| GET | /api/stats/overview | 统计数据 |

#### 认证接口
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/logout | 用户登出 |
| GET | /api/auth/me | 获取当前用户信息 |

#### 需登录接口
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/posts/:id/like | 点赞/取消点赞 |
| POST | /api/posts/:id/favorite | 收藏/取消收藏 |
| GET | /api/favorites | 我的收藏列表 |
| POST | /api/comments | 发表评论 |

#### 管理员接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/posts | 文章列表（含草稿） |
| POST | /api/admin/posts | 新建文章 |
| PUT | /api/admin/posts/:id | 更新文章 |
| DELETE | /api/admin/posts/:id | 删除文章 |
| GET | /api/admin/categories | 分类管理列表 |
| POST | /api/admin/categories | 新建分类 |
| PUT | /api/admin/categories/:id | 更新分类 |
| DELETE | /api/admin/categories/:id | 删除分类 |
| GET | /api/admin/tags | 标签管理列表 |
| POST | /api/admin/tags | 新建标签 |
| DELETE | /api/admin/tags/:id | 删除标签 |
| GET | /api/admin/comments | 评论管理列表 |
| PUT | /api/admin/comments/:id/status | 审核评论 |
| DELETE | /api/admin/comments/:id | 删除评论 |
| GET | /api/admin/users | 用户管理列表 |
| PUT | /api/admin/users/:id/status | 禁用/启用用户 |
| GET | /api/admin/files | 文件列表（按时间分组） |
| POST | /api/admin/files/upload | 上传文件 |
| DELETE | /api/admin/files/:id | 删除文件 |
| GET | /api/admin/stats | 详细统计数据 |

---

## 6. 安全架构

### 6.1 认证流程
```
客户端 → 登录 → 后端验证 → 返回JWT Token
                                        ↓
客户端存储Token → 后续请求携带 Authorization: Bearer <token>
                                        ↓
后端中间件解析验证 → 通过则继续，否则返回401
```

### 6.2 安全措施
| 措施 | 说明 |
|------|------|
| JWT Token | 无状态鉴权，设置过期时间 |
| 密码加密 | bcryptjs 哈希存储 |
| XSS防护 | 评论内容过滤，输出编码 |
| SQL注入防护 | Sequelize ORM 参数化查询 |
| 请求速率限制 | koa-rate-limit 接口限流 |
| CORS限制 | 只允许前端域名跨域访问 |
| 文件上传校验 | 限制类型（图片）+ 大小 |

---

## 7. 文件存储架构

### 7.1 存储路径规则
```
uploads/
├── 2026/
│   ├── 07/
│   │   ├── 01/
│   │   │   ├── abc123.jpg
│   │   │   └── def456.png
│   │   └── 02/
│   │       └── ghi789.jpg
│   └── 08/
│       └── ...
└── ...
```

### 7.2 容量控制
- 每次上传前检查 `uploads/` 目录总大小
- 超过 10GB 返回 413 Payload Too Large
- 定期清理已删除标记的文件

---

## 8. Docker 部署架构

```yaml
# 三容器架构
services:
  mysql:
    image: mysql:8
    volumes: - mysql-data:/var/lib/mysql
  
  server:
    build: ./server
    depends_on: - mysql
    volumes: - uploads:/app/src/uploads
  
  nginx:
    image: nginx:alpine
    volumes: 
      - ./client/.output/public:/usr/share/nginx/html
    ports: - "80:80" - "443:443"
    depends_on: - server
```

---

## 9. 性能与扩展

### 9.1 性能优化策略
| 策略 | 说明 |
|------|------|
| SSG静态生成 | 博客页面预渲染为HTML |
| 图片懒加载 | 文章列表图片延迟加载 |
| 数据库索引 | 常用查询字段加索引 |
| 响应缓存 | 文章列表等不频繁变化的数据缓存 |

### 9.2 水平扩展方向
- 前端：CDN加速静态资源
- 后端：多实例负载均衡
- 数据库：读写分离
- 文件存储：迁移到OSS/S3
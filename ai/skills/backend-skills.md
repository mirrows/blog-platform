# 后端技术栈说明 - AI 技能定义

> 本文档定义项目的**后端技术栈详情**，供 AI 了解项目的技术生态、版本、关键 API 和最佳实践。

---

## 1. 核心技术栈

| 技术 | 版本 | 用途 | 关键文档 |
|------|:----:|------|---------|
| Node.js | 18+ | 运行时 | https://nodejs.org/ |
| Koa2 | 2.x | Web框架 | https://koajs.com/ |
| Sequelize | 6.x | ORM | https://sequelize.org/ |
| MySQL2 | - | MySQL驱动 | https://github.com/sidorares/node-mysql2 |
| jsonwebtoken | 9.x | JWT | https://github.com/auth0/node-jsonwebtoken |
| bcryptjs | 2.x | 密码加密 | https://github.com/dcodeIO/bcrypt.js |
| koa-body | 6.x | 请求体解析 | https://github.com/koajs/koa-body |
| koa-static | 5.x | 静态文件服务 | https://github.com/koajs/static |
| koa-router | 12.x | 路由 | https://github.com/koajs/router |
| koa-cors | - | 跨域 | https://github.com/koajs/cors |
| ip2region | - | IP定位 | https://github.com/lionsoul2014/ip2region |

---

## 2. 项目初始化

### 2.1 创建项目
```bash
mkdir server && cd server
npm init -y
npm install koa koa-router koa-body koa-static koa-cors koa-helmet
npm install koa-rate-limit
npm install sequelize mysql2
npm install jsonwebtoken bcryptjs
npm install ip2region
npm install dotenv
npm install nodemon --save-dev
```

### 2.2 package.json 配置
```json
{
  "name": "blog-server",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js"
  }
}
```

### 2.3 .env 文件
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

---

## 3. Koa 应用入口

```javascript
// src/app.js
const Koa = require('koa')
const cors = require('koa-cors')
const { koaBody } = require('koa-body')
const static = require('koa-static')
const path = require('path')

const app = new Koa()
const config = require('./config')
const errorHandler = require('./middleware/errorHandler')
const rateLimiter = require('./middleware/rateLimiter')

// 中间件顺序
app.use(errorHandler)
app.use(cors({ origin: config.domain.frontend, credentials: true }))
app.use(koaBody({ multipart: true, formidable: { maxFileSize: 5 * 1024 * 1024 } }))
app.use(rateLimiter)
app.use(static(path.join(__dirname, 'uploads')))

// 加载路由
const router = require('./routes/_index')
app.use(router.routes())
app.use(router.allowedMethods())

// 启动服务器
const PORT = config.port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
```

---

## 4. Sequelize 配置与使用

### 4.1 数据库配置
```javascript
// src/config/database.js
const { Sequelize } = require('sequelize')
const config = require('./index')

const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    logging: false,
    timezone: '+08:00',
    define: {
      timestamps: true,
      underscored: true,
      charset: 'utf8mb4'
    }
  }
)

module.exports = sequelize
```

### 4.2 模型定义示例
```javascript
// src/models/Post.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: '标题不能为空' }
    }
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  summary: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft'
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  published_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'posts',
  timestamps: true,
  underscored: true
})

module.exports = Post
```

### 4.3 模型关联
```javascript
// src/models/_associations.js
const User = require('./User')
const Post = require('./Post')
const Category = require('./Category')
const Tag = require('./Tag')
const Comment = require('./Comment')
const Like = require('./Like')
const Favorite = require('./Favorite')

// 用户与文章
User.hasMany(Post, { foreignKey: 'author_id', as: 'posts' })
Post.belongsTo(User, { foreignKey: 'author_id', as: 'author' })

// 分类与文章
Category.hasMany(Post, { foreignKey: 'category_id', as: 'posts' })
Post.belongsTo(Category, { foreignKey: 'category_id', as: 'category' })

// 文章与标签（多对多）
Post.belongsToMany(Tag, { through: 'post_tags', foreignKey: 'post_id', as: 'tags' })
Tag.belongsToMany(Post, { through: 'post_tags', foreignKey: 'tag_id', as: 'posts' })

// 文章与评论
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' })
Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post' })

// 评论自关联（回复）
Comment.belongsTo(Comment, { foreignKey: 'parent_id', as: 'parent' })
Comment.hasMany(Comment, { foreignKey: 'parent_id', as: 'replies' })

// 文章与点赞
Post.hasMany(Like, { foreignKey: 'post_id', as: 'likes' })
User.hasMany(Like, { foreignKey: 'user_id', as: 'likes' })

// 文章与收藏
Post.hasMany(Favorite, { foreignKey: 'post_id', as: 'favorites' })
User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites' })
```

---

## 5. Koa 路由示例

### 5.1 路由结构
```javascript
// src/routes/_index.js - 统一加载所有路由
const Router = require('koa-router')
const router = new Router()

const routes = [
  require('./auth'),
  require('./posts'),
  require('./categories'),
  require('./tags'),
  require('./comments'),
  require('./likes'),
  require('./favorites'),
  require('./stats'),
  require('./files'),
  require('./rss')
]

routes.forEach(r => {
  router.use(r.routes())
})

module.exports = router
```

### 5.2 路由实现示例
```javascript
// src/routes/posts.js
const Router = require('koa-router')
const router = new Router({ prefix: '/api' })
const { Post, Category, Tag } = require('../models')
const { success, fail, successWithPagination } = require('../utils/response')
const auth = require('../middleware/auth')

// 公开：获取文章列表
router.get('/posts', async (ctx) => {
  const { page = 1, pageSize = 10, categoryId, tagId } = ctx.query
  const offset = (page - 1) * pageSize
  
  const where = { status: 'published' }
  if (categoryId) where.category_id = categoryId
  
  const { count, rows } = await Post.findAndCountAll({
    where,
    include: [
      { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
      { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'] }
    ],
    order: [['published_at', 'DESC']],
    limit: Number(pageSize),
    offset: Number(offset)
  })
  
  ctx.body = successWithPagination(rows, {
    page: Number(page),
    pageSize: Number(pageSize),
    total: count
  })
})

// 公开：获取文章详情
router.get('/posts/:id', async (ctx) => {
  const post = await Post.findByPk(ctx.params.id, {
    include: [
      { model: Category, as: 'category' },
      { model: Tag, as: 'tags' },
      { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }
    ]
  })
  
  if (!post) {
    ctx.body = fail('文章不存在', 404)
    return
  }
  
  // 增加阅读量
  post.view_count += 1
  await post.save()
  
  ctx.body = success(post)
})

// 需要登录：创建文章
router.post('/admin/posts', auth, async (ctx) => {
  if (ctx.state.user.role !== 'admin') {
    ctx.body = fail('无权限', 403)
    return
  }
  
  const { title, content, summary, categoryId, tags, status } = ctx.request.body
  const post = await Post.create({
    title,
    content,
    summary,
    category_id: categoryId,
    author_id: ctx.state.user.id,
    status: status || 'draft',
    published_at: status === 'published' ? new Date() : null
  })
  
  // 关联标签
  if (tags && tags.length > 0) {
    await post.setTags(tags)
  }
  
  ctx.body = success(post, '创建成功')
})

module.exports = router
```

---

## 6. 数据库同步

```javascript
// 在 app.js 末尾添加
const sequelize = require('./config/database')

// 加载模型关联
require('./models/_associations')

// 同步数据库（开发环境使用 force: false）
sequelize.sync({ force: false }).then(() => {
  console.log('数据库同步完成')
}).catch(err => {
  console.error('数据库同步失败:', err)
})
```

---

## 7. IP 定位工具

```javascript
// src/utils/ipLocation.js
const path = require('path')

let ip2region = null
try {
  ip2region = require('ip2region').default
} catch (err) {
  console.warn('ip2region 未安装，IP定位功能不可用')
}

function getIpLocation(ip) {
  // 本地地址直接返回
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
    return { fullLocation: '本地' }
  }
  
  if (!ip2region) {
    return { fullLocation: '未知位置' }
  }
  
  try {
    const query = new ip2region()
    const res = query.search(ip)
    const region = res?.province || ''
    const city = res?.city || ''
    const fullLocation = `${region}${city}`.replace(/0/g, '').trim()
    return { fullLocation: fullLocation || '未知位置' }
  } catch (err) {
    return { fullLocation: '未知位置' }
  }
}

module.exports = { getIpLocation }
```

---

## 8. 统一响应工具

```javascript
// src/utils/response.js
function success(data, message = 'success') {
  return { code: 200, message, data }
}

function successWithPagination(list, pagination) {
  return { code: 200, message: 'success', data: { list, pagination } }
}

function fail(message, code = 400) {
  return { code, message }
}

module.exports = { success, successWithPagination, fail }
```

---

## 9. Docker 配置

### 9.1 Dockerfile
```dockerfile
# server/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY src/ ./src/

EXPOSE 3000

CMD ["node", "src/app.js"]
```

### 9.2 docker-compose.yml（项目根目录）
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: blog-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASS}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_CHARACTER_SET_SERVER: utf8mb4
      MYSQL_COLLATION_SERVER: utf8mb4_unicode_ci
    volumes:
      - mysql-data:/var/lib/mysql
    ports:
      - "3306:3306"
    restart: always

  server:
    build: ./server
    container_name: blog-server
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASS=${DB_PASS}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - uploads:/app/src/uploads
    ports:
      - "3000:3000"
    depends_on:
      - mysql
    restart: always

volumes:
  mysql-data:
  uploads:
```

---

## 10. 开发与构建命令

```json
{
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js",
    "docker:build": "docker-compose build",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down"
  }
}
```

---

## 11. 关键依赖版本

```json
{
  "dependencies": {
    "koa": "^2.15.0",
    "koa-router": "^12.0.0",
    "koa-body": "^6.0.0",
    "koa-static": "^5.0.0",
    "koa-cors": "^0.0.16",
    "koa-helmet": "^7.0.0",
    "koa-rate-limit": "^3.0.0",
    "sequelize": "^6.35.0",
    "mysql2": "^3.6.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.0"
  },
  "optionalDependencies": {
    "ip2region": "^3.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

---

## 12. 项目目录结构（后端完成态）

```
server/
├── Dockerfile
├── package.json
├── .env
├── .gitignore
├── src/
│   ├── app.js                       # 入口
│   ├── config/
│   │   ├── index.js                 # 全局配置
│   │   └── database.js             # 数据库配置
│   ├── models/
│   │   ├── _associations.js         # 模型关联
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Category.js
│   │   ├── Tag.js
│   │   ├── Comment.js
│   │   ├── Like.js
│   │   ├── Favorite.js
│   │   ├── VisitLog.js
│   │   └── File.js
│   ├── routes/
│   │   ├── _index.js                # 路由汇总
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── categories.js
│   │   ├── tags.js
│   │   ├── comments.js
│   │   ├── likes.js
│   │   ├── favorites.js
│   │   ├── stats.js
│   │   ├── files.js
│   │   └── rss.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── services/
│   └── utils/
│       ├── response.js
│       └── ipLocation.js
│   └── uploads/
│       └── .gitkeep
└── nodemon.json
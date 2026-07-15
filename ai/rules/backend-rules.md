# 后端代码规范 - Node.js / Koa2

> 本文档用于 AI 辅助开发时的后端代码标准参考。
> AI 在生成后端代码时，必须遵循以下规范。

---

## 1. 框架与语言规范

### 1.1 框架版本
- Node.js 18+（推荐 20 LTS）
- Koa2（`koa` 2.x）
- 使用 CommonJS（`require`/`module.exports`）或 ESM（`import`/`export`），保持项目统一

### 1.2 代码风格
```javascript
// ✅ 正确：使用 async/await
async function getPosts(ctx) {
  const posts = await Post.findAll()
  ctx.body = success(posts)
}

// ❌ 错误：避免回调嵌套
Post.findAll().then(posts => {
  ctx.body = success(posts)
}).catch(err => {
  // ...
})
```

---

## 2. 项目结构规范

### 2.1 目录约定
```
src/
├── app.js           # 入口文件
├── config/          # 配置文件
│   ├── index.js     # 全局配置
│   └── database.js  # 数据库配置
├── models/          # Sequelize 模型
├── routes/          # 路由层
├── middleware/      # 中间件
├── services/        # 业务逻辑层
└── utils/           # 工具函数
```

### 2.2 文件命名规范
- **入口文件**：`app.js`
- **配置文件**：`kebab-case`，如 `database.js`
- **模型文件**：大驼峰（PascalCase），单数，如 `User.js`、`Post.js`
- **路由文件**：小写 + 复数，如 `posts.js`、`categories.js`
- **中间件文件**：小驼峰，如 `errorHandler.js`、`rateLimiter.js`

---

## 3. 模型定义规范

### 3.1 Sequelize 模型
```javascript
// ✅ 正确：使用 sequelize.define
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: '标题不能为空' },
      len: [1, 200]
    }
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft'
  }
}, {
  tableName: 'posts',
  timestamps: true,
  underscored: true,  // 使用蛇形命名
  paranoid: false     // 不使用软删除
})

module.exports = Post
```

### 3.2 关联定义
```javascript
// ✅ 正确：在模型文件中定义关联
Post.belongsTo(Category, { foreignKey: 'category_id', as: 'category' })
Post.belongsToMany(Tag, { through: 'post_tags', foreignKey: 'post_id', as: 'tags' })
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' })
Post.belongsTo(User, { foreignKey: 'author_id', as: 'author' })
```

### 3.3 模型字段规范
- 主键统一为 `id`，自增 INT
- 外键统一为 `xxx_id` 格式
- 时间戳使用 `created_at`、`updated_at`
- 布尔字段使用 `TINYINT(1)`，命名 `is_xxx`
- 状态字段使用 `ENUM`，命名 `status`

---

## 4. 路由规范

### 4.1 路由定义
```javascript
// ✅ 正确：使用 koa-router
const Router = require('koa-router')
const router = new Router({ prefix: '/api' })

router.get('/posts', async (ctx) => {
  // 获取文章列表
})

router.get('/posts/:id', async (ctx) => {
  // 获取文章详情
})

module.exports = router
```

### 4.2 URL 命名规范
- 使用复数名词：`/api/posts`、`/api/categories`
- 使用连字符连接：`/api/visit-logs`
- 嵌套资源使用路径参数：`/api/posts/:id/comments`
- 动作类 URL 使用动词：`/api/auth/login`、`/api/auth/logout`

### 4.3 HTTP 方法使用
| 方法 | 用途 | 示例 |
|------|------|------|
| GET | 查询/读取 | GET /api/posts |
| POST | 创建/提交 | POST /api/posts |
| PUT | 全量更新 | PUT /api/posts/:id |
| PATCH | 部分更新 | PATCH /api/posts/:id/status |
| DELETE | 删除 | DELETE /api/posts/:id |

---

## 5. 中间件规范

### 5.1 JWT 鉴权中间件
```javascript
// ✅ 正确：JWT 中间件
async function authMiddleware(ctx, next) {
  const token = ctx.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    ctx.status = 401
    ctx.body = { code: 401, message: '未登录' }
    return
  }
  
  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    ctx.state.user = decoded
    await next()
  } catch (err) {
    ctx.status = 401
    ctx.body = { code: 401, message: 'Token 无效或已过期' }
  }
}
```

### 5.2 错误处理中间件
```javascript
// ✅ 正确：全局错误处理
async function errorHandler(ctx, next) {
  try {
    await next()
  } catch (err) {
    console.error('Error:', err)
    
    ctx.status = err.status || 500
    ctx.body = {
      code: err.status || 500,
      message: err.message || '服务器内部错误'
    }
  }
}
```

### 5.3 中间件注册顺序
```javascript
// ✅ 正确：中间件顺序
app.use(errorHandler)         // 1. 错误处理（最外层）
app.use(cors())               // 2. 跨域
app.use(koaBody({ multipart: true }))  // 3. 请求体解析
app.use(rateLimiter)          // 4. 速率限制
app.use(router.routes())      // 5. 路由（最内层）
```

---

## 6. 响应格式规范

### 6.1 成功响应
```javascript
// ✅ 正确：使用统一响应格式
function success(data, message = 'success') {
  return {
    code: 200,
    message,
    data
  }
}

// 分页响应
function successWithPagination(list, pagination) {
  return {
    code: 200,
    message: 'success',
    data: { list, pagination }
  }
}
```

### 6.2 错误响应
```javascript
function fail(message, code = 400) {
  return {
    code,
    message
  }
}
```

---

## 7. 文件上传规范

### 7.1 文件存储路径
```javascript
// 按日期组织文件
const date = new Date()
const uploadPath = path.join(
  __dirname, '../uploads',
  String(date.getFullYear()),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0')
)
```

### 7.2 文件大小限制
```javascript
// 上传前检查目录总大小（10G 限制）
async function checkStorageLimit(fileSize) {
  const uploadDir = path.join(__dirname, '../uploads')
  const totalSize = await getDirectorySize(uploadDir)
  
  if (totalSize + fileSize > 10 * 1024 * 1024 * 1024) {
    throw new Error('存储空间已满（最大 10GB）')
  }
}
```

### 7.3 文件类型校验
```javascript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024  // 5MB

function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new Error('不支持的文件类型')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('文件大小不能超过 5MB')
  }
}
```

---

## 8. 数据库操作规范

### 8.1 查询规范
```javascript
// ✅ 正确：使用参数化查询
const posts = await Post.findAll({
  where: {
    status: 'published',
    category_id: categoryId
  },
  include: [
    { model: Category, as: 'category', attributes: ['id', 'name'] }
  ],
  order: [['published_at', 'DESC']],
  limit: 10,
  offset: 0
})

// ❌ 错误：禁止原生 SQL 拼接
const posts = await sequelize.query(`SELECT * FROM posts WHERE category_id = ${categoryId}`)
```

### 8.2 事务处理
```javascript
// ✅ 正确：复杂操作使用事务
const result = await sequelize.transaction(async (t) => {
  const post = await Post.create(data, { transaction: t })
  await post.addTags(tagIds, { transaction: t })
  return post
})
```

### 8.3 索引建议
```sql
-- 常用查询字段应建立索引
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_visit_logs_visit_date ON visit_logs(visit_date);
```

---

## 9. IP 定位规范

```javascript
// 使用 ip2region 或 geoip-lite 进行 IP 定位
const ip2region = require('ip2region').default
const query = new ip2region()

function getIpLocation(ip) {
  try {
    const res = query.search(ip)
    return {
      country: res.country,
      region: res.province,
      city: res.city,
      // 返回格式如 "广东广州"
      fullLocation: `${res.province}${res.city}`.replace('0', '')
    }
  } catch (err) {
    return { fullLocation: '未知位置' }
  }
}
```

---

## 10. 安全规范

### 10.1 密码加密
```javascript
// ✅ 正确：使用 bcryptjs 加密
const bcrypt = require('bcryptjs')
const SALT_ROUNDS = 10

async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash)
}
```

### 10.2 JWT 配置
```javascript
// JWT 配置
module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '7d',        // Token 有效期 7 天
    refreshExpiresIn: '30d' // 刷新 Token 有效期 30 天
  }
}
```

### 10.3 速率限制
```javascript
// 不同接口使用不同限制
const rateLimitConfig = {
  '/api/auth/login': { max: 5, window: 60 * 1000 },       // 登录：1分钟5次
  '/api/comments': { max: 10, window: 60 * 1000 },        // 评论：1分钟10次
  '/api/admin': { max: 100, window: 60 * 1000 },          // 后台：1分钟100次
  default: { max: 60, window: 60 * 1000 }                 // 默认：1分钟60次
}
```

---

## 11. 环境变量与配置

### 11.1 配置文件结构
```javascript
// config/index.js
module.exports = {
  port: process.env.PORT || 3000,
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'blog',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    dialect: 'mysql'
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '7d'
  },
  
  // 域名预留
  domain: {
    frontend: process.env.FRONTEND_DOMAIN || 'https://your-domain.com',
    backend: process.env.BACKEND_DOMAIN || 'https://api.your-domain.com'
  },
  
  upload: {
    maxSize: 10 * 1024 * 1024 * 1024,  // 10GB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024        // 5MB per file
  }
}
```

### 11.2 .env 文件
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=blog
DB_USER=root
DB_PASS=your-password

# JWT 密钥
JWT_SECRET=your-secure-jwt-secret-key

# 域名配置（预留）
FRONTEND_DOMAIN=https://your-domain.com
BACKEND_DOMAIN=https://api.your-domain.com
```

---

## 12. API 响应字段命名规范

### 12.1 字段命名规则
- **必须使用小驼峰命名（camelCase）**
- ❌ 禁止使用下划线命名（snake_case）：如 `user_name`、`created_at`
- ❌ 禁止使用大驼峰命名（PascalCase）：如 `UserName`、`CreatedAt`
- ✅ 正确示例：`userName`、`createdAt`、`viewCount`、`coverImage`

### 12.2 数据库字段与 API 响应的映射
```javascript
// 数据库字段（下划线命名）
// posts 表：user_id, created_at, view_count, cover_image

// API 响应字段（小驼峰命名）
{
  userId: 1,
  createdAt: "2024-01-01 00:00:00",
  viewCount: 100,
  coverImage: "https://example.com/image.jpg"
}
```

### 12.3 字段转换工具
```javascript
// utils/transform.js
function camelCase(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function transformKeys(obj, callback) {
  if (Array.isArray(obj)) {
    return obj.map(item => transformKeys(item, callback))
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      result[callback(key)] = transformKeys(obj[key], callback)
      return result
    }, {})
  }
  return obj
}

// 使用示例
const response = transformKeys(sequelizeResult, camelCase)
```

### 12.4 在路由中使用
```javascript
// ✅ 正确：转换后返回
router.get('/admin/posts', async (ctx) => {
  const posts = await Post.findAll()
  const transformedPosts = transformKeys(posts, camelCase)
  ctx.body = success(transformedPosts)
})

// ❌ 错误：直接返回数据库字段
router.get('/admin/posts', async (ctx) => {
  const posts = await Post.findAll()
  ctx.body = success(posts)  // 返回下划线字段
})
```

### 12.5 嵌套对象处理
```javascript
// 关联查询的结果也需要转换
const posts = await Post.findAll({
  include: [
    { model: Category, as: 'category' },
    { model: User, as: 'author' }
  ]
})

// 转换所有层级
const transformed = transformKeys(posts, camelCase)
// 结果：post.category.name, post.author.userName
```

---

## 13. 禁止事项

- ❌ 禁止在路由处理函数中直接使用 `console.log`（使用日志库）
- ❌ 禁止在循环中执行数据库查询（N+1 问题）
- ❌ 禁止将密码/密钥硬编码在代码中
- ❌ 禁止返回敏感信息（密码等）到前端
- ❌ 禁止使用 `eval()` 或 `new Function()`
- ❌ 禁止在 SQL 查询中使用字符串拼接
- ❌ 禁止在不清理的情况下上传用户文件
- ❌ 禁止在请求处理中阻塞事件循环

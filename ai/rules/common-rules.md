# 通用规范 - 项目全局

> 本文档定义前后端通用的编码规范、Git 提交规范、注释规范等。
> AI 在生成代码时，必须遵循以下通用标准。

---

## 1. Git 提交规范

### 1.1 提交信息格式
```
<type>(<scope>): <subject>

<body> (可选)

<footer> (可选)
```

### 1.2 提交类型
| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(posts): 添加文章搜索功能` |
| `fix` | 修复 bug | `fix(auth): 修复 Token 过期后未跳转登录页` |
| `style` | 样式修改 | `style(home): 调整首页卡片间距` |
| `refactor` | 重构 | `refactor(api): 重构评论接口逻辑` |
| `docs` | 文档更新 | `docs(readme): 更新部署说明` |
| `chore` | 构建/工具链 | `chore(deps): 升级 Element Plus 到 2.8.x` |
| `perf` | 性能优化 | `perf(images): 添加图片懒加载` |
| `test` | 测试相关 | `test(auth): 添加登录接口测试` |

### 1.3 提交示例
```bash
# ✅ 正确
feat(posts): 添加文章全文搜索功能

- 支持标题和内容搜索
- 使用 MySQL LIKE 查询
- 搜索结果分页展示

# ❌ 错误
fix bug
update code
```

### 1.4 分支命名规范
| 分支 | 用途 | 命名格式 |
|------|------|---------|
| `main` | 主分支，生产环境 | `main` |
| `develop` | 开发分支 | `develop` |
| 功能分支 | 开发新功能 | `feat/post-search` |
| 修复分支 | 修复 bug | `fix/login-error` |
| 发布分支 | 发布准备 | `release/v1.0.0` |

---

## 2. 代码注释规范

### 2.1 文件头注释
```javascript
/**
 * 文件名：posts.js
 * 描述：文章相关路由处理
 * 创建时间：2026-07-01
 */
```

### 2.2 函数注释
```javascript
/**
 * 获取分页文章列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码，从1开始
 * @param {number} params.pageSize - 每页数量
 * @param {string} [params.categoryId] - 分类ID（可选）
 * @param {string} [params.status] - 文章状态（可选）
 * @returns {Promise<{list: Array, pagination: Object}>} 文章列表和分页信息
 */
async function getPosts(params) {
  // ...
}
```

### 2.3 复杂逻辑注释
```javascript
// 1. 验证用户权限
// 2. 检查文章状态是否为已发布
// 3. 增加阅读计数
// 4. 返回文章详情
```

### 2.4 注释规范
- **必须注释**：复杂的业务逻辑、算法、正则表达式
- **可选注释**：简单的属性声明、显而易见的功能
- **禁止注释**：过时的、误导性的注释
- **TODO 格式**：`// TODO: 添加缓存支持`
- **FIXME 格式**：`// FIXME: 边界情况未处理`

---

## 3. 命名规范

### 3.1 大小写规范
| 场景 | 规范 | 示例 |
|------|------|------|
| 组件名 | PascalCase | `PostCard.vue` |
| 函数/方法 | camelCase | `getPosts()` |
| 变量 | camelCase | `postList` |
| 常量 | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| 数据库字段 | snake_case | `created_at` |
| CSS class | kebab-case | `.post-card` |
| 文件名（Vue） | PascalCase | `PostCard.vue` |
| 文件名（JS） | kebab-case | `error-handler.js` |

### 3.2 命名原则
- 使用有意义的英文单词，禁止拼音
- 避免缩写（除非是通用缩写：`id`、`url`、`http`）
- 布尔变量使用 `is`/`has`/`can` 前缀：`isPublished`、`hasPermission`
- 事件回调使用 `on` 前缀：`onClick`、`onSubmit`
- 数组/列表使用复数：`posts`、`tags`

---

## 4. 错误处理规范

### 4.1 错误处理原则
- 所有异步操作必须使用 try/catch
- 错误信息要有意义，便于问题定位
- 前端向后端发请求必须处理网络错误和业务错误

### 4.2 统一错误码
| 错误码 | 说明 |
|:------:|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或 Token 过期 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 413 | 上传文件过大 |
| 422 | 请求数据验证失败 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

---

## 5. 日志规范

### 5.1 日志级别
| 级别 | 用途 | 示例 |
|:----:|------|------|
| ERROR | 系统错误，需要人工介入 | 数据库连接失败 |
| WARN | 警告，不影响运行 | 请求参数异常 |
| INFO | 重要操作记录 | 用户登录、文章发布 |
| DEBUG | 调试信息 | 函数调用参数 |

### 5.2 日志格式
```
[时间戳] [级别] [模块] 消息 - 详细信息
示例: [2026-07-01 16:00:00] [INFO] [auth] 用户登录成功 - userId: 1, ip: 183.6.122.45
```

---

## 6. 安全性规范

### 6.1 通用安全规则
- 所有用户输入必须验证和过滤
- 不在前端暴露敏感信息（密码、Token、密钥）
- 使用 HTTPS（生产环境）
- 设置合理的 CORS 策略
- 请求和响应中移除敏感字段

### 6.2 XSS 防护
```javascript
// 前端：输出 HTML 时使用 v-html 需谨慎
// 后端：评论内容存库前转义 HTML 标签
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
```

### 6.3 CSRF 防护
- 使用 SameSite Cookie 属性
- 关键操作（删除、修改）二次确认
- API 使用 POST/DELETE 而非 GET 进行写操作

---

## 7. 性能规范

### 7.1 前端性能
- 图片使用懒加载
- 非首屏组件异步加载
- 避免不必要的重渲染
- 合理使用 computed 缓存
- 大数据列表使用虚拟滚动

### 7.2 后端性能
- 数据库查询加索引
- 避免 N+1 查询
- 合理使用连表查询
- 批量操作使用事务
- 频繁访问的数据加缓存

---

## 8. 环境与配置

### 8.1 环境区分
| 环境 | 用途 | 配置 |
|------|------|------|
| development | 本地开发 | 本地数据库，调试日志 |
| staging | 测试环境 | 测试数据库，信息日志 |
| production | 生产环境 | 生产数据库，错误日志 |

### 8.2 配置文件
- 敏感配置通过环境变量注入
- 默认值提供开发环境本地配置
- 配置文件不包含任何真实密码/密钥

---

## 9. 依赖管理

### 9.1 依赖规范
- 固定依赖版本，避免自动升级导致的不兼容
- 定期更新依赖以修复安全漏洞
- 移除未使用的依赖
- 开发依赖和运行依赖分开（`devDependencies` vs `dependencies`）

### 9.2 package.json 规范
```json
{
  "name": "blog-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "开发命令",
    "build": "构建命令",
    "start": "启动命令"
  }
}
```

---

## 10. 文档规范

### 10.1 代码即文档
- 代码应该自解释，好的命名比注释更重要
- 复杂的逻辑才需要注释解释
- README 包含项目启动和部署说明

### 10.2 文档维护
- 修改代码同时更新相关文档
- 重大变更更新 CHANGELOG
- API 变更更新接口文档

---

## 11. 设计模式与最佳实践

### 11.1 推荐使用的模式
- **组合模式**（Composition）：Vue 3 Composition API
- **中间件模式**（Middleware）：Koa 中间件链
- **仓库模式**（Repository）：Service 层封装数据操作
- **观察者模式**（Observer）：Pinia store/watch

### 11.2 避免使用的模式
- ❌ 全局状态滥用（能局部状态就不用全局）
- ❌ 过度继承（优先组合而非继承）
- ❌ 上帝对象（一个对象承担过多职责）

---

## 12. 禁止事项总结

- ❌ 禁止提交包含敏感信息的代码（密码、Key、Token）
- ❌ 禁止提交过大的二进制文件（> 100MB）
- ❌ 禁止在代码中使用 `console.log` 调试输出（用正式日志替代）
- ❌ 禁止直接修改 `main` 分支（通过 PR 合并）
- ❌ 禁止在提交信息中使用无意义的描述
- ❌ 禁止提交未完成的、有编译错误的代码
- ❌ 禁止在前端直接操作数据库
- ❌ 禁止在后端直接返回原始错误堆栈
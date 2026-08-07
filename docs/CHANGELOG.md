# 变更日志

> 本文档记录博客平台项目的所有重要变更。
> 格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)。

---

## [v1.0] - 2026-07-01

### 🎉 初始版本
项目立项，完成产品需求文档（PRD）确认。

### ✅ 已确认功能

#### 核心功能（MVP）
- [x] 文章发布与管理（md-editor-v3 Markdown编辑器）
- [x] 文章分类与标签
- [x] 文章搜索（全文搜索）
- [x] 游客评论（记录IP + User-Agent）
- [x] 评论审核管理
- [x] 用户注册/登录（JWT）
- [x] 用户角色（管理员 + 普通用户）
- [x] 文件上传与管理（10G限制，按时间分组）
- [x] 首页实时信息（时间/访问时长/IP定位）
- [x] 后台管理框架

#### 增强功能（P1）
- [x] 文章点赞/收藏（游客隐藏）
- [x] 数据统计（当前在线、月访问）
- [x] 暗黑模式（跟随系统 + 手动切换 + 持久化）
- [x] 社交分享（卡片形式 + 动态 OG 标签）
- [x] RSS订阅

#### 扩展功能（后续迭代）
- [ ] 多语言支持（中/英文）
- [ ] SSG静态生成（Nuxt 3）
- [ ] Docker容器化部署
- [ ] CI/CD流水线（GitHub Actions）

### 🛠 技术栈确认
| 层级 | 技术选型 |
|------|---------|
| 前端框架 | Vue 3 + Nuxt 3 |
| 构建工具 | Vite |
| UI库 | Element Plus |
| CSS预处理器 | Sass/SCSS |
| Markdown编辑器 | md-editor-v3 |
| 状态管理 | Pinia |
| 后端框架 | Node.js + Koa2 |
| 数据库 | MySQL 8 |
| ORM | Sequelize |
| 鉴权方式 | JWT |
| API风格 | RESTful |
| 部署方式 | Docker + 自建服务器 |
| CI/CD | GitHub Actions |

---

## 变更记录格式

### 版本号命名规则
- **v主版本.次版本.修订号**
- 主版本：重大重构或不兼容的API变更
- 次版本：向下兼容的功能新增
- 修订号：向下兼容的问题修复

### 变更类型标记
- `🎉 Added` 新增功能
- `🔄 Changed` 功能变更
- `📌 Deprecated` 即将废弃
- `🗑️ Removed` 功能移除
- `🐛 Fixed` 问题修复
- `🔒 Security` 安全更新

const Router = require('koa-router')
const { Op } = require('sequelize')
const { Post, Category, Tag, User, Comment } = require('../models/_associations')
const { success, fail, successWithPagination } = require('../utils/response')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')

const router = new Router({ prefix: '/api' })

// ============================================
// 公开接口
// ============================================

// 获取文章列表
router.get('/posts', async (ctx) => {
  const { page = 1, pageSize = 10, categoryId, tagId, keyword } = ctx.query
  const offset = (page - 1) * pageSize

  const where = { status: 'published' }
  if (categoryId) where.category_id = categoryId
  if (keyword) {
    where[Op.or] = [
      { title: { [Op.like]: `%${keyword}%` } },
      { content: { [Op.like]: `%${keyword}%` } }
    ]
  }

  const { count, rows } = await Post.findAndCountAll({
    where,
    include: [
      { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
      { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
      { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }
    ],
    order: [['published_at', 'DESC']],
    limit: Number(pageSize),
    offset: Number(offset),
    attributes: { exclude: ['content'] }
  })

  ctx.body = successWithPagination(rows, {
    page: Number(page),
    pageSize: Number(pageSize),
    total: count
  })
})

// 搜索文章
router.get('/posts/search', async (ctx) => {
  const { q, page = 1, pageSize = 10 } = ctx.query

  if (!q) {
    ctx.body = fail('请输入搜索关键词')
    return
  }

  const offset = (page - 1) * pageSize
  const where = {
    status: 'published',
    [Op.or]: [
      { title: { [Op.like]: `%${q}%` } },
      { content: { [Op.like]: `%${q}%` } }
    ]
  }

  const { count, rows } = await Post.findAndCountAll({
    where,
    include: [
      { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
      { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } }
    ],
    order: [['published_at', 'DESC']],
    limit: Number(pageSize),
    offset: Number(offset),
    attributes: { exclude: ['content'] }
  })

  ctx.body = successWithPagination(rows, {
    page: Number(page),
    pageSize: Number(pageSize),
    total: count,
    keyword: q
  })
})

// 获取文章详情
router.get('/posts/:id', async (ctx) => {
  const post = await Post.findByPk(ctx.params.id, {
    include: [
      { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
      { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
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

// 获取文章归档
router.get('/archive', async (ctx) => {
  const posts = await Post.findAll({
    where: { status: 'published' },
    attributes: ['id', 'title', 'published_at'],
    order: [['published_at', 'DESC']]
  })

  // 按年月分组
  const archive = {}
  posts.forEach(post => {
    const year = post.published_at.getFullYear()
    const month = post.published_at.getMonth() + 1
    const key = `${year}-${String(month).padStart(2, '0')}`
    if (!archive[key]) archive[key] = []
    archive[key].push({
      id: post.id,
      title: post.title,
      date: post.published_at
    })
  })

  ctx.body = success(archive)
})

// ============================================
// 管理员接口
// ============================================

// 获取所有文章（含草稿）
router.get('/admin/posts', authMiddleware(), adminMiddleware, async (ctx) => {
  const { page = 1, pageSize = 20, status } = ctx.query
  const offset = (page - 1) * pageSize

  const where = {}
  if (status) where.status = status

  const { count, rows } = await Post.findAndCountAll({
    where,
    include: [
      { model: Category, as: 'category', attributes: ['id', 'name'] },
      { model: User, as: 'author', attributes: ['id', 'username'] }
    ],
    order: [['created_at', 'DESC']],
    limit: Number(pageSize),
    offset: Number(offset)
  })

  ctx.body = successWithPagination(rows, {
    page: Number(page),
    pageSize: Number(pageSize),
    total: count
  })
})

// 创建文章
router.post('/admin/posts', authMiddleware(), adminMiddleware, async (ctx) => {
  const { title, content, summary, coverImage, categoryId, tags, status } = ctx.request.body

  if (!title || !content) {
    ctx.body = fail('标题和内容不能为空')
    return
  }

  const post = await Post.create({
    title,
    content,
    summary: summary || content.substring(0, 200),
    cover_image: coverImage,
    category_id: categoryId || null,
    author_id: ctx.state.user.id,
    status: status || 'draft',
    published_at: status === 'published' ? new Date() : null
  })

  // 关联标签
  if (tags && tags.length > 0) {
    const tagInstances = await Tag.findAll({ where: { id: tags } })
    await post.setTags(tagInstances)
  }

  ctx.body = success(post, '创建成功')
})

// 更新文章
router.put('/admin/posts/:id', authMiddleware(), adminMiddleware, async (ctx) => {
  const post = await Post.findByPk(ctx.params.id)

  if (!post) {
    ctx.body = fail('文章不存在', 404)
    return
  }

  const { title, content, summary, coverImage, categoryId, tags, status } = ctx.request.body

  const updateData = {}
  if (title !== undefined) updateData.title = title
  if (content !== undefined) updateData.content = content
  if (summary !== undefined) updateData.summary = summary
  if (coverImage !== undefined) updateData.cover_image = coverImage
  if (categoryId !== undefined) updateData.category_id = categoryId
  if (status !== undefined) {
    updateData.status = status
    if (status === 'published' && !post.published_at) {
      updateData.published_at = new Date()
    }
  }

  await post.update(updateData)

  // 更新标签
  if (tags !== undefined) {
    const tagInstances = await Tag.findAll({ where: { id: tags } })
    await post.setTags(tagInstances)
  }

  ctx.body = success(post, '更新成功')
})

// 删除文章
router.delete('/admin/posts/:id', authMiddleware(), adminMiddleware, async (ctx) => {
  const post = await Post.findByPk(ctx.params.id)

  if (!post) {
    ctx.body = fail('文章不存在', 404)
    return
  }

  await post.destroy()
  ctx.body = success(null, '删除成功')
})

module.exports = router

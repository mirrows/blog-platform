const Router = require('koa-router')
const { Category, Post } = require('../models/_associations')
const { success, fail } = require('../utils/response')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')
const sequelize = require('../config/database')
const xss = require('xss')

const router = new Router({ prefix: '/api' })

// 获取所有分类（公开）
router.get('/categories', async (ctx) => {
  const categories = await Category.findAll({
    order: [['sort_order', 'ASC'], ['name', 'ASC']],
    attributes: {
      include: [
        [sequelize.literal(`(
          SELECT COUNT(*) FROM posts
          WHERE posts.category_id = Category.id
          AND posts.status = 'published'
        )`), 'post_count']
      ]
    }
  })

  ctx.body = success(categories)
})

// 管理员：获取所有分类
router.get('/admin/categories', authMiddleware(), adminMiddleware, async (ctx) => {
  const categories = await Category.findAll({
    order: [['sort_order', 'ASC']],
    attributes: {
      include: [
        [sequelize.literal(`(
          SELECT COUNT(*) FROM posts
          WHERE posts.category_id = Category.id
        )`), 'post_count']
      ]
    }
  })

  ctx.body = success(categories)
})

// 管理员：创建分类
router.post('/admin/categories', authMiddleware(), adminMiddleware, async (ctx) => {
  const { name, slug, description, sortOrder } = ctx.request.body

  if (!name || !slug) {
    ctx.body = fail('分类名称和别名不能为空')
    return
  }

  const existing = await Category.findOne({
    where: {
      [require('sequelize').Op.or]: [{ name }, { slug }]
    }
  })

  if (existing) {
    ctx.body = fail(existing.name === name ? '分类名称已存在' : '分类别名已存在')
    return
  }

  const category = await Category.create({
    name: xss(name),
    slug: xss(slug),
    description: xss(description),
    sort_order: sortOrder || 0
  })

  ctx.body = success(category, '创建成功')
})

// 管理员：更新分类
router.put('/admin/categories/:id', authMiddleware(), adminMiddleware, async (ctx) => {
  const category = await Category.findByPk(ctx.params.id)

  if (!category) {
    ctx.body = fail('分类不存在', 404)
    return
  }

  const { name, slug, description, sortOrder } = ctx.request.body
  const updateData = {}
  if (name !== undefined) updateData.name = xss(name)
  if (slug !== undefined) updateData.slug = xss(slug)
  if (description !== undefined) updateData.description = xss(description)
  if (sortOrder !== undefined) updateData.sort_order = sortOrder

  await category.update(updateData)
  ctx.body = success(category, '更新成功')
})

// 管理员：删除分类
router.delete('/admin/categories/:id', authMiddleware(), adminMiddleware, async (ctx) => {
  const category = await Category.findByPk(ctx.params.id)

  if (!category) {
    ctx.body = fail('分类不存在', 404)
    return
  }

  // 检查是否有文章使用此分类
  const postCount = await Post.count({ where: { category_id: category.id } })
  if (postCount > 0) {
    ctx.body = fail(`该分类下有 ${postCount} 篇文章，无法删除`)
    return
  }

  await category.destroy()
  ctx.body = success(null, '删除成功')
})

module.exports = router

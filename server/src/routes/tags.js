const Router = require('koa-router')
const { Tag, Post } = require('../models/_associations')
const { success, fail } = require('../utils/response')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')

const router = new Router({ prefix: '/api' })

// 获取所有标签（公开）
router.get('/tags', async (ctx) => {
  const tags = await Tag.findAll({
    order: [['name', 'ASC']],
    include: [{
      model: Post,
      as: 'posts',
      attributes: [],
      where: { status: 'published' },
      required: false
    }]
  })

  const result = tags.map(tag => ({
    ...tag.toJSON(),
    post_count: tag.posts?.length || 0
  }))

  ctx.body = success(result)
})

// 管理员：获取所有标签
router.get('/admin/tags', authMiddleware(), adminMiddleware, async (ctx) => {
  const tags = await Tag.findAll({
    order: [['name', 'ASC']],
    include: [{
      model: Post,
      as: 'posts',
      attributes: [],
      required: false
    }]
  })

  const result = tags.map(tag => ({
    ...tag.toJSON(),
    post_count: tag.posts?.length || 0
  }))

  ctx.body = success(result)
})

// 管理员：创建标签
router.post('/admin/tags', authMiddleware(), adminMiddleware, async (ctx) => {
  const { name, slug } = ctx.request.body

  if (!name || !slug) {
    ctx.body = fail('标签名称和别名不能为空')
    return
  }

  const existing = await Tag.findOne({
    where: {
      [require('sequelize').Op.or]: [{ name }, { slug }]
    }
  })

  if (existing) {
    ctx.body = fail(existing.name === name ? '标签名称已存在' : '标签别名已存在')
    return
  }

  const tag = await Tag.create({ name, slug })
  ctx.body = success(tag, '创建成功')
})

// 管理员：删除标签
router.delete('/admin/tags/:id', authMiddleware(), adminMiddleware, async (ctx) => {
  const tag = await Tag.findByPk(ctx.params.id)

  if (!tag) {
    ctx.body = fail('标签不存在', 404)
    return
  }

  await tag.destroy()
  ctx.body = success(null, '删除成功')
})

module.exports = router

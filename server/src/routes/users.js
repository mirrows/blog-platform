const Router = require('koa-router')
const { User, Post } = require('../models/_associations')
const { success, fail, successWithPagination } = require('../utils/response')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')

const router = new Router({ prefix: '/api/admin' })

// 获取用户列表
router.get('/users', authMiddleware(), adminMiddleware, async (ctx) => {
  const { page = 1, pageSize = 20 } = ctx.query
  const offset = (page - 1) * pageSize

  const { count, rows } = await User.findAndCountAll({
    attributes: { exclude: ['password'] },
    order: [['created_at', 'DESC']],
    limit: Number(pageSize),
    offset: Number(offset)
  })

  // 获取每个用户的文章数
  const result = await Promise.all(rows.map(async (user) => {
    const postCount = await Post.count({ where: { author_id: user.id } })
    return {
      ...user.toJSON(),
      post_count: postCount
    }
  }))

  ctx.body = successWithPagination(result, {
    page: Number(page),
    pageSize: Number(pageSize),
    total: count
  })
})

// 更新用户状态（禁用/启用）
router.put('/users/:id/status', authMiddleware(), adminMiddleware, async (ctx) => {
  const { status } = ctx.request.body

  if (!['active', 'disabled'].includes(status)) {
    ctx.body = fail('无效的状态值')
    return
  }

  const user = await User.findByPk(ctx.params.id)

  if (!user) {
    ctx.body = fail('用户不存在', 404)
    return
  }

  if (user.role === 'admin') {
    ctx.body = fail('不能修改管理员的状态')
    return
  }

  await user.update({ status })
  ctx.body = success(null, '更新成功')
})

module.exports = router

const Router = require('koa-router')
const { Favorite, Post } = require('../models/_associations')
const { success, fail, successWithPagination } = require('../utils/response')
const { authMiddleware } = require('../middleware/auth')

const router = new Router({ prefix: '/api' })

// 收藏/取消收藏（需登录）
router.post('/posts/:id/favorite', authMiddleware(), async (ctx) => {
  const postId = ctx.params.id
  const userId = ctx.state.user.id

  const post = await Post.findByPk(postId)
  if (!post) {
    ctx.body = fail('文章不存在', 404)
    return
  }

  const existing = await Favorite.findOne({
    where: { post_id: postId, user_id: userId }
  })

  if (existing) {
    await existing.destroy()
    await post.decrement('favorite_count')
    ctx.body = success({ favorited: false }, '已取消收藏')
  } else {
    await Favorite.create({ post_id: postId, user_id: userId })
    await post.increment('favorite_count')
    ctx.body = success({ favorited: true }, '收藏成功')
  }
})

// 获取我的收藏列表
router.get('/favorites', authMiddleware(), async (ctx) => {
  const { page = 1, pageSize = 10 } = ctx.query
  const offset = (page - 1) * pageSize
  const userId = ctx.state.user.id

  const { count, rows } = await Favorite.findAndCountAll({
    where: { user_id: userId },
    include: [{
      model: Post,
      as: 'post',
      include: ['category', 'tags', 'author']
    }],
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

// 检查用户是否已收藏某文章
router.get('/posts/:id/favorite/status', authMiddleware(false), async (ctx) => {
  const postId = ctx.params.id

  if (!ctx.state.user) {
    ctx.body = success({ favorited: false })
    return
  }

  const fav = await Favorite.findOne({
    where: { post_id: postId, user_id: ctx.state.user.id }
  })

  ctx.body = success({ favorited: !!fav })
})

module.exports = router

const Router = require('koa-router')
const { Like, Post } = require('../models/_associations')
const { success, fail } = require('../utils/response')
const { authMiddleware } = require('../middleware/auth')

const router = new Router({ prefix: '/api' })

// 点赞/取消点赞（需登录）
router.post('/posts/:id/like', authMiddleware(), async (ctx) => {
  const postId = ctx.params.id
  const userId = ctx.state.user.id

  // 检查文章是否存在
  const post = await Post.findByPk(postId)
  if (!post) {
    ctx.body = fail('文章不存在', 404)
    return
  }

  // 检查是否已点赞
  const existingLike = await Like.findOne({
    where: { post_id: postId, user_id: userId }
  })

  if (existingLike) {
    // 取消点赞
    await existingLike.destroy()
    await post.decrement('like_count')
    ctx.body = success({ liked: false }, '已取消点赞')
  } else {
    // 点赞
    await Like.create({ post_id: postId, user_id: userId })
    await post.increment('like_count')
    ctx.body = success({ liked: true }, '点赞成功')
  }
})

// 检查用户是否已点赞某文章
router.get('/posts/:id/like/status', authMiddleware(false), async (ctx) => {
  const postId = ctx.params.id

  if (!ctx.state.user) {
    ctx.body = success({ liked: false })
    return
  }

  const like = await Like.findOne({
    where: { post_id: postId, user_id: ctx.state.user.id }
  })

  ctx.body = success({ liked: !!like })
})

module.exports = router

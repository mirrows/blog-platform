const Router = require('koa-router')
const { Comment, Post, User, Setting } = require('../models/_associations')
const { success, fail, successWithPagination } = require('../utils/response')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')
const { getClientIp } = require('../utils/ipLocation')
const xss = require('xss')

const router = new Router({ prefix: '/api' })

// 获取文章评论列表（公开）
router.get('/comments', async (ctx) => {
  const { postId, page = 1, pageSize = 20 } = ctx.query

  if (!postId) {
    ctx.body = fail('缺少文章ID')
    return
  }

  const offset = (page - 1) * pageSize

  const { count, rows } = await Comment.findAndCountAll({
    where: {
      post_id: postId,
      status: 'approved',
      parent_id: null // 只获取顶级评论
    },
    include: [
      {
        model: Comment,
        as: 'replies',
        where: { status: 'approved' },
        required: false,
        include: [
          { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }
        ]
      },
      { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }
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

// 发表评论（公开，游客可评，但已登录用户会记录用户信息）
router.post('/comments', authMiddleware(false), async (ctx) => {
  const { postId, content, nickname, parentId } = ctx.request.body

  if (!postId || !content) {
    ctx.body = fail('文章ID和评论内容不能为空')
    return
  }

  // 检查文章是否存在
  const post = await Post.findByPk(postId)
  if (!post) {
    ctx.body = fail('文章不存在', 404)
    return
  }

  const ip = getClientIp(ctx)
  const userAgent = ctx.headers['user-agent'] || ''

  // 如果已登录用户传入了昵称，且与当前用户昵称不一致，更新用户昵称
  let updatedUser = null
  if (ctx.state.user && nickname && nickname !== ctx.state.user.nickname) {
    await User.update({ nickname: xss(nickname) }, { where: { id: ctx.state.user.id } })
    updatedUser = await User.findByPk(ctx.state.user.id)
  }

  // 从全局设置中读取 autoApprove 配置
  const setting = await Setting.findOne({ where: { key: 'autoApprove' } })
  const autoApprove = setting ? setting.value === 'true' : true

  const comment = await Comment.create({
    content: xss(content),
    nickname: xss(ctx.state.user ? (nickname || ctx.state.user.nickname || ctx.state.user.username) : (nickname || '匿名游客')),
    ip_address: ip,
    user_agent: userAgent,
    post_id: postId,
    user_id: ctx.state.user?.id || null,
    parent_id: parentId || null,
    status: autoApprove ? 'approved' : 'pending'
  })

  // 更新文章评论数
  await post.increment('comment_count')

  ctx.body = success({
    comment,
    user: updatedUser ? updatedUser.toPublicJSON() : null
  }, autoApprove ? '评论发表成功' : '评论发表成功，等待审核')
})

// ============================================
// 管理员接口
// ============================================

// 获取所有评论（管理员）
router.get('/admin/comments', authMiddleware(), adminMiddleware, async (ctx) => {
  const { page = 1, pageSize = 20, status, postId } = ctx.query
  const offset = (page - 1) * pageSize

  const where = {}
  if (status) where.status = status
  if (postId) where.post_id = postId

  const { count, rows } = await Comment.findAndCountAll({
    where,
    include: [
      { model: Post, as: 'post', attributes: ['id', 'title'] },
      { model: User, as: 'user', attributes: ['id', 'username'] }
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

// 审核评论
router.put('/admin/comments/:id/status', authMiddleware(), adminMiddleware, async (ctx) => {
  const { status } = ctx.request.body

  if (!['approved', 'rejected'].includes(status)) {
    ctx.body = fail('状态值无效')
    return
  }

  const comment = await Comment.findByPk(ctx.params.id)
  if (!comment) {
    ctx.body = fail('评论不存在', 404)
    return
  }

  await comment.update({ status })
  ctx.body = success(comment, '审核完成')
})

// 删除评论
router.delete('/admin/comments/:id', authMiddleware(), adminMiddleware, async (ctx) => {
  const comment = await Comment.findByPk(ctx.params.id)
  if (!comment) {
    ctx.body = fail('评论不存在', 404)
    return
  }

  await comment.destroy()
  ctx.body = success(null, '删除成功')
})

module.exports = router

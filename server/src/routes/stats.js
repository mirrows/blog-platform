const Router = require('koa-router')
const { Op } = require('sequelize')
const { VisitLog, Post } = require('../models/_associations')
const { success } = require('../utils/response')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')

const router = new Router({ prefix: '/api' })

// 获取概览统计数据（公开）
router.get('/stats/overview', async (ctx) => {
  const now = new Date()

  // 计算当天开始时间
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  // 计算本月开始时间
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  // 5分钟前
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

  // 当前在线人数：最近5分钟有请求的唯一IP
  const onlineCount = await VisitLog.count({
    where: {
      created_at: { [Op.gte]: fiveMinutesAgo }
    },
    distinct: true,
    col: 'ip_address'
  })

  // 今日访问量
  const todayVisits = await VisitLog.count({
    where: {
      created_at: { [Op.gte]: todayStart }
    }
  })

  // 本月访问量
  const monthVisits = await VisitLog.count({
    where: {
      created_at: { [Op.gte]: monthStart }
    }
  })

  // 总访问量
  const totalVisits = await VisitLog.count()

  // 文章总数
  const totalPosts = await Post.count()
  const publishedPosts = await Post.count({ where: { status: 'published' } })

  ctx.body = success({
    online_count: onlineCount,
    today_visits: todayVisits,
    month_visits: monthVisits,
    total_visits: totalVisits,
    total_posts: totalPosts,
    published_posts: publishedPosts
  })
})

// 获取详细统计数据（管理员）
router.get('/admin/stats', authMiddleware(), adminMiddleware, async (ctx) => {
  const now = new Date()
  const { User, Comment } = require('../models/_associations')

  // 计算本月开始时间
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  // 5分钟前
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

  // 当前在线人数
  const onlineUsers = await VisitLog.count({
    where: { created_at: { [Op.gte]: fiveMinutesAgo } },
    distinct: true,
    col: 'ip_address'
  })

  // 月访问量
  const monthlyVisits = await VisitLog.count({
    where: { created_at: { [Op.gte]: monthStart } }
  })

  // 文章统计
  const totalPosts = await Post.count()
  const publishedPosts = await Post.count({ where: { status: 'published' } })
  const draftPosts = await Post.count({ where: { status: 'draft' } })
  const archivedPosts = await Post.count({ where: { status: 'archived' } })

  // 评论统计
  const totalComments = await Comment.count()
  const approvedComments = await Comment.count({ where: { status: 'approved' } })
  const pendingComments = await Comment.count({ where: { status: 'pending' } })
  const rejectedComments = await Comment.count({ where: { status: 'rejected' } })

  // 用户统计
  const totalUsers = await User.count()

  // 总阅读量
  const totalViews = await Post.sum('view_count')

  // 过去30天每天访问量
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const dailyVisits = await VisitLog.findAll({
    attributes: [
      [require('sequelize').fn('DATE', require('sequelize').col('created_at')), 'date'],
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
    ],
    where: {
      created_at: { [Op.gte]: thirtyDaysAgo }
    },
    group: [require('sequelize').fn('DATE', require('sequelize').col('created_at'))],
    order: [[require('sequelize').fn('DATE', require('sequelize').col('created_at')), 'ASC']]
  })

  // 热门文章 TOP 10
  const topPosts = await Post.findAll({
    where: { status: 'published' },
    order: [['view_count', 'DESC']],
    limit: 10,
    attributes: ['id', 'title', 'view_count', 'like_count', 'comment_count']
  })

  ctx.body = success({
    posts: totalPosts,
    comments: totalComments,
    users: totalUsers,
    views: totalViews || 0,
    onlineUsers,
    monthlyVisits,
    publishedPosts,
    draftPosts,
    archivedPosts,
    approvedComments,
    pendingComments,
    rejectedComments,
    daily_visits: dailyVisits,
    top_posts: topPosts
  })
})

// 记录访问日志（前端调用）
router.post('/stats/visit', async (ctx) => {
  const { pageUrl } = ctx.request.body
  const ip = ctx.headers['x-forwarded-for'] || ctx.ip || ''
  const userAgent = ctx.headers['user-agent'] || ''
  const now = new Date()

  try {
    await VisitLog.create({
      ip_address: ip.replace(/::ffff:/, '').split(',')[0].trim(),
      page_url: pageUrl || '/',
      user_agent: userAgent,
      visit_date: now.toISOString().split('T')[0]
    })
  } catch (err) {
    // 日志记录失败不影响用户体验
  }

  ctx.body = success(null)
})

module.exports = router

const Router = require('koa-router')
const router = new Router()

// 加载所有路由模块
const routes = [
  require('./auth'),
  require('./posts'),
  require('./categories'),
  require('./tags'),
  require('./comments'),
  require('./likes'),
  require('./favorites'),
  require('./stats'),
  require('./files'),
  require('./rss')
]

// 注册所有路由
routes.forEach(r => {
  router.use(r.routes(), r.allowedMethods())
})

// IP 定位接口
router.get('/api/ip', async (ctx) => {
  const { getClientIp, getIpLocation } = require('../utils/ipLocation')
  const ip = getClientIp(ctx)
  const location = getIpLocation(ip)

  ctx.body = {
    code: 200,
    message: 'success',
    data: {
      ip,
      location: location.fullLocation
    }
  }
})

module.exports = router

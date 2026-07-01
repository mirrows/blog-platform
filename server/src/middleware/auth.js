/**
 * JWT 鉴权中间件
 * 支持两种模式：
 * 1. required: true - 必须登录（默认）
 * 2. required: false - 可选登录，解析Token但不强制
 */
const jwt = require('jsonwebtoken')
const config = require('../config')

function authMiddleware(required = true) {
  return async (ctx, next) => {
    const token = ctx.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      if (required) {
        ctx.status = 401
        ctx.body = { code: 401, message: '请先登录' }
        return
      }
      ctx.state.user = null
      await next()
      return
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret)
      ctx.state.user = decoded
      await next()
    } catch (err) {
      if (required) {
        ctx.status = 401
        ctx.body = { code: 401, message: 'Token 无效或已过期' }
        return
      }
      ctx.state.user = null
      await next()
    }
  }
}

/**
 * 管理员权限中间件
 */
async function adminMiddleware(ctx, next) {
  if (!ctx.state.user || ctx.state.user.role !== 'admin') {
    ctx.status = 403
    ctx.body = { code: 403, message: '无权限访问' }
    return
  }
  await next()
}

module.exports = { authMiddleware, adminMiddleware }

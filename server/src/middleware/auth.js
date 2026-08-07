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

    // 只验证 token，不捕获 next() 的错误
    let decoded
    try {
      decoded = jwt.verify(token, config.jwt.secret)
    } catch (err) {
      if (required) {
        ctx.status = 401
        ctx.body = { code: 401, message: 'Token 无效或已过期' }
        return
      }
      ctx.state.user = null
      await next()
      return
    }

    ctx.state.user = decoded
    // next() 中的错误会继续向上传播到 errorHandler，不会被误判为 401
    await next()
  }
}

/**
 * 管理员权限中间件
 */
async function adminMiddleware(ctx, next) {
  console.log('[adminMiddleware] 进入中间件');
  console.log('[adminMiddleware] ctx.state.user:', ctx.state.user);
  console.log('[adminMiddleware] ctx.state.user.role:', ctx.state.user?.role);
  console.log('[adminMiddleware] 请求路径:', ctx.path);
  if (!ctx.state.user || ctx.state.user.role !== 'admin') {
    ctx.status = 403
    ctx.body = { code: 403, message: '无权限访问' }
    return
  }
  await next()
}

module.exports = { authMiddleware, adminMiddleware }

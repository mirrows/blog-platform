/**
 * 简易速率限制中间件（内存实现）
 * 注意：生产环境建议使用 Redis 实现分布式限流
 */
const clients = new Map()

const rateLimiter = async (ctx, next) => {
  const ip = ctx.ip || ctx.connection.remoteAddress
  const now = Date.now()
  const windowMs = 60 * 1000 // 1分钟
  const maxRequests = 100 // 最多100次/分钟

  const client = clients.get(ip) || { count: 0, resetTime: now + windowMs }

  if (now > client.resetTime) {
    client.count = 0
    client.resetTime = now + windowMs
  }

  client.count++

  if (client.count > maxRequests) {
    ctx.status = 429
    ctx.body = { code: 429, message: '请求过于频繁，请稍后再试' }
    return
  }

  clients.set(ip, client)
  await next()
}

module.exports = rateLimiter

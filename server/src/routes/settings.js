const Router = require('koa-router')
const { Setting } = require('../models/_associations')
const { success, fail } = require('../utils/response')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')

const router = new Router({ prefix: '/api' })

// 获取全局设置（公开，任何人可读）
router.get('/settings', async (ctx) => {
  const { key } = ctx.query
  const where = key ? { key } : {}

  const settings = await Setting.findAll({ where })
  const result = {}
  settings.forEach(s => {
    try {
      result[s.key] = JSON.parse(s.value)
    } catch {
      result[s.key] = s.value
    }
  })

  // 如果指定了单个 key，直接返回该值
  if (key && result.hasOwnProperty(key)) {
    ctx.body = success({ [key]: result[key] })
    return
  }

  ctx.body = success(result)
})

// 获取所有全局设置（管理员）
router.get('/admin/settings', authMiddleware(), adminMiddleware, async (ctx) => {
  const { key } = ctx.query
  const where = key ? { key } : {}
  const settings = await Setting.findAll()
  const result = {}
  settings.forEach(s => {
    // 尝试解析 JSON 值，否则保持字符串
    try {
      result[s.key] = JSON.parse(s.value)
    } catch {
      result[s.key] = s.value
    }
  })
  ctx.body = success(result)
})

// 更新全局设置（管理员）
router.put('/admin/settings', authMiddleware(), adminMiddleware, async (ctx) => {
  const settings = ctx.request.body

  if (!settings || typeof settings !== 'object') {
    ctx.body = fail('参数无效')
    return
  }

  for (const [key, value] of Object.entries(settings)) {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
    await Setting.upsert({
      key,
      value: stringValue
    })
  }

  ctx.body = success(null, '设置更新成功')
})

module.exports = router

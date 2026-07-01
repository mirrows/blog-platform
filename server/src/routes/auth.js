const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const config = require('../config')
const { User } = require('../models/_associations')
const { success, fail } = require('../utils/response')
const { authMiddleware } = require('../middleware/auth')

const router = new Router({ prefix: '/api/auth' })

// 用户注册
router.post('/register', async (ctx) => {
  const { username, email, password } = ctx.request.body

  if (!username || !email || !password) {
    ctx.body = fail('用户名、邮箱和密码不能为空')
    return
  }

  // 检查用户名或邮箱是否已存在
  const existingUser = await User.findOne({
    where: {
      [require('sequelize').Op.or]: [
        { username },
        { email }
      ]
    }
  })

  if (existingUser) {
    ctx.body = fail(existingUser.username === username ? '用户名已存在' : '邮箱已被注册')
    return
  }

  const user = await User.create({
    username,
    email,
    password,
    role: 'user',
    status: 'active'
  })

  ctx.body = success(user.toPublicJSON(), '注册成功')
})

// 用户登录
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body

  if (!username || !password) {
    ctx.body = fail('用户名和密码不能为空')
    return
  }

  const user = await User.findOne({
    where: {
      [require('sequelize').Op.or]: [
        { username },
        { email: username }
      ]
    }
  })

  if (!user) {
    ctx.body = fail('用户不存在', 404)
    return
  }

  if (user.status === 'disabled') {
    ctx.body = fail('账号已被禁用，请联系管理员')
    return
  }

  const isValid = await user.validatePassword(password)
  if (!isValid) {
    ctx.body = fail('密码错误')
    return
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  )

  ctx.body = success({
    token,
    user: user.toPublicJSON()
  }, '登录成功')
})

// 获取当前用户信息
router.get('/me', authMiddleware(), async (ctx) => {
  const user = await User.findByPk(ctx.state.user.id)

  if (!user) {
    ctx.body = fail('用户不存在', 404)
    return
  }

  ctx.body = success(user.toPublicJSON())
})

// 用户登出（前端清除 Token，后端无需操作）
router.post('/logout', async (ctx) => {
  ctx.body = success(null, '已登出')
})

module.exports = router

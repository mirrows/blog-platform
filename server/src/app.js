const Koa = require('koa')
const cors = require('koa-cors')
const helmet = require('koa-helmet')
const { koaBody } = require('koa-body')
const mount = require('koa-mount');
const static = require('koa-static')
const path = require('path')

const app = new Koa()
const config = require('./config')
const errorHandler = require('./middleware/errorHandler')
const rateLimiter = require('./middleware/rateLimiter')

// ============================================
// 中间件注册（顺序重要）
// ============================================

// 1. 安全头
app.use(helmet())

// 2. 全局错误处理
app.use(errorHandler)

// 3. 跨域
app.use(cors({
  origin: config.domain.frontend,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}))

// 4. 请求体解析（支持文件上传）
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: config.upload.maxFileSize,
    uploadDir: path.join(__dirname, '../uploads'),
    keepExtensions: true
  },
  jsonLimit: '10mb',
  textLimit: '10mb'
}))

// 5. 速率限制
app.use(rateLimiter)

// // 6. 静态文件服务（上传文件访问）
// app.use(static(path.join(__dirname, '../uploads'), {
//   maxage: 30 * 24 * 60 * 60 * 1000, // 30天缓存
//   gzip: true
// }))
// 6. 静态文件服务（上传文件访问）
app.use(mount('/uploads', static(path.join(__dirname, '../uploads'), {
  maxage: 30 * 24 * 60 * 60 * 1000, // 30天缓存
  gzip: true,
  // 重点：设置响应头
  setHeaders: (res, path, stats) => {
    // 1. 彻底解决 NotSameOrigin 报错（允许任何来源读取）
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    // 2. 加上 CORS 头（允许跨域）
    res.setHeader('Access-Control-Allow-Origin', '*');

    // 3. 如果图片经常变动，可以禁用浏览器缓存（选填）
    // res.setHeader('Cache-Control', 'no-cache');
  }
})))

// 7. 路由
const router = require('./routes/_index')
app.use(router.routes())
app.use(router.allowedMethods())

// ============================================
// 数据库同步与启动
// ============================================
const sequelize = require('./config/database')

// 加载模型关联
require('./models/_associations')

const PORT = config.port

async function start() {
  try {
    // 同步数据库（开发环境 force: false，生产环境必须 false）
    await sequelize.sync({ force: false })
    console.log('数据库同步完成')

    app.listen(PORT, () => {
      console.log(`服务器启动成功: http://localhost:${PORT}`)
      console.log(`前端地址: ${config.domain.frontend}`)
      console.log(`API地址: ${config.domain.backend}`)
    })
  } catch (err) {
    console.error('启动失败:', err.message)
    process.exit(1)
  }
}

start()

module.exports = app

/**
 * 全局错误处理中间件
 */

async function errorHandler(ctx, next) {
  try {
    await next()
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error:`, err.message)

    // Sequelize 验证错误
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      ctx.status = 422
      ctx.body = {
        code: 422,
        message: '数据验证失败',
        errors: err.errors?.map(e => ({
          field: e.path,
          message: e.message
        }))
      }
      return
    }

    // Sequelize 外键约束错误
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '关联数据不存在'
      }
      return
    }

    // JWT 错误
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: 'Token 无效或已过期'
      }
      return
    }

    // 自定义错误
    ctx.status = err.status || 500
    ctx.body = {
      code: err.status || 500,
      message: err.message || '服务器内部错误'
    }
  }
}

module.exports = errorHandler

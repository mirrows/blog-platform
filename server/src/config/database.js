const { Sequelize } = require('sequelize')
const config = require('./index')

const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    logging: false,
    timezone: config.database.timezone,
    define: {
      timestamps: true,
      underscored: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
)

// 测试数据库连接
async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('数据库连接成功')
  } catch (error) {
    console.error('数据库连接失败:', error.message)
  }
}

testConnection()

module.exports = sequelize

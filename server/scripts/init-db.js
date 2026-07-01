const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

async function initDatabase() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root123'
  }

  let connection

  try {
    // 连接 MySQL（不指定数据库，启用多语句执行）
    connection = await mysql.createConnection({
      ...config,
      multipleStatements: true
    })
    console.log('✅ 连接 MySQL 成功')

    // 读取 SQL 文件
    const sqlPath = path.join(__dirname, '..', 'init-db.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // 执行 SQL（支持多语句，保留注释）
    await connection.query(sql)
    console.log('✅ 数据库和表结构创建成功')

    console.log('\n🎉 数据库初始化完成！')
    console.log('默认管理员账号：admin / admin123')

  } catch (error) {
    console.error('❌ 初始化失败:', error.message)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

initDatabase()

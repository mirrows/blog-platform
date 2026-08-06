const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

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

    // 检查是否需要创建或更新默认管理员账号
    const [adminUsers] = await connection.query('SELECT * FROM users WHERE username = ?', [
      process.env.ADMIN_USERNAME || 'admin'
    ])

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'

    if (adminUsers.length === 0) {
      // 管理员不存在，创建默认管理员
      await connection.query(
        'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
        [
          adminUsername,
          adminEmail,
          hashedPassword,
          'admin',
          1
        ]
      )
      console.log('✅ 默认管理员账号创建成功')
      console.log(`   用户名：${adminUsername}`)
      console.log(`   密码：${process.env.ADMIN_PASSWORD || 'admin123'}`)
    } else {
      // 管理员已存在，更新密码和状态以确保账号可用
      await connection.query(
        'UPDATE users SET password = ?, email = ?, status = 1 WHERE username = ?',
        [hashedPassword, adminEmail, adminUsername]
      )
      console.log('✅ 管理员账号已存在，密码和状态已更新')
      console.log(`   用户名：${adminUsername}`)
      console.log(`   密码：${process.env.ADMIN_PASSWORD || 'admin123'}`)
    }

    console.log('\n🎉 数据库初始化完成！')

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

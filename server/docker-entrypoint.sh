#!/bin/sh
set -e

echo "============================================"
echo "  Blog Platform - Server Entrypoint"
echo "============================================"

# 等待 MySQL 就绪
echo "⏳ 等待 MySQL 就绪..."
until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
  sleep 2
done
echo "✅ MySQL 已就绪"

# 运行数据库初始化脚本（建表 + 管理员密码）
echo "⏳ 初始化数据库..."
node /app/scripts/init-db.js
echo "✅ 数据库初始化完成"

# 启动应用
echo "🚀 启动 Node.js 服务..."
exec node /app/src/app.js

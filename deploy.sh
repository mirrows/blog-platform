#!/bin/bash
set -e

echo "============================================"
echo "  Blog Platform - Docker 一键部署脚本"
echo "============================================"
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "[错误] 未检测到 Docker，请先安装 Docker"
    echo "安装指南: https://docs.docker.com/get-docker/"
    exit 1
fi
echo "[✓] Docker 已安装"
echo ""

# 检查 .env 文件（不存在则从模板复制）
if [ ! -f .env ]; then
    echo "[信息] 未检测到 .env 文件，正在从 .env.example 复制..."
    cp .env.example .env
    echo "[✓] 已创建 .env 文件，请根据需要修改配置"
    echo ""
else
    echo "[✓] .env 文件已存在"
    echo ""
fi

# 检查 SSL 目录（如未配置则创建占位目录）
if [ ! -d ssl ]; then
    mkdir -p ssl 2>/dev/null
    echo "[信息] 已创建 ssl/ 目录，如需 HTTPS 请放置证书文件"
    echo ""
fi

# 给 entrypoint 脚本添加执行权限
chmod +x server/docker-entrypoint.sh 2>/dev/null || true

echo "============================================"
echo "  开始构建并启动服务..."
echo "============================================"
echo ""

# 启动所有服务
docker compose up -d --build

echo ""
echo "============================================"
echo "  [✓] 部署成功！"
echo "============================================"
echo ""
echo "  访问地址:"
echo "  前端页面: http://localhost"
echo "  后台管理: http://localhost/admin/login"
echo "  API 接口: http://localhost:3000/api"
echo ""
echo "  默认管理员账号:"
echo "  用户名: admin"
echo "  密码: admin123"
echo ""
echo "  提示: 如需修改配置，请编辑 .env 文件后重新运行本脚本"
echo ""

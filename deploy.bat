@echo off
chcp 65001 >nul
title Blog Platform - 一键部署脚本

echo ============================================
echo   Blog Platform - Docker 一键部署
echo ============================================
echo.

REM 检查 Docker 是否安装
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Docker，请先安装 Docker Desktop
    echo 下载地址: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo [✓] Docker 已安装
echo.

REM 检查 .env 文件（不存在则从模板复制）
if not exist .env (
    echo [信息] 未检测到 .env 文件，正在从 .env.example 复制...
    copy .env.example .env >nul
    echo [✓] 已创建 .env 文件，请根据需要修改配置
    echo.
) else (
    echo [✓] .env 文件已存在
    echo.
)

REM 检查 SSL 目录（如未配置则创建占位目录）
if not exist ssl (
    mkdir ssl >nul 2>&1
    echo [信息] 已创建 ssl/ 目录，如需 HTTPS 请放置证书文件
    echo.
)

REM 检查 client/node_modules 不存在时提示
if not exist client\node_modules (
    echo [信息] 前端依赖未安装，构建过程会自动安装（可能较慢）
    echo.
)

echo ============================================
echo  开始构建并启动服务...
echo ============================================
echo.

REM 启动所有服务
docker compose up -d --build

if %errorlevel% neq 0 (
    echo [错误] 部署失败，请检查上方错误信息
    pause
    exit /b 1
)

echo.
echo ============================================
echo  [✓] 部署成功！
echo ============================================
echo.
echo  访问地址:
echo  前端页面: http://localhost
echo  后台管理: http://localhost/admin/login
echo  API 接口: http://localhost:3000/api
echo.
echo  默认管理员账号:
echo  用户名: admin
echo  密码: admin123
echo.
echo  提示: 如需修改配置，请编辑 .env 文件后重新运行本脚本
echo.
pause

FROM node:20-alpine

WORKDIR /app

# 安装网络工具（用于等待 MySQL 就绪）
RUN apk add --no-cache netcat-openbsd

# 安装依赖
COPY package*.json ./
RUN npm install --production --registry=https://registry.npmmirror.com

# 复制源码
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY init-db.sql ./

# 创建上传目录
RUN mkdir -p src/uploads

# 复制并设置 entrypoint 脚本
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/stats/overview || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]

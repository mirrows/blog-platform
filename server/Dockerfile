FROM node:20-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install --production --registry=https://registry.npmmirror.com

# 复制源码
COPY src/ ./src/

# 创建上传目录
RUN mkdir -p src/uploads

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/stats/overview || exit 1

CMD ["node", "src/app.js"]

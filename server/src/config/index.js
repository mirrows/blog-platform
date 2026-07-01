require('dotenv').config()

const config = {
  port: process.env.PORT || 3001,

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'blog',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    dialect: 'mysql',
    timezone: '+08:00'
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-jwt-secret-key',
    expiresIn: '7d'
  },

  // 域名预留
  domain: {
    frontend: process.env.FRONTEND_DOMAIN || 'http://localhost:3000',
    backend: process.env.BACKEND_DOMAIN || 'http://localhost:3001'
  },

  upload: {
    maxStorageSize: 10 * 1024 * 1024 * 1024, // 10GB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    maxFileSize: 5 * 1024 * 1024, // 5MB per file
    dir: 'uploads'
  }
}

module.exports = config

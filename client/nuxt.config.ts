// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // SSG 模式
  ssr: false,

  // Modules
  modules: [
    '@pinia/nuxt',
    '@element-plus/nuxt'
  ],

  // CSS 全局引入
  css: [
    '~/assets/styles/global.scss',
    'element-plus/dist/index.css',
  ],

  // Vite 配置
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/variables.scss" as *;\n',
        },
      },
    },
  },

  // 运行时配置
  runtimeConfig: {
    public: {
      apiBase: `${process.env.API_BASE_URL || 'http://localhost:3001'}/api`,
      backend: process.env.API_BASE_URL || 'http://localhost:3001',
    },
  },

  // 应用配置
  app: {
    head: {
      title: '我的博客',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '分享生活，记录思考' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  // 构建配置
  build: {
    transpile: ['element-plus', 'md-editor-v3'],
  },

  compatibilityDate: '2025-04-01',
})

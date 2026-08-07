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
    optimizeDeps: {
      include: [
        'md-editor-v3',
        '@lucide/vue',  // 强制预构建图标库，合并所有图标到一个 chunk
        '@element-plus/icons-vue',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'dayjs',
        'dayjs/plugin/*.js',
        'lodash-unified',
        'markdown-it',
        'md-editor-v3',
        '@lezer/common',
        '@lezer/lr',
        '@lezer/markdown',
        '@lezer/highlight',
        '@element-plus/icons-vue',
        '@lezer/common',
        '@lezer/highlight',
        '@lezer/lr',
        '@lezer/markdown',
        'xss', // CJS
        'html2canvas',
      ]
    },
  },

  // 运行时配置
  runtimeConfig: {
    public: {
      apiBase: `${process.env.API_BASE_URL || 'http://localhost:3001'}/api`,
      backend: process.env.API_BASE_URL || 'http://localhost:3001',
      frontend: process.env.FRONTEND_DOMAIN || 'http://localhost:3000',
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
        // Open Graph 标签
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: '我的博客' },
        { property: 'og:description', content: '分享生活，记录思考' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:url', content: 'https://your-domain.com' },
        { property: 'og:site_name', content: '我的博客' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '我的博客' },
        { name: 'twitter:description', content: '分享生活，记录思考' },
        { name: 'twitter:image', content: '/og-image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'RSS 订阅', href: '/api/rss' },
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
          defer: true,
        },
      ],
    },
  },

  // 构建配置
  build: {
    transpile: ['element-plus', 'md-editor-v3'],
  },
  compatibilityDate: '2025-04-01',
  // components: {
  //   dirs: []
  // }
})

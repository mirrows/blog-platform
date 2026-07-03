# 前端技术栈说明 - AI 技能定义

> 本文档定义项目的**前端技术栈详情**，供 AI 了解项目的技术生态、版本、关键 API 和最佳实践。

---

## 1. 核心技术栈

| 技术 | 版本 | 用途 | 关键文档 |
|------|:----:|------|---------|
| Nuxt 3 | 3.x | 前端框架（SSG模式） | https://nuxt.com/docs |
| Vue 3 | 3.x | UI框架 | https://vuejs.org/ |
| Vite | 5.x | 构建工具 | https://vitejs.dev/ |
| Element Plus | 2.x | UI组件库 | https://element-plus.org/ |
| Pinia | 2.x | 状态管理 | https://pinia.vuejs.org/ |
| md-editor-v3 | 4.x | Markdown编辑器 | https://imzbf.github.io/md-editor-v3/ |
| Sass/SCSS | - | CSS预处理器 | https://sass-lang.com/ |
| vue-i18n | 9.x | 国际化 | https://vue-i18n.intlify.dev/ |

---

## 2. Nuxt 3 配置要点

### 2.1 项目初始化
```bash
npx nuxi@latest init client
cd client
npm install element-plus @element-plus/icons-vue
npm install pinia @pinia/nuxt
npm install md-editor-v3
npm install sass
npm install @vueuse/core
```

### 2.2 nuxt.config.ts 配置
```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // SSG 模式
  ssr: false,
  target: 'static',
  
  // 模块
  modules: [
    '@pinia/nuxt',
    '@element-plus/nuxt',
  ],
  
  // CSS 全局引入
  css: [
    '~/assets/styles/global.scss',
    '~/assets/styles/variables.scss',
  ],

  // Vite 配置
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/variables.scss" as *;'
        }
      }
    }
  },
  
  // 运行时配置（公共）
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000/api'
    }
  }
})
```

### 2.3 Nuxt 3 关键特性
```typescript
// 自动导入：components/ 和 composables/ 下的文件自动导入
// 约定式路由：pages/ 目录结构自动生成路由

// 数据获取
const { data, error } = await useFetch('/api/posts')

// 运行时配置
const config = useRuntimeConfig()
console.log(config.public.apiBase)

// 状态管理
const counter = useState('counter', () => Math.round(Math.random() * 1000))
```

---

## 3. Element Plus 使用指南

### 3.1 安装与配置
```bash
npm install element-plus @element-plus/icons-vue
```

### 3.2 常用组件
```vue
<template>
  <!-- 按钮 -->
  <el-button type="primary">主要按钮</el-button>
  <el-button :icon="Plus">带图标</el-button>
  
  <!-- 表格 -->
  <el-table :data="tableData" border stripe>
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="date" label="日期" />
    <el-table-column label="操作" width="150">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  
  <!-- 表单 -->
  <el-form :model="form" :rules="rules" label-width="80px">
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </el-form-item>
  </el-form>
  
  <!-- 对话框 -->
  <el-dialog v-model="dialogVisible" title="提示" width="30%">
    <span>确认删除吗？</span>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="danger" @click="confirmDelete">确认</el-button>
    </template>
  </el-dialog>
  
  <!-- 消息提示 -->
  <el-button @click="ElMessage.success('操作成功')">成功提示</el-button>
  <el-button @click="ElMessage.warning('警告')">警告提示</el-button>
</template>
```

---

## 4. md-editor-v3 使用指南

### 4.1 安装
```bash
npm install md-editor-v3
```

### 4.2 基础用法
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const text = ref('# Hello World')
const handleSave = (value: string) => {
  console.log('保存内容:', value)
}
</script>

<template>
  <MdEditor 
    v-model="text"
    :toolbars="['bold', 'italic', 'heading', '|', 'quote', 'code', '|', 'preview']"
    theme="light"
    @onSave="handleSave"
  />
</template>
```

### 4.3 上传图片
```vue
<script setup lang="ts">
const onUploadImg = async (files: FileList, callback: (urls: string[]) => void) => {
  const formData = new FormData()
  formData.append('file', files[0])
  
  const { data } = await useFetch('/api/admin/files/upload', {
    method: 'POST',
    body: formData
  })
  
  callback([data.value.data.url])
}
</script>
```

---

## 5. Pinia 状态管理

```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref('')
  
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  console.log(5666, isLoggedIn)
  async function login(username: string, password: string) {
    const { data } = await useFetch('/api/auth/login', {
      method: 'POST',
      body: { username, password }
    })
    token.value = data.value.data.token
    user.value = data.value.data.user
  }
  
  function logout() {
    token.value = ''
    user.value = null
  }
  
  return { user, token, isLoggedIn, isAdmin, login, logout }
})
```

---

## 6. 样式主题（暗黑模式）

```scss
// assets/styles/variables.scss
// 浅色模式
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f7fa;
  --text-primary: #303133;
  --text-secondary: #909399;
  --border-color: #dcdfe6;
  --accent-color: #409eff;
}

// 暗黑模式
[data-theme="dark"] {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --border-color: #2c3e50;
  --accent-color: #66b1ff;
}
```

---

## 7. 国际化配置

```typescript
// plugins/i18n.ts
import { createI18n } from 'vue-i18n'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'zh-CN',
    messages: {
      'zh-CN': {
        home: { welcome: '欢迎来到我的博客' },
        common: { login: '登录', register: '注册' }
      },
      'en': {
        home: { welcome: 'Welcome to my blog' },
        common: { login: 'Login', register: 'Register' }
      }
    }
  })
  
  vueApp.use(i18n)
})
```

---

## 8. 开发与构建命令

```json
{
  "scripts": {
    "dev": "nuxt dev",           // 开发模式
    "build": "nuxt build",       // 构建（SSG生成静态文件）
    "generate": "nuxt generate", // 预渲染静态页面
    "preview": "nuxt preview",   // 预览构建结果
    "lint": "eslint .",          // 代码检查
    "typecheck": "nuxt typecheck" // TypeScript 类型检查
  }
}
```

---

## 9. 环境变量

```env
# .env
API_BASE_URL=http://localhost:3000/api
```

---

## 10. 关键依赖版本锁定

```json
{
  "dependencies": {
    "nuxt": "^3.10.0",
    "vue": "^3.4.0",
    "element-plus": "^2.8.0",
    "@element-plus/icons-vue": "^2.3.0",
    "@pinia/nuxt": "^0.5.0",
    "pinia": "^2.1.0",
    "md-editor-v3": "^4.0.0",
    "vue-i18n": "^9.9.0",
    "@vueuse/core": "^10.7.0"
  },
  "devDependencies": {
    "sass": "^1.69.0",
    "typescript": "^5.3.0"
  }
}

# 前端代码规范 - Vue 3 / Nuxt 3

> 本文档用于 AI 辅助开发时的前端代码标准参考。
> AI 在生成前端代码时，必须遵循以下规范。

---

## 1. 框架与语言规范

### 1.1 框架版本
- Vue 3.x（Composition API）
- Nuxt 3.x（SSG 模式，`ssr: false`，`target: 'static'`）
- 使用 `<script setup>` 语法糖
- TypeScript 可选，推荐使用 `.vue` 单文件组件

### 1.2 Composition API 规范
```vue
<script setup>
// ✅ 正确：使用 Composition API
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

const count = ref(0)
const doubled = computed(() => count.value * 2)

onMounted(() => {
  console.log('mounted')
})
</script>
```

### 1.3 禁用选项式 API
```vue
<script>
// ❌ 错误：禁用选项式 API
export default {
  data() { return {} },
  methods: {}
}
</script>
```

---

## 2. 项目结构规范

### 2.1 目录约定
```
pages/      # Nuxt 自动路由，文件名即路径
components/ # 公共组件，使用自动导入（Nuxt 3 特性）
composables/ # 组合式函数，使用 useXxx 命名
locales/    # 多语言 JSON 文件
assets/     # 样式/图片等静态资源
public/     # 公共静态文件
```

### 2.2 文件命名规范
- **页面文件**：小写 + 连字符，如 `post-detail.vue`
- **组件文件**：大驼峰（PascalCase），如 `PostCard.vue`
- **组合式函数**：小驼峰，`use` 前缀，如 `useAuth.ts`
- **样式文件**：小写 + 连字符，如 `global.scss`

---

## 3. 组件编写规范

### 3.1 组件结构
```vue
<template>
  <!-- 模板区域 -->
</template>

<script setup lang="ts">
// 逻辑区域
</script>

<style scoped lang="scss">
// 样式区域（必须使用 scoped）
</style>
```

### 3.2 Props 定义
```vue
<script setup lang="ts">
// ✅ 正确：使用 defineProps 定义
interface Props {
  title: string
  content?: string  // 可选属性
  count: number
}

const props = defineProps<Props>()
</script>
```

### 3.3 Emits 定义
```vue
<script setup lang="ts">
// ✅ 正确：使用 defineEmits 定义
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'click': [event: MouseEvent]
}>()
</script>
```

### 3.4 组件命名
- 公共组件放在 `components/` 目录，Nuxt 3 自动全局注册
- 页面级别组件放在 `pages/` 目录
- 组件名使用多个单词，避免与 HTML 元素冲突

---

## 4. Element Plus 规范

### 4.1 组件使用
```vue
<template>
  <!-- ✅ 正确：使用 Element Plus 组件 -->
  <el-button type="primary" @click="handleClick">
    确认
  </el-button>
  
  <el-table :data="tableData" border>
    <el-table-column prop="name" label="名称" />
  </el-table>
</template>
```

### 4.2 图标使用
```vue
<script setup lang="ts">
// ✅ 正确：按需导入 Element Plus 图标
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
</script>

<template>
  <el-button :icon="Plus">添加</el-button>
</template>
```

### 4.3 表单验证
```vue
<template>
  <el-form ref="formRef" :model="form" :rules="rules">
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
const formRef = ref()
const form = reactive({
  email: ''
})
const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const submit = async () => {
  await formRef.value.validate()
  // 验证通过后的逻辑
}
</script>
```

---

## 5. 样式规范

### 5.1 预处理器
- 使用 Sass/SCSS
- 全局变量定义在 `assets/styles/variables.scss`
- 组件内样式使用 `<style scoped lang="scss">`

### 5.2 命名规范（BEM 变体）
```scss
// ✅ 正确：使用语义化的 class 命名
.post-card { }
.post-card__title { }
.post-card--featured { }
```

### 5.3 变量使用
```scss
// ✅ 正确：使用 CSS 变量（支持暗黑模式切换）
:root {
  --bg-primary: #ffffff;
  --text-primary: #303133;
}

[data-theme="dark"] {
  --bg-primary: #1a1a2e;
  --text-primary: #e0e0e0;
}
```

### 5.4 响应式设计
```scss
// 断点规范
$breakpoints: (
  'mobile': 320px,
  'tablet': 768px,
  'desktop': 1024px
);

// ✅ 正确：使用移动端优先的媒体查询
.card {
  width: 100%;
  
  @media (min-width: 768px) {
    width: 50%;
  }
  
  @media (min-width: 1024px) {
    width: 33.33%;
  }
}
```

---

## 6. 状态管理规范

### 6.1 Pinia Store
```typescript
// ✅ 正确：使用 Pinia 定义 store
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref('')
  
  const isLoggedIn = computed(() => !!token.value)
  
  const login = async (credentials) => {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
    token.value = res.data.token
    user.value = res.data.user
  }
  
  return { user, token, isLoggedIn, login }
})
```

### 6.2 Store 命名
- `useXxxStore` 格式，如 `useAuthStore`、`usePostStore`

---

## 7. API 请求规范

### 7.1 使用 Nuxt $fetch
```typescript
// ✅ 正确：使用 Nuxt 的 $fetch
const { data, error } = await useFetch('/api/posts')

// 带参数的 POST 请求
const { data } = await useFetch('/api/auth/login', {
  method: 'POST',
  body: { username, password }
})
```

### 7.2 错误处理
```typescript
try {
  const { data } = await useFetch('/api/posts')
  if (error.value) {
    ElMessage.error('获取文章列表失败')
    return
  }
  // 处理数据
} catch (err) {
  ElMessage.error('网络错误')
}
```

---

## 8. 国际化规范

### 8.1 文案使用
```vue
<template>
  <!-- ✅ 正确：使用国际化函数 -->
  <p>{{ $t('home.welcome') }}</p>
</template>
```

### 8.2 语言文件
```json
// locales/zh-CN.json
{
  "home": {
    "welcome": "欢迎来到我的博客",
    "subtitle": "记录生活，分享思考"
  },
  "common": {
    "login": "登录",
    "register": "注册",
    "logout": "登出"
  }
}
```

---

## 9. 性能优化规范

### 9.1 图片优化
```vue
<template>
  <!-- ✅ 正确：使用 Nuxt 图片组件或懒加载 -->
  <img 
    v-lazy="post.coverImage" 
    :alt="post.title"
    loading="lazy"
  />
</template>
```

### 9.2 组件异步加载
```typescript
// ✅ 正确：非首屏组件使用异步加载
defineAsyncComponent(() => import('~/components/ShareButtons.vue'))
```

---

## 10. 暗黑模式规范

```vue
<script setup lang="ts">
// ✅ 正确：使用 useTheme composable
const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <el-button @click="toggleTheme">
    {{ isDark ? '☀️' : '🌙' }}
  </el-button>
</template>
```

---

## 11. Git 提交规范

```
feat: 新功能
fix: 修复 bug
style: 样式修改
refactor: 重构
docs: 文档更新
chore: 构建/工具链
```

---

## 12. 禁止事项

- ❌ 禁止在组件内直接操作 DOM（使用 ref 替代）
- ❌ 禁止使用 `any` 类型（TypeScript 中）
- ❌ 禁止在模板中使用复杂的表达式（应提取到 computed）
- ❌ 禁止直接修改 props
- ❌ 禁止在非 `onUnmounted` 中不清除定时器/事件监听
- ❌ 禁止在路由组件外使用 `useRouter`/`useRoute`
<template>
  <header class="app-header">
    <div class="header-inner">
      <nuxt-link to="/" class="logo">
        <span class="logo-text">我的博客</span>
      </nuxt-link>

      <nav class="nav-links">
        <nuxt-link to="/" class="nav-link">首页</nuxt-link>
        <nuxt-link to="/archive" class="nav-link">归档</nuxt-link>
        <nuxt-link to="/about" class="nav-link">关于</nuxt-link>
      </nav>

      <div class="header-actions">
        <el-button text @click="toggleTheme">
          <el-icon><Moon /></el-icon>
        </el-button>

        <template v-if="auth.isLoggedIn.value">
          <el-dropdown>
            <el-button text>
              {{ auth.user.value?.username }}
              <el-icon><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="auth.isAdmin.value" @click="navigateTo('/admin')">
                  后台管理
                </el-dropdown-item>
                <el-dropdown-item @click="auth.logout()">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button size="small" @click="navigateTo('/login')">登录</el-button>
          <el-button size="small" type="primary" @click="navigateTo('/register')">注册</el-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Moon, ArrowDown } from '@element-plus/icons-vue'

const auth = useAuth()

const toggleTheme = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark')
  document.documentElement.classList.toggle('dark', !isDark)
}
</script>

<style scoped lang="scss">
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--header-bg);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-light);
  z-index: 1000;

  .header-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 20px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      background: linear-gradient(135deg, var(--accent-color), #67c23a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .nav-links {
    display: flex;
    gap: 24px;

    .nav-link {
      color: var(--text-secondary);
      font-size: 15px;
      font-weight: 500;
      transition: color 0.2s;

      &:hover, &.router-link-active {
        color: var(--accent-color);
      }
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none !important;
  }
}
</style>

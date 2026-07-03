<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h2>后台管理</h2>
      </div>
      <nav class="sidebar-nav">
        <nuxt-link to="/admin" class="nav-item">
          <el-icon><DataLine /></el-icon>
          <span>仪表盘</span>
        </nuxt-link>
        <nuxt-link to="/admin/posts" class="nav-item">
          <el-icon><Document /></el-icon>
          <span>文章管理</span>
        </nuxt-link>
        <nuxt-link to="/admin/categories" class="nav-item">
          <el-icon><Folder /></el-icon>
          <span>分类管理</span>
        </nuxt-link>
        <nuxt-link to="/admin/tags" class="nav-item">
          <el-icon><PriceTag /></el-icon>
          <span>标签管理</span>
        </nuxt-link>
        <nuxt-link to="/admin/comments" class="nav-item">
          <el-icon><ChatDotRound /></el-icon>
          <span>评论管理</span>
        </nuxt-link>
        <nuxt-link to="/admin/users" class="nav-item">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </nuxt-link>
        <nuxt-link to="/admin/files" class="nav-item">
          <el-icon><FolderOpened /></el-icon>
          <span>文件管理</span>
        </nuxt-link>
        <nuxt-link to="/admin/stats" class="nav-item">
          <el-icon><TrendCharts /></el-icon>
          <span>数据统计</span>
        </nuxt-link>
      </nav>
    </aside>

    <main class="admin-main">
      <div class="admin-header">
        <div class="header-left">
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="header-right">
          <el-button @click="goToHome">
            <el-icon><HomeFilled /></el-icon>
            返回前台
          </el-button>
          <el-button type="primary" @click="auth.logout()">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </div>

      <div class="admin-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const auth = useAuth()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/admin': '仪表盘',
    '/admin/posts': '文章管理',
    '/admin/categories': '分类管理',
    '/admin/tags': '标签管理',
    '/admin/comments': '评论管理',
    '/admin/users': '用户管理',
    '/admin/files': '文件管理',
    '/admin/stats': '数据统计'
  }
  return titles[route.path] || '后台管理'
})

const goToHome = () => {
  navigateTo('/')
}
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.admin-sidebar {
  width: 240px;
  background: #304156;
  color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  overflow-y: auto;

  .sidebar-header {
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .sidebar-nav {
    padding: 10px 0;

    .nav-item {
      display: flex;
      align-items: center;
      padding: 14px 20px;
      color: #bfcbd9;
      text-decoration: none;
      transition: all 0.3s;
      border-left: 3px solid transparent;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #fff;
      }

      &.router-link-active {
        background: rgba(64, 158, 255, 0.1);
        color: #409eff;
        border-left-color: #409eff;
      }

      .el-icon {
        margin-right: 10px;
        font-size: 18px;
      }

      span {
        font-size: 14px;
      }
    }
  }
}

.admin-main {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;

  .admin-header {
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    position: sticky;
    top: 0;
    z-index: 99;

    .header-left {
      h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        color: #303133;
      }
    }

    .header-right {
      display: flex;
      gap: 10px;
    }
  }

  .admin-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 60px;

    .sidebar-header h2 {
      display: none;
    }

    .sidebar-nav .nav-item {
      padding: 14px 10px;
      justify-content: center;

      span {
        display: none;
      }

      .el-icon {
        margin-right: 0;
      }
    }
  }

  .admin-main {
    margin-left: 60px;
  }
}
</style>

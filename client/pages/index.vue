<template>
  <div class="page-container">
    <!-- 实时信息栏 -->
    <div class="info-bar">
      <SiteInfo />
    </div>

    <!-- 文章列表 -->
    <div class="content-area">
      <div class="section-header">
        <h2 class="section-title">最新文章</h2>
        <div class="section-actions">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章..."
            clearable
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>

      <!-- 文章网格 -->
      <div v-else-if="posts.length > 0" class="post-grid">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <el-empty description="暂无文章" />
      </div>

      <!-- 分页 -->
      <div v-if="total > pageSize" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="loadPosts"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

const api = useApi()
const posts = ref<any[]>([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)
const searchKeyword = ref('')

const loadPosts = async () => {
  loading.value = true
  const res = await api.get('/posts', {
    page: currentPage.value,
    pageSize: pageSize.value,
  })
  if (res.code === 200 && res.data) {
    posts.value = res.data.list
    total.value = res.data.pagination.total
  }
  loading.value = false
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchKeyword.value.trim())}`)
  }
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped lang="scss">
.info-bar {
  margin-bottom: 24px;
}

.content-area {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .section-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .search-input {
      width: 280px;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 12px;

    .search-input {
      width: 100% !important;
    }
  }
}
</style>

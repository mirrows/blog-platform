<template>
  <div class="page-container">
    <div class="search-header">
      <h2>搜索结果</h2>
      <p v-if="keyword">关键词：<strong>{{ keyword }}</strong>，共找到 {{ total }} 篇文章</p>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>

    <div v-else-if="posts.length > 0" class="post-grid">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>

    <div v-else class="empty-state">
      <el-empty description="未找到相关文章" />
    </div>

    <div v-if="total > pageSize" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="loadResults"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const api = useApi()
const keyword = ref(route.query.q || '')
const posts = ref<any[]>([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const loadResults = async () => {
  loading.value = true
  const res = await api.get('/posts/search', {
    q: keyword.value,
    page: currentPage.value,
    pageSize: pageSize.value,
  })
  if (res.code === 200 && res.data) {
    posts.value = res.data.list
    total.value = res.data.pagination.total
  }
  loading.value = false
}

onMounted(loadResults)
</script>

<style scoped lang="scss">
.search-header {
  margin-bottom: 24px;
  h2 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
  p { color: var(--text-muted); }
}
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>

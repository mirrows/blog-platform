<template>
  <div class="page-container">
    <div class="favorites-page">
      <div class="page-header">
        <h2>我的收藏</h2>
      </div>

      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-else-if="favorites.length > 0" class="post-grid">
        <PostCard v-for="post in favorites" :key="post.id" :post="post" />
      </div>

      <div v-else class="empty-state">
        <el-empty description="暂无收藏的文章" />
      </div>

      <div v-if="total > pageSize" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="loadFavorites"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuth()
const api = useApi()
const likes = useLikes()

const favorites = ref<any[]>([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const loadFavorites = async () => {
  loading.value = true
  const res = await likes.getFavorites(currentPage.value, pageSize.value)
  if (res.code === 200 && res.data) {
    // 提取 post 数据，因为 API 返回的是 Favorite 记录，包含 post 关联
    favorites.value = res.data.list.map((item: any) => item.post || item)
    total.value = res.data.pagination.total
  }
  loading.value = false
}

onBeforeMount(() => {
  if (!auth.isLoggedIn.value) {
    navigateTo('/login')
  }
})

onMounted(() => {
  loadFavorites()
})
</script>

<style scoped lang="scss">
.favorites-page {
  padding: 20px 0;

  .page-header {
    margin-bottom: 24px;

    h2 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
}
</style>

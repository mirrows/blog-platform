<template>
  <div class="page-container">
    <h2 class="page-title">文章归档</h2>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <div v-else-if="Object.keys(archive).length > 0" class="archive-list">
      <div v-for="(posts, yearMonth) in archive" :key="yearMonth" class="archive-group">
        <h3 class="archive-month">{{ yearMonth }}</h3>
        <ul class="archive-posts">
          <li v-for="post in posts" :key="post.id" class="archive-item" @click="navigateTo(`/post/${post.id}`)">
            <span class="archive-date">{{ formatDate(post.date) }}</span>
            <span class="archive-title">{{ post.title }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="empty-state">
      <el-empty description="暂无文章" />
    </div>
  </div>
</template>

<script setup lang="ts">
const api = useApi()
const archive = ref<Record<string, any[]>>({})
const loading = ref(true)

const formatDate = (date: string) => {
  if (!date) return ''
  const d = new Date(date)
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onMounted(async () => {
  const res = await api.get('/archive')
  if (res.code === 200 && res.data) {
    archive.value = res.data
  }
  loading.value = false
})
</script>

<style scoped lang="scss">
.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
}

.archive-group {
  margin-bottom: 32px;

  .archive-month {
    font-size: 20px;
    font-weight: 600;
    color: var(--accent-color);
    padding-bottom: 12px;
    border-bottom: 2px solid var(--accent-color);
    margin-bottom: 16px;
  }

  .archive-posts {
    list-style: none;

    .archive-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 10px 0;
      cursor: pointer;
      border-bottom: 1px solid var(--border-light);
      transition: color 0.2s;

      &:hover {
        color: var(--accent-color);
      }

      .archive-date {
        color: var(--text-muted);
        font-size: 14px;
        min-width: 50px;
      }

      .archive-title {
        color: var(--text-primary);
        font-size: 15px;
      }
    }
  }
}
</style>

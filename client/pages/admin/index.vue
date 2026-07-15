<template>
  <div class="dashboard">
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon posts">
            <el-icon :size="30"><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.posts }}</div>
            <div class="stat-label">文章总数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon comments">
            <el-icon :size="30"><ChatDotRound /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.comments }}</div>
            <div class="stat-label">评论总数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon users">
            <el-icon :size="30"><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.users }}</div>
            <div class="stat-label">用户总数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon views">
            <el-icon :size="30"><View /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.views }}</div>
            <div class="stat-label">总阅读量</div>
          </div>
        </div>
      </el-card>
    </div>

    <div class="dashboard-content">
      <el-row :gutter="20">
        <el-col :xs="24" :lg="16">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>最新文章</span>
                <el-button type="primary" link @click="goToPosts">
                  查看全部
                </el-button>
              </div>
            </template>
            <el-table :data="recentPosts" style="width: 100%">
              <el-table-column prop="title" label="标题" min-width="200" />
              <el-table-column prop="author" label="作者" width="120" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'published' ? 'success' : 'info'">
                    {{ row.status === 'published' ? '已发布' : '草稿' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="viewCount" label="阅读量" width="100" />
              <el-table-column prop="createdAt" label="创建时间" width="180">
                <template #default="{ row }">
                  {{ formatDate(row.createdAt) }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :lg="8">
          <el-card>
            <template #header>
              <span>最新评论</span>
            </template>
            <div v-if="recentComments.length === 0" class="empty-state">
              <el-empty description="暂无评论" :image-size="80" />
            </div>
            <div v-else class="comment-list">
              <div v-for="comment in recentComments" :key="comment.id" class="comment-item">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.nickname || '匿名用户' }}</span>
                  <el-tag :type="comment.status === 'approved' ? 'success' : 'warning'" size="small">
                    {{ comment.status === 'approved' ? '已通过' : '待审核' }}
                  </el-tag>
                </div>
                <div class="comment-content">{{ comment.content.substring(0, 50) }}...</div>
                <div class="comment-time">{{ formatDate(comment.createdAt) }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const api = useApi()
const auth = useAuth()

const stats = ref({
  posts: 0,
  comments: 0,
  users: 0,
  views: 0
})

const recentPosts = ref([])
const recentComments = ref([])

onMounted(async () => {
  await loadStats()
  await loadRecentPosts()
  await loadRecentComments()
})

const loadStats = async () => {
  const res = await api.get('/admin/stats')
  if (res.code === 200) {
    stats.value = res.data
  }
}

const loadRecentPosts = async () => {
  const res = await api.get('/admin/posts', { page: 1, pageSize: 5 })
  if (res.code === 200) {
    recentPosts.value = res.data.list.map((post: any) => ({
      ...post,
      author: post.author?.username || '未知'
    }))
  }
}

const loadRecentComments = async () => {
  const res = await api.get('/admin/comments', { page: 1, pageSize: 5 })
  if (res.code === 200) {
    recentComments.value = res.data.list
  }
}

const goToPosts = () => navigateTo('/admin/posts')

const formatDate = (date: string | null | undefined) => {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
</script>

<style scoped lang="scss">
.dashboard {
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 20px;

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 20px;

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;

          &.posts {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          &.comments {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }

          &.users {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          }

          &.views {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          }
        }

        .stat-info {
          flex: 1;

          .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #303133;
            margin-bottom: 5px;
          }

          .stat-label {
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
  }

  .dashboard-content {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .comment-list {
      .comment-item {
        padding: 15px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .comment-author {
            font-weight: 500;
            color: #303133;
          }
        }

        .comment-content {
          font-size: 14px;
          color: #606266;
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .comment-time {
          font-size: 12px;
          color: #909399;
        }
      }
    }

    .empty-state {
      padding: 20px 0;
    }
  }
}
</style>

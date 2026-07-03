<template>
  <div class="stats-page">
    <div class="page-header">
      <h2>数据统计</h2>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon online">
              <el-icon :size="28"><Connection /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.onlineUsers }}</div>
              <div class="stat-label">当前在线</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon monthly">
              <el-icon :size="28"><DataAnalysis /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.monthlyVisits }}</div>
              <div class="stat-label">月访问量</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon posts">
              <el-icon :size="28"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalPosts }}</div>
              <div class="stat-label">文章总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon comments">
              <el-icon :size="28"><ChatDotRound /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalComments }}</div>
              <div class="stat-label">评论总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :lg="12">
        <el-card>
          <template #header>
            <span>文章状态分布</span>
          </template>
          <div class="chart-container">
            <div class="chart-placeholder">
              <el-progress
                type="dashboard"
                :percentage="postStats.publishedPercent"
                :color="colors.success"
                :width="120"
              >
                <template #default>
                  <span class="chart-value">{{ postStats.published }}</span>
                  <span class="chart-label">已发布</span>
                </template>
              </el-progress>
              <div class="chart-legend">
                <div class="legend-item">
                  <span class="dot success" />
                  <span>已发布：{{ postStats.published }}</span>
                </div>
                <div class="legend-item">
                  <span class="dot info" />
                  <span>草稿：{{ postStats.draft }}</span>
                </div>
                <div class="legend-item">
                  <span class="dot warning" />
                  <span>已归档：{{ postStats.archived }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card>
          <template #header>
            <span>评论状态分布</span>
          </template>
          <div class="chart-container">
            <div class="chart-placeholder">
              <el-progress
                type="dashboard"
                :percentage="commentStats.approvedPercent"
                :color="colors.success"
                :width="120"
              >
                <template #default>
                  <span class="chart-value">{{ commentStats.approved }}</span>
                  <span class="chart-label">已通过</span>
                </template>
              </el-progress>
              <div class="chart-legend">
                <div class="legend-item">
                  <span class="dot success" />
                  <span>已通过：{{ commentStats.approved }}</span>
                </div>
                <div class="legend-item">
                  <span class="dot warning" />
                  <span>待审核：{{ commentStats.pending }}</span>
                </div>
                <div class="legend-item">
                  <span class="dot danger" />
                  <span>已驳回：{{ commentStats.rejected }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
const api = useApi()

const colors = {
  success: '#67c23a',
  warning: '#e6a23c',
  danger: '#f56c6c',
  info: '#909399'
}

const stats = ref({
  onlineUsers: 0,
  monthlyVisits: 0,
  totalPosts: 0,
  totalComments: 0
})

const postStats = ref({
  published: 0,
  draft: 0,
  archived: 0,
  publishedPercent: 0
})

const commentStats = ref({
  approved: 0,
  pending: 0,
  rejected: 0,
  approvedPercent: 0
})

onMounted(async () => {
  await loadStats()
})

const loadStats = async () => {
  const res = await api.get('/admin/stats')
  if (res.code === 200) {
    const data = res.data
    stats.value = {
      onlineUsers: data.onlineUsers || 0,
      monthlyVisits: data.monthlyVisits || 0,
      totalPosts: data.posts || 0,
      totalComments: data.comments || 0
    }

    const totalPostCount = (data.publishedPosts || 0) + (data.draftPosts || 0) + (data.archivedPosts || 0)
    postStats.value = {
      published: data.publishedPosts || 0,
      draft: data.draftPosts || 0,
      archived: data.archivedPosts || 0,
      publishedPercent: totalPostCount > 0 ? Math.round((data.publishedPosts || 0) / totalPostCount * 100) : 0
    }

    const totalCommentCount = (data.approvedComments || 0) + (data.pendingComments || 0) + (data.rejectedComments || 0)
    commentStats.value = {
      approved: data.approvedComments || 0,
      pending: data.pendingComments || 0,
      rejected: data.rejectedComments || 0,
      approvedPercent: totalCommentCount > 0 ? Math.round((data.approvedComments || 0) / totalCommentCount * 100) : 0
    }
  }
}
</script>

<style scoped lang="scss">
.stats-page {
  .page-header {
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 500;
    }
  }

  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;
      gap: 15px;

      .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;

        &.online {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.monthly {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.posts {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &.comments {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }

      .stat-info {
        .stat-value {
          font-size: 24px;
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

  .chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;

    .chart-placeholder {
      text-align: center;

      .chart-value {
        display: block;
        font-size: 24px;
        font-weight: 700;
        color: #303133;
      }

      .chart-label {
        display: block;
        font-size: 12px;
        color: #909399;
        margin-top: 5px;
      }
    }

    .chart-legend {
      margin-top: 20px;
      text-align: left;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 14px;
        color: #606266;

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;

          &.success { background: #67c23a; }
          &.info { background: #909399; }
          &.warning { background: #e6a23c; }
          &.danger { background: #f56c6c; }
        }
      }
    }
  }
}
</style>

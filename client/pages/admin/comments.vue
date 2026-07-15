<template>
  <div class="comments-management">
    <div class="page-header">
      <h2>评论管理</h2>
      <el-checkbox v-model="autoApproved" label="默认通过" @change="handleAutoApprovedChange" />
    </div>

    <el-card>
      <div class="filter-bar">
        <el-select v-model="filterStatus" placeholder="评论状态" clearable style="width: 150px; margin-right: 10px" @change="loadComments">
          <el-option label="全部" value="" />
          <el-option label="待审核" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已驳回" value="rejected" />
        </el-select>
        <el-input
          v-model="searchKeyword"
          placeholder="搜索评论内容"
          style="width: 300px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <el-table :data="comments" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="content" label="评论内容" min-width="300" show-overflow-tooltip />
        <el-table-column prop="post" label="文章" width="200" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.post?.title || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ipAddress" label="IP地址" width="140" />
         <el-table-column prop="createdAt" label="评论时间" width="180">
           <template #default="{ row }">
             {{ formatDate(row.createdAt) }}
           </template>
         </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'pending' || row.status === 'rejected'"
              type="success"
              link
              @click="approveComment(row.id)"
            >
              <el-icon><Check /></el-icon>
              通过
            </el-button>
            <el-button
              v-if="row.status === 'pending' || row.status === 'approved'"
              type="warning"
              link
              @click="rejectComment(row.id)"
            >
              <el-icon><Close /></el-icon>
              驳回
            </el-button>
            <el-button type="danger" link @click="deleteComment(row.id)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @change="loadComments"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const api = useApi()

const comments = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const filterStatus = ref('')
const searchKeyword = ref('')

// 从后端读取"默认通过"设置，默认为 true
const autoApproved = ref(true)

onMounted(async () => {
  await loadAutoApproveSetting()
  loadComments()
})

const loadAutoApproveSetting = async () => {
  const res = await api.get('/admin/settings')
  if (res.code === 200 && res.data) {
    autoApproved.value = res.data.autoApprove !== false
  }
}

const handleAutoApprovedChange = async (val: boolean) => {
  try {
    const res = await api.put('/admin/settings', { autoApprove: val })
    if (res.code === 200) {
      ElMessage.success('设置已更新')
    }
  } catch (error) {
    ElMessage.error('更新设置失败')
  }
}

const loadComments = async () => {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    if (filterStatus.value) {
      params.status = filterStatus.value
    }

    const res = await api.get('/admin/comments', params)
    if (res.code === 200) {
      comments.value = res.data.list
      total.value = res.data.pagination.total
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadComments()
}

const approveComment = async (id: number) => {
  try {
    const res = await api.put(`/admin/comments/${id}/status`, { status: 'approved' })
    if (res.code === 200) {
      ElMessage.success('审核通过')
      loadComments()
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const rejectComment = async (id: number) => {
  try {
    const res = await api.put(`/admin/comments/${id}/status`, { status: 'rejected' })
    if (res.code === 200) {
      ElMessage.success('已驳回')
      loadComments()
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const deleteComment = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await api.delete(`/admin/comments/${id}`)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadComments()
    }
  } catch (error) {
    // 用户取消删除
  }
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    approved: 'success',
    pending: 'warning',
    rejected: 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    approved: '已通过',
    pending: '待审核',
    rejected: '已驳回'
  }
  return texts[status] || status
}

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
.comments-management {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 500;
    }
  }

  .filter-bar {
    display: flex;
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

<template>
  <div class="posts-management">
    <div class="page-header">
      <h2>文章管理</h2>
      <el-button type="primary" @click="goToCreatePost">
        <el-icon><Plus /></el-icon>
        新建文章
      </el-button>
    </div>

    <el-card>
      <div class="filter-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索文章标题"
          style="width: 300px; margin-right: 10px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="文章状态" clearable style="width: 150px" @change="loadPosts">
          <el-option label="全部" value="" />
          <el-option label="已发布" value="published" />
          <el-option label="草稿" value="draft" />
          <el-option label="已归档" value="archived" />
        </el-select>
      </div>

      <el-table :data="posts" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            {{ row.category?.name || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="120">
          <template #default="{ row }">
            {{ row.author?.username || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="阅读量" width="100" />
         <el-table-column prop="publishedAt" label="发布时间" width="180">
           <template #default="{ row }">
             {{ formatDate(row.publishedAt) }}
           </template>
         </el-table-column>
         <el-table-column prop="createdAt" label="创建时间" width="180">
           <template #default="{ row }">
             {{ formatDate(row.createdAt) }}
           </template>
         </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="editPost(row.id)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button
              v-if="row.status === 'draft'"
              type="success"
              link
              @click="publishPost(row.id)"
            >
              <el-icon><Check /></el-icon>
              发布
            </el-button>
            <el-button type="danger" link @click="deletePost(row.id)">
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
          @change="loadPosts"
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
const auth = useAuth()

const posts = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const searchKeyword = ref('')
const filterStatus = ref('')

onMounted(() => {
  loadPosts()
})

const loadPosts = async () => {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    if (filterStatus.value) {
      params.status = filterStatus.value
    }

    const res = await api.get('/admin/posts', params)
    if (res.code === 200) {
      posts.value = res.data.list
      total.value = res.data.pagination.total
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadPosts()
}

const goToCreatePost = () => {
  return navigateTo('/admin/posts/create')
}

const editPost = (id: number) => {
  return navigateTo(`/admin/posts/${id}/edit`)
}

const publishPost = async (id: number) => {
  try {
    const res = await api.put(`/admin/posts/${id}`, { status: 'published' })
    if (res.code === 200) {
      ElMessage.success('发布成功')
      loadPosts()
    }
  } catch (error) {
    ElMessage.error('发布失败')
  }
}

const deletePost = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await api.delete(`/admin/posts/${id}`)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadPosts()
    }
  } catch (error) {
    // 用户取消删除
  }
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    published: 'success',
    draft: 'info',
    archived: 'warning'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    published: '已发布',
    draft: '草稿',
    archived: '已归档'
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
.posts-management {
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

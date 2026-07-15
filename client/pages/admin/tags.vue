<template>
  <div class="tags-management">
    <div class="page-header">
      <h2>标签管理</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>
        新建标签
      </el-button>
    </div>

    <el-card>
      <el-table :data="tags" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="标签名称" min-width="150" />
        <el-table-column prop="slug" label="URL标识" min-width="150" />
        <el-table-column prop="postCount" label="文章数" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="editTag(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              @click="deleteTag(row.id)"
              :disabled="row.postCount > 0"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑标签对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑标签' : '新建标签'"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="标签名称" required>
          <el-input
            v-model="form.name"
            placeholder="请输入标签名称"
            maxlength="50"
            show-word-limit
            @input="generateSlug"
          />
        </el-form-item>
        <el-form-item label="URL标识" required>
          <el-input
            v-model="form.slug"
            placeholder="请输入URL标识（英文）"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const api = useApi()

const tags = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref(null)

const form = ref({
  name: '',
  slug: ''
})

onMounted(() => {
  loadTags()
})

const loadTags = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/tags')
    if (res.code === 200) {
      tags.value = res.data
    }
  } finally {
    loading.value = false
  }
}

const generateSlug = () => {
  form.value.slug = form.value.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\u4e00-\u9fa5]/g, '')
}

const showAddDialog = () => {
  isEdit.value = false
  editingId.value = null
  form.value = {
    name: '',
    slug: ''
  }
  dialogVisible.value = true
}

const editTag = (tag: any) => {
  isEdit.value = true
  editingId.value = tag.id
  form.value = {
    name: tag.name,
    slug: tag.slug
  }
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.value.name || !form.value.slug) {
    ElMessage.warning('请填写标签名称和URL标识')
    return
  }

  try {
    let res
    if (isEdit.value) {
      res = await api.put(`/admin/tags/${editingId.value}`, form.value)
    } else {
      res = await api.post('/admin/tags', form.value)
    }

    if (res.code === 200) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      loadTags()
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const deleteTag = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个标签吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await api.delete(`/admin/tags/${id}`)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadTags()
    }
  } catch (error) {
    // 用户取消删除
  }
}

const formatDate = (date: string | null | undefined) => {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleString('zh-CN')
}
</script>

<style scoped lang="scss">
.tags-management {
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
}
</style>

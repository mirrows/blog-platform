<template>
  <div class="categories-management">
    <div class="page-header">
      <h2>分类管理</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>
        新建分类
      </el-button>
    </div>

    <el-card>
      <el-table :data="categories" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" min-width="150" />
        <el-table-column prop="slug" label="URL标识" min-width="150" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="post_count" label="文章数" width="100" />
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="editCategory(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              @click="deleteCategory(row.id)"
              :disabled="row.post_count > 0"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑分类' : '新建分类'"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="分类名称" required>
          <el-input
            v-model="form.name"
            placeholder="请输入分类名称"
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
        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
            maxlength="500"
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

const categories = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref(null)

const form = ref({
  name: '',
  slug: '',
  description: ''
})

onMounted(() => {
  loadCategories()
})

const loadCategories = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/categories')
    if (res.code === 200) {
      categories.value = res.data
    }
  } finally {
    loading.value = false
  }
}

const generateSlug = () => {
  // 简单的slug生成：将中文转换为拼音或使用英文
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
    slug: '',
    description: ''
  }
  dialogVisible.value = true
}

const editCategory = (category: any) => {
  isEdit.value = true
  editingId.value = category.id
  form.value = {
    name: category.name,
    slug: category.slug,
    description: category.description || ''
  }
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.value.name || !form.value.slug) {
    ElMessage.warning('请填写分类名称和URL标识')
    return
  }

  try {
    let res
    if (isEdit.value) {
      res = await api.put(`/admin/categories/${editingId.value}`, form.value)
    } else {
      res = await api.post('/admin/categories', form.value)
    }

    if (res.code === 200) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      loadCategories()
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const deleteCategory = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个分类吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await api.delete(`/admin/categories/${id}`)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadCategories()
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
.categories-management {
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

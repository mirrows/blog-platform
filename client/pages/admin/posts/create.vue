<template>
  <div class="post-editor">
    <div class="page-header">
      <h2>新建文章</h2>
      <div class="header-actions">
        <el-button @click="goBack">取消</el-button>
        <el-button type="success" @click="savePost('draft')">保存草稿</el-button>
        <el-button type="primary" @click="savePost('published')">发布文章</el-button>
      </div>
    </div>

    <el-card>
      <el-form :model="form" label-width="120px">
        <el-form-item label="文章标题" required>
          <el-input
            v-model="form.title"
            placeholder="请输入文章标题"
            maxlength="255"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="文章摘要">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入文章摘要（留空则自动从内容中提取）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="封面图片">
          <el-input
            v-model="form.coverImage"
            placeholder="请输入封面图片URL"
          />
        </el-form-item>

        <el-form-item label="文章分类">
          <el-select v-model="form.categoryId" placeholder="选择分类" clearable style="width: 100%">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="文章标签">
          <el-select
            v-model="form.tags"
            multiple
            filterable
            allow-create
            placeholder="选择或创建标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in tags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="文章内容" required>
          <MdEditor
            v-model="form.content"
            :theme="isDark ? 'dark' : 'light'"
            :preview="true"
            :toolbars="toolbars"
            height="500px"
          />
        </el-form-item>

        <el-form-item>
          <div class="form-actions">
            <el-button @click="goBack">取消</el-button>
            <el-button type="success" @click="savePost('draft')">保存草稿</el-button>
            <el-button type="primary" @click="savePost('published')">发布文章</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const api = useApi()
const route = useRoute()
const isDark = ref(false)

const goBack = () => {
  return navigateTo('/admin/posts')
}

const isEdit = computed(() => !!route.params.id)
const postId = computed(() => route.params.id)

const form = ref({
  title: '',
  content: '',
  summary: '',
  coverImage: '',
  categoryId: null as number | null,
  tags: [] as number[]
})

const categories = ref([])
const tags = ref([])

const toolbars = [
  'bold',
  'underline',
  'italic',
  'strikeThrough',
  'color',
  'header',
  'quote',
  'list',
  'ordered',
  'check',
  'code',
  'codeBlock',
  'link',
  'image',
  'table',
  'revoke',
  'next',
  'preview',
  'htmlPreview',
  'fullscreen'
]

onMounted(async () => {
  await loadCategories()
  await loadTags()

  if (isEdit.value) {
    await loadPost()
  }
})

const loadCategories = async () => {
  const res = await api.get('/admin/categories')
  if (res.code === 200) {
    categories.value = res.data
  }
}

const loadTags = async () => {
  const res = await api.get('/admin/tags')
  if (res.code === 200) {
    tags.value = res.data
  }
}

const loadPost = async () => {
  const res = await api.get(`/admin/posts/${postId.value}`)
  if (res.code === 200) {
    const post = res.data
    form.value = {
      title: post.title,
      content: post.content,
      summary: post.summary || '',
      coverImage: post.cover_image || '',
      categoryId: post.category_id,
      tags: post.tags?.map((t: any) => t.id) || []
    }
  }
}

const savePost = async (status: string) => {
  if (!form.value.title || !form.value.content) {
    ElMessage.warning('请填写标题和内容')
    return
  }

  try {
    const data: any = {
      title: form.value.title,
      content: form.value.content,
      summary: form.value.summary || form.value.content.substring(0, 200),
      coverImage: form.value.coverImage,
      categoryId: form.value.categoryId,
      tags: form.value.tags,
      status
    }

    let res
    if (isEdit.value) {
      res = await api.put(`/admin/posts/${postId.value}`, data)
    } else {
      res = await api.post('/admin/posts', data)
    }

    if (res.code === 200) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      return navigateTo('/admin/posts')
    }
  } catch (error) {
    ElMessage.error('保存失败')
  }
}
</script>

<style scoped lang="scss">
.post-editor {
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

    .header-actions {
      display: flex;
      gap: 10px;
    }
  }

  .form-actions {
    display: flex;
    gap: 10px;
  }
}
</style>

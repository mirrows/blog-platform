<template>
  <div class="files-management">
    <div class="page-header">
      <h2>文件管理</h2>
      <div>
        <el-upload
          :action="uploadUrl"
          :headers="uploadHeaders"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :show-file-list="false"
          :accept="allowedTypes.join(',')"
          :limit="1"
          :data="{}"
        >
          <el-button type="primary">
            <el-icon><Upload /></el-icon>
            上传文件
          </el-button>
        </el-upload>
      </div>
    </div>

    <el-card>
      <div v-if="loading" v-loading="loading" style="min-height: 200px" />

      <div v-else-if="filesByMonth.length === 0" class="empty-state">
        <el-empty description="暂无文件" :image-size="100" />
      </div>

      <div v-else v-for="(group, index) in filesByMonth" :key="index" class="file-group">
        <h3 class="group-title">{{ group.month }}</h3>
        <div class="file-grid">
          <div v-for="file in group.files" :key="file.id" class="file-item">
            <div class="file-preview">
              <el-image
                v-if="file.mimeType?.startsWith('image/')"
                :src="file.url"
                fit="cover"
                class="file-thumb"
                :preview-src-list="[file.url]"
              />
              <div v-else class="file-icon">
                <el-icon :size="40"><Document /></el-icon>
              </div>
            </div>
            <div class="file-info">
              <p class="file-name" :title="file.originalName">{{ file.originalName }}</p>
              <p class="file-size">{{ formatFileSize(file.size) }}</p>
            </div>
            <div class="file-actions">
              <el-button type="primary" link @click="copyUrl(file.url)">
                <el-icon><Link /></el-icon>
              </el-button>
              <el-button type="danger" link @click="deleteFile(file.id)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
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
const config = useRuntimeConfig()

const files = ref([])
const loading = ref(false)

const uploadUrl = `${config.public.apiBase}/admin/files/upload`
const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem('token')}`
}
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']

const filesByMonth = computed(() => {
  const groups: Record<string, any[]> = {}

  files.value.forEach((file: any) => {
    // 后端返回的 uploadDate 格式为 YYYY-MM-DD，直接使用
    const key = file.uploadDate
    if (!groups[key]) groups[key] = []
    groups[key].push(file)
  })

  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, files]) => ({
      month: `${month.substring(0, 4)}年${month.substring(5, 7)}月${month.substring(8, 10)}日`,
      files
    }))
})

onMounted(() => {
  loadFiles()
})

const loadFiles = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/files', { page: 1, pageSize: 100 })
    if (res.code === 200) {
      // 后端返回格式：{ groups: { "2026-07": [...] }, pagination: {...} }
      const allFiles: any[] = []
      if (res.data.groups) {
        Object.values(res.data.groups).forEach((fileGroup: any) => {
          allFiles.push(...fileGroup)
        })
      }
      // 为每个文件拼接完整的 URL（后端返回的是相对路径）
      const backendUrl = config.public.backend
      files.value = allFiles.map((file: any) => ({
        ...file,
        url: file.url.startsWith('http') ? file.url : `${backendUrl}${file.url}`
      }))
    }
  } finally {
    loading.value = false
  }
}

const handleUploadSuccess = (res: any) => {
  if (res.code === 200) {
    ElMessage.success('上传成功')
    loadFiles()
  } else {
    ElMessage.error(res.message || '上传失败')
  }
}

const handleUploadError = () => {
  ElMessage.error('上传失败')
}

const copyUrl = (url: string) => {
  navigator.clipboard.writeText(url).then(() => {
    ElMessage.success('链接已复制')
  })
}

const deleteFile = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个文件吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await api.delete(`/admin/files/${id}`)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadFiles()
    }
  } catch (error) {
    // 用户取消删除
  }
}

const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}
</script>

<style scoped lang="scss">
.files-management {
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

  .empty-state {
    padding: 40px 0;
  }

  .file-group {
    margin-bottom: 30px;

    .group-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e4e7ed;
    }

    .file-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;

      .file-item {
        background: #f5f7fa;
        border-radius: 8px;
        padding: 15px;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          // transform: translateY(-2px);
        }

        .file-preview {
          width: 100%;
          height: 150px;
          overflow: hidden;
          border-radius: 4px;
          margin-bottom: 10px;
          background: #e4e7ed;
          display: flex;
          align-items: center;
          justify-content: center;

          .file-thumb {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .file-icon {
            color: #909399;
          }
        }

        .file-info {
          .file-name {
            font-size: 13px;
            font-weight: 500;
            margin: 0 0 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .file-size {
            font-size: 12px;
            color: #909399;
            margin: 0;
          }
        }

        .file-actions {
          display: flex;
          justify-content: flex-end;
          gap: 5px;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>

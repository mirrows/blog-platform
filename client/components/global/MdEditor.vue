<template>
  <!-- <div>
    <ClientOnly>
      <div v-if="ready"> -->
        <Suspense>
          <template #fallback>
            <div class="internal-loading" :style="{height}">模块加载中...</div>
          </template>
          <MdEditor
            :style="{height}"
            :model-value="modelValue"
            @update:model-value="handleUpdate"
            :theme="theme"
            :preview="preview"
            :toolbars="toolbars"
            @upload-img="handleUploadImg"
          />
        </Suspense>
      <!-- </div>
    </ClientOnly>
  </div> -->
</template>

<script setup lang="ts">
// import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const MdEditor = defineAsyncComponent({
  loader: () => import('md-editor-v3').then(m => m.MdEditor),
  suspensible: true,
})

const ready = ref(false)

const props = defineProps<{
  modelValue?: string
  theme?: 'light' | 'dark'
  preview?: boolean
  toolbars?: string[]
  height?: string,
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleUpdate = (value: string) => {
  emits('update:modelValue', value)
}

// 图片上传处理
const handleUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  const urls: string[] = []

  for (const file of files) {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const config = useRuntimeConfig()
      const res = await $fetch(`${config.public.apiBase || ''}/admin/files/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      }) as any

      if (res.code === 200) {
        console.log(566, `${config.public.backend || ''}${res.data.url}`)
        urls.push(`${config.public.backend || ''}${res.data.url}`)
        console.log(422, res.data)
      }
    } catch (error) {
      console.error('图片上传失败', error)
    }
  }

  callback(urls)
}

onMounted(() => {
  requestAnimationFrame(() => {
    ready.value = true
  })
})
</script>

<style scoped lang="scss">
  .internal-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: var(--text-muted);
    background: var(--bg-secondary);
    border-radius: var(--radius-sm);
  }
</style>

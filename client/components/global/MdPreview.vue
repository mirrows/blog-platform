<template>
  <div>
    <ClientOnly>
      <Suspense>
        <template #fallback>
          <div class="internal-loading">预览加载中...</div>
        </template>
        <MdPreview
          :model-value="modelValue"
          :theme="theme"
        />
      </Suspense>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import 'md-editor-v3/lib/style.css'

const MdPreview = defineAsyncComponent({
  loader: () => import('md-editor-v3').then(m => m.MdPreview),
  suspensible: true,
})

const props = defineProps<{
  modelValue?: string
  theme?: 'light' | 'dark'
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped lang="scss">
.internal-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--text-muted);
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
}
</style>

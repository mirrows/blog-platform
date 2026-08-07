/**
 * 预加载 md-editor-v3
 * 在应用启动时预加载，避免首次使用时等待
 */
import { ref, computed } from 'vue'

export const usePreloadMdEditor = () => {
  const preloadState = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')

  const preload = async () => {
    if (preloadState.value === 'ready') {
      return
    }

    try {
      preloadState.value = 'loading'

      // 预加载 md-editor-v3 的编辑器组件
      await import('md-editor-v3')

      // 预加载预览组件
      await import('md-editor-v3').then(m => m.MdPreview)

      preloadState.value = 'ready'
      console.log('✅ md-editor-v3 预加载完成')
    } catch (error) {
      console.error('❌ md-editor-v3 预加载失败:', error)
      preloadState.value = 'error'
    }
  }

  return {
    preloadState,
    preload,
    isReady: computed(() => preloadState.value === 'ready'),
    isLoading: computed(() => preloadState.value === 'loading'),
  }
}

<template>
  <div>
    <!-- 应用启动加载动画 -->
    <Transition name="fade">
      <div v-if="showLoading" class="app-loading-overlay">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载界面...</div>
        <div class="loading-progress">
          <div class="progress-bar" :style="{ width: progressWidth }"></div>
        </div>
      </div>
    </Transition>

    <!-- 主应用内容 -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// 初始化主题（跟随系统 + 持久化）
useTheme()

// 预加载 md-editor-v3
const { preload, isReady, isLoading } = usePreloadMdEditor()
const showLoading = ref(true)
const progress = ref(0)

// 模拟进度条
const progressWidth = computed(() => `${progress.value}%`)

// 启动预加载
const startPreload = async () => {
  // 模拟进度条动画
  const progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 15
      if (progress.value > 90) progress.value = 90
    }
  }, 200)

  try {
    // 执行预加载
    await preload()

    // 完成进度条
    clearInterval(progressInterval)
    progress.value = 100

    // 等待一小段时间让用户看到100%
    await new Promise(resolve => setTimeout(resolve, 300))

    // 隐藏加载动画
    showLoading.value = false
  } catch (error) {
    clearInterval(progressInterval)
    console.error('预加载失败:', error)
    // 即使失败也隐藏加载动画，让用户可以继续使用
    setTimeout(() => {
      showLoading.value = false
    }, 500)
  }
}

// 应用启动时立即开始预加载
onMounted(() => {
  startPreload()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

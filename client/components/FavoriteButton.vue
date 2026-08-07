<template>
  <div class="favorite-button">
    <el-button
      :type="favorited ? 'primary' : 'info'"
      :loading="loading"
      @click="handleClick"
    >
      <el-icon>
        <StarFilled v-if="favorited" />
        <Star v-else />
      </el-icon>
      <span>收藏</span>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { Star, StarFilled } from '@element-plus/icons-vue'

const props = defineProps<{
  postId: number
}>()

const auth = useAuth()
const likes = useLikes()

const favorited = ref(false)
const loading = ref(false)

// 检查收藏状态
const checkStatus = async () => {
  if (!auth.isLoggedIn.value) return
  const res = await likes.checkFavoriteStatus(props.postId)
  if (res.code === 200 && res.data) {
    favorited.value = res.data.favorited
  }
}

// 切换收藏状态
const handleClick = async () => {
  if (!auth.isLoggedIn.value) {
    ElMessage.warning('请先登录')
    navigateTo('/login')
    return
  }

  loading.value = true
  const res = await likes.toggleFavorite(props.postId)
  if (res.code === 200 && res.data) {
    favorited.value = res.data.favorited
    if (res.data.favorited) {
      ElMessage.success('收藏成功')
    } else {
      ElMessage.success('已取消收藏')
    }
  } else {
    ElMessage.error(res.message || '操作失败')
  }
  loading.value = false
}

onMounted(() => {
  checkStatus()
})
</script>

<style scoped lang="scss">
.favorite-button {
  display: inline-block;
}
</style>

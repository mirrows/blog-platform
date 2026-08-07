<template>
  <div class="like-button">
    <el-button
      :type="liked ? 'primary' : 'info'"
      :loading="loading"
      @click="handleClick"
    >
      <el-icon :type="liked ? 'primary' : 'info'">
        <ThumbUpIcon :filled="liked" />
      </el-icon>
      <span>{{ likeCount }}</span>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import ThumbUpIcon from './icons/ThumbUpIcon.vue'

const props = defineProps<{
  postId: number
  initialCount?: number
}>()

const auth = useAuth()
const likes = useLikes()

const liked = ref(false)
const likeCount = ref(props.initialCount || 0)
const loading = ref(false)

// 检查点赞状态
const checkStatus = async () => {
  if (!auth.isLoggedIn.value) return
  const res = await likes.checkLikeStatus(props.postId)
  if (res.code === 200 && res.data) {
    liked.value = res.data.liked
  }
}

// 切换点赞状态
const handleClick = async () => {
  if (!auth.isLoggedIn.value) {
    ElMessage.warning('请先登录')
    navigateTo('/login')
    return
  }

  loading.value = true
  const res = await likes.toggleLike(props.postId)
  if (res.code === 200 && res.data) {
    liked.value = res.data.liked
    if (res.data.liked) {
      likeCount.value += 1
    } else {
      likeCount.value -= 1
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
.like-button {
  display: inline-block;
}
</style>

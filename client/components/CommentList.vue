<template>
  <div class="comment-list">
    <!-- 评论表单 -->
    <div class="comment-form">
      <div class="form-row" v-if="!auth.isLoggedIn.value">
        <el-input v-model="nickname" placeholder="昵称（选填）" size="small" class="nickname-input" />
      </div>
      <el-input
        v-model="content"
        type="textarea"
        :rows="3"
        placeholder="写下你的评论..."
        maxlength="1000"
        show-word-limit
      />
      <div class="form-actions">
        <el-button type="primary" size="small" @click="submitComment" :loading="submitting">
          发表评论
        </el-button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div v-if="comments.length > 0" class="comments">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <span class="comment-author">{{ comment.user?.username || comment.nickname || '匿名游客' }}</span>
          <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
        </div>
        <div class="comment-content">{{ comment.content }}</div>
        <div v-if="comment.replies?.length" class="comment-replies">
          <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
            <span class="reply-author">{{ reply.user?.username || reply.nickname || '匿名游客' }}</span>
            <span class="reply-content">{{ reply.content }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-comments">
      暂无评论，来说两句吧~
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ postId: number }>()
const auth = useAuth()
const api = useApi()

const comments = ref<any[]>([])
const content = ref('')
const nickname = ref('')
const submitting = ref(false)

const formatDate = (date: string) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const loadComments = async () => {
  const res = await api.get('/comments', { postId: props.postId })
  if (res.code === 200 && res.data) {
    comments.value = res.data.list
  }
}

const submitComment = async () => {
  if (!content.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  submitting.value = true
  const res = await api.post('/comments', {
    postId: props.postId,
    content: content.value.trim(),
    nickname: nickname.value.trim() || undefined,
  })
  submitting.value = false

  if (res.code === 200) {
    ElMessage.success('评论发表成功，等待审核')
    content.value = ''
    nickname.value = ''
  } else {
    ElMessage.error(res.message || '评论失败')
  }
}

onMounted(loadComments)
</script>

<style scoped lang="scss">
.comment-form {
  margin-bottom: 24px;

  .form-row { margin-bottom: 8px; }
  .nickname-input { max-width: 200px; }
  .form-actions { margin-top: 8px; display: flex; justify-content: flex-end; }
}

.comment-item {
  padding: 16px 0;
  border-bottom: 1px solid var(--border-light);

  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    .comment-author { font-weight: 600; font-size: 14px; }
    .comment-date { color: var(--text-muted); font-size: 12px; }
  }

  .comment-content { font-size: 14px; line-height: 1.6; }
}

.comment-replies {
  margin-left: 24px;
  margin-top: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);

  .reply-item {
    padding: 6px 0;
    .reply-author { font-weight: 600; font-size: 13px; margin-right: 8px; }
    .reply-content { font-size: 13px; }
  }
}

.no-comments {
  text-align: center;
  color: var(--text-muted);
  padding: 24px;
}
</style>

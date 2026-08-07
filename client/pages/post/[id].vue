<template>
  <div class="page-container">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <div v-else-if="post" class="post-detail">
      <article class="post-article card">
        <h1 class="post-title">{{ post.title }}</h1>

        <div class="post-meta">
          <span v-if="post.author" class="author">
            <el-icon><User /></el-icon> {{ post.author.username }}
          </span>
          <span class="date">
            <el-icon><Calendar /></el-icon> {{ formatDate(post.publishedAt) }}
          </span>
          <span class="views">
            <el-icon><View /></el-icon> {{ post.viewCount }} 阅读
          </span>
          <span v-if="post.category" class="category">
            <el-icon><Folder /></el-icon> {{ post.category.name }}
          </span>
        </div>

        <div v-if="post.tags?.length" class="post-tags">
          <el-tag v-for="tag in post.tags" :key="tag.id" size="small">
            {{ tag.name }}
          </el-tag>
        </div>

        <!-- 互动按钮 -->
        <div class="post-actions">
          <LikeButton :post-id="post.id" :initial-count="post.likeCount" />
          <FavoriteButton :post-id="post.id" />
          <ShareButtons :post="post" />
        </div>

        <MdPreview v-model="renderedContent" :theme="isDark ? 'dark' : 'light'" />
      </article>

      <!-- 评论区 -->
      <div class="comment-section card">
        <h3 class="comment-title">评论 ({{ post.commentCount || 0 }})</h3>
        <CommentList :post-id="post.id" @comment-submitted="handleCommentSubmitted" />
      </div>
    </div>

    <div v-else class="empty-state">
      <el-empty description="文章不存在" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Calendar, View, Folder } from '@element-plus/icons-vue'
// import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import xss from 'xss'

const MdPreview = defineAsyncComponent({
  loader: () => import('md-editor-v3').then(m => m.MdPreview),
  suspensible: true,
})

const route = useRoute()
const api = useApi()
const post = ref<any>(null)
const loading = ref(true)
const renderedContent = ref('')
const isDark = ref(false)

const handleCommentSubmitted = () => {
  if (post.value) {
    post.value.commentCount = (post.value.commentCount || 0) + 1
  }
}

const formatDate = (date: string) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onMounted(async () => {
  const id = route.params.id
  const res = await api.get(`/posts/${id}`)
  if (res.code === 200 && res.data) {
    post.value = res.data
    // 简单 Markdown 渲染（生产环境建议使用 marked 或 md-editor-v3 的预览组件）
    renderedContent.value = xss(res.data.content || '')

    // 动态设置 OG 标签（社交分享卡片）
    const config = useRuntimeConfig()
    const frontendUrl = config.public.frontend || window.location.origin
    const postUrl = `${frontendUrl}/post/${post.value.id}`
    const ogImage = post.value.coverImage
      ? `${config.public.backend || ''}${post.value.coverImage}`
      : `${frontendUrl}/og-image.png`

    useHead({
      title: `${post.value.title} - 我的博客`,
      meta: [
        { property: 'og:title', content: post.value.title },
        { property: 'og:description', content: post.value.summary || '分享生活，记录思考' },
        { property: 'og:image', content: ogImage },
        { property: 'og:url', content: postUrl },
        { name: 'twitter:title', content: post.value.title },
        { name: 'twitter:description', content: post.value.summary || '分享生活，记录思考' },
        { name: 'twitter:image', content: ogImage },
      ],
    })
  }
  loading.value = false
})

// 简单 Markdown 渲染函数
function renderMarkdown(md: string): string {
  if (!md) return ''
  let html = md
    // 标题
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // 粗体和斜体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 行内代码
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // 图片
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />')
    // 链接
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
    // 段落
    .replace(/\n\n/g, '</p><p>')
    // 换行
    .replace(/\n/g, '<br/>')

  return `<p>${html}</p>`
}
</script>

<style scoped lang="scss">
.post-detail {
  max-width: 800px;
  margin: 0 auto;
}

.post-article {
  padding: 40px;

  .post-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 16px;
    line-height: 1.4;
  }

  .post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    color: var(--text-muted);
    font-size: 14px;
    margin-bottom: 20px;

    .el-icon {
      vertical-align: middle;
    }
  }

  .post-tags {
    margin-bottom: 24px;
    display: flex;
    gap: 8px;
  }

  .post-actions {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid var(--border-light);
    margin-bottom: 24px;
  }
}

.comment-section {
  margin-top: 24px;
  padding: 24px;

  .comment-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
  }
}
</style>

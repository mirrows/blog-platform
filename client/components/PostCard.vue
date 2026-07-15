<template>
  <div class="post-card card" @click="navigateTo(`/post/${post.id}`)">
    <div v-if="post.coverImage" class="post-cover">
      <img :src="post.coverImage" :alt="post.title" loading="lazy" />
    </div>
    <div class="post-body">
      <div class="post-meta">
        <span v-if="post.category" class="category-tag">
          {{ post.category.name }}
        </span>
        <span class="date">{{ formatDate(post.publishedAt) }}</span>
      </div>
      <h3 class="post-title">{{ post.title }}</h3>
      <p class="post-summary">{{ post.summary || post.content?.substring(0, 150) }}</p>
      <div class="post-footer">
        <div class="tags" v-if="post.tags?.length">
          <span v-for="tag in post.tags" :key="tag.id" class="tag">
            #{{ tag.name }}
          </span>
        </div>
        <div class="stats">
          <span><el-icon><View /></el-icon> {{ post.viewCount || 0 }}</span>
          <span><el-icon><ChatDotRound /></el-icon> {{ post.commentCount || 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { View, ChatDotRound } from '@element-plus/icons-vue'

const props = defineProps<{
  post: any
}>()

const formatDate = (date: string) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<style scoped lang="scss">
.post-card {
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-2px);
  }

  .post-cover {
    width: 100%;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .post-body {
    padding: 20px;
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .category-tag {
      background: var(--accent-color);
      color: #fff;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
    }

    .date {
      color: var(--text-muted);
      font-size: 13px;
    }
  }

  .post-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .post-summary {
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;

      .tag {
        color: var(--accent-color);
        font-size: 12px;
      }
    }

    .stats {
      display: flex;
      gap: 12px;
      color: var(--text-muted);
      font-size: 13px;

      .el-icon {
        font-size: 14px;
        vertical-align: middle;
      }
    }
  }
}
</style>

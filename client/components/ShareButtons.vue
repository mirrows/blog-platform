<template>
  <div class="share-buttons">
    <el-button type="primary" link @click="copyLink">
      <el-icon><Link /></el-icon>
      复制链接
    </el-button>

    <el-button type="primary" link @click="openNativeShare">
      <el-icon><Share /></el-icon>
      分享
    </el-button>

    <el-button type="primary" link @click="generatePoster">
      <el-icon><Picture /></el-icon>
      海报
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { Link, Share, Picture } from '@element-plus/icons-vue'

const props = defineProps<{
  post: any
}>()

const config = useRuntimeConfig()
const backendUrl = config.public.backend

// 复制链接
const copyLink = async () => {
  const url = `${config.public.frontend || window.location.origin}/post/${props.post.id}`
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success('链接已复制')
  } catch {
    ElMessage.error('复制失败')
  }
}

// Web Share API 分享
const openNativeShare = async () => {
  if (!navigator.share) {
    ElMessage.info('您的浏览器不支持原生分享')
    return
  }

  const url = `${config.public.frontend || window.location.origin}/post/${props.post.id}`
  try {
    await navigator.share({
      title: props.post.title,
      text: props.post.summary || '',
      url,
    })
  } catch (err) {
    // 用户取消分享
  }
}

// 生成海报
const generatePoster = () => {
  const poster = new SharePoster()
  poster.generate(props.post)
}

// 简单的海报生成类
class SharePoster {
  generate(post: any) {
    // 创建海报容器
    const container = document.createElement('div')
    container.style.cssText = `
      width: 400px;
      padding: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    `

    const title = document.createElement('h2')
    title.textContent = post.title
    title.style.cssText = `
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      line-height: 1.4;
    `

    const desc = document.createElement('p')
    desc.textContent = post.summary || '分享生活，记录思考'
    desc.style.cssText = `
      font-size: 16px;
      opacity: 0.9;
      margin-bottom: 20px;
      line-height: 1.6;
    `

    const url = document.createElement('p')
    url.textContent = `${window.location.origin}/post/${post.id}`
    url.style.cssText = `
      font-size: 14px;
      opacity: 0.8;
      word-break: break-all;
    `

    container.appendChild(title)
    container.appendChild(desc)
    container.appendChild(url)
    document.body.appendChild(container)

    // 使用 html2canvas 生成图片
    if (window.html2canvas) {
      window.html2canvas(container).then((canvas: any) => {
        const link = document.createElement('a')
        link.download = `share-${post.id}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        document.body.removeChild(container)
        ElMessage.success('海报已下载')
      }).catch(() => {
        document.body.removeChild(container)
        ElMessage.error('海报生成失败')
      })
    } else {
      // 如果 html2canvas 未加载，显示提示
      document.body.removeChild(container)
      ElMessage.warning('海报生成功能需要加载 html2canvas 库')
    }
  }
}
</script>

<style scoped lang="scss">
.share-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
</style>

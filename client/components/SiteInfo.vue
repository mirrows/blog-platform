<template>
  <div class="site-info">
    <div class="info-item">
      <el-icon><Clock /></el-icon>
      <span class="label">实时时间：</span>
      <span class="value">{{ currentTime }}</span>
    </div>
    <div class="info-item">
      <el-icon><Timer /></el-icon>
      <span class="label">访问时长：</span>
      <span class="value">{{ visitDuration }}</span>
    </div>
    <div class="info-item">
      <el-icon><Monitor /></el-icon>
      <span class="label">当前IP：</span>
      <span class="value">{{ ip || '获取中...' }}</span>
    </div>
    <div class="info-item">
      <el-icon><Location /></el-icon>
      <span class="label">IP位置：</span>
      <span class="value">{{ location || '获取中...' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, Timer, Monitor, Location } from '@element-plus/icons-vue'
const { currentTime, visitDuration, ip, location } = useSiteInfo()
</script>

<style scoped lang="scss">
.site-info {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  box-shadow: var(--shadow-sm);

  .info-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    font-size: 14px;

    .el-icon {
      color: var(--accent-color);
      font-size: 16px;
    }

    .label {
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .value {
      color: var(--text-primary);
      font-weight: 500;
    }
  }
}
</style>

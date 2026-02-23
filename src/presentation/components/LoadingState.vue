<template>
  <div class="loading-container">
    <el-icon class="is-loading" :size="40">
      <Loading />
    </el-icon>
    <p>{{ text }}</p>
  </div>
</template>

<script>
import { Loading } from '@element-plus/icons-vue'

/**
 * 加载状态组件
 * 展示加载中的状态
 */
export default {
  name: 'LoadingState',
  components: {
    Loading
  },
  props: {
    /**
     * 加载提示文本
     */
    text: {
      type: String,
      default: '加载中...'
    }
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: #409EFF;
}

.loading-container p {
  margin-top: 20px;
  font-size: 18px;
  color: #666;
}

.is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

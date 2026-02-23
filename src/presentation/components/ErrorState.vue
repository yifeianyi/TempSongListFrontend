<template>
  <div class="error-container">
    <el-alert :title="message" type="error" :closable="false" show-icon />
    <div v-if="showRetry" class="retry-section">
      <el-button type="primary" @click="handleRetry">
        重新加载
      </el-button>
    </div>
  </div>
</template>

<script>
/**
 * 错误状态组件
 * 展示错误信息和重试按钮
 */
export default {
  name: 'ErrorState',
  props: {
    /**
     * 错误消息
     */
    message: {
      type: String,
      default: '加载数据失败，请刷新重试'
    },
    /**
     * 是否显示重试按钮
     */
    showRetry: {
      type: Boolean,
      default: true
    }
  },
  emits: ['retry'],
  setup(props, { emit }) {
    const handleRetry = () => {
      emit('retry')
    }

    return {
      handleRetry
    }
  }
}
</script>

<style scoped>
.error-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.retry-section {
  margin-top: 20px;
  text-align: center;
}
</style>

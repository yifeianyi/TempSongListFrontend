<template>
  <div class="head-icon" v-if="url">
    <img :src="url" alt="Head Icon" @error="handleError" />
  </div>
</template>

<script>
import { createImageErrorHandler } from '../../shared/utils/image'

/**
 * 头像图标组件
 * 展示歌手的头像图片
 */
export default {
  name: 'HeadIcon',
  props: {
    url: {
      type: String,
      required: true,
      description: '头像图片地址'
    }
  },
  setup() {
    const handleError = createImageErrorHandler()

    return {
      handleError
    }
  }
}
</script>

<style scoped>
.head-icon {
  position: relative;
  z-index: 1000;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background-color: white;
  padding: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  border: 2px solid #409EFF;
  margin: 0 auto;
}

.head-icon:hover {
  transform: scale(1.05);
}

.head-icon img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .head-icon {
    width: 180px;
    height: 180px;
  }
}
</style>

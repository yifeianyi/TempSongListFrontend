<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="handleVisibleChange"
    title="盲盒歌曲"
    width="500px"
    custom-class="random-song-dialog"
  >
    <div v-if="song" class="random-song-content">
      <h3>{{ song.song_name }}</h3>
      <p>歌手: {{ song.singer }}</p>
      <p>语言: {{ song.language }}</p>
      <p>曲风: {{ song.style }}</p>
      <p v-if="song.note">备注: {{ song.note }}</p>
    </div>
    <div v-else class="random-song-empty">
      <p>暂无符合条件的歌曲</p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleRandomAgain">再抽一次</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
/**
 * 盲盒歌曲弹窗组件
 * 展示随机抽选的歌曲
 */
export default {
  name: 'RandomSongModal',
  props: {
    /**
     * 是否可见
     */
    visible: {
      type: Boolean,
      default: false
    },
    /**
     * 随机歌曲数据
     */
    song: {
      type: Object,
      default: null
    }
  },
  emits: ['update:visible', 'close', 'random-again'],
  setup(props, { emit }) {
    // 处理可见性变化
    const handleVisibleChange = (value) => {
      emit('update:visible', value)
    }

    // 关闭弹窗
    const handleClose = () => {
      emit('update:visible', false)
      emit('close')
    }

    // 再抽一次
    const handleRandomAgain = () => {
      emit('random-again')
    }

    return {
      handleVisibleChange,
      handleClose,
      handleRandomAgain
    }
  }
}
</script>

<style scoped>
.random-song-content h3 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
}

.random-song-content p {
  font-size: 16px;
  margin: 8px 0;
  color: #666;
}

.random-song-empty {
  text-align: center;
  padding: 20px;
  color: #999;
}

.random-song-empty p {
  font-size: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>

<template>
  <div class="table-container">
    <el-table
      :data="songs"
      style="width: 100%"
      :stripe="true"
      :border="true"
      class="songs-table"
      v-loading="loading"
    >
      <el-table-column 
        prop="song_name" 
        label="歌曲名称" 
        :width="isMobile ? 120 : 200" 
      />
      <el-table-column 
        prop="language" 
        label="语言" 
        :width="isMobile ? 80 : 120" 
      />
      <el-table-column 
        prop="singer" 
        label="歌手" 
        :width="isMobile ? 120 : 180" 
      />
      <el-table-column 
        prop="style" 
        label="曲风" 
        :width="isMobile ? 80 : 120" 
      />
      <el-table-column 
        prop="note" 
        label="备注" 
      />
    </el-table>
  </div>
</template>

<script>
/**
 * 歌曲表格组件
 * 展示歌曲列表的表格
 */
export default {
  name: 'SongTable',
  props: {
    /**
     * 歌曲列表
     */
    songs: {
      type: Array,
      required: true,
      default: () => []
    },
    /**
     * 是否加载中
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * 是否为移动端
     */
    isMobile: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.table-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.songs-table {
  border-radius: 8px;
  overflow: hidden;
}

.songs-table :deep(.el-table__header th) {
  background-color: #409EFF !important;
  color: white !important;
  font-weight: bold;
  font-size: 16px;
  padding: 12px 0;
}

.songs-table :deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

.songs-table :deep(.el-table__cell) {
  font-size: 14px;
  padding: 8px 0;
}

.songs-table :deep(.el-table__header-wrapper) {
  border-radius: 8px 8px 0 0;
}

@media (max-width: 768px) {
  .table-container {
    padding: 10px;
    margin: 0 10px;
  }

  .songs-table :deep(.el-table__header th) {
    font-size: 14px;
  }

  .songs-table :deep(.el-table__body td) {
    padding: 3px 0;
  }

  /* 移动端表格列宽调整 */
  .songs-table :deep(.el-table__header th:nth-child(1)),
  .songs-table :deep(.el-table__body td:nth-child(1)) {
    width: 100px !important;
    min-width: 100px !important;
  }

  .songs-table :deep(.el-table__header th:nth-child(2)),
  .songs-table :deep(.el-table__body td:nth-child(2)) {
    width: 60px !important;
    min-width: 60px !important;
  }

  .songs-table :deep(.el-table__header th:nth-child(3)),
  .songs-table :deep(.el-table__body td:nth-child(3)) {
    width: 100px !important;
    min-width: 100px !important;
  }

  .songs-table :deep(.el-table__header th:nth-child(4)),
  .songs-table :deep(.el-table__body td:nth-child(4)) {
    width: 60px !important;
    min-width: 60px !important;
  }
}
</style>

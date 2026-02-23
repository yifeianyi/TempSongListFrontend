<template>
  <div class="filters-container">
    <div class="filters-wrapper">
      <div class="filters">
        <el-select
          :model-value="selectedLanguage"
          placeholder="请选择语言"
          clearable
          @change="handleLanguageChange"
          class="filter-select"
        >
          <el-option
            v-for="language in languages"
            :key="language"
            :label="language"
            :value="language"
          />
        </el-select>

        <el-select
          :model-value="selectedStyle"
          placeholder="请选择曲风"
          clearable
          @change="handleStyleChange"
          class="filter-select"
        >
          <el-option
            v-for="style in styles"
            :key="style"
            :label="style"
            :value="style"
          />
        </el-select>

        <div class="search-container">
          <el-input
            :model-value="searchText"
            placeholder="搜索歌名或歌手"
            clearable
            @clear="handleSearchClear"
            @keyup.enter="handleSearch"
            @update:model-value="handleSearchInput"
            class="search-input"
          >
            <template #append>
              <el-button icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </div>

        <div class="button-container">
          <el-button @click="handleReset" type="warning" class="reset-button">
            重置
          </el-button>
          <el-button @click="handleRandom" type="success" class="random-button">
            盲盒
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'

/**
 * 筛选栏组件
 * 提供语言、曲风筛选和搜索功能
 */
export default {
  name: 'FilterBar',
  components: {
    Search
  },
  props: {
    /**
     * 选中的语言
     */
    selectedLanguage: {
      type: String,
      default: ''
    },
    /**
     * 选中的曲风
     */
    selectedStyle: {
      type: String,
      default: ''
    },
    /**
     * 搜索文本
     */
    searchText: {
      type: String,
      default: ''
    },
    /**
     * 语言列表
     */
    languages: {
      type: Array,
      default: () => []
    },
    /**
     * 曲风列表
     */
    styles: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:selectedLanguage', 'update:selectedStyle', 'update:searchText', 
          'filter', 'reset', 'random'],
  setup(props, { emit }) {
    // 语言选择变化
    const handleLanguageChange = (value) => {
      emit('update:selectedLanguage', value || '')
      emit('filter')
    }

    // 曲风选择变化
    const handleStyleChange = (value) => {
      emit('update:selectedStyle', value || '')
      emit('filter')
    }

    // 搜索输入
    const handleSearchInput = (value) => {
      emit('update:searchText', value)
    }

    // 执行搜索
    const handleSearch = () => {
      emit('filter')
    }

    // 清空搜索
    const handleSearchClear = () => {
      emit('update:searchText', '')
      emit('filter')
    }

    // 重置筛选
    const handleReset = () => {
      emit('update:selectedLanguage', '')
      emit('update:selectedStyle', '')
      emit('update:searchText', '')
      emit('reset')
    }

    // 随机歌曲
    const handleRandom = () => {
      emit('random')
    }

    return {
      handleLanguageChange,
      handleStyleChange,
      handleSearchInput,
      handleSearch,
      handleSearchClear,
      handleReset,
      handleRandom
    }
  }
}
</script>

<style scoped>
.filters-container {
  max-width: 1200px;
  margin: 0 auto 20px;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.filters-wrapper {
  width: 100%;
  box-sizing: border-box;
}

.filters {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: nowrap;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.filter-select {
  flex-shrink: 1;
  width: 200px;
  max-width: 30%;
}

.search-container {
  display: flex;
  flex: 1;
  gap: 10px;
  min-width: 0;
  align-items: center;
}

.search-input {
  flex: 1;
  min-width: 0;
}

.search-input :deep(.el-input-group__append) {
  background-color: #409EFF;
  color: white;
  border-color: #409EFF;
}

.reset-button {
  flex-shrink: 0;
  min-width: 80px;
}

.random-button {
  flex-shrink: 0;
  min-width: 80px;
  margin-left: 10px;
}

@media (max-width: 768px) {
  .filters-container {
    padding: 0 10px;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
    flex-wrap: nowrap;
    gap: 10px;
  }

  .filter-select {
    width: 100%;
    max-width: none;
    flex-shrink: 1;
  }

  .search-container {
    width: 100%;
    flex-direction: column;
    min-width: 0;
    align-items: stretch;
    box-sizing: border-box;
  }

  .search-input {
    flex: 1;
    min-width: 0;
    width: 100%;
  }

  .button-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 2%;
    box-sizing: border-box;
  }

  .reset-button,
  .random-button {
    width: 48%;
    flex-shrink: 0;
    margin: 10px 0 0 0;
  }

  .reset-button {
    margin-right: 2%;
  }
}

@media (min-width: 769px) and (max-width: 992px) {
  .filter-select {
    width: 150px;
    max-width: 40%;
    flex-shrink: 1;
  }

  .search-container {
    flex: 1;
    min-width: 0;
    align-items: center;
  }
}

@media (min-width: 993px) and (max-width: 1200px) {
  .filter-select {
    width: 180px;
    max-width: 35%;
    flex-shrink: 1;
  }

  .search-container {
    flex: 1;
    min-width: 0;
    align-items: center;
  }
}

@media (min-width: 1201px) {
  .filter-select {
    width: 200px;
    max-width: 30%;
    flex-shrink: 1;
  }

  .search-container {
    flex: 1;
    min-width: 0;
    align-items: center;
  }
}
</style>

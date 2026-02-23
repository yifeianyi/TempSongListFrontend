<template>
  <div id="app">
    <!-- 背景 -->
    <div class="background" :style="backgroundStyle"></div>
    
    <div class="content">
      <!-- 加载状态 -->
      <LoadingState v-if="loading" :text="loadingText" />

      <!-- 错误状态 -->
      <ErrorState v-else-if="error" :message="error" @retry="loadAllData" />

      <!-- 正常内容 -->
      <template v-else>
        <!-- 头部 -->
        <header class="header">
          <HeadIcon v-if="headIconUrl" :url="headIconUrl" />
          <h1>{{ siteTitle }}</h1>
        </header>

        <!-- 筛选栏 -->
        <FilterBar
          v-model:selected-language="selectedLanguage"
          v-model:selected-style="selectedStyle"
          v-model:search-text="searchText"
          :languages="languages"
          :styles="styles"
          @filter="handleFilter"
          @reset="handleReset"
          @random="handleRandom"
        />

        <!-- 歌曲表格 -->
        <SongTable
          :songs="filteredSongs"
          :loading="tableLoading"
          :is-mobile="isMobile"
        />
      </template>
    </div>

    <!-- 盲盒弹窗 -->
    <RandomSongModal
      v-model:visible="showRandomSongDialog"
      :song="randomSong"
      @random-again="handleRandom"
    />
  </div>
</template>

<script setup>
/**
 * App 根组件
 * 使用 Vue 3 Composition API 和分离的 Composables
 */
import { ref, computed, onMounted, watch } from 'vue'

// Composables
import { useSongList, useSiteSettings, useDomain } from './presentation/composables'

// 共享层 - 工具
import { watchDeviceType } from './shared/utils/device'
import { SITE_CONFIG } from './infrastructure/config/config'
import { ERROR_MESSAGES, LOADING_TEXT } from './infrastructure/config/constants'

// 表现层 - 组件
import {
  HeadIcon,
  SongTable,
  FilterBar,
  RandomSongModal,
  LoadingState,
  ErrorState,
} from './presentation/components'

// ==================== 初始化 Composables ====================

const {
  currentArtist,
  loadDomainMappings,
  getArtistFromDomain,
  initDomainWatcher,
  setArtist,
} = useDomain()

const {
  siteTitle,
  headIconUrl,
  backgroundUrl,
  loadArtistInfo,
  loadSiteSettings,
} = useSiteSettings()

const {
  filteredSongs,
  languages,
  styles,
  tableLoading,
  loadSongs,
  loadFilters,
  filterSongs,
  getRandomSong,
} = useSongList()

// ==================== 组件内部状态 ====================

const isMobile = ref(false)
const loading = ref(true)
const error = ref(null)
const selectedLanguage = ref('')
const selectedStyle = ref('')
const searchText = ref('')
const showRandomSongDialog = ref(false)
const randomSong = ref(null)

// ==================== 计算属性 ====================

const backgroundStyle = computed(() => {
  const url = backgroundUrl.value
  if (url?.startsWith('linear')) {
    return { backgroundImage: url }
  }
  return {
    backgroundImage: url ? `url(${url})` : 'none',
    backgroundSize: 'cover',
  }
})

const loadingText = computed(() => LOADING_TEXT.DEFAULT)

// ==================== 方法 ====================

const loadAllData = async () => {
  loading.value = true
  error.value = null

  try {
    await Promise.all([
      loadSongs(currentArtist.value),
      loadFilters(currentArtist.value),
      loadSiteSettings(currentArtist.value),
      loadArtistInfo(currentArtist.value),
    ])
  } catch (err) {
    console.error('加载数据失败:', err)
    error.value = ERROR_MESSAGES.LOAD_FAILED
  } finally {
    loading.value = false
  }
}

const handleFilter = async () => {
  await filterSongs(currentArtist.value, {
    language: selectedLanguage.value,
    style: selectedStyle.value,
    search: searchText.value,
  })
}

const handleReset = async () => {
  selectedLanguage.value = ''
  selectedStyle.value = ''
  searchText.value = ''
  await loadSongs(currentArtist.value)
}

const handleRandom = async () => {
  const song = await getRandomSong(currentArtist.value, {
    language: selectedLanguage.value,
    style: selectedStyle.value,
    search: searchText.value,
  })
  randomSong.value = song
  showRandomSongDialog.value = true
}

const handleArtistChange = (newArtist) => {
  if (newArtist !== currentArtist.value) {
    setArtist(newArtist)
    loadAllData()
  }
}

// ==================== 生命周期 ====================

onMounted(async () => {
  // 初始化设备检测
  isMobile.value = window.innerWidth <= 768
  watchDeviceType((type) => {
    isMobile.value = type === 'mobile'
  })

  // 加载域名映射
  await loadDomainMappings()

  // 设置当前歌手
  const artist = getArtistFromDomain()
  setArtist(artist)

  // 加载数据
  await loadAllData()

  // 监听 URL 变化
  initDomainWatcher(handleArtistChange)
})

// 监听歌手变化，更新标题
watch(currentArtist, (newArtist, oldArtist) => {
  if (newArtist !== oldArtist) {
    siteTitle.value = `${newArtist}的歌单`
  }
})
</script>

<style>
@import './presentation/styles/app.css';
</style>

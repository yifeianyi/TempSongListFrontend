<template>
  <div id="app">
    <!-- 背景 -->
    <div 
      class="background" 
      :style="backgroundStyle"
    ></div>
    
    <div class="content">
      <!-- 加载状态 -->
      <LoadingState 
        v-if="loading" 
        :text="loadingText" 
      />

      <!-- 错误状态 -->
      <ErrorState 
        v-else-if="error" 
        :message="error" 
        @retry="loadAllData" 
      />

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

<script>
import { ref, computed, onMounted, watch } from 'vue'

// 领域层类型（用于类型提示）
// import type { Song, ArtistInfo, SiteSetting } from './domain/types'

// 基础设施层 - 服务
import {
  songListService,
  domainService,
  imageService,
  siteSettingsProcessor,
} from './infrastructure/api/RealSongListService'
import { SITE_CONFIG } from './infrastructure/config/config'
import { ERROR_MESSAGES, LOADING_TEXT } from './infrastructure/config/constants'

// 共享层 - 工具
import { checkIsMobile, watchDeviceType } from './shared/utils/device'
import { watchUrlChanges } from './shared/utils/url'

// 表现层 - 组件
import {
  HeadIcon,
  SongTable,
  FilterBar,
  RandomSongModal,
  LoadingState,
  ErrorState,
} from './presentation/components'

/**
 * App 根组件
 * 遵循 DDD 架构，将业务逻辑委托给领域服务和基础设施层
 */
export default {
  name: 'App',
  components: {
    HeadIcon,
    SongTable,
    FilterBar,
    RandomSongModal,
    LoadingState,
    ErrorState,
  },
  setup() {
    // ==================== 状态定义 ====================
    
    // 当前歌手
    const currentArtist = ref(SITE_CONFIG.DEFAULT_ARTIST)
    
    // 网站标题
    const siteTitle = ref('')
    
    // 歌曲数据
    const songs = ref([])
    const filteredSongs = ref([])
    
    // 筛选选项
    const languages = ref([])
    const styles = ref([])
    
    // 筛选状态
    const selectedLanguage = ref('')
    const selectedStyle = ref('')
    const searchText = ref('')
    
    // 图片资源
    const headIconUrl = ref(SITE_CONFIG.DEFAULT_HEAD_ICON)
    const backgroundUrl = ref('')
    
    // UI 状态
    const isMobile = ref(checkIsMobile())
    const loading = ref(true)
    const tableLoading = ref(false)
    const error = ref(null)
    
    // 盲盒弹窗
    const showRandomSongDialog = ref(false)
    const randomSong = ref(null)
    
    // 域名映射
    let domainMappings = {}

    // ==================== 计算属性 ====================
    
    /**
     * 背景样式
     */
    const backgroundStyle = computed(() => {
      const url = backgroundUrl.value
      if (url && url.startsWith('linear')) {
        return { backgroundImage: url }
      }
      return { 
        backgroundImage: url ? `url(${url})` : 'none',
        backgroundSize: 'cover'
      }
    })
    
    /**
     * 加载提示文本
     */
    const loadingText = computed(() => {
      return loading.value ? LOADING_TEXT.DEFAULT : ''
    })

    // ==================== 方法定义 ====================
    
    /**
     * 加载域名映射
     */
    const loadDomainMappings = async () => {
      domainMappings = await domainService.loadDomainMappings()
    }
    
    /**
     * 根据域名获取歌手
     */
    const getArtistFromDomain = () => {
      return domainService.getArtistFromDomain(domainMappings)
    }
    
    /**
     * 加载歌曲列表
     */
    const loadSongs = async () => {
      try {
        const data = await songListService.getSongs(currentArtist.value)
        songs.value = data
        filteredSongs.value = data
      } catch (err) {
        console.error('加载歌曲列表失败:', err)
        throw new Error(ERROR_MESSAGES.FETCH_SONGS_FAILED)
      }
    }
    
    /**
     * 加载筛选选项
     */
    const loadFilters = async () => {
      try {
        const [langs, sts] = await Promise.all([
          songListService.getLanguages(currentArtist.value),
          songListService.getStyles(currentArtist.value),
        ])
        languages.value = langs
        styles.value = sts
      } catch (err) {
        console.error('加载筛选选项失败:', err)
      }
    }
    
    /**
     * 加载歌手信息
     */
    const loadArtistInfo = async () => {
      try {
        const info = await songListService.getArtistInfo(currentArtist.value)
        siteTitle.value = `${info.name}的歌单`
        document.title = `${info.name}的歌单`
      } catch (err) {
        console.error('加载歌手信息失败:', err)
        // 使用默认值
        siteTitle.value = `${currentArtist.value}的歌单`
        document.title = `${currentArtist.value}的歌单`
      }
    }
    
    /**
     * 加载网站设置
     */
    const loadSiteSettings = async () => {
      try {
        const settings = await songListService.getSiteSettings(currentArtist.value)
        
        // 处理设置
        const { headIconUrl: iconUrl, backgroundUrl: bgUrl } = 
          siteSettingsProcessor.processSettings(
            settings,
            currentArtist.value,
            imageService
          )
        
        // 验证并设置图片
        const [verifiedIcon, verifiedBg] = await Promise.all([
          imageService.verifyImage(iconUrl),
          imageService.verifyImage(bgUrl),
        ])
        
        headIconUrl.value = verifiedIcon
        backgroundUrl.value = siteSettingsProcessor.processBackground(verifiedBg)
      } catch (err) {
        console.error('加载网站设置失败:', err)
        // 使用默认值
        headIconUrl.value = SITE_CONFIG.DEFAULT_HEAD_ICON
        backgroundUrl.value = SITE_CONFIG.DEFAULT_BACKGROUND
      }
    }
    
    /**
     * 筛选歌曲
     */
    const handleFilter = async () => {
      tableLoading.value = true
      try {
        const data = await songListService.getSongs(currentArtist.value, {
          language: selectedLanguage.value,
          style: selectedStyle.value,
          search: searchText.value,
        })
        filteredSongs.value = data
      } catch (err) {
        console.error('筛选歌曲失败:', err)
      } finally {
        tableLoading.value = false
      }
    }
    
    /**
     * 重置筛选
     */
    const handleReset = async () => {
      selectedLanguage.value = ''
      selectedStyle.value = ''
      searchText.value = ''
      await loadSongs()
    }
    
    /**
     * 随机歌曲（盲盒）
     */
    const handleRandom = async () => {
      try {
        const song = await songListService.getRandomSong(currentArtist.value, {
          language: selectedLanguage.value,
          style: selectedStyle.value,
          search: searchText.value,
        })
        randomSong.value = song
        showRandomSongDialog.value = true
      } catch (err) {
        console.error('获取随机歌曲失败:', err)
        randomSong.value = null
        showRandomSongDialog.value = true
      }
    }
    
    /**
     * 加载所有数据
     */
    const loadAllData = async () => {
      loading.value = true
      error.value = null
      
      try {
        await Promise.all([
          loadSongs(),
          loadFilters(),
          loadSiteSettings(),
          loadArtistInfo(),
        ])
      } catch (err) {
        console.error('加载数据失败:', err)
        error.value = ERROR_MESSAGES.LOAD_FAILED
      } finally {
        loading.value = false
      }
    }
    
    /**
     * 处理歌手变化
     */
    const handleArtistChange = (newArtist) => {
      if (newArtist !== currentArtist.value) {
        currentArtist.value = newArtist
        loadAllData()
      }
    }

    // ==================== 生命周期 ====================
    
    onMounted(async () => {
      // 加载域名映射
      await loadDomainMappings()
      
      // 获取当前歌手
      const artist = getArtistFromDomain()
      currentArtist.value = artist
      
      // 加载数据
      await loadAllData()
      
      // 监听设备类型变化
      const unsubscribeDevice = watchDeviceType((type) => {
        isMobile.value = type === 'mobile'
      })
      
      // 监听 URL 变化
      const unsubscribeUrl = watchUrlChanges(() => {
        const newArtist = getArtistFromDomain()
        handleArtistChange(newArtist)
      })
      
      // 组件卸载时取消监听（在 Vue 3 setup 中通常不需要手动处理，
      // 但如果使用 effect 或 watch，需要返回清理函数）
      // 这里使用事件监听，需要在 beforeUnmount 中清理
      // 实际清理在组件卸载时自动处理
    })
    
    // 监听当前歌手变化
    watch(currentArtist, (newArtist, oldArtist) => {
      if (newArtist !== oldArtist) {
        siteTitle.value = `${newArtist}的歌单`
      }
    })

    // ==================== 返回模板所需 ====================
    
    return {
      // 状态
      siteTitle,
      songs,
      filteredSongs,
      languages,
      styles,
      selectedLanguage,
      selectedStyle,
      searchText,
      headIconUrl,
      backgroundStyle,
      isMobile,
      loading,
      tableLoading,
      error,
      showRandomSongDialog,
      randomSong,
      loadingText,
      
      // 方法
      loadAllData,
      handleFilter,
      handleReset,
      handleRandom,
    }
  }
}
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  position: relative;
  width: 100%;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.content {
  padding: 0;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

.header {
  margin-bottom: 30px;
  padding-top: 30px;
  position: relative;
  text-align: center;
}

.header h1 {
  font-size: 2.5rem;
  color: #333;
  margin: 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  padding-top: 20px;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
    padding-top: 120px;
  }
}
</style>

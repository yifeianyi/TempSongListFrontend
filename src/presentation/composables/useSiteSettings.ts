/**
 * Composable - 网站设置管理
 * 封装网站设置、歌手信息、图片资源等
 */

import { ref } from 'vue'
import type { ArtistInfo, SiteSetting } from '../../domain/types'
import {
  songListService,
  imageService,
  siteSettingsProcessor,
} from '../../infrastructure/api/RealSongListService'
import { SITE_CONFIG } from '../../infrastructure/config/config'

export function useSiteSettings() {
  // 网站标题
  const siteTitle = ref('')
  
  // 图片资源
  const headIconUrl = ref(SITE_CONFIG.DEFAULT_HEAD_ICON)
  const backgroundUrl = ref('')

  /**
   * 加载歌手信息
   */
  const loadArtistInfo = async (artist: string) => {
    try {
      const info: ArtistInfo = await songListService.getArtistInfo(artist)
      siteTitle.value = `${info.name}的歌单`
      document.title = `${info.name}的歌单`
    } catch (err) {
      console.error('加载歌手信息失败:', err)
      siteTitle.value = `${artist}的歌单`
      document.title = `${artist}的歌单`
    }
  }

  /**
   * 加载网站设置
   */
  const loadSiteSettings = async (artist: string) => {
    try {
      const settings: SiteSetting[] = await songListService.getSiteSettings(artist)

      // 处理设置
      const { headIconUrl: iconUrl, backgroundUrl: bgUrl } =
        siteSettingsProcessor.processSettings(settings, artist, imageService)

      // 验证并设置图片
      const [verifiedIcon, verifiedBg] = await Promise.all([
        imageService.verifyImage(iconUrl),
        imageService.verifyImage(bgUrl),
      ])

      headIconUrl.value = verifiedIcon
      backgroundUrl.value = siteSettingsProcessor.processBackground(verifiedBg)
    } catch (err) {
      console.error('加载网站设置失败:', err)
      headIconUrl.value = SITE_CONFIG.DEFAULT_HEAD_ICON
      backgroundUrl.value = SITE_CONFIG.DEFAULT_BACKGROUND
    }
  }

  return {
    siteTitle,
    headIconUrl,
    backgroundUrl,
    loadArtistInfo,
    loadSiteSettings,
  }
}

/**
 * Composable - 域名管理
 * 封装域名映射和歌手识别逻辑
 */

import { ref } from 'vue'
import { domainService } from '../../infrastructure/api/RealSongListService'
import { SITE_CONFIG } from '../../infrastructure/config/config'
import { watchUrlChanges } from '../../shared/utils/url'

export function useDomain() {
  // 当前歌手
  const currentArtist = ref(SITE_CONFIG.DEFAULT_ARTIST)
  
  // 域名映射
  let domainMappings: Record<string, string> = {}

  /**
   * 加载域名映射
   */
  const loadDomainMappings = async () => {
    domainMappings = await domainService.loadDomainMappings()
  }

  /**
   * 根据域名获取歌手
   */
  const getArtistFromDomain = (): string => {
    return domainService.getArtistFromDomain(domainMappings)
  }

  /**
   * 初始化并监听域名变化
   */
  const initDomainWatcher = (onArtistChange: (artist: string) => void) => {
    // 监听 URL 变化
    const unsubscribeUrl = watchUrlChanges(() => {
      const newArtist = getArtistFromDomain()
      if (newArtist !== currentArtist.value) {
        currentArtist.value = newArtist
        onArtistChange(newArtist)
      }
    })

    return unsubscribeUrl
  }

  /**
   * 设置当前歌手
   */
  const setArtist = (artist: string) => {
    currentArtist.value = artist
  }

  return {
    currentArtist,
    loadDomainMappings,
    getArtistFromDomain,
    initDomainWatcher,
    setArtist,
  }
}

/**
 * 基础设施层 - 歌单服务实现
 * 实现 ISongListService 接口，处理与后端的实际通信
 */

import type {
  ISongListService,
  IDomainService,
  IImageService,
} from '../../domain/api/ISongListService'
import type { Song, ArtistInfo, SiteSetting } from '../../domain/types'
import { API_CONFIG, SITE_CONFIG, UI_CONFIG, MEDIA_CONFIG } from '../config/config'
import { SITE_SETTING_POSITIONS } from '../config/constants'

/**
 * 构建 API URL
 */
function buildApiUrl(endpoint: string, params?: Record<string, string>): string {
  const url = new URL(`${API_CONFIG.BASE_PATH}${endpoint}`, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value)
    })
  }
  return url.toString()
}

/**
 * 处理 API 响应
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

/**
 * 歌单服务实现类
 */
export class RealSongListService implements ISongListService {
  async getSongs(
    artist: string,
    filters?: { language?: string; style?: string; search?: string }
  ): Promise<Song[]> {
    const params: Record<string, string> = { artist }
    if (filters?.language) params.language = filters.language
    if (filters?.style) params.style = filters.style
    if (filters?.search) params.search = filters.search

    const response = await fetch(buildApiUrl('/songs/', params))
    return handleResponse<Song[]>(response)
  }

  async getLanguages(artist: string): Promise<string[]> {
    const response = await fetch(buildApiUrl('/languages/', { artist }))
    const languages = await handleResponse<string[]>(response)
    return this.cleanAndDeduplicate(languages)
  }

  async getStyles(artist: string): Promise<string[]> {
    const response = await fetch(buildApiUrl('/styles/', { artist }))
    const styles = await handleResponse<string[]>(response)
    return this.cleanAndDeduplicate(styles)
  }

  /**
   * 清洗数据：去除空格、去重、排序
   */
  private cleanAndDeduplicate(items: string[]): string[] {
    // 去除首尾空格，过滤空值
    const cleaned = items
      .map(item => item?.trim())
      .filter(item => item && item.length > 0)
    
    // 去重（使用 Set）
    const unique = [...new Set(cleaned)]
    
    // 按字母顺序排序
    return unique.sort((a, b) => a.localeCompare(b, 'zh-CN'))
  }

  async getArtistInfo(artist: string): Promise<ArtistInfo> {
    const response = await fetch(buildApiUrl('/artist-info/', { artist }))
    return handleResponse<ArtistInfo>(response)
  }

  async getSiteSettings(artist: string): Promise<SiteSetting[]> {
    const response = await fetch(buildApiUrl('/site-settings/', { artist }))
    return handleResponse<SiteSetting[]>(response)
  }

  async getRandomSong(
    artist: string,
    filters?: { language?: string; style?: string; search?: string }
  ): Promise<Song | null> {
    const params: Record<string, string> = { artist }
    if (filters?.language) params.language = filters.language
    if (filters?.style) params.style = filters.style
    if (filters?.search) params.search = filters.search

    const response = await fetch(buildApiUrl('/random-song/', params))
    if (response.status === 404) {
      return null
    }
    return handleResponse<Song>(response)
  }
}

/**
 * 域名服务实现类
 */
export class DomainService implements IDomainService {
  async loadDomainMappings(): Promise<Record<string, string>> {
    try {
      const response = await fetch(UI_CONFIG.DOMAIN_MAPPING_PATH)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('加载域名映射失败:', error)
    }
    return {}
  }

  getArtistFromDomain(mappings: Record<string, string>): string {
    // 优先检查 URL 参数中的 artist
    const urlParams = new URLSearchParams(window.location.search)
    const artistFromUrl = urlParams.get('artist')
    if (artistFromUrl) {
      return artistFromUrl
    }

    const hostname = window.location.hostname
    const port = window.location.port
    const fullHostname = port ? `${hostname}:${port}` : hostname

    // 检查完整域名匹配
    if (mappings[fullHostname]) {
      return mappings[fullHostname]
    }

    // 检查仅主机名匹配
    if (mappings[hostname]) {
      return mappings[hostname]
    }

    // 使用默认值
    return SITE_CONFIG.DEFAULT_ARTIST
  }
}

/**
 * 图片服务实现类
 */
export class ImageService implements IImageService {
  async verifyImage(url: string): Promise<string> {
    // 如果已经是默认值或不是媒体路径，直接返回
    if (
      !url ||
      url === SITE_CONFIG.DEFAULT_HEAD_ICON ||
      !url.startsWith('/media')
    ) {
      return SITE_CONFIG.DEFAULT_HEAD_ICON
    }

    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(url)
      img.onerror = () => {
        console.warn('图片加载失败，使用默认图片:', url)
        resolve(SITE_CONFIG.DEFAULT_HEAD_ICON)
      }
      img.src = url
    })
  }

  buildMediaPath(artist: string, filename: string): string {
    return `${MEDIA_CONFIG.BASE_PATH}/${artist}/${filename}`
  }
}

/**
 * 网站设置处理服务
 */
export class SiteSettingsProcessor {
  /**
   * 处理网站设置，提取头像和背景图片
   */
  processSettings(
    settings: SiteSetting[],
    artist: string,
    imageService: IImageService
  ): { headIconUrl: string; backgroundUrl: string } {
    let headIconUrl = SITE_CONFIG.DEFAULT_HEAD_ICON
    let backgroundUrl = ''

    settings.forEach((setting) => {
      if (setting.photo_url) {
        const imagePath = imageService.buildMediaPath(artist, setting.photo_url)
        if (setting.position === SITE_SETTING_POSITIONS.HEAD_ICON) {
          headIconUrl = imagePath
        } else if (setting.position === SITE_SETTING_POSITIONS.BACKGROUND) {
          backgroundUrl = imagePath
        }
      }
    })

    return { headIconUrl, backgroundUrl }
  }

  /**
   * 处理验证后的背景图片
   */
  processBackground(verifiedBackground: string): string {
    if (
      verifiedBackground === SITE_CONFIG.DEFAULT_BACKGROUND_MARKER ||
      !verifiedBackground
    ) {
      return SITE_CONFIG.DEFAULT_BACKGROUND
    }
    return verifiedBackground
  }
}

// 导出服务实例
export const songListService = new RealSongListService()
export const domainService = new DomainService()
export const imageService = new ImageService()
export const siteSettingsProcessor = new SiteSettingsProcessor()

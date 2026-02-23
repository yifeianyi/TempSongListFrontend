/**
 * 领域层 - 类型定义
 * 定义所有业务领域模型类型
 */

/**
 * 歌曲模型
 */
export interface Song {
  id: number
  song_name: string
  singer: string
  language: string
  style: string
  note?: string
}

/**
 * 歌手信息模型
 */
export interface ArtistInfo {
  id: number
  key: string
  name: string
  description?: string
}

/**
 * 网站设置模型
 */
export interface SiteSetting {
  id: number
  position: number
  photo_url?: string
  title?: string
  description?: string
}

/**
 * 筛选状态模型
 */
export interface FilterState {
  language: string
  style: string
  search: string
}

/**
 * 域名映射配置
 */
export interface DomainMapping {
  [domain: string]: string
}

/**
 * API 响应统一格式
 */
export interface ApiResponse<T> {
  code: number
  data: T
  message?: string
}

/**
 * 图片资源类型
 */
export type ImageType = 'headIcon' | 'background'

/**
 * 设备类型
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop'

/**
 * 基础设施层 - 配置管理
 * 集中管理应用配置
 */

/**
 * API 配置
 */
export const API_CONFIG = {
  /**
   * API 基础路径
   */
  BASE_PATH: '/api/songlist',

  /**
   * 默认超时时间（毫秒）
   */
  TIMEOUT: 10000,

  /**
   * 重试次数
   */
  RETRY_COUNT: 3,
}

/**
 * 网站默认配置
 */
export const SITE_CONFIG = {
  /**
   * 默认歌手标识
   */
  DEFAULT_ARTIST: 'youyou',

  /**
   * 默认标题
   */
  DEFAULT_TITLE: '歌单',

  /**
   * 默认头像
   */
  DEFAULT_HEAD_ICON: '/favicon.ico',

  /**
   * 默认背景（渐变）
   */
  DEFAULT_BACKGROUND: 'linear-gradient(135deg, #8eb69b 0%, #f8b195 100%)',

  /**
   * 背景使用默认值的标记
   */
  DEFAULT_BACKGROUND_MARKER: 'USE_DEFAULT_BACKGROUND',
}

/**
 * UI 配置
 */
export const UI_CONFIG = {
  /**
   * 移动端断点（像素）
   */
  MOBILE_BREAKPOINT: 768,

  /**
   * 平板断点（像素）
   */
  TABLET_BREAKPOINT: 992,

  /**
   * 域名映射文件路径
   */
  DOMAIN_MAPPING_PATH: '/domain-mappings.json',
}

/**
 * 媒体配置
 */
export const MEDIA_CONFIG = {
  /**
   * 媒体文件基础路径
   */
  BASE_PATH: '/media/songlist',
}

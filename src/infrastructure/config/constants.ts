/**
 * 基础设施层 - 常量定义
 * 应用级别的常量
 */

/**
 * 网站设置位置类型
 */
export const SITE_SETTING_POSITIONS = {
  /**
   * 头像图标
   */
  HEAD_ICON: 1,

  /**
   * 背景图片
   */
  BACKGROUND: 2,
} as const

/**
 * 错误消息
 */
export const ERROR_MESSAGES = {
  /**
   * 加载失败
   */
  LOAD_FAILED: '加载数据失败，请刷新重试',

  /**
   * 网络错误
   */
  NETWORK_ERROR: '网络连接失败，请检查网络',

  /**
   * 获取歌曲列表失败
   */
  FETCH_SONGS_FAILED: '获取歌曲列表失败',

  /**
   * 获取歌手信息失败
   */
  FETCH_ARTIST_FAILED: '获取歌手信息失败',

  /**
   * 没有符合条件的歌曲
   */
  NO_MATCHING_SONGS: '暂无符合条件的歌曲',
} as const

/**
 * 加载状态文本
 */
export const LOADING_TEXT = {
  /**
   * 默认加载文本
   */
  DEFAULT: '加载中...',

  /**
   * 加载歌曲
   */
  SONGS: '加载歌曲列表...',

  /**
   * 加载筛选
   */
  FILTERS: '加载筛选条件...',
} as const

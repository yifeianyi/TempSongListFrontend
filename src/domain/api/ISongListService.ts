/**
 * 领域层 - 服务接口定义
 * 定义歌单服务的抽象接口，具体实现在基础设施层
 */

import type { Song, ArtistInfo, SiteSetting } from '../types'

/**
 * 歌单服务接口
 * 遵循依赖倒置原则：高层模块依赖此抽象接口
 */
export interface ISongListService {
  /**
   * 获取歌曲列表
   * @param artist 歌手标识
   * @param filters 筛选条件
   */
  getSongs(
    artist: string,
    filters?: { language?: string; style?: string; search?: string }
  ): Promise<Song[]>

  /**
   * 获取语言列表
   * @param artist 歌手标识
   */
  getLanguages(artist: string): Promise<string[]>

  /**
   * 获取曲风列表
   * @param artist 歌手标识
   */
  getStyles(artist: string): Promise<string[]>

  /**
   * 获取歌手信息
   * @param artist 歌手标识
   */
  getArtistInfo(artist: string): Promise<ArtistInfo>

  /**
   * 获取网站设置
   * @param artist 歌手标识
   */
  getSiteSettings(artist: string): Promise<SiteSetting[]>

  /**
   * 获取随机歌曲
   * @param artist 歌手标识
   * @param filters 筛选条件
   */
  getRandomSong(
    artist: string,
    filters?: { language?: string; style?: string; search?: string }
  ): Promise<Song | null>
}

/**
 * 域名服务接口
 */
export interface IDomainService {
  /**
   * 加载域名映射配置
   */
  loadDomainMappings(): Promise<Record<string, string>>

  /**
   * 根据当前域名获取歌手标识
   * @param mappings 域名映射配置
   */
  getArtistFromDomain(mappings: Record<string, string>): string
}

/**
 * 图片服务接口
 */
export interface IImageService {
  /**
   * 验证图片是否可加载
   * @param url 图片URL
   * @returns 可用的图片URL或默认值
   */
  verifyImage(url: string): Promise<string>

  /**
   * 构建媒体文件路径
   * @param artist 歌手标识
   * @param filename 文件名
   */
  buildMediaPath(artist: string, filename: string): string
}

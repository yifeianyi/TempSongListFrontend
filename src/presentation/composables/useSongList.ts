/**
 * Composable - 歌单数据管理
 * 封装歌单相关的数据和逻辑
 */

import { ref, computed } from 'vue'
import type { Song, ArtistInfo, SiteSetting } from '../../domain/types'
import { songListService } from '../../infrastructure/api/RealSongListService'
import { ERROR_MESSAGES } from '../../infrastructure/config/constants'

export function useSongList() {
  // 歌曲数据
  const songs = ref<Song[]>([])
  const filteredSongs = ref<Song[]>([])
  
  // 筛选选项
  const languages = ref<string[]>([])
  const styles = ref<string[]>([])
  
  // 加载状态
  const tableLoading = ref(false)

  /**
   * 加载歌曲列表
   */
  const loadSongs = async (artist: string) => {
    try {
      const data = await songListService.getSongs(artist)
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
  const loadFilters = async (artist: string) => {
    try {
      const [langs, sts] = await Promise.all([
        songListService.getLanguages(artist),
        songListService.getStyles(artist),
      ])
      languages.value = langs
      styles.value = sts
    } catch (err) {
      console.error('加载筛选选项失败:', err)
    }
  }

  /**
   * 筛选歌曲
   */
  const filterSongs = async (
    artist: string,
    filters: { language?: string; style?: string; search?: string }
  ) => {
    tableLoading.value = true
    try {
      const data = await songListService.getSongs(artist, filters)
      filteredSongs.value = data
    } catch (err) {
      console.error('筛选歌曲失败:', err)
    } finally {
      tableLoading.value = false
    }
  }

  /**
   * 获取随机歌曲
   */
  const getRandomSong = async (
    artist: string,
    filters?: { language?: string; style?: string; search?: string }
  ) => {
    return await songListService.getRandomSong(artist, filters)
  }

  return {
    songs,
    filteredSongs,
    languages,
    styles,
    tableLoading,
    loadSongs,
    loadFilters,
    filterSongs,
    getRandomSong,
  }
}

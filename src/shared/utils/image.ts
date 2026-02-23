/**
 * 共享层 - 图片处理工具
 */

import { SITE_CONFIG } from '../../infrastructure/config/config'

/**
 * 图片加载选项
 */
export interface ImageLoadOptions {
  timeout?: number
  retryCount?: number
}

/**
 * 加载图片并返回结果
 * @param src 图片地址
 * @param options 加载选项
 */
export function loadImage(
  src: string,
  options: ImageLoadOptions = {}
): Promise<HTMLImageElement> {
  const { timeout = 10000 } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    
    // 设置超时
    const timeoutId = setTimeout(() => {
      reject(new Error(`Image load timeout: ${src}`))
    }, timeout)

    img.onload = () => {
      clearTimeout(timeoutId)
      resolve(img)
    }

    img.onerror = () => {
      clearTimeout(timeoutId)
      reject(new Error(`Image load failed: ${src}`))
    }

    img.src = src
  })
}

/**
 * 验证多个图片，返回可用的图片地址
 * @param urls 图片地址列表
 * @param defaultUrl 默认图片地址
 */
export async function validateImages(
  urls: string[],
  defaultUrl: string = SITE_CONFIG.DEFAULT_HEAD_ICON
): Promise<string[]> {
  const results = await Promise.allSettled(
    urls.map((url) => loadImage(url).then(() => url))
  )

  return results.map((result, index) =>
    result.status === 'fulfilled' ? result.value : defaultUrl
  )
}

/**
 * 获取图片的失败处理函数
 * @param defaultSrc 默认图片地址
 */
export function createImageErrorHandler(
  defaultSrc: string = SITE_CONFIG.DEFAULT_HEAD_ICON
): (event: Event) => void {
  return (event: Event) => {
    const img = event.target as HTMLImageElement
    if (img) {
      img.src = defaultSrc
    }
  }
}

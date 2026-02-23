/**
 * 共享层 - 设备检测工具
 */

import { UI_CONFIG } from '../../infrastructure/config/config'

/**
 * 检测是否为移动端设备
 */
export function checkIsMobile(): boolean {
  return window.innerWidth <= UI_CONFIG.MOBILE_BREAKPOINT
}

/**
 * 检测是否为平板设备
 */
export function checkIsTablet(): boolean {
  const width = window.innerWidth
  return width > UI_CONFIG.MOBILE_BREAKPOINT && width <= UI_CONFIG.TABLET_BREAKPOINT
}

/**
 * 获取当前设备类型
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (checkIsMobile()) return 'mobile'
  if (checkIsTablet()) return 'tablet'
  return 'desktop'
}

/**
 * 监听设备类型变化
 * @param callback 设备类型变化时的回调函数
 * @returns 取消监听的函数
 */
export function watchDeviceType(
  callback: (type: 'mobile' | 'tablet' | 'desktop') => void
): () => void {
  const handler = () => {
    callback(getDeviceType())
  }

  window.addEventListener('resize', handler)

  // 返回取消监听的函数
  return () => {
    window.removeEventListener('resize', handler)
  }
}

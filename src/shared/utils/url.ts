/**
 * 共享层 - URL 处理工具
 */

/**
 * 获取 URL 参数
 * @param param 参数名
 * @returns 参数值或 null
 */
export function getUrlParam(param: string): string | null {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

/**
 * 监听 URL 变化
 * @param callback URL 变化时的回调函数
 * @returns 取消监听的函数
 */
export function watchUrlChanges(callback: () => void): () => void {
  const handlePopstate = () => callback()
  const handleHashchange = () => callback()

  window.addEventListener('popstate', handlePopstate)
  window.addEventListener('hashchange', handleHashchange)

  return () => {
    window.removeEventListener('popstate', handlePopstate)
    window.removeEventListener('hashchange', handleHashchange)
  }
}

/**
 * 更新 URL 参数（不刷新页面）
 * @param params 要更新的参数
 */
export function updateUrlParams(params: Record<string, string | null>): void {
  const url = new URL(window.location.href)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === null) {
      url.searchParams.delete(key)
    } else {
      url.searchParams.set(key, value)
    }
  })

  window.history.replaceState({}, '', url.toString())
}

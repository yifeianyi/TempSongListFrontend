import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // 解析域名到歌手的映射
  const domainMappings = {}

  // 从环境变量中读取域名映射
  // 格式：域名=singer标识（支持点号）
  Object.keys(env).forEach(key => {
    // 跳过 VITE_ 前缀的系统变量和 DEFAULT_ARTIST
    if (key !== 'DEFAULT_ARTIST' && !key.startsWith('VITE_')) {
      // key 就是域名，value 是歌手标识
      domainMappings[key] = env[key]
    }
  })

  return {
    plugins: [vue()],
    server: {
      port: 5174,
      host: '0.0.0.0',
      proxy: {
        // 代理 /api 请求到后端
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          secure: false,
        },
        // 代理 /media 请求到后端（包括 songlist 的图片资源）
        '/media': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          secure: false,
        },
      }
    },
    // 将域名映射注入为环境变量，供前端代码使用
    envPrefix: ['VITE_'],
    define: {
      'import.meta.env.VITE_DOMAIN_MAPPINGS': JSON.stringify(domainMappings),
      'import.meta.env.VITE_DEFAULT_ARTIST': JSON.stringify(env.DEFAULT_ARTIST || 'youyou'),
    }
  }
})
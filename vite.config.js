import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // 解析域名到歌手的映射
  const domainMappings = {}

  // 从环境变量中读取域名映射
  // 格式：youyou_example_com=youyou (域名中的点被替换为下划线)
  Object.keys(env).forEach(key => {
    if (key !== 'DEFAULT_ARTIST' && key.includes('_') && !key.startsWith('VITE_')) {
      const domain = key.replace(/_/g, '.')
      domainMappings[domain] = env[key]
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
    define: {
      __DOMAIN_MAPPINGS__: JSON.stringify(domainMappings),
      __DEFAULT_ARTIST__: JSON.stringify(env.DEFAULT_ARTIST || 'youyou'),
    }
  }
})
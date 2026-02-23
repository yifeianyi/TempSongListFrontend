import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取 __dirname 等价物（ESM 模式）
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // 解析域名到歌手的映射
  const domainMappings = {}

  // 从环境变量中读取域名映射
  // 格式：域名=singer标识（支持点号）
  Object.keys(env).forEach(key => {
    // 只包含包含点号的变量（域名格式：xxx.xxx.xxx）
    // 排除 VITE_ 前缀、npm_ 前缀、NODE_ 前缀等系统变量
    // 排除 DEFAULT_ARTIST
    if (key !== 'DEFAULT_ARTIST' &&
        !key.startsWith('VITE_') &&
        !key.startsWith('npm_') &&
        !key.startsWith('NODE_') &&
        key.includes('.') &&
        // 排除路径类型的变量（包含 /）
        !key.includes('/') &&
        // 排除常见的系统环境变量
        !['PATH', 'HOME', 'USER', 'SHELL', 'PWD', 'LANG', 'TERM', 'EDITOR', 'DISPLAY',
          'SSH_CONNECTION', 'SSH_CLIENT', 'SSH_TTY', 'XDG_', 'DBUS_', 'LESSOPEN', 'LESSCLOSE',
          'LS_COLORS', 'LOGNAME', 'OLDPWD', 'SHLVL', 'TMUX', 'COLOR', '_', 'INIT_CWD'].some(prefix => key.startsWith(prefix))) {
      // key 就是域名，value 是歌手标识
      domainMappings[key] = env[key]
    }
  })

  // 创建域名映射配置文件（构建时会生成到 public 目录）
  const domainMappingsPath = path.resolve(process.cwd(), 'public/domain-mappings.json')
  try {
    fs.writeFileSync(domainMappingsPath, JSON.stringify(domainMappings, null, 2), 'utf-8')
    console.log('✓ 域名映射配置文件已生成:', domainMappingsPath)
  } catch (err) {
    console.error('生成域名映射配置文件失败:', err)
  }

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@domain': path.resolve(__dirname, './src/domain'),
        '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
        '@presentation': path.resolve(__dirname, './src/presentation'),
        '@shared': path.resolve(__dirname, './src/shared'),
      },
    },
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
    // 将默认歌手注入为环境变量
    envPrefix: ['VITE_'],
    define: {
      'import.meta.env.VITE_DEFAULT_ARTIST': JSON.stringify(env.DEFAULT_ARTIST || 'youyou'),
    }
  }
})
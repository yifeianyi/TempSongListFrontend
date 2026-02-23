# AGENTS.md - AI 编码助手指南

本文档为 AI 编码助手提供项目背景、架构和开发规范，帮助快速理解和维护本项目。

---

## 项目概述

**项目名称**: youyou-songlist-frontend  
**项目类型**: 多歌手歌单前端模板  
**主要用途**: 为不同歌手提供可共享的歌单展示页面，通过域名或 URL 参数自动识别歌手身份

### 核心特性

- 🎵 支持多歌手，通过域名自动识别
- 🔍 智能搜索和筛选（歌名、歌手、语言、曲风）
- 🎲 盲盒功能，随机推荐歌曲
- 📱 响应式设计，支持移动端
- 🎨 可自定义页面标题、头像、背景图
- ⚡ 基于 Vue 3 + Element Plus

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | ^3.2.0 | 前端框架（使用 Composition API） |
| Element Plus | ^2.0.0 | UI 组件库 |
| Vite | ^4.0.0 | 构建工具 |
| @vitejs/plugin-vue | ^4.0.0 | Vite Vue 插件 |

---

## 项目结构

```
TempSongListFrontend/
├── public/                     # 静态资源（不经过构建处理）
│   ├── favicon.ico            # 网站图标
│   ├── default-avatar.svg     # 默认头像
│   ├── default-background.svg # 默认背景图
│   └── domain-mappings.json   # 域名映射配置（由 vite.config.js 生成）
├── src/
│   ├── components/
│   │   └── HeadIcon.vue       # 歌手头像组件（圆形、带边框）
│   ├── App.vue                # 主应用组件（包含所有业务逻辑）
│   └── main.js                # 应用入口（注册 Vue、Element Plus、图标）
├── .env                       # 环境变量（域名映射配置，git 忽略）
├── .env.example               # 环境变量示例模板
├── vite.config.js             # Vite 配置（含代理、域名映射生成逻辑）
├── nginx.example.conf         # Nginx 配置示例
├── DEPLOYMENT.md              # 详细部署指南
└── package.json               # 项目依赖和脚本
```

### 关键文件说明

**`vite.config.js`**: 
- 开发服务器端口: 5174
- 代理 `/api` 和 `/media` 到后端 (127.0.0.1:8000)
- 构建时解析 `.env` 生成 `domain-mappings.json`

**`src/App.vue`**:
- 约 900+ 行，包含完整的业务逻辑
- 使用 Vue 3 Composition API (`<script setup>` 风格）
- 响应式设计（移动端断点: 768px）

---

## 构建和开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器（端口 5174）
npm run dev

# 构建生产版本（输出到 dist/）
npm run build

# 预览生产构建
npm run preview
```

---

## 歌手识别机制

系统通过以下优先级确定当前歌手：

1. **URL 参数**: `?artist=youyou`（最高优先级）
2. **域名映射**: 从 `/domain-mappings.json` 查找当前域名对应的歌手
3. **默认值**: `DEFAULT_ARTIST` 环境变量（后备）

### 域名映射配置

在 `.env` 文件中配置（格式: `域名=歌手标识`）：

```env
# 本地开发
localhost=youyou
127.0.0.1=youyou

# 生产环境
youyou.example.com=youyou
bingjie.example.com=bingjie

# 默认值
DEFAULT_ARTIST=youyou
```

**注意**: 
- 生产环境 `.env` 使用原始域名格式（带点号）
- `.env.example` 使用下划线格式（`youyou_example_com=youyou`）供某些系统使用

---

## 后端 API 接口

前端通过 `/api/songlist/` 访问后端服务：

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/songlist/songs/` | GET | 获取歌曲列表（支持筛选参数） |
| `/api/songlist/languages/` | GET | 获取语言列表 |
| `/api/songlist/styles/` | GET | 获取曲风列表 |
| `/api/songlist/random-song/` | GET | 随机获取一首歌曲（支持筛选） |
| `/api/songlist/site-settings/` | GET | 获取网站设置（头像、背景图） |
| `/api/songlist/artist-info/` | GET | 获取歌手中文名称 |

所有接口都需要 `?artist=xxx` 参数。

### 媒体文件路径

图片资源存储路径格式: `/media/songlist/{artist}/{filename}`

---

## 代码风格指南

### Vue 组件规范

- 使用 Composition API (`setup` 函数)
- 组件名使用 PascalCase
- 使用 `ref` 和 `computed` 管理状态
- 异步操作使用 `async/await`

### 样式规范

- 使用 scoped CSS
- 响应式断点:
  - 移动端: `max-width: 768px`
  - 平板: `769px - 992px`
  - 桌面: `993px - 1200px`
  - 大屏: `min-width: 1201px`
- 使用 `::v-deep` 穿透 Element Plus 组件样式

### 命名约定

- 变量: camelCase
- 组件: PascalCase
- API 路径: kebab-case
- 常量: 全大写 + 下划线

---

## 测试说明

**当前状态**: 本项目未配置测试框架。

如需添加测试，建议：
- 单元测试: Vitest + Vue Test Utils
- E2E 测试: Playwright 或 Cypress

---

## 部署流程

### 开发环境

1. 配置 `.env` 文件
2. 运行 `npm run dev`
3. 通过 `localhost:5174` 或带参数访问 `localhost:5174?artist=youyou`

### 生产环境

1. 运行 `npm run build` 生成 `dist/` 目录
2. 配置 Nginx（参考 `nginx.example.conf`）
3. 配置 `.env` 文件（域名映射）
4. 确保后端服务运行在 `127.0.0.1:8000`

### Nginx 关键配置

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location /api {
    proxy_pass http://127.0.0.1:8000;
}

location /media {
    proxy_pass http://127.0.0.1:8000;
}
```

---

## 添加新歌手步骤

1. **后端配置**: 在 Django 的 `songlist/models.py` 中 `ARTIST_CONFIG` 添加新歌手
2. **前端配置**: 在 `.env` 中添加域名映射
3. **Nginx 配置**: 添加新的 `server` 块
4. **数据导入**: 通过 Django Admin 导入歌曲和网站设置

---

## 安全注意事项

1. **环境变量**: `.env` 文件包含敏感配置，已加入 `.gitignore`
2. **CORS**: 开发时代理配置处理跨域，生产环境需后端配置 CORS
3. **HTTPS**: 生产环境建议启用 HTTPS（参考 `nginx.example.conf` 中的 SSL 配置）
4. **输入验证**: 所有用户输入（搜索框）通过 Element Plus 组件进行基础验证

---

## 常见问题排查

| 问题 | 排查方向 |
|------|----------|
| 显示默认歌手而非对应歌手 | 检查 `.env` 域名映射、Nginx `server_name` |
| API 请求失败 | 检查后端服务是否运行、Nginx 代理配置 |
| 图片加载失败 | 检查 `/media` 路径配置、文件权限 |
| 构建失败 | 检查 Node.js 版本（需 16+） |

---

## 许可证

GPLv3

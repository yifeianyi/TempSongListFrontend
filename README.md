# Songlist 模板前端

一个通用的歌单前端模板，可以供不同歌手共享使用。通过域名或 URL 参数区分不同歌手，每个歌手可以看到自己的歌单页面。

## 特性

- 🎵 支持多歌手，通过域名自动识别
- 🔍 智能搜索和筛选（歌名、歌手、语言、曲风）
- 🎲 盲盒功能，随机推荐歌曲
- 📱 响应式设计，支持移动端
- 🎨 可自定义页面标题、头像、背景图
- ⚡ Vue 3 + Element Plus，性能优秀

## 技术栈

- Vue 3.2+
- Element Plus 2.0+
- Vite 4.0+

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，并配置域名到歌手的映射：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 域名到歌手的映射配置
# 格式：域名=singer标识
# 多个域名用换行分隔

# 本地开发环境
localhost=youyou

# 示例：为不同歌手配置不同域名
# youyou.example.com=youyou
# bingjie.example.com=bingjie
# newartist.example.com=newartist

# 默认值（当域名不匹配时使用）
DEFAULT_ARTIST=youyou
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 4. 通过 URL 参数访问不同歌手

如果不想配置域名，也可以通过 URL 参数 `?artist=singer标识` 来访问不同歌手的歌单：

```
http://localhost:5173?artist=youyou
http://localhost:5173?artist=bingjie
```

## 配置说明

### 域名映射

前端通过以下优先级顺序获取歌手标识：

1. **环境变量映射**：从 `.env` 文件中根据当前域名查找对应的歌手标识
2. **URL 参数**：从 URL 中的 `?artist=` 参数获取
3. **默认值**：使用 `DEFAULT_ARTIST` 配置的默认值

### 后端 API 对接

前端通过统一的 API 路径 `/api/songlist/` 访问后端，并自动附加 `artist` 参数：

```
GET /api/songlist/songs/?artist=youyou
GET /api/songlist/languages/?artist=youyou
GET /api/songlist/styles/?artist=youyou
GET /api/songlist/random/?artist=youyou
GET /api/songlist/settings/?artist=youyou
```

### 网站设置

前端会自动从后端 `/api/songlist/settings/?artist=xxx` 获取歌手的网站设置，包括：

- **头像图标**（position=1）：显示在页面顶部
- **背景图片**（position=2）：作为页面背景
- **页面标题**：从后端获取并显示

## 部署

### 1. 构建生产版本

```bash
npm run build
```

构建后的文件在 `dist/` 目录。

### 2. 配置 Nginx

参考 `nginx.example.conf` 文件配置 Nginx。

#### 开发环境配置

```nginx
server {
    listen 80;
    server_name youyou.example.com;

    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
    }
}
```

#### 生产环境配置

```nginx
server {
    listen 80;
    server_name youyou.example.com;

    root /path/to/songlist-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
    }
}
```

### 3. 配置多个歌手域名

在 Nginx 中为每个歌手配置一个 `server` 块，所有域名都指向同一个前端应用：

```nginx
# 歌手 1
server {
    listen 80;
    server_name youyou.example.com;
    # ... 配置同上
}

# 歌手 2
server {
    listen 80;
    server_name bingjie.example.com;
    # ... 配置同上
}
```

## 添加新歌手

### 步骤 1：后端配置

在 `songlist/models.py` 的 `ARTIST_CONFIG` 中添加新歌手：

```python
ARTIST_CONFIG = {
    'youyou': '乐游',
    'bingjie': '冰洁',
    'newartist': '新歌手',  # 添加这一行
}
```

运行数据库迁移：

```bash
python manage.py makemigrations songlist
python manage.py migrate songlist --database=songlist_db
```

### 步骤 2：前端配置

在 `.env` 文件中添加域名映射：

```env
newartist.example.com=newartist
```

或者通过 URL 参数访问：

```
http://your-domain.com?artist=newartist
```

### 步骤 3：Nginx 配置

添加新的 `server` 块：

```nginx
server {
    listen 80;
    server_name newartist.example.com;
    # ... 配置同上
}
```

### 步骤 4：导入数据

通过 Django Admin 后台导入歌曲和网站设置数据。

## 功能说明

### 歌曲列表

- 显示歌曲名称、语言、原唱歌手、曲风、备注
- 支持分页加载
- 响应式表格，移动端自适应

### 搜索和筛选

- **语言筛选**：按语言筛选歌曲
- **曲风筛选**：按曲风筛选歌曲
- **搜索功能**：按歌名或歌手名称搜索
- **组合筛选**：可以同时使用多个筛选条件

### 盲盒功能

- 点击"盲盒"按钮随机推荐一首歌曲
- 支持基于当前筛选条件的随机推荐
- 可以多次抽取，直到找到满意的歌曲

### 网站设置

- 自动从后端获取歌手的网站设置
- 支持自定义头像图标
- 支持自定义背景图片
- 动态显示歌手名称

## 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_DEFAULT_ARTIST` | 默认歌手标识 | `youyou` |
| `VITE_DOMAIN_MAPPINGS` | 域名到歌手的映射（JSON） | `{"youyou.example.com":"youyou"}` |

## 文件结构

```
Temp_frontend/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 组件
│   │   └── HeadIcon.vue   # 头像组件
│   ├── App.vue            # 主应用组件
│   └── main.js            # 应用入口
├── .env                   # 环境变量配置
├── .env.example           # 环境变量示例
├── .gitignore            # Git 忽略文件
├── nginx.example.conf    # Nginx 配置示例
├── package.json          # 项目配置
├── vite.config.js        # Vite 配置
└── README.md             # 本文档
```

## 常见问题

### Q: 如何测试不同歌手的歌单？

A: 可以通过以下方式：
1. 配置不同的域名并修改本地 hosts 文件
2. 使用 URL 参数：`http://localhost:5173?artist=bingjie`

### Q: 为什么页面显示默认歌手的歌单？

A: 检查以下几点：
1. `.env` 文件中的域名映射是否正确
2. 域名是否配置正确
3. 是否使用 URL 参数覆盖

### Q: 如何自定义页面样式？

A: 可以修改 `src/App.vue` 中的 `<style>` 部分，或者创建独立的 CSS 文件。

### Q: 支持 HTTPS 吗？

A: 支持。参考 `nginx.example.conf` 中的 HTTPS 配置示例。

## 维护建议

1. **定期更新依赖**：运行 `npm update` 更新依赖包
2. **代码规范**：使用 ESLint 和 Prettier 保持代码风格一致
3. **性能优化**：使用生产构建并启用 Gzip 压缩
4. **安全加固**：配置 HTTPS 和安全响应头

## 许可证

本项目采用 GPLv3 许可证。

## 联系方式

如有问题，请联系项目维护者。
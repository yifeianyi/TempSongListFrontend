# Songlist 模板前端部署指南

本文档详细说明如何部署 Songlist 模板前端，实现通过不同域名访问不同歌手的歌单页面。

## 部署架构

```
                    用户请求
                        |
                        v
                 [ 域名解析 ]
                        |
         +--------------+--------------+
         |                             |
         v                             v
  youyou.example.com          bingjie.example.com
         |                             |
         +--------------+--------------+
                        |
                        v
                 [ Nginx 服务器 ]
                        |
           +------------+------------+
           |                         |
           v                         v
    [ 前端应用 ]              [ 后端 API ]
  (127.0.0.1:5173)           (127.0.0.1:8000)
```

## 部署步骤

### 前提条件

- 服务器已安装 Node.js 18+
- 服务器已安装 Nginx
- 服务器已配置好 Django 后端（songlist 应用）
- 已准备好域名并解析到服务器

### 步骤 1：上传代码到服务器

```bash
# 在本地构建
npm run build

# 上传 dist 目录到服务器
scp -r dist/ user@your-server:/var/www/songlist-frontend/
```

### 步骤 2：配置环境变量

在服务器上创建 `.env` 文件：

```bash
cd /var/www/songlist-frontend
nano .env
```

配置内容：

```env
# 域名到歌手的映射
youyou_example_com=youyou
bingjie_example_com=bingjie

# 默认歌手
DEFAULT_ARTIST=youyou
```

**注意**：在环境变量中，域名中的点号（.）需要替换为下划线（_），因为某些系统不支持在环境变量中使用点号。

### 步骤 3：配置 Nginx

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/songlist-frontend
```

配置内容：

```nginx
# 通用上游配置
upstream songlist_backend {
    server 127.0.0.1:8000;
}

# 歌手 1: 乐游
server {
    listen 80;
    server_name youyou.example.com;

    # 前端静态文件
    root /var/www/songlist-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://songlist_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 媒体文件
    location /media {
        proxy_pass http://songlist_backend;
        proxy_set_header Host $host;
    }

    location /photos {
        proxy_pass http://songlist_backend;
        proxy_set_header Host $host;
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}

# 歌手 2: 冰洁
server {
    listen 80;
    server_name bingjie.example.com;

    # 前端静态文件
    root /var/www/songlist-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://songlist_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 媒体文件
    location /media {
        proxy_pass http://songlist_backend;
        proxy_set_header Host $host;
    }

    location /photos {
        proxy_pass http://songlist_backend;
        proxy_set_header Host $host;
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/songlist-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 步骤 4：配置域名解析

在域名服务商处配置 DNS 解析：

```
youyou.example.com -> 您的服务器 IP
bingjie.example.com -> 您的服务器 IP
```

### 步骤 5：测试访问

在浏览器中访问：

- http://youyou.example.com
- http://bingjie.example.com

应该能看到不同歌手的歌单页面。

## HTTPS 配置（推荐）

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d youyou.example.com -d bingjie.example.com

# 自动续期
sudo certbot renew --dry-run
```

Certbot 会自动更新 Nginx 配置，启用 HTTPS。

## 添加新歌手

### 1. 后端配置

在 `songlist/models.py` 中添加新歌手：

```python
ARTIST_CONFIG = {
    'youyou': '乐游',
    'bingjie': '冰洁',
    'newartist': '新歌手',
}
```

运行迁移：

```bash
python manage.py makemigrations songlist
python manage.py migrate songlist --database=songlist_db
```

### 2. 前端配置

更新 `.env` 文件：

```env
youyou_example_com=youyou
bingjie_example_com=bingjie
newartist_example_com=newartist
```

### 3. Nginx 配置

添加新的 server 块：

```nginx
server {
    listen 80;
    server_name newartist.example.com;

    root /var/www/songlist-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://songlist_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /media {
        proxy_pass http://songlist_backend;
        proxy_set_header Host $host;
    }

    location /photos {
        proxy_pass http://songlist_backend;
        proxy_set_header Host $host;
    }
}
```

重新加载 Nginx：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 4. 导入数据

通过 Django Admin 后台导入歌曲和网站设置数据。

## 故障排查

### 问题 1：访问域名显示 404

**原因**：Nginx 配置错误或静态文件路径不对。

**解决方案**：
1. 检查 Nginx 配置：`sudo nginx -t`
2. 检查静态文件路径：`ls -la /var/www/songlist-frontend/dist/`
3. 查看 Nginx 错误日志：`sudo tail -f /var/log/nginx/error.log`

### 问题 2：显示默认歌手而不是对应歌手

**原因**：环境变量配置错误。

**解决方案**：
1. 检查 `.env` 文件内容
2. 确保域名中的点号替换为下划线
3. 检查 Nginx 配置中的 `server_name` 是否正确

### 问题 3：API 请求失败

**原因**：后端服务未启动或 Nginx 代理配置错误。

**解决方案**：
1. 检查后端服务是否运行：`systemctl status gunicorn`
2. 检查 Nginx 代理配置
3. 查看后端日志：`sudo tail -f /var/log/gunicorn/error.log`

### 问题 4：图片加载失败

**原因**：媒体文件路径配置错误。

**解决方案**：
1. 检查 Nginx 中的 `/media` 和 `/photos` 配置
2. 检查后端媒体文件路径
3. 确保文件权限正确

## 性能优化

### 1. 启用 Gzip 压缩

已在 Nginx 配置中启用。

### 2. 启用浏览器缓存

在 Nginx 配置中添加：

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. 使用 CDN

对于静态资源，可以使用 CDN 加速。

### 4. 启用 HTTP/2

Nginx 1.9.5+ 支持 HTTP/2，在配置中添加：

```nginx
listen 443 ssl http2;
```

## 监控和日志

### Nginx 日志

```bash
# 访问日志
sudo tail -f /var/log/nginx/access.log

# 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 后端日志

```bash
# Gunicorn 日志
sudo tail -f /var/log/gunicorn/error.log

# Django 日志
sudo tail -f /var/log/django/error.log
```

## 安全建议

1. **启用 HTTPS**：使用 SSL/TLS 加密通信
2. **配置防火墙**：只开放必要的端口（80, 443）
3. **定期更新**：及时更新系统和软件包
4. **备份**：定期备份数据库和代码
5. **监控**：设置监控告警，及时发现异常

## 维护

### 更新前端代码

```bash
# 本地构建
npm run build

# 上传到服务器
scp -r dist/* user@your-server:/var/www/songlist-frontend/dist/

# 重启 Nginx（如果需要）
sudo systemctl reload nginx
```

### 添加新歌手

参考前面的"添加新歌手"章节。

## 总结

通过以上步骤，您已经成功部署了 Songlist 模板前端，实现了通过不同域名访问不同歌手的歌单页面。如有任何问题，请参考故障排查章节或联系技术支持。
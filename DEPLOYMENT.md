# 🚀 CodeX 项目部署指南

## 方案一：Vercel 部署（推荐，5 分钟上线）⭐

### 步骤 1：准备 GitHub 仓库

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 创建 .gitignore（如果还没有）
echo "node_modules" > .gitignore
echo ".env.local" >> .gitignore
echo "dist" >> .gitignore

# 提交
git commit -m "Initial commit"
```

### 步骤 2：推送到 GitHub

1. 访问 https://github.com 并登录
2. 创建新仓库（例如：`codex`）
3. 按提示推送代码：

```bash
# 关联远程仓库
git remote add origin https://github.com/你的用户名/codex.git

# 推送
git push -u origin main
```

### 步骤 3：在 Vercel 部署

1. **访问** https://vercel.com 并注册（可用 GitHub 账号登录）
2. **点击** "Add New Project"
3. **选择** 你的 `codex` 仓库
4. **配置环境变量**（重要！）：
   - 点击 "Environment Variables"
   - 添加：
     - `VITE_SUPABASE_URL` = `https://gzkpctjtwsqkxhxnyxtw.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `sb_publishable_FYJ1xx7cguNRIWLeQUkALA_zcpKfMfm`
5. **点击** "Deploy"

### 步骤 4：等待部署完成

- ⏳ 约 2-5 分钟
- ✅ 部署成功后会获得一个域名：`https://codex-xxx.vercel.app`
- 🌐 立即可以公网访问！

### 步骤 5：自定义域名（可选）

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的域名
3. 按提示配置 DNS

---

## 方案二：Cloudflare Pages（完全免费）

### 步骤 1：登录 Cloudflare

1. 访问 https://pages.cloudflare.com
2. 用 Cloudflare 账号登录（没有就注册）

### 步骤 2：连接 Git

1. 点击 "Create a project"
2. 选择 "Connect to Git"
3. 选择你的 `codex` 仓库

### 步骤 3：配置构建

- **Build command**: `npm run build`
- **Build output directory**: `dist`

### 步骤 4：设置环境变量

点击 "Environment variables" → "Add variable"：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 步骤 5：部署

点击 "Save and Deploy"，等待完成即可！

---

## 方案三：VPS 服务器部署（最灵活）

### 准备工作

- 购买 VPS（阿里云/腾讯云/DigitalOcean）
- 系统推荐：Ubuntu 20.04 或 22.04
- 配置：1 核 2G 起步（约 60 元/月）

### 步骤 1：安装 Node.js

```bash
# SSH 登录服务器
ssh root@你的服务器 IP

# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v
npm -v
```

### 步骤 2：上传代码

```bash
# 方法 1：使用 Git
cd /var/www
git clone https://github.com/你的用户名/codex.git
cd codex

# 方法 2：使用 SCP（从本地上传）
# 在本地执行：
scp -r ./admin@服务器IP:/var/www/codex
```

### 步骤 3：安装依赖

```bash
cd /var/www/codex
npm install
```

### 步骤 4：配置环境变量

```bash
# 创建 .env.production 文件
nano .env.production

# 填入内容：
VITE_SUPABASE_URL=https://gzkpctjtwsqkxhxnyxtw.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_FYJ1xx7cguNRIWLeQUkALA_zcpKfMfm
```

### 步骤 5：构建项目

```bash
npm run build
```

### 步骤 6：安装 Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### 步骤 7：配置 Nginx

```bash
# 编辑 Nginx 配置
sudo nano /etc/nginx/sites-available/codex

# 填入以下内容：
server {
    listen 80;
    server_name 你的域名或服务器 IP;
    
    root /var/www/codex/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 步骤 8：启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/codex /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 步骤 9：开放防火墙（如果需要）

```bash
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS'
```

### 步骤 10：配置 HTTPS（推荐）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书（如果有域名）
sudo certbot --nginx -d 你的域名

# 自动续期
sudo certbot renew --dry-run
```

---

## 🔍 验证部署

### 测试清单

1. **访问网站**
   - 打开浏览器输入域名
   - 应该能看到登录页面

2. **测试登录**
   - 使用 `admin` / `admin123` 登录
   - 检查控制台是否有错误

3. **测试用户管理**
   - 创建新用户
   - 编辑、禁用、删除用户
   - 检查 Supabase 数据库是否同步

4. **性能检查**
   - 页面加载速度
   - 资源是否正确缓存

---

## 📊 各方案成本对比

| 方案 | 费用 | 难度 | 适合场景 |
|------|------|------|----------|
| **Vercel** | 免费（$0/月） | ⭐ 简单 | 个人项目、演示、小型应用 |
| **Cloudflare Pages** | 免费（$0/月） | ⭐⭐ 中等 | 需要全球加速的应用 |
| **VPS 服务器** | 60-200 元/月 | ⭐⭐⭐ 较难 | 生产环境、企业应用 |

---

## 🎯 我的建议

### 如果你是新手/个人项目：
✅ **选择 Vercel**
- 5 分钟上线
- 无需运维
- 自动 HTTPS
- 免费额度够用

### 如果你需要国内快速访问：
✅ **选择 Cloudflare Pages** 或 **国内 VPS**

### 如果是企业生产环境：
✅ **选择 VPS** + **备案域名** + **HTTPS**

---

## 💡 常见问题

### Q: 部署后无法访问 Supabase？
A: 检查环境变量是否正确配置，确保 URL 和 Key 完全正确。

### Q: 刷新页面出现 404？
A: 需要配置 SPA 路由重写，vercel.json 已包含此配置。

### Q: 如何更新部署？
A: 
- **Vercel/Cloudflare**: 推送代码到 GitHub 自动重新部署
- **VPS**: 重新拉取代码并构建

### Q: 需要备案吗？
A: 
- 使用 Vercel/Cloudflare 提供的域名：**不需要**
- 使用自己的国内域名：**需要备案**

---

**祝你部署顺利！** 🎉  
有任何问题随时问我！

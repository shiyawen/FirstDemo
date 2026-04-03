# Supabase 快速配置指南

## 🎯 5 分钟快速开始

### 第一步：创建 .env.local 文件

在项目根目录创建 `.env.local` 文件，内容如下：

```env
VITE_SUPABASE_URL=你的 Supabase 项目 URL
VITE_SUPABASE_ANON_KEY=你的 Supabase Anon Key
```

### 第二步：获取 Supabase 凭证

1. 访问 https://supabase.com 并登录
2. 创建新项目或选择现有项目
3. 进入 **Settings** → **API**
4. 复制两个值填入 `.env.local`

### 第三步：执行 SQL 脚本

在 Supabase 的 **SQL Editor** 中执行 `supabase-schema.sql` 文件的内容。

### 第四步：重启服务

```bash
# 停止当前运行的服务（Ctrl+C）
npm run dev
```

查看控制台输出：
- ✅ 无警告信息 = 配置正确
- ⚠️ "Supabase 配置缺失" = 检查 `.env.local`

---

📖 详细说明请查看 `SUPABASE_SETUP.md`

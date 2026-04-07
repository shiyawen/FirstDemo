# 部署到 Gitee Pages - 完整指南

## 为什么选择 Gitee Pages？
- ✅ 国内访问无限制
- ✅ 速度超快（CDN 加速）
- ✅ 完全免费
- ✅ 支持 HTTPS
- ✅ 一键开启静态托管

---

## 🚀 快速部署步骤

### 第一步：创建 Gitee 账号（如果没有）

1. 访问 https://gitee.com
2. 注册账号（支持手机号注册）

### 第二步：创建仓库

1. 登录 Gitee
2. 点击右上角 **"+"** → **"新建仓库"**
3. 填写信息：
   - 仓库名称：`codex` 或 `FirstDemo`
   - 公开性：**公开**
   - 初始化：❌ 不要勾选任何选项
4. 点击 **"创建"**

### 第三步：推送代码到 Gitee

```bash
# 添加 Gitee 远程仓库（替换为你的用户名）
git remote add gitee https://gitee.com/你的用户名/codex.git

# 推送代码
git push gitee main
```

### 第四步：开启 Pages 服务

1. 进入你的 Gitee 仓库页面
2. 点击顶部菜单 **"服务"** → **"Gitee Pages"**
3. 配置：
   - 来源分支：`main`
   - 生成路径：留空
4. 点击 **"启动"**
5. 等待约 1-2 分钟

### 第五步：获得访问地址

你会看到类似这样的地址：
```
https://你的用户名.gitee.io/codex/
```

**✅ 这个地址国内可以直接访问！**

---

## ⚠️ 重要：配置 Supabase

由于 Gitee Pages 不支持环境变量，需要在代码中硬编码配置。

我已经为你准备好了修改方案：

### 修改 supabaseService.ts

在文件开头添加常量：

```typescript
// 生产环境配置（硬编码）
const SUPABASE_URL = 'https://gzkpctjtwsqkxhxnyxtw.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_FYJ1xx7cguNRIWLeQUkALA_zcpKfMfm'

// 使用硬编码值（适用于 Gitee Pages）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY
```

这样可以同时支持本地开发（使用环境变量）和生产环境（使用硬编码）。

---

## 📊 与 Cloudflare 对比

| 特性 | Gitee Pages | Cloudflare Pages |
|------|------------|------------------|
| 国内访问 | ✅ 极速 | ❌ 受限 |
| 费用 | 免费 | 免费 |
| 构建速度 | 快 | 中等 |
| 环境变量 | ❌ 不支持 | ✅ 支持 |
| HTTPS | ✅ | ✅ |
| 自定义域名 | ✅ | ✅ |
| 上手难度 | ⭐⭐ | ⭐ |

---

## 💡 我的建议

### 如果你想要：
- **最快的国内访问速度** → Gitee Pages
- **最简单的配置** → Gitee Pages
- **支持环境变量** → 考虑其他方案

---

## 🎯 立即执行

现在就开始吧！只需 5 分钟就能搞定：

1. 去 Gitee 创建仓库
2. 推送代码
3. 开启 Pages 服务
4. 获得访问地址！

需要帮助随时找我！🚀

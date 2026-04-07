# Gitee（码云）部署方案

## 为什么选择 Gitee？
- ✅ 国内访问速度快
- ✅ 完全免费
- ✅ 支持静态页面托管
- ✅ 与 GitHub 同步方便

## 部署步骤

### 第一步：创建 Gitee 仓库

1. 访问 https://gitee.com
2. 登录/注册账号
3. 点击右上角 "+" → "新建仓库"
4. 填写信息：
   - 仓库路径：`codex` 或 `FirstDemo`
   - 公开性：公开
   - 初始化：不勾选任何选项

### 第二步：同步代码到 Gitee

```bash
# 添加 Gitee 远程仓库
git remote add gitee https://gitee.com/你的用户名/codex.git

# 推送到 Gitee
git push gitee main
```

### 第三步：开启 Gitee Pages 服务

1. 进入你的 Gitee 仓库页面
2. 点击 "服务" → "Gitee Pages"
3. 选择分支：`main`
4. 点击 "启动"
5. 获得访问地址：`https://你的用户名.gitee.io/codex/`

### 第四步：配置环境变量

⚠️ **注意**：Gitee Pages 不支持环境变量配置！

需要使用以下方法之一：

#### 方法 A：硬编码（简单但不推荐）

修改 `src/services/supabaseService.ts`：

```typescript
const supabaseUrl = 'https://gzkpctjtwsqkxhxnyxtw.supabase.co'
const supabaseAnonKey = 'sb_publishable_FYJ1xx7cguNRIWLeQUkALA_zcpKfMfm'
```

然后重新构建推送。

#### 方法 B：使用配置文件

创建 `src/config.ts`：

```typescript
export const config = {
  supabaseUrl: 'https://gzkpctjtwsqkxhxnyxtw.supabase.co',
  supabaseAnonKey: 'sb_publishable_FYJ1xx7cguNRIWLeQUkALA_zcpKfMfm',
}
```

然后在代码中导入使用。

---

## 自动化同步脚本

创建 `.github/workflows/sync-to-gitee.yml`：

```yaml
name: Sync to Gitee

on:
  push:
    branches: [main]

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Sync to Gitee
        uses: adambirds/sync-github-to-gitlab-action@v1.0.0
        with:
          destination_repository: https://gitee.com/你的用户名/codex.git
          destination_branch: main
        env:
          DESTINATION_USERNAME: 你的 Gitee 用户名
          DESTINATION_PASSWORD: ${{ secrets.GITEE_PASSWORD }}
```

---

## 推荐方案对比

| 方案 | 速度 | 难度 | 成本 | 推荐度 |
|------|------|------|------|--------|
| **Cloudflare Pages** | ⭐⭐⭐⭐ | ⭐ | 免费 | ⭐⭐⭐⭐⭐ |
| **Gitee Pages** | ⭐⭐⭐⭐⭐ | ⭐⭐ | 免费 | ⭐⭐⭐⭐ |
| **阿里云 Web+** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ¥50+/月 | ⭐⭐⭐ |
| **VPS 自建** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ¥60+/月 | ⭐⭐⭐ |

---

## 我的建议

### 个人项目/演示：
✅ **Cloudflare Pages** - 最简单，免费，速度够用

### 企业项目：
✅ **Gitee Pages** + 自定义域名 - 速度最快

### 需要后端集成：
✅ **阿里云/腾讯云** - 更灵活

---

现在就去试试吧！🚀

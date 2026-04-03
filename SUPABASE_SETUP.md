# Supabase 集成指南

## 📋 步骤一：创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 并注册账号
2. 点击 "New Project" 创建新项目
3. 填写项目信息：
   - **Name**: codex（或你喜欢的名字）
   - **Database Password**: 设置一个强密码（请妥善保管）
   - **Region**: 选择离你最近的区域
4. 等待项目创建完成（约 2-5 分钟）

## 📋 步骤二：获取 API 凭证

1. 进入项目后，点击左侧菜单的 **Settings** (齿轮图标)
2. 选择 **API**
3. 复制以下两个值：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbG...` (很长的字符串)

## 📋 步骤三：配置环境变量

1. 在项目根目录创建 `.env.local` 文件：
   ```bash
   cp .env.example .env.local
   ```

2. 编辑 `.env.local` 文件，填入你的凭证：
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 📋 步骤四：创建数据库表

1. 在 Supabase 控制台，点击左侧菜单的 **SQL Editor**
2. 点击 "New Query"
3. 复制并粘贴 `supabase-schema.sql` 文件中的全部内容
4. 点击 "Run" 执行 SQL 脚本

成功标志：看到 "Success. No rows returned" 提示

## 📋 步骤五：验证集成

1. 确保开发服务器正在运行：
   ```bash
   npm run dev
   ```

2. 打开浏览器访问 `http://localhost:5173`

3. 使用默认管理员账号登录：
   - 用户名：`admin`
   - 密码：`admin123`

4. 检查浏览器控制台：
   - 如果看到 `✅ 默认管理员账户已创建`，说明初始化成功
   - 如果能成功登录，说明集成成功

## 🔧 故障排查

### 问题：看到 "⚠️ Supabase 配置缺失" 警告

**解决方案**：
- 检查 `.env.local` 文件是否存在
- 确认环境变量名称正确（`VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`）
- 重启开发服务器（停止后重新运行 `npm run dev`）

### 问题：登录失败或无法创建用户

**解决方案**：
1. 检查 Supabase 项目是否正常运行
2. 验证数据库表是否正确创建：
   - 进入 **Table Editor** 查看是否有 `users` 表
   - 检查表中是否有数据
3. 检查行级安全策略（RLS）是否正确配置

### 问题：CORS 错误

**解决方案**：
- 确保在 `.env.local` 中配置的 URL 完全正确（包括 `https://`）
- 检查 Supabase 项目设置中的 Site URL 配置

## 📊 数据迁移（可选）

如果你想从 localStorage 迁移现有数据到 Supabase：

1. 在浏览器控制台导出 localStorage 数据：
   ```javascript
   const users = JSON.parse(localStorage.getItem('codex_users'));
   console.log(JSON.stringify(users, null, 2));
   ```

2. 在 Supabase SQL Editor 中手动插入数据：
   ```sql
   INSERT INTO users (id, username, password, email, created_at)
   VALUES 
     ('1', 'admin', 'admin123', 'admin@codex.com', '2024-01-01T00:00:00Z');
   -- 添加更多用户...
   ```

## 🚀 下一步优化建议

### 1. 密码加密（强烈推荐）
当前密码是明文存储的，生产环境必须加密：

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

然后在 `supabaseService.ts` 中添加加密逻辑。

### 2. 添加邮箱验证
启用 Supabase Auth 的邮箱验证功能。

### 3. 完善权限控制
细化 RLS 策略，限制用户只能访问自己的数据。

### 4. 添加实时订阅
利用 Supabase 的实时功能实现多端数据同步。

## 📚 参考资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript/introduction)
- [行级安全策略 (RLS) 指南](https://supabase.com/docs/guides/auth/row-level-security)

---

祝你集成顺利！如有问题，欢迎查阅 Supabase 文档或寻求社区帮助。

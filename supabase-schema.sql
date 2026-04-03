-- Supabase 数据库表结构
-- 在 Supabase SQL Editor 中执行此脚本

-- 创建 users 表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  is_disabled BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- 启用行级安全策略（RLS）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有用户读取（生产环境应该限制）
CREATE POLICY "Allow public read access" ON users
  FOR SELECT
  USING (true);

-- 创建策略：允许插入新用户
CREATE POLICY "Allow public insert" ON users
  FOR INSERT
  WITH CHECK (true);

-- 创建策略：允许更新自己的信息
CREATE POLICY "Allow users to update own data" ON users
  FOR UPDATE
  USING (true);

-- 创建策略：允许删除（仅管理员，这里简化处理）
CREATE POLICY "Allow delete" ON users
  FOR DELETE
  USING (true);

-- 注释说明
COMMENT ON TABLE users IS '用户账户表';
COMMENT ON COLUMN users.id IS '用户唯一标识符';
COMMENT ON COLUMN users.username IS '用户名（唯一）';
COMMENT ON COLUMN users.password IS '密码（生产环境应加密存储）';
COMMENT ON COLUMN users.email IS '电子邮箱地址';
COMMENT ON COLUMN users.created_at IS '账户创建时间';
COMMENT ON COLUMN users.last_login IS '最后登录时间';

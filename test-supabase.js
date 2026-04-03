import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 开始验证 Supabase 连接...')
console.log('📡 Supabase URL:', supabaseUrl)
console.log('🔑 Anon Key:', supabaseAnonKey ? '已配置 ✅' : '未配置 ❌')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 环境变量未配置完整！')
} else {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  // 测试连接
  const testConnection = async () => {
    try {
      console.log('\n📡 正在测试数据库连接...')
      
      // 尝试查询 users 表
      const { data, error } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true })
      
      if (error) {
        if (error.message.includes('relation "public.users" does not exist')) {
          console.error('❌ 数据库表不存在！')
          console.log('\n📝 请在 Supabase SQL Editor 中执行以下 SQL 创建表：')
          console.log('访问：https://supabase.com/dashboard/project/gzkpctjtwsqkxhxnyxtw/sql\n')
          console.log('-- 复制 supabase-schema.sql 文件的内容并执行')
        } else if (error.message.includes('JWT')) {
          console.error('❌ 认证失败！请检查 Anon Key 是否正确')
        } else {
          console.error('❌ 连接错误:', error.message)
        }
        return false
      }
      
      console.log('✅ 数据库连接成功！')
      console.log('✅ users 表已存在')
      
      // 检查是否有数据
      const { data: users } = await supabase
        .from('users')
        .select('*')
        .limit(1)
      
      if (users && users.length > 0) {
        console.log('✅ 数据库中已有用户数据')
      } else {
        console.log('ℹ️  数据库为空，将自动创建默认管理员账户')
      }
      
      return true
    } catch (err) {
      console.error('❌ 测试失败:', err.message)
      return false
    }
  }
  
  testConnection()
}

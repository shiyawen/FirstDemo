import { createClient } from '@supabase/supabase-js'
import type { User, UserProfile } from './userService'

export type { User, UserProfile }

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 调试信息：检查环境变量是否正确加载
console.log('🔍 Supabase 配置检查:')
console.log('  - URL:', supabaseUrl ? '✅ 已配置' : '❌ 未配置')
console.log('  - Key:', supabaseAnonKey ? '✅ 已配置 (长度:' + (supabaseAnonKey?.length || 0) + ')' : '❌ 未配置')

// 检查 Supabase 配置是否存在
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase 配置缺失，请检查 .env.local 文件')
  console.info('📖 应用将回退到 localStorage 模式')
} else {
  console.log('✅ Supabase 配置正确，使用云端数据库模式')
}

// 仅在配置存在时创建 Supabase 客户端
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    })
  : null

// 用户数据表操作
const USERS_TABLE = 'users'

// Supabase 字段映射（数据库使用 snake_case，代码中使用 camelCase）
interface SupabaseUser {
  id: string;
  username: string;
  password: string;
  email?: string;
  created_at: string;
  last_login?: string;
  is_disabled?: boolean;
  updated_at?: string;
}

// 转换为应用 User 格式
const toAppUser = (dbUser: SupabaseUser): User => ({
  ...dbUser,
  createdAt: dbUser.created_at,
  isDisabled: dbUser.is_disabled,
  lastLogin: dbUser.last_login,
})

// 初始化默认管理员账户（仅在数据库为空时）
export const initializeDefaultUsers = async () => {
  // 如果没有配置 Supabase，使用 localStorage
  if (!isSupabaseConfigured) {
    // 调用原有的 localStorage 初始化逻辑
    const USERS_STORAGE_KEY = 'codex_users';
    const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!existingUsers) {
      const defaultUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          password: 'admin123',
          email: 'admin@codex.com',
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
      console.log('✅ 默认管理员账户已创建 (localStorage 模式)');
    }
    return;
  }

  try {
    // 检查是否已有用户
    const { data: existingUsers, error: countError } = await supabase!
      .from(USERS_TABLE)
      .select('id', { count: 'exact' })
    
    if (countError) throw countError
    
    // 如果没有用户，创建默认管理员
    if (!existingUsers || existingUsers.length === 0) {
      const defaultUser: Omit<SupabaseUser, 'id' | 'created_at'> & { created_at?: string } = {
        username: 'admin',
        password: 'admin123', // 生产环境应该加密
        email: 'admin@codex.com',
        created_at: new Date().toISOString(),
      }
      
      const { error: insertError } = await supabase!
        .from(USERS_TABLE)
        .insert([defaultUser])
      
      if (insertError) throw insertError
      console.log('✅ 默认管理员账户已创建 (Supabase 模式)')
    }
  } catch (error) {
    console.error('❌ 初始化默认用户失败:', error)
  }
}

// 获取所有用户
export const getAllUsers = async (): Promise<User[]> => {
  // 如果没有配置 Supabase，使用 localStorage
  if (!isSupabaseConfigured) {
    const USERS_STORAGE_KEY = 'codex_users';
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users).map((u: any) => ({ ...u, createdAt: u.created_at || u.createdAt })) : [];
  }

  try {
    const { data, error } = await supabase!
      .from(USERS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return (data || []).map(toAppUser)
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return []
  }
}

// 根据用户名查找用户
export const getUserByUsername = async (username: string): Promise<User | undefined> => {
  // 如果没有配置 Supabase，使用 localStorage
  if (!isSupabaseConfigured) {
    const USERS_STORAGE_KEY = 'codex_users';
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    const userArray = users ? JSON.parse(users) : [];
    return userArray.find((u: any) => u.username === username);
  }

  try {
    const { data, error } = await supabase!
      .from(USERS_TABLE)
      .select('*')
      .eq('username', username)
      .single()
    
    if (error) throw error
    return data ? toAppUser(data as SupabaseUser) : undefined
  } catch (error) {
    console.error('查找用户失败:', error)
    return undefined
  }
}

// 验证登录凭证
export const validateLogin = async (username: string, password: string): Promise<User | null> => {
  // 如果没有配置 Supabase，使用 localStorage
  if (!isSupabaseConfigured) {
    const USERS_STORAGE_KEY = 'codex_users';
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    const userArray = users ? JSON.parse(users) : [];
    const user = userArray.find((u: any) => u.username === username && u.password === password);
    if (user) {
      // 检查是否被禁用
      if (user.isDisabled === true) {
        console.warn('❌ 用户已被禁用，拒绝登录');
        return null;
      }
      // 更新最后登录时间（localStorage 模式）
      user.last_login = new Date().toISOString();
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(userArray));
    }
    return user ? { ...user, createdAt: user.created_at || user.createdAt } : null;
  }

  try {
    const user = await getUserByUsername(username)
    console.log('🔍 登录验证 - 查询到的用户:', user)
    console.log('  - isDisabled:', user?.isDisabled)
    console.log('  - username:', user?.username)
    
    if (user && user.password === password) {
      // 检查是否被禁用（admin 不能被禁用）
      if (user.username !== 'admin' && user.isDisabled === true) {
        console.warn('❌ 用户已被禁用，拒绝登录')
        return null
      }
      // 更新最后登录时间
      await supabase!
        .from(USERS_TABLE)
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id)
      
      return user
    }
    return null
  } catch (error) {
    console.error('登录验证失败:', error)
    return null
  }
}

// 创建新用户
export const createUser = async (username: string, password: string, email?: string): Promise<User | null> => {
  // 如果没有配置 Supabase，使用 localStorage
  if (!isSupabaseConfigured) {
    const USERS_STORAGE_KEY = 'codex_users';
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    const userArray = users ? JSON.parse(users) : [];
    
    // 检查用户名是否已存在
    if (userArray.find((u: any) => u.username === username)) {
      return null;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      email,
      createdAt: new Date().toISOString(),
    };

    userArray.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(userArray));
    return newUser;
  }

  try {
    // 检查用户名是否已存在
    const existingUser = await getUserByUsername(username)
    if (existingUser) {
      return null
    }

    const newUser: Omit<SupabaseUser, 'id' | 'created_at'> & { created_at?: string } = {
      username,
      password, // 生产环境应该使用 bcrypt 加密
      email,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase!
      .from(USERS_TABLE)
      .insert([newUser])
      .select()
      .single()
    
    if (error) throw error
    return toAppUser(data as SupabaseUser)
  } catch (error) {
    console.error('创建用户失败:', error)
    return null
  }
}

// 设置当前登录用户（仍然使用 localStorage 用于会话保持）
export const setCurrentUser = (user: User | null) => {
  const CURRENT_USER_KEY = 'codex_current_user'
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

// 获取当前登录用户
export const getCurrentUser = (): User | null => {
  const CURRENT_USER_KEY = 'codex_current_user'
  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

// 退出登录
export const logout = () => {
  localStorage.removeItem('codex_current_user')
}

// 获取用户档案（不包含密码）
export const getUserProfile = (user: User): UserProfile => {
  const { password, ...profile } = user
  return profile
}

// 更新用户信息
export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  // 如果没有配置 Supabase，使用 localStorage
  if (!isSupabaseConfigured) {
    const USERS_STORAGE_KEY = 'codex_users';
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    const userArray = users ? JSON.parse(users) : [];
    const index = userArray.findIndex((u: any) => u.id === id);
    if (index === -1) return null;
    
    userArray[index] = { ...userArray[index], ...updates };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(userArray));
    return { ...userArray[index], createdAt: userArray[index].created_at || userArray[index].createdAt };
  }

  try {
    const { data, error } = await supabase!
      .from(USERS_TABLE)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return toAppUser(data as SupabaseUser)
  } catch (error) {
    console.error('更新用户失败:', error)
    return null
  }
}

// 切换用户禁用状态
export const toggleUserDisabled = async (id: string): Promise<boolean> => {
  try {
    // 首先获取用户信息
    const user = await getUserByField('id', id);
    if (!user) {
      console.error('用户不存在');
      return false;
    }
    
    // 保护 admin 账户
    if (user.username === 'admin') {
      console.warn('不能禁用 admin 账户');
      return false;
    }
    
    const newStatus = !user.isDisabled;
    
    // 如果没有配置 Supabase，使用 localStorage
    if (!isSupabaseConfigured) {
      const USERS_STORAGE_KEY = 'codex_users';
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      const userArray = users ? JSON.parse(users) : [];
      const index = userArray.findIndex((u: any) => u.id === id);
      if (index === -1) return false;
      
      userArray[index].isDisabled = newStatus;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(userArray));
      return true;
    }
    
    const { error } = await supabase!
      .from(USERS_TABLE)
      .update({ is_disabled: newStatus })
      .eq('id', id)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('切换用户状态失败:', error)
    return false
  }
}

// 根据字段查找用户（辅助函数）
const getUserByField = async (field: string, value: string): Promise<User | undefined> => {
  if (!isSupabaseConfigured) {
    const USERS_STORAGE_KEY = 'codex_users';
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    const userArray = users ? JSON.parse(users) : [];
    return userArray.find((u: any) => u[field] === value);
  }
  
  try {
    const { data, error } = await supabase!
      .from(USERS_TABLE)
      .select('*')
      .eq(field, value)
      .single()
    
    if (error) throw error
    return data ? toAppUser(data as SupabaseUser) : undefined
  } catch (error) {
    console.error('查找用户失败:', error)
    return undefined
  }
}

// 删除用户
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    // 首先获取用户信息
    const user = await getUserByField('id', id);
    if (!user) {
      console.error('用户不存在');
      return false;
    }
    
    // 保护 admin 账户
    if (user.username === 'admin') {
      console.warn('不能删除 admin 账户');
      return false;
    }
    
    // 如果没有配置 Supabase，使用 localStorage
    if (!isSupabaseConfigured) {
      const USERS_STORAGE_KEY = 'codex_users';
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      const userArray = users ? JSON.parse(users) : [];
      const filtered = userArray.filter((u: any) => u.id !== id);
      if (filtered.length === userArray.length) return false;
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
    
    const { error } = await supabase!
      .from(USERS_TABLE)
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('删除用户失败:', error)
    return false
  }
}

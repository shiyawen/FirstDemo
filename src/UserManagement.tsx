import { useState, useEffect } from 'react';
import { createUser, getAllUsers, updateUser, deleteUser, toggleUserDisabled, type User } from './services/supabaseService';

interface UserManagementProps {
  onUserAdded?: () => void;
}

export default function UserManagement({ onUserAdded }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 编辑状态
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');

  // 加载用户列表
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const usersList = await getAllUsers();
    setUsers(usersList);
  };

  // 处理编辑用户
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditEmail(user.email || '');
    setEditPassword('');
    setShowForm(false);
  };

  // 保存编辑
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!editingUser) return;

    if (!editUsername) {
      setError('用户名不能为空');
      return;
    }

    if (editPassword && editPassword.length < 6) {
      setError('密码长度至少为 6 个字符');
      return;
    }

    setIsLoading(true);
    try {
      const updates: Partial<User> = {
        username: editUsername,
        email: editEmail || undefined,
      };

      if (editPassword) {
        updates.password = editPassword;
      }

      const result = await updateUser(editingUser.id, updates);
      if (result) {
        setSuccess(`用户 "${editUsername}" 更新成功！`);
        setEditingUser(null);
        await loadUsers();
        setIsLoading(false);
      } else {
        setError('更新用户失败');
        setIsLoading(false);
      }
    } catch (error) {
      setError('更新用户失败');
      setIsLoading(false);
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditUsername('');
    setEditEmail('');
    setEditPassword('');
  };

  // 切换禁用状态
  const handleToggleDisabled = async (userId: string, username: string) => {
    if (username === 'admin') {
      setError('不能禁用 admin 账户');
      return;
    }

    try {
      const success = await toggleUserDisabled(userId);
      if (success) {
        setSuccess(`已${users.find(u => u.id === userId)?.isDisabled ? '启用' : '禁用'}用户 "${username}"`);
        await loadUsers();
      } else {
        setError('操作失败');
      }
    } catch (error) {
      setError('操作失败');
    }
  };

  // 删除用户
  const handleDeleteUser = async (userId: string, username: string) => {
    if (username === 'admin') {
      setError('不能删除 admin 账户');
      return;
    }

    if (!confirm(`确定要删除用户 "${username}" 吗？此操作不可恢复。`)) {
      return;
    }

    try {
      const success = await deleteUser(userId);
      if (success) {
        setSuccess(`用户 "${username}" 已删除`);
        await loadUsers();
      } else {
        setError('删除失败');
      }
    } catch (error) {
      setError('删除失败');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newUsername || !newPassword) {
      setError('用户名和密码为必填项');
      return;
    }

    if (newPassword.length < 6) {
      setError('密码长度至少为 6 个字符');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createUser(newUsername, newPassword, newEmail || undefined);
      if (result) {
        setSuccess(`用户 "${newUsername}" 创建成功！`);
        setNewUsername('');
        setNewPassword('');
        setNewEmail('');
        setShowForm(false);
        await loadUsers();
        onUserAdded?.();
        setIsLoading(false);
      } else {
        setError('用户名已存在');
        setIsLoading(false);
      }
    } catch (error) {
      setError('创建用户失败');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">用户管理</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          {showForm ? '取消' : '添加新用户'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {/* Edit User Form */}
      {editingUser && (
        <form onSubmit={handleSaveEdit} className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">编辑用户</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                用户名
              </label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="请输入用户名"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                邮箱
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="请输入邮箱"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                新密码（留空则不修改）
              </label>
              <input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="请输入新密码（至少 6 位）"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition"
              >
                {isLoading ? '保存中...' : '保存更改'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                取消
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Add User Form */}
      {showForm && (
        <form onSubmit={handleAddUser} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                用户名
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="请输入用户名"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="请输入密码（至少 6 位）"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                邮箱（可选）
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="请输入邮箱"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition"
            >
              {isLoading ? '创建中...' : '创建用户'}
            </button>
          </div>
        </form>
      )}

      {/* Users List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 font-semibold text-gray-700">用户名</th>
              <th className="px-4 py-3 font-semibold text-gray-700">邮箱</th>
              <th className="px-4 py-3 font-semibold text-gray-700">创建时间</th>
              <th className="px-4 py-3 font-semibold text-gray-700">状态</th>
              <th className="px-4 py-3 font-semibold text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{user.username}</td>
                <td className="px-4 py-3 text-gray-600">{user.email || '-'}</td>
                <td className="px-4 py-3 text-gray-600 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {user.username === 'admin' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      管理员
                    </span>
                  ) : user.isDisabled ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      已禁用
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      正常
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                    >
                      编辑
                    </button>
                    {user.username !== 'admin' && (
                      <>
                        <button
                          onClick={() => handleToggleDisabled(user.id, user.username)}
                          className={`px-3 py-1 text-sm rounded transition ${
                            user.isDisabled
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-yellow-600 text-white hover:bg-yellow-700'
                          }`}
                        >
                          {user.isDisabled ? '启用' : '禁用'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                        >
                          删除
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
        <p><strong>用户总数：</strong> {users.length}</p>
      </div>
    </div>
  );
}
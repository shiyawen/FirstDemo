import { getUserProfile, type User } from './services/supabaseService';

interface UserProfileProps {
  user: User;
}

export default function UserProfilePage({ user }: UserProfileProps) {
  const profile = getUserProfile(user);
  const createdDate = new Date(profile.createdAt).toLocaleString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {profile.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">个人资料</h1>
            <p className="text-gray-600">您的账户信息</p>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Username */}
            <div className="border-l-4 border-indigo-600 pl-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                用户名
              </label>
              <p className="text-lg font-semibold text-gray-900">{profile.username}</p>
            </div>

            {/* Email */}
            <div className="border-l-4 border-blue-600 pl-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                邮箱
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {profile.email || <span className="text-gray-400">未设置</span>}
              </p>
            </div>

            {/* User ID */}
            <div className="border-l-4 border-green-600 pl-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                用户 ID
              </label>
              <p className="text-lg font-semibold text-gray-900 font-mono text-sm">{profile.id}</p>
            </div>

            {/* Created At */}
            <div className="border-l-4 border-purple-600 pl-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                账户创建时间
              </label>
              <p className="text-lg font-semibold text-gray-900">{createdDate}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">账户状态</p>
                <p className="text-lg font-bold text-indigo-600">活跃</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">最后登录</p>
                <p className="text-lg font-bold text-green-600">刚刚</p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>提示：</strong>您的账户信息已安全存储。如果您有管理员权限，可以管理其他用户。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
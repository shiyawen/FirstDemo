import { useState } from 'react';
import { logout, type User } from './services/supabaseService';
import UserManagement from './UserManagement';
import UserProfile from './UserProfile';

interface DashboardProps {
  user: User;
  onLogout?: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'management'>('profile');

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">CodeX</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">欢迎，<strong>{user.username}</strong></span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            个人资料
          </button>
          {user.username === 'admin' && (
            <button
              onClick={() => setActiveTab('management')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === 'management'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              用户管理
            </button>
          )}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'profile' ? (
            <UserProfile user={user} />
          ) : (
            <UserManagement />
          )}
        </div>
      </div>
    </div>
  );
}
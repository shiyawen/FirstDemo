// User data structure
export interface User {
  id: string;
  username: string;
  password: string;
  email?: string;
  createdAt: string;
  isDisabled?: boolean; // 登录禁用标志
  lastLogin?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  createdAt: string;
}

const USERS_STORAGE_KEY = 'codex_users';
const CURRENT_USER_KEY = 'codex_current_user';

// Initialize with default admin user
const initializeDefaultUsers = () => {
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
  }
};

// Get all users
export const getAllUsers = (): User[] => {
  initializeDefaultUsers();
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

// Find user by username
export const getUserByUsername = (username: string): User | undefined => {
  const users = getAllUsers();
  return users.find(user => user.username === username);
};

// Validate login credentials
export const validateLogin = (username: string, password: string): User | null => {
  const user = getUserByUsername(username);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

// Create new user
export const createUser = (username: string, password: string, email?: string): User | null => {
  // Check if username already exists
  if (getUserByUsername(username)) {
    return null;
  }

  const newUser: User = {
    id: Date.now().toString(),
    username,
    password,
    email,
    createdAt: new Date().toISOString(),
  };

  const users = getAllUsers();
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  return newUser;
};

// Set current logged-in user
export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Get current logged-in user
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Logout
export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Get user profile (without password)
export const getUserProfile = (user: User): UserProfile => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
};

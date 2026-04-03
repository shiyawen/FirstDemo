# CodeX - Product Management System

A modern React application built with Vite and Tailwind CSS that provides user authentication, account management, and product listing functionality.

## Features

### 🔐 Authentication System
- Default admin account (username: `admin`, password: `admin123`)
- Secure login with form validation
- Session persistence using localStorage
- Error handling for invalid credentials

### 👥 User Management
- Admin-only user creation interface
- Add new users with username, password, and optional email
- User list with creation dates
- Password validation (minimum 6 characters)
- Unique username enforcement
- View all registered users

### 📋 User Profile
- Display current user account information
- Show user ID, email, and account creation date
- Account status indicator
- Personalized profile view with avatar

### 📦 Product List
- Display products with images, names, and prices
- Search functionality to filter products
- Paginated product list (5 items per page)
- Responsive grid layout

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **State Management**: React Hooks
- **Data Storage**: localStorage (JSON-based)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Demo Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

Admin users have access to the User Management panel.

## Project Structure

```
src/
├── components/
│   ├── Login.tsx              # Login component with validation
│   ├── Dashboard.tsx          # Main dashboard with navigation
│   ├── UserProfile.tsx        # User profile display
│   ├── UserManagement.tsx     # User creation and management
│   └── ProductList.tsx        # Product list with search and pagination
├── services/
│   └── userService.ts         # User authentication and data management
├── App.tsx                    # Main app component with routing logic
├── index.css                  # Global and Tailwind styles
└── main.tsx                   # Application entry point
```

## Data Storage

User data is stored in browser's localStorage with the following structure:

```json
{
  "id": "unique-id",
  "username": "user@example.com",
  "password": "encrypted-password",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Features in Detail

### Login Page
- Clean, modern interface with gradient background
- Username and password fields
- Remember me option
- Social login buttons (decorative)
- Sign up link integration
- Error messages for failed login attempts

### Dashboard
- Navigation bar with user greeting
- Tab-based interface for different sections
- Logout functionality
- Role-based access control (admin features)

### User Management (Admin Only)
- Create new user form with validation
- View all users in a sortable table
- Email field is optional
- Real-time user list updates
- Success and error messages

### User Profile
- Display account information
- Account status indicator
- Last login timestamp
- User ID and creation date
- Clean, readable layout

## Security Notes

⚠️ **Important**: This is a demo application. In a production environment, you should:
- Hash passwords using bcrypt or similar
- Use secure session tokens
- Implement backend authentication
- Use HTTPS for all communications
- Never store sensitive data in localStorage
- Implement proper database with security measures

## Future Enhancements

- Backend API integration
- Database support (MongoDB, PostgreSQL, etc.)
- Email verification
- Password reset functionality
- User roles and permissions
- Activity logging
- Two-factor authentication

## License

MIT
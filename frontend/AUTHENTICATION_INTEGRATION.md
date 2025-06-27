# SiteCraft Authentication Integration

This document explains the complete authentication integration between the Next.js frontend and Spring Boot backend for SiteCraft.

## Overview

The authentication system uses session-based authentication with the following features:
- Login/Logout functionality
- User registration
- Password recovery via OTP
- Session management
- Route protection
- Role-based access control

## Backend Integration

### API Endpoints

All authentication endpoints are available at `http://localhost:8080/auth/`:

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/register` - User registration
- `GET /auth/getSession` - Get current session data
- `POST /auth/forgotPassword/sendOTP` - Send password recovery OTP
- `POST /auth/forgotPassword/verifyOTP` - Verify OTP
- `POST /auth/forgotPassword/resetPassword` - Reset password

### Session Data

The session contains:
- `storeId`: The store ID the user belongs to
- `userId`: The user's ID
- `role`: User role (admin, staff, etc.)

## Frontend Components

### 1. Authentication API (`/src/lib/auth.ts`)

Contains all API functions for authentication:

```typescript
import { login, logout, getSession, register } from '@/lib/auth'

// Login
await login(email, password)

// Logout
await logout()

// Get session
const session = await getSession()

// Register
await register({ email, password, name, phone, gender })
```

### 2. Authentication Hook (`/src/hooks/useAuth.ts`)

Zustand store for managing authentication state:

```typescript
import { useAuth } from '@/hooks/useAuth'

const { 
  isAuthenticated, 
  user, 
  login, 
  logout, 
  signup, 
  checkSession,
  loginError,
  signupError,
  isLoading 
} = useAuth()
```

### 3. Form Hooks

#### Login Form (`/src/hooks/useLoginForm.ts`)
```typescript
const { 
  email, 
  setEmail, 
  password, 
  setPassword, 
  isLoading, 
  loginError, 
  onSubmit 
} = useLoginForm()
```

#### Signup Form (`/src/hooks/useSignupForm.ts`)
```typescript
const { 
  formData, 
  handleInputChange, 
  errors, 
  signupError, 
  isLoading, 
  onSubmit 
} = useSignupForm()
```

#### Forgot Password Form (`/src/hooks/useForgotPasswordForm.ts`)
```typescript
const { 
  step, 
  email, 
  otp, 
  newPassword, 
  isLoading, 
  error,
  handleSendOTP,
  handleVerifyOTP,
  handleResetPassword 
} = useForgotPasswordForm()
```

### 4. Components

#### SessionProvider (`/src/components/providers/SessionProvider.tsx`)
Automatically checks for existing session on app startup.

#### ProtectedRoute (`/src/components/auth/ProtectedRoute.tsx`)
Protects routes from unauthenticated access:

```typescript
<ProtectedRoute requiredRole="admin">
  <DashboardPage />
</ProtectedRoute>
```

#### LoginForm (`/src/components/auth/LoginForm.tsx`)
Complete login form component with error handling.

## Usage Examples

### 1. Protecting a Dashboard Page

```typescript
// /src/app/dashboard/page.tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Dashboard content</div>
    </ProtectedRoute>
  )
}
```

### 2. Creating a Login Page

```typescript
// /src/app/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  )
}
```

### 3. Using Authentication State

```typescript
import { useAuth } from '@/hooks/useAuth'

function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  
  return (
    <header>
      {isAuthenticated ? (
        <div>
          <span>Welcome, {user?.role}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <a href="/login">Login</a>
      )}
    </header>
  )
}
```

### 4. Role-Based Access Control

```typescript
import { useAuth } from '@/hooks/useAuth'

function AdminPanel() {
  const { user } = useAuth()
  
  if (user?.role !== 'admin') {
    return <div>Access denied</div>
  }
  
  return <div>Admin content</div>
}
```

## Setup Instructions

### 1. Backend Configuration

Ensure your Spring Boot backend is running on `http://localhost:8080` and has:
- CORS configured to allow requests from the frontend
- Session management enabled
- Email service configured for OTP functionality

### 2. Frontend Configuration

The authentication is already integrated into the app layout. The `SessionProvider` automatically checks for existing sessions on app startup.

### 3. Environment Variables

Make sure your backend URL is correctly configured in the auth API functions if you're using a different port or domain.

## Security Features

- Session-based authentication with secure cookies
- Password hashing on the backend
- OTP-based password recovery
- Role-based access control
- Automatic session checking
- Protected routes with loading states

## Error Handling

All authentication functions include proper error handling:
- Network errors
- Invalid credentials
- Session expiration
- Server errors
- Validation errors

## Testing

To test the integration:

1. Start the backend server
2. Start the frontend development server
3. Navigate to `/login`
4. Try logging in with valid credentials
5. Verify you're redirected to the dashboard
6. Check that protected routes work correctly
7. Test logout functionality

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for frontend domain
2. **Session Not Persisting**: Check that `credentials: 'include'` is used in fetch calls
3. **Login Fails**: Verify backend authentication endpoints are working
4. **OTP Not Sending**: Check email service configuration in backend

### Debug Tips

- Check browser network tab for API calls
- Verify session cookies are being set
- Check backend logs for authentication errors
- Use browser dev tools to inspect session state 
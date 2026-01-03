# Fresh Gen2 Amplify Todo App

A modern, full-stack todo application built with AWS Amplify Gen2, Next.js 15, TypeScript, and Tailwind CSS.

## Features

### ✅ Core Functionality
- **User Authentication** (Email/Password + Social Login)
- **Email Verification** flow
- **Password Reset** with secure token handling
- **Real-time GraphQL** subscriptions
- **Advanced Filtering** (status, priority, category, search)
- **Bulk Operations** (select, update, delete multiple todos)
- **Responsive Design** for all screen sizes

### ✅ Authentication Features
- **Email/Password** authentication
- **Social Authentication** (Google & GitHub OAuth)
- **Email Verification** workflow
- **Password Reset** flow
- **Route Protection** with automatic redirects
- **Session Management** with JWT tokens

### ✅ Advanced Features
- **Real-time Updates** via GraphQL subscriptions
- **Type-safe API** with TypeScript throughout
- **Modern UI** with shadcn/ui components
- **Comprehensive Testing** (10 E2E tests)
- **Production-ready** deployment configuration

## Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- AWS CLI configured
- Git

### Installation

1. **Clone and install:**
   ```bash
   git clone <repository-url>
   cd gen2-comparison-fresh
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your OAuth credentials (see Social Authentication section below).

3. **Configure Amplify:**
   ```bash
   npx ampx configure
   npx ampx sandbox
   ```

4. **Start development:**
   ```bash
   pnpm dev
   ```

5. **Run tests:**
   ```bash
   npx playwright test
   ```

## Social Authentication Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/signin`
     - `https://yourdomain.com/auth/signin`

5. Add to `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

### GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App:
   - Homepage URL: `http://localhost:3000` or your domain
   - Authorization callback URL:
     - `http://localhost:3000/auth/signin`
     - `https://yourdomain.com/auth/signin`

3. Add to `.env.local`:
   ```
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

### Deploy Social Auth Configuration

After setting up OAuth credentials, deploy the updated configuration:

```bash
npx ampx sandbox --outputs-format json
```

The social authentication buttons will now work for both sign-in and sign-up flows.

## Authentication Flow

```
User Registration:
1. Sign up with email/password or social provider
2. Receive email verification code
3. Verify email to complete registration
4. Access granted to protected routes

Password Reset:
1. Request password reset with email
2. Receive reset email with secure link
3. Enter new password with verification code
4. Password updated successfully

Social Authentication:
1. Click Google/GitHub button
2. Redirect to OAuth provider
3. Grant permissions
4. Automatic account creation/login
5. Access granted to application
```

## Testing Authentication

### Automated Tests
```bash
# Run all authentication tests
npx playwright test tests/e2e/auth.spec.ts

# Run with visual browser
npx playwright test tests/e2e/auth.spec.ts --headed

# Run specific test
npx playwright test tests/e2e/auth.spec.ts -g "should redirect to sign-in"
```

### Manual Testing

1. **Email Authentication:**
   ```bash
   # Start dev server
   pnpm dev

   # Visit http://localhost:3000
   # Should redirect to /auth/signin

   # Test signup flow:
   # 1. Go to /auth/signup
   # 2. Create account with real email
   # 3. Check email for verification code
   # 4. Verify email at /auth/verify-email
   # 5. Sign in at /auth/signin
   # 6. Access protected dashboard
   ```

2. **Password Reset:**
   ```bash
   # From sign-in page, click "Forgot password?"
   # Enter email and submit
   # Check email for reset link
   # Follow link to reset password
   # Sign in with new password
   ```

3. **Social Authentication:**
   ```bash
   # From sign-in or signup page
   # Click "Continue with Google" or "Continue with GitHub"
   # Complete OAuth flow
   # Should be automatically signed in
   ```

## Architecture

### Frontend (Next.js 15 + TypeScript)
- **App Router** for modern routing
- **Server Components** with client components where needed
- **Type-safe** API calls with Amplify client
- **Real-time subscriptions** for live updates

### Backend (AWS Amplify Gen2)
- **GraphQL API** with automatic type generation
- **Cognito User Pools** for authentication
- **DynamoDB** for data storage
- **Real-time subscriptions** via WebSocket
- **Social OAuth** providers (Google, GitHub)

### Authentication
- **Route Protection** with AuthWrapper component
- **Session Management** with JWT tokens
- **Social OAuth** integration
- **Email verification** workflow
- **Password reset** with secure tokens

## Deployment

### Development
```bash
npx ampx sandbox
pnpm dev
```

### Production
```bash
npx ampx deploy
```

### Environment Variables for Production
Set these in your Amplify console:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

## Project Structure

```
├── amplify/                 # Amplify backend configuration
│   ├── auth/               # Authentication setup
│   ├── data/               # GraphQL schema and resolvers
│   └── storage/            # File storage configuration
├── src/
│   ├── app/                # Next.js app router pages
│   │   ├── auth/          # Authentication pages
│   │   ├── api/           # API routes
│   │   └── layout.tsx     # Root layout
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   └── TodoList.tsx  # Main todo component
│   └── lib/               # Utility functions
├── tests/                  # Test files
│   └── e2e/              # End-to-end tests
├── .env.example          # Environment variables template
└── amplify_outputs.json  # Generated Amplify configuration
```

## API Reference

### Authentication
- `signUp()` - Register new user
- `signIn()` - Sign in existing user
- `signInWithRedirect()` - Social authentication
- `confirmSignUp()` - Email verification
- `resetPassword()` - Initiate password reset
- `confirmResetPassword()` - Complete password reset
- `signOut()` - Sign out user

### Todo Operations
- `client.models.Todo.create()` - Create todo
- `client.models.Todo.list()` - List todos
- `client.models.Todo.update()` - Update todo
- `client.models.Todo.delete()` - Delete todo
- `client.models.Todo.observeQuery()` - Real-time subscriptions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npx playwright test`
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

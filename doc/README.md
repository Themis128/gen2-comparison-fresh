# Themistoklis Baltzakis Portfolio - Technical Documentation

This document provides detailed technical information about the portfolio website and its integrated AWS Amplify Gen2 todo application demonstration.

## 🎯 Project Overview

This is a dual-purpose application serving as both:

1. **Professional Portfolio** for Themistoklis Baltzakis, ML/LLM Engineer
2. **Technical Showcase** demonstrating modern full-stack development with AWS Amplify Gen2

## 🏗️ Architecture

### Frontend Architecture

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript for type safety
- **Styling:** Tailwind CSS with custom WebGL shaders
- **Components:** shadcn/ui + Radix UI primitives
- **State Management:** React hooks + Amplify client
- **PWA Features:** Service worker, manifest, offline support

### Backend Architecture

- **Platform:** AWS Amplify Gen2
- **API:** GraphQL with automatic type generation
- **Database:** Amazon DynamoDB
- **Authentication:** Amazon Cognito User Pools
- **Real-time:** WebSocket subscriptions
- **Storage:** Amazon S3 (future enhancement)

### Development Tools

- **Testing:** Jest unit testing
- **Linting:** ESLint with flat config
- **Type Checking:** TypeScript strict mode
- **Package Manager:** pnpm
- **Build Tool:** Next.js with Turbopack support

## 📁 Detailed Project Structure

```
├── amplify/                          # AWS Amplify Gen2 Backend
│   ├── auth/                        # Authentication configuration
│   │   ├── resource.ts              # Cognito User Pool setup
│   │   ├── post-confirmation-handler.ts
│   │   ├── pre-signup-handler.ts
│   │   └── custom-message-handler.ts
│   ├── data/                        # GraphQL API
│   │   └── resource.ts              # Schema and resolvers
│   ├── backend.ts                   # Backend configuration
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # Root layout with providers
│   │   ├── page.tsx                 # Homepage (portfolio)
│   │   ├── globals.css              # Global styles
│   │   ├── contact/                 # Contact page
│   │   ├── projects/                # Projects showcase
│   │   ├── streaming-test/          # Real-time features demo
│   │   ├── test-auto-healing/       # Error recovery demo
│   │   ├── error-test/              # Error handling demo
│   │   └── integrated-components/   # Component integration tests
│   ├── components/                  # React Components
│   │   ├── ui/                      # Reusable UI components
│   │   │   ├── button.tsx           # Custom button variants
│   │   │   ├── input.tsx            # Form inputs
│   │   │   ├── card.tsx             # Content cards
│   │   │   └── ...                  # Other UI primitives
│   │   ├── Hero.tsx                 # Portfolio hero section
│   │   ├── About.tsx                # Personal information
│   │   ├── Skills.tsx               # Technical skills
│   │   ├── Projects.tsx             # Project showcase
│   │   ├── Experience.tsx           # Work experience
│   │   ├── Certifications.tsx       # Professional certs
│   │   ├── Contact.tsx              # Contact information
│   │   ├── TodoList.tsx             # Todo app demo
│   │   ├── AIProjectGenerator.tsx   # AI-powered features
│   │   ├── NavigationWrapper.tsx    # Responsive navigation
│   │   └── ...                      # Other components
│   ├── lib/                         # Utilities & Configuration
│   │   ├── amplify-client-config.ts # AWS Amplify setup
│   │   ├── personal-data.ts         # Portfolio content
│   │   ├── theme-context.tsx        # Theme management
│   │   ├── utils.ts                 # Helper functions
│   │   └── ...                      # Other utilities
│   └── hooks/                       # Custom React hooks
├── tests/                           # Test Suite
│   └── e2e/                         # Playwright E2E tests
│       ├── auth.spec.ts             # Authentication tests
│       ├── todo.spec.ts             # Todo functionality tests
│       └── ...                     # Other test files
├── public/                          # Static Assets
│   ├── icons/                       # PWA icons
│   ├── images/                      # Portfolio images
│   └── manifest.json               # PWA manifest
├── docs/                            # Documentation
│   ├── README.md                    # This file
│   ├── AUTHENTICATION_SETUP_GUIDE.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── TESTING_PLAN.md
│   └── TODO_ROADMAP.md
├── types/                           # TypeScript Declarations
│   └── 21st-extensions.d.ts         # Custom type extensions
└── Configuration Files
    ├── next.config.mjs             # Next.js configuration
    ├── tailwind.config.js          # Tailwind CSS config
    ├── playwright.config.ts        # E2E test configuration
    ├── jest.config.ts              # Unit test configuration
    ├── eslint.config.js            # Linting configuration
    └── package.json                # Dependencies & scripts
```

## 🔧 Setup & Configuration

### Prerequisites

- **Node.js:** 18.0.0 or higher
- **Package Manager:** pnpm 8.0.0 or higher
- **AWS CLI:** Configured with appropriate permissions
- **Git:** For version control

### Environment Setup

1. **Clone Repository:**

   ```bash
   git clone https://github.com/Themis128/gen2-comparison-fresh.git
   cd gen2-comparison-fresh
   ```

2. **Install Dependencies:**

   ```bash
   pnpm install
   ```

3. **AWS Configuration (Optional):**
   ```bash
   npx ampx configure
   ```

### Development Commands

```bash
# Start development with sandbox (recommended)
npm run dev:sandbox

# Start development only
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm run test:e2e    # End-to-end tests
npm run test        # Unit tests

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔐 Authentication System

### Features

- **Email/Password Authentication**
- **Social OAuth** (Google, GitHub)
- **Email Verification** workflow
- **Password Reset** with secure tokens
- **Session Management** with JWT
- **Route Protection** with automatic redirects

### Configuration

#### Google OAuth Setup

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project and enable Google+ API
3. Create OAuth 2.0 credentials:
   - **Application type:** Web application
   - **Authorized redirect URIs:**
     - `http://localhost:50000/auth/signin`
     - `https://yourdomain.com/auth/signin`

4. **Environment Variables:**
   ```bash
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

#### GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App:
   - **Homepage URL:** `http://localhost:50000` or your domain
   - **Authorization callback URL:**
     - `http://localhost:50000/auth/signin`
     - `https://yourdomain.com/auth/signin`

3. **Environment Variables:**
   ```bash
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

### Authentication Flow

```
Registration Flow:
1. User submits email/password or selects social provider
2. For email auth: Send verification code to email
3. User verifies email with code
4. Account activated, user can sign in

Social Authentication:
1. User clicks Google/GitHub button
2. Redirect to OAuth provider
3. User grants permissions
4. Automatic account creation/login
5. Redirect to protected content

Password Reset:
1. User requests password reset
2. Secure reset token sent to email
3. User follows link and sets new password
4. Password updated successfully
```

## 🎨 UI/UX Design System

### Design Principles

- **Mobile-First:** Responsive design for all screen sizes
- **Accessibility:** WCAG compliant with proper ARIA labels
- **Performance:** Optimized loading with code splitting
- **Consistency:** Unified design language throughout

### Component Library

#### Core Components (`src/components/ui/`)

- **Button:** Multiple variants (default, outline, ghost, link)
- **Input:** Styled form inputs with validation states
- **Card:** Content containers with consistent styling
- **Dialog:** Modal dialogs with proper focus management
- **Dropdown:** Accessible dropdown menus
- **Tabs:** Tabbed interfaces
- **Toast:** Notification system
- **Avatar:** User profile images
- **Badge:** Status indicators and labels

#### Portfolio Components

- **Hero:** Animated hero section with gradient background
- **About:** Personal introduction and bio
- **Skills:** Technical skills visualization
- **Projects:** Project showcase with filtering
- **Experience:** Timeline-based work history
- **Contact:** Contact form with validation

#### Todo Components

- **TodoList:** Main todo management interface
- **TodoItem:** Individual todo items with actions
- **TodoFilters:** Advanced filtering and search
- **BulkActions:** Multi-select operations

### Styling Approach

- **Tailwind CSS:** Utility-first styling framework
- **Custom Properties:** CSS custom properties for theming
- **WebGL Shaders:** Custom gradient animations
- **Dark/Light Mode:** User preference switching
- **Responsive Breakpoints:** Mobile-first design

## 🚀 Deployment

### Development Deployment

```bash
# Start local sandbox
npm run dev:sandbox

# Access at http://localhost:50000
```

### Production Deployment

#### AWS Amplify Hosting

1. **Connect Repository** to Amplify Console
2. **Build Settings:**

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```

3. **Environment Variables:**
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`

#### Manual Deployment

```bash
# Deploy backend
npx ampx deploy

# Build frontend
npm run build

# Deploy to hosting provider
```

## 📊 Performance & Optimization

### Performance Metrics

- **Lighthouse Score:** Target 90+ on all metrics
- **Core Web Vitals:** Optimized for real users
- **Bundle Size:** Code splitting and lazy loading
- **Image Optimization:** Next.js automatic optimization

### Optimization Techniques

- **Server Components:** Reduce client-side JavaScript
- **Streaming:** Progressive loading of content
- **Caching:** Service worker for offline support
- **Compression:** Gzip/Brotli compression
- **CDN:** Global content delivery

## 🔍 Monitoring & Debugging

### Development Tools

- **React DevTools:** Component inspection
- **Next.js DevTools:** Framework-specific debugging
- **Amplify Studio:** Backend management
- **AWS CloudWatch:** Production monitoring

### Error Handling

- **Global Error Boundary:** Graceful error handling
- **Error Logging:** Client-side error reporting
- **Fallback UI:** User-friendly error states
- **Auto-healing:** Automatic recovery mechanisms

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/your-feature`
3. **Make** changes with tests
4. **Run** test suite: `npm run test:e2e`
5. **Commit** changes: `git commit -am 'Add feature'`
6. **Push** branch: `git push origin feature/your-feature`
7. **Create** pull request

### Code Standards

- **TypeScript:** Strict type checking enabled
- **ESLint:** Automated code linting
- **Prettier:** Consistent code formatting
- **Testing:** 100% test coverage for new features

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [AWS Amplify Gen2 Docs](https://docs.amplify.aws/)
- [Tailwind CSS Guide](https://tailwindcss.com/docs)
- [Playwright Testing](https://playwright.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 📞 Support

For technical questions or issues:

- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Documentation:** This README and linked guides

---

**Last Updated:** January 2026
**Version:** 1.0.0
**Author:** Themistoklis Baltzakis - `https://yourdomain.com/auth/signin`

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

## Route Structure

The application uses a protected route structure:

- **Public Routes**: `/auth/signin`, `/auth/signup`, `/auth/forgot-password`
- **Protected Routes**: `/app` (Main Portfolio), `/admin` (Admin Dashboard)
- **Automatic Redirects**: Unauthenticated users are redirected to `/auth/signin`. Authenticated users are redirected to `/app` (or `/admin` if they have admin privileges).

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
npm run test:e2e -- tests/e2e/auth.spec.ts

# Run with visual browser
npm run test:e2e -- tests/e2e/auth.spec.ts --headed

# Run specific test
npm run test:e2e -- tests/e2e/auth.spec.ts -g "should redirect to sign-in"
```

### Test Mode

For E2E testing, the app supports a "Test Mode" that bypasses real Amplify authentication. This is enabled in Playwright tests using:

```typescript
await page.addInitScript(() => {
  (window as any).__NEXT_PUBLIC_TEST_MODE = 'true';
});
```

### Manual Testing

1. **Email Authentication:**

   ```bash
   # Start dev server
   pnpm dev

   # Visit http://localhost:3001
   # Should redirect to /auth/signin

   # Test signup flow:
   # 1. Go to /auth/signup
   # 2. Create account with real email
   # 3. Check email for verification code
   # 4. Verify email at /auth/verify-email
   # 5. Sign in at /auth/signin
   # 6. Access protected dashboard at /app
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

- **Route Protection** with protected layout structure
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
│   │   ├── (protected)/   # Protected routes (/app)
│   │   ├── admin/         # Admin dashboard (/admin)
│   │   ├── auth/          # Authentication pages
│   │   ├── api/           # API routes
│   │   └── layout.tsx     # Root layout
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components (shadcn/ui)
│   │   ├── AIProjectGenerator.tsx  # AI-powered project generator
│   │   ├── ThemeSwitcher.tsx       # Theme management
│   │   ├── gradient-mesh.tsx       # WebGL animations
│   │   └── TodoList.tsx            # Main todo component
│   └── lib/               # Utility functions
├── tests/                  # Test files
│   └── e2e/              # End-to-end tests
├── doc/                   # Documentation files
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
5. Run tests: `npm run test:e2e`
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

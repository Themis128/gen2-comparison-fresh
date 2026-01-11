# Themistoklis Baltzakis Portfolio Application

## Overview

This is a modern, full-stack portfolio website built with Next.js 16, AWS Amplify Gen2, and TypeScript. The application showcases professional work, skills, and projects while demonstrating advanced web development techniques and cloud architecture.

## Architecture

### Frontend Architecture
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand for client-side state
- **Internationalization**: next-intl for multi-language support
- **Animations**: Framer Motion for smooth transitions
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Platform**: AWS Amplify Gen2
- **Database**: Amazon DynamoDB
- **Authentication**: Amazon Cognito with email/password
- **API**: GraphQL with AWS AppSync
- **Real-time**: WebSocket subscriptions for live updates
- **Authorization**: Group-based permissions (ADMIN, USER)

### Key Features

#### Portfolio Features
1. **Hero Section**: Animated introduction with WebGL background
2. **About Section**: Professional biography and career summary
3. **Skills Section**: Interactive skill visualization with categories
4. **Projects Section**: Featured work with detailed project pages
5. **Experience Section**: Professional work history timeline
6. **Contact Section**: Interactive contact form with validation

#### Technical Features
1. **Responsive Design**: Mobile-first approach with adaptive layouts
2. **Dark/Light Theme**: System preference detection and manual toggle
3. **PWA Support**: Service worker, offline capability, install prompt
4. **Performance Optimization**: Code splitting, lazy loading, image optimization
5. **SEO Optimization**: Dynamic meta tags, structured data, sitemap
6. **Accessibility**: WCAG compliant components and navigation
7. **Analytics**: Web vitals monitoring and performance tracking

#### Backend Features
1. **Contact Form**: GraphQL mutations with validation
2. **Real-time Updates**: Live contact message synchronization
3. **Authentication**: Secure user management with groups
4. **Admin Dashboard**: Message management interface
5. **API Security**: Public API key and identity pool authorization

## Application Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── contact/       # Contact page
│   │   │   ├── projects/      # Projects listing and detail
│   │   │   └── layout.tsx     # Localized layout
│   │   ├── auth/              # Authentication pages
│   │   │   ├── signin/        # Sign in page
│   │   │   ├── signup/        # Sign up page
│   │   │   ├── confirm/       # Email confirmation
│   │   │   └── forgot-password/ # Password reset
│   │   ├── api/               # API routes
│   │   │   └── contact/       # Contact form endpoint
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components (shadcn/ui)
│   │   ├── Hero.tsx          # Hero section component
│   │   ├── About.tsx         # About section component
│   │   ├── Skills.tsx        # Skills section component
│   │   ├── ContactForm.tsx   # Contact form component
│   │   ├── ContactMessages.tsx # Admin message viewer
│   │   └── ...               # Other feature components
│   ├── lib/                  # Utilities and configurations
│   │   ├── personal-data.ts  # Portfolio content data
│   │   ├── stores/           # Zustand state stores
│   │   ├── graphql/          # GraphQL queries/mutations
│   │   ├── utils.ts          # Utility functions
│   │   └── ...               # Other utilities
│   ├── messages/             # Internationalization messages
│   │   ├── en.json           # English translations
│   │   └── el.json           # Greek translations
│   └── hooks/                # Custom React hooks
├── amplify/                  # AWS Amplify Gen2 backend
│   ├── data/                # GraphQL schema and resolvers
│   ├── auth/                # Authentication configuration
│   └── backend.ts           # Backend configuration
├── public/                  # Static assets
│   ├── icons/              # PWA icons
│   ├── images/             # Portfolio images
│   └── manifest.json       # PWA manifest
├── docs/                   # Documentation
├── tests/                  # End-to-end tests
└── types/                  # TypeScript type definitions
```

## Data Models

### ContactMessage
```typescript
{
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  newsletter: boolean;
  recaptchaToken: string;
  createdAt: string;
  updatedAt: string;
}
```

### User Groups
- **ADMIN**: Full access to contact messages and admin features
- **USER**: Read-only access to public content

## API Endpoints

### GraphQL Operations

#### Queries
- `listContactMessages`: Retrieve all contact messages (admin only)
- `getContactMessage`: Retrieve specific message by ID

#### Mutations
- `createContactMessage`: Submit new contact form
- `updateContactMessage`: Update existing message (admin only)
- `deleteContactMessage`: Delete message (admin only)

### REST API Routes
- `POST /api/contact`: Contact form submission endpoint
- `GET /api/og`: Open Graph image generation

## Authentication Flow

1. **Registration**: Email/password with email verification
2. **Login**: Email/password authentication
3. **Password Reset**: Secure password recovery flow
4. **Group Assignment**: Automatic user group assignment
5. **Session Management**: JWT tokens with refresh capability

## Testing Strategy

### End-to-End Testing
- **Framework**: Playwright
- **Coverage**: All user journeys and critical paths
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **CI/CD**: Automated test execution on deployment

### Test Categories
1. **Portfolio Navigation**: Homepage, sections, responsive design
2. **Contact Form**: Validation, submission, error handling
3. **Authentication**: Sign up, sign in, password reset flows
4. **Admin Features**: Message management, dashboard access
5. **Accessibility**: WCAG compliance, keyboard navigation
6. **Performance**: Core Web Vitals, loading times

## Deployment

### Environment Setup
1. **Development**: Local Next.js dev server + Amplify sandbox
2. **Staging**: AWS Amplify hosting with staging backend
3. **Production**: AWS Amplify hosting with production backend

### Build Process
1. **Type Checking**: TypeScript compilation
2. **Linting**: ESLint code quality checks
3. **Testing**: Playwright E2E test execution
4. **Build**: Next.js production build
5. **Deployment**: AWS Amplify automated deployment

## Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Route-based and component-based splitting
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Font Loading**: Optimized font loading with display swap
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Caching**: Aggressive caching strategies for static assets

### Backend Optimizations
- **Database Indexing**: Optimized DynamoDB queries
- **API Caching**: AppSync caching for GraphQL operations
- **CDN**: CloudFront distribution for global content delivery
- **Edge Computing**: Lambda@Edge for dynamic content optimization

## Security Measures

### Frontend Security
- **Content Security Policy**: Strict CSP headers
- **XSS Protection**: Input sanitization and validation
- **CSRF Protection**: Token-based request validation
- **Secure Headers**: Security headers configuration

### Backend Security
- **Authentication**: Cognito user authentication
- **Authorization**: Group-based access control
- **API Security**: API key and identity pool protection
- **Data Validation**: Zod schema validation
- **Rate Limiting**: API rate limiting and abuse protection

## Monitoring and Analytics

### Performance Monitoring
- **Web Vitals**: Core Web Vitals tracking
- **Error Tracking**: Sentry error monitoring
- **User Analytics**: Privacy-focused analytics
- **Performance Budgets**: Automated performance regression detection

### Business Analytics
- **Contact Form Analytics**: Submission tracking and conversion
- **User Engagement**: Page views, session duration, bounce rates
- **Technical Metrics**: API response times, error rates
- **Conversion Tracking**: Goal completion and funnel analysis

## Development Workflow

### Local Development
1. **Setup**: `pnpm install` for dependency installation
2. **Backend**: `npm run dev:backend` for Amplify sandbox
3. **Frontend**: `npm run dev:frontend` for Next.js dev server
4. **Testing**: `npm run test` for Playwright test execution

### Code Quality
1. **Linting**: ESLint with Next.js and TypeScript rules
2. **Type Checking**: Strict TypeScript configuration
3. **Formatting**: Prettier with Tailwind CSS plugin
4. **Testing**: Comprehensive E2E test coverage

### Git Workflow
1. **Branching**: Feature branches from main
2. **Commits**: Conventional commit messages
3. **Pull Requests**: Code review and automated testing
4. **Merging**: Squash merge to main branch

## Troubleshooting

### Common Issues

#### Build Failures
- **Type Errors**: Check TypeScript configuration and type definitions
- **Missing Dependencies**: Run `pnpm install` to sync dependencies
- **Environment Variables**: Verify all required env vars are set

#### Runtime Errors
- **Authentication Issues**: Check Cognito configuration and user groups
- **API Errors**: Verify GraphQL schema and resolvers
- **Styling Issues**: Check Tailwind CSS configuration and class names

#### Performance Issues
- **Slow Loading**: Check bundle size and code splitting
- **High Memory Usage**: Monitor React component re-renders
- **Network Issues**: Verify API endpoints and caching strategies

### Debug Tools
- **React DevTools**: Component inspection and profiling
- **Playwright Trace Viewer**: Test execution debugging
- **AWS CloudWatch**: Backend logging and monitoring
- **Lighthouse**: Performance and accessibility auditing

## Contributing

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/repo.git`
3. Install dependencies: `pnpm install`
4. Start development: `npm run dev:sandbox`
5. Create feature branch: `git checkout -b feature/your-feature`

### Code Standards
1. **TypeScript**: Strict type checking enabled
2. **ESLint**: All linting rules must pass
3. **Prettier**: Code formatting must match configuration
4. **Testing**: All new features require E2E tests

### Pull Request Process
1. Update documentation for any new features
2. Add tests for new functionality
3. Ensure all tests pass
4. Update README if needed
5. Request code review
6. Address review feedback
7. Merge to main branch

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For support and questions:
- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for general questions
- **Documentation**: This docs folder for detailed guides
- **Email**: Contact form on the website for direct inquiries

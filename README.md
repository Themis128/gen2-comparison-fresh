# Themistoklis Baltzakis - Portfolio Website

A modern portfolio website showcasing AWS Amplify Gen2 capabilities through an integrated todo application. Built with Next.js 15, TypeScript, Tailwind CSS, and featuring real-time GraphQL subscriptions, authentication, and a comprehensive demonstration of full-stack development skills.

## 🚀 Live Demo

Visit the live portfolio at: [https://your-portfolio-domain.com](https://your-portfolio-domain.com)

## 📋 Overview

This project serves dual purposes:

1. **Professional Portfolio** - Showcasing skills, experience, and projects of Themistoklis Baltzakis, ML/LLM Engineer
2. **Technical Demonstration** - Interactive todo application demonstrating AWS Amplify Gen2, GraphQL, real-time subscriptions, and modern web development practices

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - App Router with Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible primitives
- **WebGL Shaders** - Custom gradient animations

### Backend

- **AWS Amplify Gen2** - Full-stack backend-as-a-service
- **GraphQL API** - Type-safe data operations
- **Amazon Cognito** - Authentication & user management
- **DynamoDB** - NoSQL database
- **Real-time Subscriptions** - WebSocket connections

### Development & Testing

- **Jest** - Unit testing
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **PWA** - Progressive Web App features

## ✨ Features

### Portfolio Sections

- **Hero Section** - Professional introduction with animated background
- **About** - Personal background and career summary
- **Skills** - Technical expertise and competencies
- **Projects** - Featured work and GitHub repositories
- **Experience** - Professional work history
- **Certifications** - Professional credentials and achievements
- **Contact** - Contact form and social links

### Todo Application Demo

- **User Authentication** - Email/password and social login (Google, GitHub)
- **Email Verification** - Secure account activation
- **Password Reset** - Secure password recovery
- **Real-time Updates** - Live synchronization across devices
- **Advanced Filtering** - By status, priority, category, and search
- **Bulk Operations** - Multi-select actions for efficiency
- **Priority Management** - Low, medium, high priority levels
- **Due Dates** - Task scheduling and deadlines
- **Categories** - Task organization and grouping

### Technical Features

- **Responsive Design** - Mobile-first approach
- **Dark/Light Theme** - User preference switching
- **PWA Support** - Installable web app
- **Offline Capability** - Service worker caching
- **Performance Optimized** - Code splitting and lazy loading
- **Accessibility** - WCAG compliant components
- **SEO Optimized** - Meta tags and structured data

## 🚀 Development Setup

### Prerequisites

- **Node.js 18+**
- **pnpm** package manager
- **AWS CLI** configured with appropriate permissions
- **Git**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Themis128/gen2-comparison-fresh.git
   cd gen2-comparison-fresh
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure AWS (optional for full functionality):**
   ```bash
   npx ampx configure
   ```

### Running the Application

#### Development with Sandbox (Recommended)

Run both frontend and backend locally for full development experience:

```bash
npm run dev:sandbox
```

This starts:

- **Next.js dev server** on `http://localhost:50000`
- **Amplify sandbox** with local GraphQL API and authentication

#### Development Only

Run frontend only (requires deployed backend):

```bash
npm run dev
```

#### Production Build

```bash
npm run build
npm start
```

## 🔐 Authentication Setup

### Social Authentication (Optional)

#### Google OAuth

1. Create OAuth 2.0 credentials in [Google Cloud Console](https://console.cloud.google.com/)
2. Add authorized redirect URIs:
   - `http://localhost:50000/auth/signin`
   - `https://yourdomain.com/auth/signin`
3. Set environment variables:
   ```bash
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

#### GitHub OAuth

1. Create OAuth App in GitHub Settings → Developer settings
2. Set authorization callback URL:
   - `http://localhost:50000/auth/signin`
   - `https://yourdomain.com/auth/signin`
3. Set environment variables:
   ```bash
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

## 📁 Project Structure

```
├── amplify/                 # AWS Amplify Gen2 backend
│   ├── auth/               # Authentication configuration
│   ├── data/               # GraphQL schema and resolvers
│   └── backend.ts          # Backend configuration
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── auth/          # Authentication pages
│   │   ├── contact/       # Contact page
│   │   ├── projects/      # Projects showcase
│   │   └── layout.tsx     # Root layout
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── Hero.tsx      # Portfolio hero section
│   │   ├── TodoList.tsx  # Todo application demo
│   │   └── ...           # Other portfolio components
│   └── lib/               # Utilities and configurations
│       ├── personal-data.ts # Portfolio content
│       └── amplify-client-config.ts # AWS configuration
├── tests/                  # Test files
│   └── e2e/              # Playwright E2E tests
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🎨 Customization

### Portfolio Content

Edit `src/lib/personal-data.ts` to customize:

- Personal information
- Skills and technologies
- Work experience
- Projects and achievements
- Contact information

### Styling

The design uses Tailwind CSS with custom components. Key files:

- `src/styles/app.css` - Custom styles
- `tailwind.config.js` - Tailwind configuration
- `src/components/ui/` - Reusable components

### Theme Configuration

Dark/light theme switching is handled by `src/lib/theme-context.tsx`.

## 🚀 Deployment

### AWS Amplify Hosting

1. **Connect repository** to AWS Amplify Console
2. **Set build settings:**

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

3. **Environment variables** (for social auth):
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`

### Manual Deployment

```bash
# Deploy backend
npx ampx deploy

# Build and deploy frontend
npm run build
# Deploy to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm run test:e2e`
6. Commit your changes: `git commit -am 'Add new feature'`
7. Push to the branch: `git push origin feature/your-feature`
8. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Themistoklis Baltzakis**

- **Title:** ML/LLM Engineer
- **Experience:** 15+ years in IT support, cloud solutions, and Cisco infrastructure
- **Location:** [Your Location]
- **Email:** [your.email@example.com]
- **LinkedIn:** [Your LinkedIn]
- **GitHub:** [Your GitHub]

## 🙏 Acknowledgments

- **AWS Amplify** team for the excellent Gen2 platform
- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first framework
- **Next.js** team for the amazing React framework
- **Playwright** for comprehensive testing capabilities

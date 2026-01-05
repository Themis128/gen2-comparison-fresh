# 🚀 Complete AWS Amplify Gen2 Next.js Deployment Guide

This guide provides step-by-step instructions for deploying your Gen2 Next.js application with custom domain and authentication to AWS Amplify.

## 📋 Prerequisites

- ✅ AWS Account with Amplify permissions
- ✅ GitHub repository with your code
- ✅ Custom domain (`baltzakisthemis.com`) registered
- ✅ Route 53 hosted zone configured
- ✅ OAuth credentials (Google & GitHub) set up
- ✅ Environment variables prepared

## 🏗️ Project Structure

Your project is set up as a **monorepo subdirectory** on the `amplify-gen2-deployment` branch:
```
your-repo/
├── gen2-comparison-fresh/     ← Your Next.js app (this directory)
│   ├── amplify/               ← Backend configuration
│   ├── src/                   ← Frontend code
│   ├── package.json           ← Dependencies
│   └── next.config.mjs        ← Next.js config
└── other-projects/            ← Other projects in repo
```

## 📦 Step 1: Prepare Repository

### Commit Your Changes
```bash
cd gen2-comparison-fresh
git add .
git commit -m "Production deployment with authentication and custom domain"
git push origin main
```

### Verify Build Locally
```bash
cd gen2-comparison-fresh
pnpm build
pnpm start
```

## 🚀 Step 2: Deploy to AWS Amplify

### Option A: New Amplify App (Recommended)

1. **Go to AWS Amplify Console**
   - Visit: https://console.aws.amazon.com/amplify/

2. **Create New App**
   - Click **"Create new app"**
   - Select **"Host your web app"**

3. **Connect Repository**
   - Choose **GitHub** as provider
   - Authorize AWS Amplify access
   - Select your repository
   - **Important:** Set **Root directory** to: `gen2-comparison-fresh`
   - Select branch: `main` (or your primary branch)

   - **Build commands** should be:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - pnpm install
         build:
           commands:
             - pnpm build
       artifacts:
         baseDirectory: .next
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
           - .next/cache/**/*
     ```

### Option B: Update Existing App

If you have an existing Amplify app (like `dcwmv1pw85f0j`):

1. Go to your existing app in Amplify Console
2. **App settings** → **General** → **Edit**
3. Update repository settings to point to your subdirectory
4. Set **Root directory** to: `gen2-comparison-fresh`

## 🔧 Step 3: Configure Environment Variables

In Amplify Console → **App settings** → **Environment variables**:

### Required Variables
```
# Authentication
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_measurement_id

# Site metadata
NEXT_PUBLIC_SITE_URL=https://www.baltzakisthemis.com
NEXT_PUBLIC_TWITTER_HANDLE=@your_twitter_handle

# Build Optimization
NEXT_TELEMETRY_DISABLED=1
NODE_OPTIONS=--max-old-space-size=20480
```

### Variable Types
- ✅ **GOOGLE_CLIENT_ID**: Plain text
- ✅ **GOOGLE_CLIENT_SECRET**: Plain text (not secret)
- ✅ **GITHUB_CLIENT_ID**: Plain text
- ✅ **GITHUB_CLIENT_SECRET**: Plain text (not secret)
- ✅ **NEXT_PUBLIC_GA_MEASUREMENT_ID**: Plain text
- ✅ **NEXT_PUBLIC_SITE_URL**: Plain text
- ✅ **NEXT_PUBLIC_TWITTER_HANDLE**: Plain text

## 🌐 Step 4: Configure Custom Domain

### Add Custom Domain
1. In Amplify Console → **Domain management**
2. Click **"Add domain"**
3. Enter: `baltzakisthemis.com`
4. Click **"Configure domain"**

### DNS Configuration
Amplify will show required DNS records. Since you already have Route 53 configured, verify these match:

```
# A Records (for root domain)
baltzakisthemis.com → d3uho3sh727e9v.cloudfront.net

# CNAME Records (for www)
www.baltzakisthemis.com → d3uho3sh727e9v.cloudfront.net
```

### SSL Certificate
- ✅ **Automatic**: Amplify provisions SSL certificates via AWS Certificate Manager
- ✅ **Domains covered**: `baltzakisthemis.com` and `www.baltzakisthemis.com`
- ✅ **Certificate status**: Should show "Ready" after DNS propagation

## 🚀 Step 5: Deploy

### First Deployment
1. Click **"Save and deploy"** in Amplify Console
2. **Deployment time**: 10-15 minutes
3. **Build phases**:
   - ✅ Install dependencies (`pnpm install`)
   - ✅ Build application (`pnpm build`)
   - ✅ Deploy to CloudFront
   - ✅ Configure custom domain

### Monitor Deployment
- **Amplify Console** → **Deployments** tab
- **Build logs** show real-time progress
- **Domain verification** shows SSL status

## 🔍 Step 6: Verify Deployment

### Test URLs
After deployment completes, test these URLs:

```
✅ https://baltzakisthemis.com/app
✅ https://baltzakisthemis.com/admin
✅ https://baltzakisthemis.com/auth/signin
✅ https://baltzakisthemis.com/auth/signup
```

### Authentication Testing
1. Visit homepage → should redirect to `/auth/signin`
2. Test **email/password** registration
3. Test **Google OAuth** sign-in
4. Test **GitHub OAuth** sign-in
5. Test **password reset** flow
6. Test **protected routes**

### SSL Verification
```bash
# Check SSL certificate
curl -I https://baltzakisthemis.com

# Should show:
# HTTP/2 200
# Content-Security-Policy: ...
# Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## 🔧 Step 7: Troubleshooting

### Build Failures
```bash
# Check build logs in Amplify Console
# Common issues:
# - Missing environment variables
# - Node.js version compatibility
# - Memory limits (increase NODE_OPTIONS)
```

### Domain Issues
```bash
# Verify DNS propagation
nslookup baltzakisthemis.com

# Check domain association status
aws amplify list-domain-associations --app-id YOUR_APP_ID
```

### Authentication Issues
- Verify OAuth redirect URIs match Amplify domain
- Check environment variables are set correctly
- Ensure OAuth apps are configured for production domain

## 📊 Step 8: Monitoring & Analytics

### Enable Monitoring
In Amplify Console:
- **Monitoring** tab: View performance metrics
- **Logs**: Access CloudWatch logs
- **Custom alerts**: Set up notifications

### Analytics Integration
Your app includes Google Analytics:
- Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable
- Analytics will auto-track page views and events

## 🔄 Step 9: Updates & Maintenance

### Deploy Updates
```bash
# Make changes locally
cd gen2-comparison-fresh
git add .
git commit -m "Update feature"
git push origin main

# Automatic deployment via Amplify CI/CD
```

### Environment Management
- **Development**: Use `npx ampx sandbox` locally
- **Staging**: Create branch deployments for testing
- **Production**: Main branch auto-deploys

## 📋 Production Checklist

### Pre-Deployment
- [x] Code committed and pushed
- [x] Environment variables prepared
- [x] OAuth apps configured for production domain
- [x] Custom domain DNS ready

### Deployment
- [ ] Amplify app created/updated
- [ ] Root directory set to `gen2-comparison-fresh`
- [ ] Environment variables configured
- [ ] Custom domain added
- [ ] SSL certificate provisioned

### Post-Deployment
- [ ] URLs accessible (HTTP 200)
- [ ] SSL working (HTTPS redirect)
- [ ] Authentication flows working
- [ ] Social OAuth functional
- [ ] Monitoring enabled
- [ ] Analytics tracking

## 🎯 Expected Results

### Production URLs
```
✅ https://baltzakisthemis.com          (Main app)
✅ https://www.baltzakisthemis.com      (WWW redirect)
✅ https://baltzakisthemis.com/auth/*    (Auth pages)
✅ https://baltzakisthemis.com/test-page (Mock data)
```

### Features Working
- ✅ **Next.js 15** SSR/SSG
- ✅ **AWS Cognito** authentication
- ✅ **Google/GitHub** OAuth
- ✅ **DynamoDB** data storage
- ✅ **AppSync** GraphQL API
- ✅ **CloudFront** CDN
- ✅ **SSL/TLS** encryption

### Performance Metrics
- **First Contentful Paint**: <1.5s
- **Lighthouse Score**: >90
- **SSL Grade**: A+
- **CDN Hit Rate**: >95%

## 🚨 Support Resources

### AWS Documentation
- [Amplify Gen2 Deployment Guide](https://docs.amplify.aws/nextjs/deploy-and-host/)
- [Custom Domain Setup](https://docs.amplify.aws/console/customdomains/)
- [Environment Variables](https://docs.amplify.aws/console/environment-variables/)

### Common Issues
- **Build timeouts**: Increase build compute type
- **Memory issues**: Add `NODE_OPTIONS=--max-old-space-size=20480`
- **Domain propagation**: Wait 24-48 hours for DNS changes

---

## 🎉 Success!

Your **Fresh Gen2 Amplify Todo App** is now live at:
**https://baltzakisthemis.com**

With full authentication, custom domain, SSL, and production-ready infrastructure! 🚀

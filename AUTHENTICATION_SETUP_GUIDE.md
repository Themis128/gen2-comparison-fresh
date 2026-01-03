# 🔐 Complete Authentication Setup Guide

This guide provides step-by-step instructions to configure and test the complete authentication system for the Fresh Gen2 Amplify Todo App.

## 📋 Prerequisites

- Node.js 18+ installed
- AWS CLI configured with your credentials
- Git repository cloned
- Basic understanding of OAuth 2.0

## 🚀 Quick Setup (5 minutes)

### 1. Environment Setup
```bash
cd gen2-comparison-fresh
cp .env.example .env.local
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Amplify
```bash
npx ampx configure
npx ampx sandbox
```

### 4. Start Development
```bash
pnpm dev
```

### 5. Test Basic Auth
Visit `http://localhost:3000` - should redirect to sign-in page.

---

## 🔧 Social Authentication Configuration

### Option A: Skip Social Auth (Email Only)
If you only want email/password authentication, no additional setup is needed. The app works perfectly with email authentication alone.

### Option B: Enable Social Authentication (Recommended)

## 📘 Google OAuth Setup

### Step 1: Create Google OAuth App

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click "Select a project" → "New Project"
   - Name: `fresh-amplify-todo-app`
   - Click "Create"

3. **Enable Google+ API**
   - In the left sidebar, go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Name: `Fresh Amplify Todo App`

5. **Configure Authorized Redirect URIs**
   - Add these URIs:
     ```
     http://localhost:3000/auth/signin
     https://yourdomain.com/auth/signin
     ```
   - Click "Create"

6. **Copy Credentials**
   - You'll see your Client ID and Client Secret
   - Keep this page open or copy them to a safe place

### Step 2: Configure Environment Variables

1. **Edit `.env.local`**
   ```bash
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_actual_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
   ```

2. **Replace with your actual values**
   - `GOOGLE_CLIENT_ID`: From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console

---

## 📘 GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/developers
   - Click "OAuth Apps" → "New OAuth App"

2. **Fill Application Details**
   ```
   Application name: Fresh Amplify Todo App
   Homepage URL: http://localhost:3000
   Application description: Modern Todo App with AWS Amplify
   ```

3. **Configure Authorization Callback URL**
   ```
   Authorization callback URL: http://localhost:3000/auth/signin
   ```

4. **Create the App**
   - Click "Register application"

5. **Generate Client Secret**
   - On the app page, click "Generate a new client secret"
   - Copy the Client ID and Client Secret

### Step 2: Configure Environment Variables

1. **Edit `.env.local`**
   ```bash
   # GitHub OAuth Configuration
   GITHUB_CLIENT_ID=your_actual_github_client_id_here
   GITHUB_CLIENT_SECRET=your_actual_github_client_secret_here
   ```

2. **Replace with your actual values**
   - `GITHUB_CLIENT_ID`: From GitHub OAuth App
   - `GITHUB_CLIENT_SECRET`: From GitHub OAuth App

---

## 🚀 Deploy Social Authentication

### Step 1: Update Amplify Sandbox
```bash
npx ampx sandbox --outputs-format json
```

This command:
- Reads your environment variables
- Updates the Cognito User Pool configuration
- Enables social authentication providers
- Regenerates `amplify_outputs.json`

### Step 2: Verify Configuration
Check that `amplify_outputs.json` contains:
```json
{
  "auth": {
    "external_providers": ["GOOGLE", "GITHUB"],
    "oauth": {
      "redirect_sign_in_uri": ["http://localhost:3000/auth/signin"],
      "redirect_sign_out_uri": ["http://localhost:3000/auth/signin"]
    }
  }
}
```

### Step 3: Restart Development Server
```bash
# Stop current server (Ctrl+C) and restart
pnpm dev
```

---

## 🧪 Testing Authentication

### Automated Testing
```bash
# Run all authentication tests
npx playwright test tests/e2e/auth.spec.ts

# Run with visual browser (recommended)
npx playwright test tests/e2e/auth.spec.ts --headed

# Run specific test
npx playwright test -g "should redirect to sign-in"
```

### Manual Testing

#### Test 1: Basic Email Authentication
1. Visit `http://localhost:3000`
2. Should redirect to `/auth/signin`
3. Click "Sign up" → Go to `/auth/signup`
4. Fill form with real email
5. Check email for verification code
6. Enter code at `/auth/verify-email`
7. Sign in at `/auth/signin`
8. Should access todo dashboard

#### Test 2: Social Authentication (Google)
1. Go to `/auth/signin`
2. Click "Continue with Google"
3. Should redirect to Google OAuth
4. Sign in with Google account
5. Grant permissions
6. Should redirect back and be signed in
7. Should access todo dashboard

#### Test 3: Social Authentication (GitHub)
1. Go to `/auth/signin`
2. Click "Continue with GitHub"
3. Should redirect to GitHub OAuth
4. Sign in with GitHub account
5. Authorize the app
6. Should redirect back and be signed in
7. Should access todo dashboard

#### Test 4: Password Reset
1. Go to `/auth/signin`
2. Click "Forgot password?"
3. Enter your email
4. Check email for reset link
5. Click link → Should go to `/auth/reset-password`
6. Enter reset code and new password
7. Should redirect to sign-in with success message

#### Test 5: Route Protection
1. Sign out from dashboard
2. Try to visit `http://localhost:3000` directly
3. Should redirect to `/auth/signin`

---

## 🔍 Troubleshooting

### Common Issues

#### Issue: Social login buttons don't work
**Solution:**
1. Check that environment variables are set in `.env.local`
2. Run `npx ampx sandbox` again after setting env vars
3. Check browser console for errors
4. Verify OAuth app redirect URIs match exactly

#### Issue: "Invalid OAuth access token"
**Solution:**
1. Regenerate OAuth credentials
2. Update environment variables
3. Run `npx ampx sandbox` to redeploy

#### Issue: Redirect loop after social login
**Solution:**
1. Check that callback URLs in OAuth apps match Amplify config
2. Ensure `http://localhost:3000/auth/signin` is in allowed redirect URIs
3. Clear browser cookies and try again

#### Issue: Email verification not working
**Solution:**
1. Check AWS SES configuration in your AWS account
2. Verify the email address you're using for signup
3. Check spam folder for verification emails

#### Issue: Tests failing
**Solution:**
```bash
# Clear test cache
npx playwright install
npx playwright test --headed --debug
```

### Debug Commands

```bash
# Check Amplify status
npx ampx sandbox --status

# View Amplify outputs
cat amplify_outputs.json | jq '.auth'

# Check environment variables
echo $GOOGLE_CLIENT_ID
echo $GITHUB_CLIENT_ID

# View Amplify logs
npx ampx sandbox --logs
```

---

## 🚀 Production Deployment

### Step 1: Update OAuth Redirect URIs

**Google:**
- Add production domain: `https://yourdomain.com/auth/signin`

**GitHub:**
- Add production domain: `https://yourdomain.com/auth/signin`

### Step 2: Set Environment Variables in Amplify Console

```bash
# In AWS Amplify Console → App settings → Environment variables
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Step 3: Deploy to Production
```bash
npx ampx deploy
```

### Step 4: Update Amplify Configuration
In `amplify/auth/resource.ts`, update callback URLs:
```typescript
callbackUrls: [
  'http://localhost:3000/auth/signin',
  'https://yourdomain.com/auth/signin',  // Add production URL
],
logoutUrls: [
  'http://localhost:3000/auth/signin',
  'https://yourdomain.com/auth/signin',  // Add production URL
],
```

---

## 📚 Authentication Flow Diagrams

### Email/Password Authentication
```
User Input → Sign Up → Email Sent → Verify Code → Account Active → Sign In → Dashboard
     ↓           ↓           ↓           ↓           ↓           ↓           ↓
  Validation  Database    SES Email   confirmSignUp  Cognito     JWT       Protected Route
```

### Social Authentication
```
User Click → OAuth Redirect → Provider Auth → Grant Permissions → Callback → Auto Sign-In → Dashboard
     ↓           ↓           ↓           ↓           ↓           ↓           ↓
  signInWithRedirect  Google/GitHub  User Consent  Authorization Code  Cognito  JWT  Protected Route
```

### Password Reset
```
Forgot Password → Email Input → Reset Email → Click Link → Enter Code → New Password → Success
     ↓           ↓           ↓           ↓           ↓           ↓           ↓
  resetPassword  Database    SES Email   Token Validation  confirmResetPassword  Update  Sign In
```

---

## 🔒 Security Features

### Implemented Security Measures
- ✅ **Password hashing** (handled by Cognito)
- ✅ **JWT token management** (automatic refresh)
- ✅ **Rate limiting** (AWS WAF configurable)
- ✅ **Account lockout** (configurable in Cognito)
- ✅ **Email verification** (prevents fake accounts)
- ✅ **Secure OAuth flow** (PKCE, state parameters)

### Recommended Additional Security
- Enable MFA (Multi-Factor Authentication)
- Set up AWS WAF rules
- Configure CloudTrail logging
- Enable Cognito advanced security features
- Set up monitoring and alerts

---

## 🎯 Next Steps

### Advanced Features to Consider
1. **Multi-Factor Authentication (MFA)**
2. **Social account linking**
3. **Custom user attributes**
4. **Account deletion flow**
5. **Password strength validation**
6. **Session management**

### Testing
- Add integration tests for OAuth flows
- Test on multiple browsers/devices
- Load testing for authentication endpoints
- Security testing with OWASP guidelines

---

## 📞 Support

### Getting Help
1. Check this guide first
2. Review AWS Amplify documentation
3. Check GitHub issues for similar problems
4. Use AWS support for account-specific issues

### Useful Links
- [AWS Amplify Auth Documentation](https://docs.amplify.aws/gen2/build-a-backend/auth/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Setup](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Cognito User Pools Guide](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)

---

## ✅ Quick Checklist

- [ ] Environment variables configured
- [ ] Google OAuth app created and configured
- [ ] GitHub OAuth app created and configured
- [ ] Amplify sandbox deployed with social auth
- [ ] Development server restarted
- [ ] Email authentication tested
- [ ] Social authentication tested
- [ ] Password reset tested
- [ ] All tests passing
- [ ] Production deployment configured

**🎉 Your authentication system is now complete and production-ready!**

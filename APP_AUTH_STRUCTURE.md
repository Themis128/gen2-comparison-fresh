# App Authentication Flow - New Structure

## Overview

The app has been restructured to implement a proper authentication flow where users must authenticate first before accessing the main application. This document describes the new folder structure and how the authentication works.

## Folder Structure

```
src/app/
├── (protected)/              # Route group for authenticated-only routes
│   ├── layout.tsx           # Protected layout with auth checking
│   └── app/                 # Main app content (requires auth)
│       ├── layout.tsx       # App layout with navigation
│       └── page.tsx         # Home/portfolio page
│
├── auth/                    # Authentication routes (public)
│   ├── layout.tsx          # Auth layout (no navigation)
│   ├── signin/
│   │   └── page.tsx        # Sign in page
│   ├── signup/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── verify-email/
│   └── modern-signin/
│
├── admin/                  # Admin routes (future)
├── api/                    # API routes
├── layout.tsx             # Root layout (Amplify config, theme)
├── page.tsx               # Root page (redirect to /app)
└── [other routes]
```

## Authentication Flow

### 1. **User Access**
When a user visits your app:
- User opens the app (e.g., `https://yourapp.com/`)
- Root page.tsx redirects to `/app` (the protected route)

### 2. **Protected Route Check**
- The `/app` route is under the `(protected)` route group
- The `(protected)/layout.tsx` checks if the user is authenticated
- Uses AWS Amplify's `getCurrentUser()` to verify authentication status

### 3. **Authentication Status**
- ✅ **User is authenticated**: 
  - Shows loading spinner briefly
  - Renders the protected app content
  - Navigation is displayed

- ❌ **User is NOT authenticated**:
  - Shows loading spinner
  - Redirects to `/auth/signin`
  - Auth page is displayed without navigation

### 4. **Sign In Flow**
After successful authentication on `/auth/signin`:
- Regular users are redirected to `/app`
- Admin users (detected by email) are redirected to `/admin`
- User is now authenticated and can access protected routes

## Key Files & Responsibilities

### `/middleware.ts` - Route Protection
- Allows auth routes without authentication check
- Allows API routes
- Redirects other routes to auth check via layout

### `(protected)/layout.tsx` - Auth Gate
- Client-side component that checks user authentication
- Shows loading spinner while checking
- Redirects to signin if not authenticated
- Renders protected content if authenticated

### `(protected)/app/layout.tsx` - Protected App Layout
- Includes `NavigationWrapper` for app navigation
- Only rendered for authenticated users

### `(protected)/app/page.tsx` - Protected Home Page
- Main portfolio/dashboard content
- Only accessible after authentication

### `/auth/signin/page.tsx` - Sign In Page
- Public route (no authentication required)
- Redirects to `/app` on successful sign in

### `/page.tsx` - Root Page
- Simple redirect to `/app`
- Ensures consistent entry point

## Environment Variables

Make sure your `.env.local` contains:

```env
# AWS Amplify Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
# ... other Amplify config
```

## Testing the Flow

### Test 1: Unauthenticated Access
1. Clear browser cookies/session
2. Visit `http://localhost:3001/`
3. Should redirect to `/auth/signin`

### Test 2: Authenticated Access
1. Sign in successfully
2. Should redirect to `/app`
3. Should see navigation and app content
4. Refreshing page should maintain authentication

### Test 3: Direct Route Access
1. Try accessing `/app` directly without authentication
2. Should redirect to `/auth/signin`

## Advantages of This Structure

✅ **Clear Separation**: Auth routes are separate from protected routes  
✅ **Automatic Redirects**: No need to manually check auth in every page  
✅ **Single Entry Point**: Root page always redirects to `/app`  
✅ **Clean Auth Flow**: Sign-in page is never shown to authenticated users  
✅ **Navigation Control**: Navigation only shows on protected routes  
✅ **Admin Support**: Easy to detect and route admin users differently  

## Future Enhancements

- Add role-based access control (RBAC) in `(protected)/layout.tsx`
- Create separate admin routes in `(protected)/admin/`
- Add per-page auth guards using layout nesting
- Implement session refresh logic
- Add logout functionality with redirect to signin

## Troubleshooting

### Issue: Infinite redirect loop
**Solution**: Check that `getCurrentUser()` is working properly with AWS Amplify configuration

### Issue: Navigation disappears
**Solution**: Navigation only appears in `(protected)/app/` - check your routes are under this group

### Issue: Auth state not persisting
**Solution**: Ensure AWS Amplify configuration is loaded before auth checks (handled in root layout)

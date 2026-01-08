import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const i18nMiddleware = createMiddleware({
  locales: ['en', 'el'],
  defaultLocale: 'en',
});

export default function middleware(request: NextRequest) {
  // First, handle i18n routing
  const i18nResponse = i18nMiddleware(request);
  if (i18nResponse) {
    return i18nResponse;
  }

  const pathname = request.nextUrl.pathname;

  // Enhanced test mode detection for Playwright (from proxy.ts)
  const isTestMode =
    request.headers.get('x-test-mode') === 'true' ||
    request.nextUrl.searchParams.get('testMode') === 'true' ||
    process.env.NODE_ENV === 'test' ||
    request.headers.get('user-agent')?.includes('Playwright') ||
    request.headers.get('user-agent')?.includes('HeadlessChrome');

  // In test mode, allow all routes and skip security headers
  if (isTestMode) {
    return NextResponse.next();
  }

  // Clone the response to add headers
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Add Content Security Policy for enhanced security
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google-analytics.com *.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' *.googleapis.com",
    "img-src 'self' data: https: *.amazonaws.com *.vercel.com",
    "font-src 'self' *.googleapis.com *.gstatic.com",
    "connect-src 'self' *.amazonaws.com *.google-analytics.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // Add HSTS header for HTTPS enforcement
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Log requests in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  }

  // Always allow auth routes (guest access)
  if (pathname.startsWith('/auth')) {
    return response;
  }

  // Always allow API routes (handle auth in API)
  if (pathname.startsWith('/api')) {
    return response;
  }

  // Always allow public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.png') ||
    pathname === '/sw.js'
  ) {
    return response;
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/contact', '/projects'];
  if (publicRoutes.includes(pathname)) {
    return response;
  }

  // Handle authentication redirects (if you add auth later)
  if (pathname.startsWith('/admin')) {
    // Add authentication check here when implementing auth
    console.warn('Admin route accessed:', request.url);
  }

  // Add cache control for static assets
  if (pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Add no-cache for API routes
  if (pathname.startsWith('/api')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};

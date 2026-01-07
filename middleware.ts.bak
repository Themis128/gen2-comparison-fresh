import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware for testing Next.js 16 features
export function middleware(request: NextRequest) {
  // Add test headers for Playwright identification
  const response = NextResponse.next();
  response.headers.set('x-middleware-test', 'true');
  response.headers.set('x-request-path', request.nextUrl.pathname);
  response.headers.set('x-request-method', request.method);

  // Add geolocation simulation for testing
  const country = request.headers.get('x-test-country') || 'US';
  response.headers.set('x-simulated-country', country);

  // Add device type detection for responsive testing
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
  response.headers.set('x-device-type', isMobile ? 'mobile' : 'desktop');

  // Add A/B testing headers
  const testVariant = request.cookies.get('test-variant')?.value || 'A';
  response.headers.set('x-test-variant', testVariant);

  // Authentication redirect logic for non-auth pages
  const pathname = request.nextUrl.pathname;

  // Allow access to auth pages
  if (pathname.startsWith('/auth')) {
    return response;
  }

  // Allow access to API routes
  if (pathname.startsWith('/api')) {
    return response;
  }

  // Check for test mode
  const isTestMode =
    request.headers.get('x-test-mode') === 'true' ||
    request.cookies.get('test-mode')?.value === 'true' ||
    request.nextUrl.searchParams.get('test-mode') === 'true';

  console.log(
    'Middleware running for path:',
    pathname,
    'isTestMode:',
    isTestMode,
    'headers:',
    Object.fromEntries(request.headers.entries())
  );

  if (isTestMode) {
    return response;
  }

  // For all other pages, redirect to signin (simulating no authentication)
  // In a real app, this would check for auth tokens/cookies
  console.log('About to redirect to signin');
  const signinUrl = new URL('/auth/signin', request.url);
  signinUrl.searchParams.set('redirect', pathname);
  console.log('Redirecting to:', signinUrl.toString());
  return NextResponse.redirect(signinUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

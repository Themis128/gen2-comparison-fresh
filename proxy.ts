import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow auth routes without authentication
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Allow API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Allow public routes
  const publicRoutes = ['/'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // For all other routes, we'll check authentication client-side
  // The auth check will be done in the layout component
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.svg$|sw\\.js).*)',
  ],
};

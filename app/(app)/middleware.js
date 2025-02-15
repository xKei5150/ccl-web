// middleware.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Paths that don't require authentication
const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

// Paths that require specific roles
const roleProtectedPaths = {
  '/dashboard/staff': ['admin', 'staff'],
  '/dashboard/admin': ['admin'],
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get auth token from cookies
  const token = request.cookies.get('payload-token');
  // If no token and trying to access protected route, redirect to login
  if (!token && !publicPaths.includes(pathname)) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Add routes that should exclude the sidebar
  const excludedRoutes = ['/auth', '/auth/register', '/404', '/500'];

  // Add custom headers for layout decisions
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-exclude-sidebar', excludedRoutes.some(route => pathname.startsWith(route)));
  requestHeaders.set('x-auth-token', token?.value || '');

  // Clone the request with new headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}
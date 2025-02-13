// middleware.js
import { NextResponse } from 'next/server';
import { payload } from '@/lib/payload';
import { hasRole } from '@/lib/utils';

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
  };
  
export async function middleware(request) {
  const token = request.cookies.get('payload-token');

  // Protect staff routes
  if (request.nextUrl.pathname.startsWith('/dashboard/staff')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      const { user } = await payload.verifyToken(token.value);
      
      if (!hasRole(user, ['admin', 'staff'])) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  const { pathname } = request.nextUrl;
    
  // Add routes that should exclude the sidebar
  const excludedRoutes = [
    '/auth',
    '/auth/register',
    '/404',
    '/500',
  ];

  // Add a custom header that our layout can read
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-exclude-sidebar', excludedRoutes.includes(pathname));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
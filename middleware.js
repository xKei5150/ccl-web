// middleware.js
import { NextResponse } from 'next/server';

// Paths that don't require authentication
const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

// Paths that require specific roles
const roleProtectedPaths = {
  '/admin': ['admin', 'staff'],
  '/dashboard/staff': ['admin', 'staff'],
  '/dashboard/reports': ['admin', 'staff'],
  '/dashboard/site-settings': ['admin'],
  '/dashboard/theme': ['admin'],
  '/dashboard/personal': ['admin', 'staff'],
  '/dashboard/household': ['admin', 'staff'],
  '/dashboard/business': ['admin', 'staff'],
};

// Paths that citizens can access - being explicit about exact paths
const citizenAllowedPaths = [
  '/dashboard/posts',
  '/dashboard/general-requests',
  '/dashboard/reports',
  '/dashboard/profile',
];

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|webp)).*)'],
};

function validatePathAccess(pathname, role, roleProtectedPaths, citizenAllowedPaths) {
  if (role === 'citizen') {
    return citizenAllowedPaths.some(path => pathname.startsWith(path));
  }

  // For protected paths, check if user's role has access
  const protectedPath = Object.entries(roleProtectedPaths).find(([path]) => pathname.startsWith(path));
  if (protectedPath) {
    const [, allowedRoles] = protectedPath;
    return allowedRoles.includes(role);
  }

  return true;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  
  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return response;
  }

  // Get auth token from cookies
  const authToken = request.cookies.get('payload-token');

  // If no token and trying to access protected route, redirect to login
  if (!authToken?.value) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Check token expiration
    const tokenData = JSON.parse(atob(authToken.value.split('.')[1]));
    if (tokenData.exp * 1000 < Date.now()) {
      // Token is expired, redirect to login
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      // Clear expired cookies
      response.cookies.delete('payload-token');
      response.cookies.delete('user-role');
      return response;
    }

    // Get user role from cookie
    const userRole = request.cookies.get('user-role')?.value;
    // If no role but has token, let them proceed to dashboard where AuthProvider will handle proper authentication
    if (!userRole && pathname.startsWith('/dashboard')) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // For non-dashboard routes, proceed if authenticated
    if (!pathname.startsWith('/dashboard')) {
      return response;
    }

    // For dashboard routes, validate access if we have a role

    if (userRole) {
      const hasAccess = validatePathAccess(pathname, userRole, roleProtectedPaths, citizenAllowedPaths);
      if (!hasAccess) {
        // Redirect to appropriate dashboard based on role
        const redirectUrl = new URL(
          userRole === 'citizen' 
            ? '/dashboard/posts'  // Default citizen landing page
            : '/dashboard',       // Default admin/staff landing page
          request.url
        );
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Exclude sidebar for specific routes
    const excludedRoutes = ['/auth', '/auth/register', '/404', '/500'];
    response.headers.set('x-exclude-sidebar', String(excludedRoutes.some(route => pathname.startsWith(route))));

    return response;

  } catch (error) {
    console.error('Middleware auth error:', error);
    // Only redirect to login if there's a real auth error, not just missing role
    if (!authToken?.value) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    // Otherwise let the request through to be handled by the AuthProvider
    return response;
  }
}
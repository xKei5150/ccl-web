// middleware.js
import { NextResponse } from 'next/server';
import { pathToRegexp } from 'path-to-regexp';

// Paths that don't require authentication
const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/admin'];

// Paths that require specific roles
const roleProtectedPaths = {
  // '/admin': ['admin', 'staff'],
  '/dashboard/posts/[slug]/edit': ['admin', 'staff'],
  '/dashboard/posts/new': ['admin', 'staff'],
  '/dashboard/staff': ['admin', 'staff'],
  '/dashboard/reports': ['admin', 'staff'],
  '/dashboard/site-settings': ['admin'],
  '/dashboard/theme': ['admin'],
  '/dashboard/personal': ['admin', 'staff'],
  '/dashboard/household': ['admin', 'staff'],
  '/dashboard/business': ['admin', 'staff'],
  '/dashboard/business-permits': ['admin', 'staff'],
};

// Paths that citizens can access - being explicit about exact paths
const citizenAllowedPaths = [
  '/dashboard',
  '/dashboard/posts',
  '/dashboard/general-requests',
  '/dashboard/reports',
  '/dashboard/profile',
  '/dashboard/financing',
];

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|webp)).*)'],
};

function validatePathAccess(pathname, role, roleProtectedPaths, citizenAllowedPaths) {
  // Normalize pathname by removing trailing slash
  const normalizedPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  // For citizens, check if the path starts with any allowed path
  if (role === 'citizen') {
    return citizenAllowedPaths.some(path => 
      normalizedPathname === path || normalizedPathname.startsWith(`${path}/`));
  }

  // Check for exact protected path matches first
  if (roleProtectedPaths[normalizedPathname]) {
    return roleProtectedPaths[normalizedPathname].includes(role);
  }

  // Check for dynamic routes
  for (const [pattern, allowedRoles] of Object.entries(roleProtectedPaths)) {
    // Skip exact matches as they were handled above
    if (pattern === normalizedPathname) continue;

    // Check if this is a dynamic route pattern
    if (pattern.includes('[')) {
      // Convert Next.js dynamic path pattern to a regex pattern
      const regexPattern = pattern
        .replace(/\[([^\]]+)\]/g, '([^/]+)') // Replace [param] with a pattern matching any string except /
        .replace(/\/\[\[\.\.\.[^\]]+\]\]/g, '(/.*)?'); // Handle [[...params]] catch-all routes
      
      const pathRegex = new RegExp(`^${regexPattern}$`);
      
      // Test against both with and without trailing slash
      if (pathRegex.test(normalizedPathname) || pathRegex.test(`${normalizedPathname}/`)) {
        return allowedRoles.includes(role);
      }
    } 
    // For static paths, check if the current path starts with this protected path
    else if (normalizedPathname === pattern || normalizedPathname.startsWith(`${pattern}/`)) {
    return allowedRoles.includes(role);
    }
  }

  // If no protected path matched, access is allowed
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
        // Log for debugging
        console.log(`[Middleware] Access denied to ${pathname} for role ${userRole}`);
        
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
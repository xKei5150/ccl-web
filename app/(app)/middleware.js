// middleware.js
export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
  };
  
  export function middleware(request) {
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
  
    return Response.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
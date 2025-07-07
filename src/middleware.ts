import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/register') ||
    pathname.startsWith('/auth/verify-email');

  // If the user is logged in (token exists)
  if (token) {
    // If they are on an auth page, redirect them to the dashboard.
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If a non-admin user tries to access an admin route, redirect them.
    if (pathname.startsWith('/admin') && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // Otherwise, allow access
    return NextResponse.next();
  }

  // If the user is not logged in, protect the routes
  const protectedRoutes = [
    '/dashboard',
    '/admin',
    '/priest-panel',
    '/visitation-servant-panel',
    '/sunday-school-servant-panel',
    '/makhdoum-panel',
    '/makhdoum-parent-panel',
    '/makhdoum-child-panel',
  ];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Redirect to login, NextAuth will handle the callback URL.
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access to all other routes (landing page, public panels, auth routes, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude files that aren't routes and the public register API
    '/((?!api/(register|auth/verify-email)|_next/static|_next/image|favicon.ico|manifest.json|icons).*)',
  ],
};

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export default auth((request) => {
  const session = request.auth;
  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/register');

  // If the user is logged in
  if (session) {
    // If they are on an auth page, redirect them to the dashboard.
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If a non-admin user tries to access an admin route, redirect them.
    if (pathname.startsWith('/admin') && session.user.role !== UserRole.ADMIN) {
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
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Allow access to all other routes (landing page, public panels, etc.)
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Exclude files that aren't routes and the public register API
    '/((?!api/register|_next/static|_next/image|favicon.ico|manifest.json|icons).*)',
  ],
};

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { NextRequest } from 'next/server';
import { UserRole } from '@prisma/client';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/register');

  const isApiAuthRoute = pathname.startsWith('/api/auth') || pathname.startsWith('/api/register');
  
  if (isApiAuthRoute) {
    return NextResponse.next();
  }
  
  // If the user is logged in
  if (session) {
    // and tries to access login/register page, redirect to dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Role-based access control
    if (pathname.startsWith('/admin') && session.user.role !== UserRole.ADMIN) {
      // If a non-admin user tries to access an admin route, redirect them
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // If the user is not logged in and not on an auth route, redirect to login
    if (!isAuthRoute && pathname !== '/') { // Allow access to landing page
        const protectedRoutes = [
            '/dashboard',
            '/admin',
            '/priest-panel',
            '/visitation-servant-panel',
            '/sunday-school-servant-panel',
            '/makhdoum-panel',
            '/makhdoum-parent-panel',
            '/makhdoum-child-panel'
        ];
        
        if (protectedRoutes.some(route => pathname.startsWith(route))) {
             return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons).*)',
  ],
};

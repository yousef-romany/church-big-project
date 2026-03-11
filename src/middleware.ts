import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

type UserRole = 'USER' | 'ADMIN' | 'PRIEST' | 'SERVANT' | 'SUNDAY_SCHOOL_SERVANT' | 'PARENT' | 'CHILD';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/register') ||
    pathname.startsWith('/auth/verify-email') ||
    pathname.startsWith('/auth/forgot-password') ||
    pathname.startsWith('/auth/reset-password') ||
    pathname.startsWith('/auth/2fa') ||
    pathname.startsWith('/auth/admin') ||
    pathname.startsWith('/auth/priest') ||
    pathname.startsWith('/auth/servant') ||
    pathname.startsWith('/auth/sunday-school-servant') ||
    pathname.startsWith('/auth/parent') ||
    pathname.startsWith('/auth/child') ||
    pathname.startsWith('/auth/makhdoum') ||
    pathname.startsWith('/auth/public');

  // If the user is logged in (token exists)
  if (token) {
    const userRole = token.role as UserRole;
    
    // If they are on an auth page, redirect them based on their role
    if (isAuthRoute) {
      let redirectPath = '/dashboard';
      
      switch (userRole) {
        case 'ADMIN':
          redirectPath = '/admin';
          break;
        case 'PRIEST':
          redirectPath = '/priest-panel/dashboard';
          break;
        case 'SERVANT':
          redirectPath = '/visitation-servant-panel/dashboard';
          break;
        case 'SUNDAY_SCHOOL_SERVANT':
          redirectPath = '/sunday-school-servant-panel/dashboard';
          break;
        case 'PARENT':
          redirectPath = '/makhdoum-parent-panel/dashboard';
          break;
        case 'CHILD':
          redirectPath = '/makhdoum-child-panel/dashboard';
          break;
        default:
          redirectPath = '/dashboard';
      }
      
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // If a non-admin user tries to access an admin route, redirect them.
    if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
      let redirectPath = '/dashboard';
      
      switch (userRole) {
        case 'PRIEST':
          redirectPath = '/priest-panel/dashboard';
          break;
        case 'SERVANT':
          redirectPath = '/visitation-servant-panel/dashboard';
          break;
        case 'SUNDAY_SCHOOL_SERVANT':
          redirectPath = '/sunday-school-servant-panel/dashboard';
          break;
        case 'PARENT':
          redirectPath = '/makhdoum-parent-panel/dashboard';
          break;
        case 'CHILD':
          redirectPath = '/makhdoum-child-panel/dashboard';
          break;
        default:
          redirectPath = '/dashboard';
      }
      
      return NextResponse.redirect(new URL(redirectPath, request.url));
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - icons (PWA icons folder)
     *
     * This uses a non-capturing group `(?:...)` at the start of the regex
     * to prevent the "Capturing groups are not allowed" parsing error.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|_next/data).*)',
  ],
};


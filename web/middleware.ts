import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/privacy', '/terms', '/login', '/register'];
const PUBLIC_PREFIXES = ['/_next/', '/favicon.ico', '/robots.txt', '/sitemap.xml'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Allow public prefixes (static assets, etc.)
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // If user is on login or register and has a token, redirect to dashboard
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow public routes without auth
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes: require token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - public file extensions
     */
    '/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/privacy', '/terms', '/login', '/register'];
const PUBLIC_PREFIXES = ['/_next/', '/favicon.ico', '/robots.txt', '/sitemap.xml'];

function isTokenExpired(token: string): boolean {
  try {
    const base64Payload = token.split('.')[1];
    if (!base64Payload) return true;
    const payload = JSON.parse(atob(base64Payload));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

function clearTokenResponse(redirectUrl: URL): NextResponse {
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set('token', '', { maxAge: 0, path: '/' });
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Allow public prefixes (static assets, etc.)
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const hasValidToken = token && !isTokenExpired(token);

  // If user is on login or register and has a valid token, redirect to dashboard
  if ((pathname === '/login' || pathname === '/register') && hasValidToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow public routes without auth
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes: require valid, non-expired token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isTokenExpired(token)) {
    return clearTokenResponse(new URL('/login', request.url));
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

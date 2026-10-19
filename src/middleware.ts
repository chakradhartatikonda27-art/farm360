import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose/jwt/verify';

const JWT_SECRET = new TextEncoder().encode(
  process.env.CMS_JWT_SECRET || 'farmcare-360-super-secret-jwt-key-2026-production'
);

const AUTH_COOKIE_NAME = 'farmcare_admin_token';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect Admin UI pages
  if (pathname.startsWith('/admin')) {
    // Direct /admin/logout link
    if (pathname === '/admin/logout') {
      const loginUrl = new URL('/admin/login', req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: '',
        path: '/',
        maxAge: 0,
        expires: new Date(0),
        httpOnly: true,
        sameSite: 'lax',
      });
      return response;
    }

    // Allow login page
    if (pathname === '/admin/login') {
      const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
      if (token) {
        try {
          await jwtVerify(token, JWT_SECRET);
          return NextResponse.redirect(new URL('/admin', req.url));
        } catch {
          // invalid token, allow viewing login page
        }
      }
      return NextResponse.next();
    }

    // All other /admin/* pages require valid JWT
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      loginUrl.searchParams.set('error', 'session_expired');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }
  }

  // Protect Admin API routes
  if (pathname.startsWith('/api/admin')) {
    // Allow login and logout API
    if (pathname === '/api/admin/auth/login' || pathname === '/api/admin/auth/logout') {
      return NextResponse.next();
    }

    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const res = NextResponse.next();
      res.headers.set('x-user-id', (payload.sub as string) || '');
      res.headers.set('x-user-role', (payload.role as string) || '');
      return res;
    } catch {
      return NextResponse.json({ error: 'Unauthorized: Invalid or expired session' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

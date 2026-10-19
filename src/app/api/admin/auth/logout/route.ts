import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, getCurrentAdminUser } from '@/lib/cms/auth';
import { addAuditLog } from '@/lib/cms/db';

export async function POST() {
  try {
    const user = await getCurrentAdminUser();
    if (user) {
      addAuditLog({
        userId: user.id,
        userName: user.name,
        action: 'USER_LOGOUT',
        entityType: 'USER',
        entityId: user.id,
        details: `User ${user.email} logged out`,
      });
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
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
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL('/admin/login', req.url);
  const response = NextResponse.redirect(url);
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

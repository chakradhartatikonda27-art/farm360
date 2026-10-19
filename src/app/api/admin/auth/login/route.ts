import { NextResponse } from 'next/server';
import { getUserByEmail, addAuditLog } from '@/lib/cms/db';
import { verifyPassword, createSessionToken, AUTH_COOKIE_NAME } from '@/lib/cms/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = getUserByEmail(email);
    if (!user || !(user.isActive ?? user.active)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValid = user.passwordHash ? verifyPassword(password, user.passwordHash) : false;
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await createSessionToken(user);

    // Audit log
    addAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'USER_LOGIN',
      entityType: 'USER',
      entityId: user.id,
      details: `Successful login for ${user.email} (${user.role})`,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });

    // Set HTTP-only secure cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: err?.message || 'An unexpected error occurred during login' },
      { status: 500 }
    );
  }
}

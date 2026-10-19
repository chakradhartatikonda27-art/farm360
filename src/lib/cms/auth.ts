import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { AdminUser, UserRole } from './types';
import { getUserByEmail, getUserById } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.CMS_JWT_SECRET || 'farmcare-360-super-secret-jwt-key-2026-production'
);

export const AUTH_COOKIE_NAME = 'farmcare_admin_token';

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Sign a JWT for authenticated admin sessions
 */
export async function createSessionToken(user: AdminUser): Promise<string> {
  return await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verify a JWT string
 */
export async function verifySessionToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Verify plaintext password against bcrypt hash
 */
export function verifyPassword(plain: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(plain, hash);
  } catch {
    return false;
  }
}

/**
 * Hash plaintext password
 */
export function hashPassword(plain: string): string {
  return bcrypt.hashSync(plain, 10);
}

/**
 * Get current authenticated user in Server Components and Route Handlers
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.sub) return null;

    const user = getUserById(payload.sub);
    if (!user || !(user.isActive ?? user.active)) return null;

    return user;
  } catch {
    return null;
  }
}

/**
 * Role-Based Access Control checker
 */
export function hasPermission(
  userRole: UserRole, 
  requiredRoles: UserRole[]
): boolean {
  if (userRole === 'SUPER_ADMIN') return true;
  return requiredRoles.includes(userRole);
}

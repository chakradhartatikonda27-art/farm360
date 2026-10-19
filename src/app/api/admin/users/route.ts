import { NextResponse } from 'next/server';
import { getUsers, getUsersAsync, saveUserAsync, deleteUserAsync, addAuditLogAsync } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission, hashPassword } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN'])) {
    return NextResponse.json({ error: 'Forbidden: Super Admin only' }, { status: 403 });
  }

  const userList = (await getUsersAsync()) || getUsers();
  const users = userList.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    avatar: u.avatar,
    active: u.isActive ?? u.active ?? true,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  }));

  return NextResponse.json({ success: true, data: users });
}

export async function POST(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN'])) {
    return NextResponse.json({ error: 'Forbidden: Super Admin only' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { email, password, name, role, active } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const saved = await saveUserAsync({
      email,
      name: name || email.split('@')[0],
      passwordHash: hashPassword(password),
      role: role || 'CONTENT_EDITOR',
      isActive: active !== undefined ? active : true,
      active: active !== undefined ? active : true,
    });

    await addAuditLogAsync({
      userId: user.id,
      userName: user.name,
      action: 'CREATE_USER',
      entityType: 'USER',
      entityId: saved.id,
      details: `Created admin user: ${saved.email} (${saved.role})`,
    });

    return NextResponse.json({
      id: saved.id,
      email: saved.email,
      name: saved.name,
      role: saved.role,
      active: saved.isActive ?? saved.active ?? true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, name, role, active, password } = body;

    // Non-super-admins can only update their own profile (name & password)
    if (user.role !== 'SUPER_ADMIN' && user.id !== id) {
      return NextResponse.json({ error: 'Forbidden: Cannot edit other users' }, { status: 403 });
    }

    const updatePayload: any = { id };
    if (name) updatePayload.name = name;
    if (password && password.trim()) updatePayload.passwordHash = hashPassword(password.trim());

    // Only Super Admin can change roles and active status
    if (user.role === 'SUPER_ADMIN') {
      if (role) updatePayload.role = role;
      if (active !== undefined) updatePayload.active = active;
    }

    const updated = await saveUserAsync(updatePayload);

    await addAuditLogAsync({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_USER',
      entityType: 'USER',
      entityId: updated.id,
      details: `Updated user profile for ${updated.email}`,
    });

    return NextResponse.json({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      active: updated.isActive ?? updated.active ?? true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN'])) {
    return NextResponse.json({ error: 'Forbidden: Super Admin only' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  if (id === user.id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
  }

  await deleteUserAsync(id);

  await addAuditLogAsync({
    userId: user.id,
    userName: user.name,
    action: 'DELETE_USER',
    entityType: 'USER',
    entityId: id,
    details: `Deleted user: ${id}`,
  });

  return NextResponse.json({ success: true, message: 'User deleted' });
}

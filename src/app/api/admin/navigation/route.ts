import { NextResponse } from 'next/server';
import { getNavigation, updateNavigation, addAuditLog } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export async function GET() {
  const nav = getNavigation();
  return NextResponse.json({ success: true, data: nav, ...nav });
}

export async function PUT(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'CONTENT_EDITOR'])) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = updateNavigation(body);

    addAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_NAVIGATION',
      entityType: 'NAVIGATION',
      entityId: 'global_menus',
      details: 'Updated header/footer navigation items and links',
    });

    return NextResponse.json({ success: true, data: updated, ...updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update navigation' }, { status: 500 });
  }
}

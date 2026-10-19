import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getNavigation, getNavigationAsync, updateNavigationAsync, addAuditLogAsync } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const nav = (await getNavigationAsync()) || getNavigation();
  return NextResponse.json({ success: true, data: nav, ...nav });
}

export async function PUT(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'CONTENT_EDITOR'])) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = await updateNavigationAsync(body);

    await addAuditLogAsync({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_NAVIGATION',
      entityType: 'NAVIGATION',
      entityId: 'global_menus',
      details: 'Updated header/footer navigation items and links',
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch {}

    return NextResponse.json({ success: true, data: updated, ...updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update navigation' }, { status: 500 });
  }
}

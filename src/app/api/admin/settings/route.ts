import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getGlobalSettings, getGlobalSettingsAsync, updateGlobalSettingsAsync, addAuditLogAsync } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = (await getGlobalSettingsAsync()) || getGlobalSettings();
  return NextResponse.json({ success: true, data: settings, ...settings });
}

export async function PUT(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN'])) {
    return NextResponse.json({ error: 'Forbidden: Super Admin only' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = await updateGlobalSettingsAsync(body);

    await addAuditLogAsync({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_GLOBAL_SETTINGS',
      entityType: 'SETTINGS',
      entityId: 'global_config',
      details: `Updated global website settings: brand, contact, and announcement ticker`,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch {}

    return NextResponse.json({ success: true, data: updated, ...updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update settings' }, { status: 500 });
  }
}

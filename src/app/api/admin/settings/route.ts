import { NextResponse } from 'next/server';
import { getGlobalSettings, updateGlobalSettings, addAuditLog } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export async function GET() {
  const settings = getGlobalSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN'])) {
    return NextResponse.json({ error: 'Forbidden: Super Admin only' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = updateGlobalSettings(body);

    addAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_GLOBAL_SETTINGS',
      entityType: 'SETTINGS',
      entityId: 'global_config',
      details: `Updated global website settings: brand, contact, and announcement ticker`,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update settings' }, { status: 500 });
  }
}

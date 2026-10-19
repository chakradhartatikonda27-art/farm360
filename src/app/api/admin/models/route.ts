import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getBusinessModels, getBusinessModelsAsync, saveBusinessModelAsync, addAuditLogAsync } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const models = (await getBusinessModelsAsync()) || getBusinessModels();
  return NextResponse.json({ success: true, data: models });
}

export async function PUT(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'CONTENT_EDITOR'])) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.id || !body.title) {
      return NextResponse.json({ error: 'Model ID and Title are required' }, { status: 400 });
    }

    const updated = await saveBusinessModelAsync(body);
    await addAuditLogAsync({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_BUSINESS_MODEL',
      entityType: 'BUSINESS_MODEL',
      entityId: updated.id,
      details: `Updated business model: "${updated.title}" (${updated.code})`,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch {}

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update business model' }, { status: 500 });
  }
}

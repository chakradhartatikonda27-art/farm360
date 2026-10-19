import { NextResponse } from 'next/server';
import { getBusinessModels, saveBusinessModel, addAuditLog } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export async function GET() {
  const models = getBusinessModels();
  return NextResponse.json(models);
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

    const updated = saveBusinessModel(body);
    addAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_BUSINESS_MODEL',
      entityType: 'BUSINESS_MODEL',
      entityId: updated.id,
      details: `Updated business model: "${updated.title}" (${updated.code})`,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update business model' }, { status: 500 });
  }
}

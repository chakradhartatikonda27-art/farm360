import { NextResponse } from 'next/server';
import { saveFaq, deleteFaq, addAuditLog } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'CONTENT_EDITOR'])) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = saveFaq({
      ...body,
      id: params.id,
    });

    addAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_FAQ',
      entityType: 'FAQ',
      entityId: updated.id,
      details: `Updated FAQ: "${updated.question}"`,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN'])) {
    return NextResponse.json({ error: 'Forbidden: Super Admin only' }, { status: 403 });
  }

  deleteFaq(params.id);

  addAuditLog({
    userId: user.id,
    userName: user.name,
    action: 'DELETE_FAQ',
    entityType: 'FAQ',
    entityId: params.id,
    details: `Deleted FAQ: ${params.id}`,
  });

  return NextResponse.json({ success: true, message: 'FAQ deleted' });
}

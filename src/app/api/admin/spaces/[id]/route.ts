import { NextResponse } from 'next/server';
import { getSpaceById, saveSpace, deleteSpace, addAuditLog } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const space = getSpaceById(params.id);
  if (!space) {
    return NextResponse.json({ error: 'Space not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: space });
}

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
    const existing = getSpaceById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 });
    }

    const updated = saveSpace({
      ...existing,
      ...body,
      id: existing.id,
      title: body.title || existing.title,
    });

    addAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_SPACE',
      entityType: 'SPACE',
      entityId: updated.id,
      details: `Updated space: "${updated.title}"`,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update space' }, { status: 500 });
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

  const existing = getSpaceById(params.id);
  if (!existing) {
    return NextResponse.json({ error: 'Space not found' }, { status: 404 });
  }

  deleteSpace(existing.id);

  addAuditLog({
    userId: user.id,
    userName: user.name,
    action: 'DELETE_SPACE',
    entityType: 'SPACE',
    entityId: existing.id,
    details: `Deleted space: "${existing.title}"`,
  });

  return NextResponse.json({ success: true, message: 'Space deleted' });
}

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSpaceById, getSpaceByIdAsync, saveSpaceAsync, deleteSpaceAsync, addAuditLogAsync } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const space = (await getSpaceByIdAsync(params.id)) || getSpaceById(params.id);
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
    const existing = (await getSpaceByIdAsync(params.id)) || getSpaceById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 });
    }

    const updated = await saveSpaceAsync({
      ...existing,
      ...body,
      id: existing.id,
      title: body.title || existing.title,
    });

    await addAuditLogAsync({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_SPACE',
      entityType: 'SPACE',
      entityId: updated.id,
      details: `Updated space: "${updated.title}"`,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch {}

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

  const existing = (await getSpaceByIdAsync(params.id)) || getSpaceById(params.id);
  if (!existing) {
    return NextResponse.json({ error: 'Space not found' }, { status: 404 });
  }

  await deleteSpaceAsync(existing.id);

  await addAuditLogAsync({
    userId: user.id,
    userName: user.name,
    action: 'DELETE_SPACE',
    entityType: 'SPACE',
    entityId: existing.id,
    details: `Deleted space: "${existing.title}"`,
  });

  try {
    revalidatePath('/', 'layout');
    revalidatePath('/');
  } catch {}

  return NextResponse.json({ success: true, message: 'Space deleted' });
}

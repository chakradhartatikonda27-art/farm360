import { NextResponse } from 'next/server';
import { getServiceById, getServiceBySlug, saveService, deleteService, addAuditLog } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const service = getServiceById(params.id) || getServiceBySlug(params.id);
  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }
  return NextResponse.json(service);
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
    const existing = getServiceById(params.id) || getServiceBySlug(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const updated = saveService({
      ...existing,
      ...body,
      id: existing.id,
      slug: body.slug || existing.slug,
      name: body.name || existing.name,
    });

    addAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_SERVICE',
      entityType: 'SERVICE',
      entityId: updated.id,
      details: `Updated service: "${updated.name}"`,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update service' }, { status: 500 });
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

  const existing = getServiceById(params.id) || getServiceBySlug(params.id);
  if (!existing) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  deleteService(existing.id);

  addAuditLog({
    userId: user.id,
    userName: user.name,
    action: 'DELETE_SERVICE',
    entityType: 'SERVICE',
    entityId: existing.id,
    details: `Deleted service: "${existing.name}" (/services/${existing.slug})`,
  });

  return NextResponse.json({ success: true, message: 'Service deleted successfully' });
}

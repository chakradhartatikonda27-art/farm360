import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServiceById, getServiceByIdAsync, getServiceBySlug, getServiceBySlugAsync, saveServiceAsync, deleteServiceAsync, addAuditLogAsync } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const service = (await getServiceByIdAsync(params.id)) || (await getServiceBySlugAsync(params.id)) || getServiceById(params.id) || getServiceBySlug(params.id);
  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: service });
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
    const existing = (await getServiceByIdAsync(params.id)) || (await getServiceBySlugAsync(params.id)) || getServiceById(params.id) || getServiceBySlug(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const updated = await saveServiceAsync({
      ...existing,
      ...body,
      id: existing.id,
      slug: body.slug || existing.slug,
      name: body.name || existing.name,
    });

    await addAuditLogAsync({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_SERVICE',
      entityType: 'SERVICE',
      entityId: updated.id,
      details: `Updated service: "${updated.name}"`,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/services');
      revalidatePath(`/services/${updated.slug}`);
      if (existing.slug !== updated.slug) {
        revalidatePath(`/services/${existing.slug}`);
      }
    } catch {}

    return NextResponse.json({ success: true, data: updated });
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

  const existing = (await getServiceByIdAsync(params.id)) || (await getServiceBySlugAsync(params.id)) || getServiceById(params.id) || getServiceBySlug(params.id);
  if (!existing) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  await deleteServiceAsync(existing.id);

  await addAuditLogAsync({
    userId: user.id,
    userName: user.name,
    action: 'DELETE_SERVICE',
    entityType: 'SERVICE',
    entityId: existing.id,
    details: `Deleted service: "${existing.name}" (/services/${existing.slug})`,
  });

  try {
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/services');
  } catch {}

  return NextResponse.json({ success: true, message: 'Service deleted successfully' });
}

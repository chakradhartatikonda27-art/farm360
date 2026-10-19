import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getTestimonialById, getTestimonialByIdAsync, saveTestimonialAsync, deleteTestimonialAsync, addAuditLogAsync } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const item = (await getTestimonialByIdAsync(params.id)) || getTestimonialById(params.id);
  if (!item) {
    return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: item });
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
    const existing = (await getTestimonialByIdAsync(params.id)) || getTestimonialById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    const updated = await saveTestimonialAsync({
      ...existing,
      ...body,
      id: existing.id,
      name: body.name || existing.name,
      quote: body.quote || existing.quote,
    });

    await addAuditLogAsync({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_TESTIMONIAL',
      entityType: 'TESTIMONIAL',
      entityId: updated.id,
      details: `Updated testimonial from "${updated.name}" (Status: ${updated.status})`,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch {}

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update testimonial' }, { status: 500 });
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

  const existing = (await getTestimonialByIdAsync(params.id)) || getTestimonialById(params.id);
  if (!existing) {
    return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
  }

  await deleteTestimonialAsync(existing.id);

  await addAuditLogAsync({
    userId: user.id,
    userName: user.name,
    action: 'DELETE_TESTIMONIAL',
    entityType: 'TESTIMONIAL',
    entityId: existing.id,
    details: `Deleted testimonial from "${existing.name}"`,
  });

  try {
    revalidatePath('/', 'layout');
    revalidatePath('/');
  } catch {}

  return NextResponse.json({ success: true, message: 'Testimonial deleted' });
}

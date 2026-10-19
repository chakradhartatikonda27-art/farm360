import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPageBySlug, getPageBySlugAsync, savePageAsync, deletePageAsync, addAuditLogAsync } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const page = (await getPageBySlugAsync(params.slug)) || getPageBySlug(params.slug);
  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: page });
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'CONTENT_EDITOR'])) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = await savePageAsync({
      ...body,
      slug: params.slug,
      title: body.title || params.slug,
    });

    await addAuditLogAsync({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_PAGE',
      entityType: 'PAGE',
      entityId: updated.id,
      details: `Updated content & sections for page: "${updated.title}"`,
    });

    // Invalidate Next.js cache so the live website immediately reflects the change
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      if (params.slug !== 'home') {
        revalidatePath(`/${params.slug}`);
      }
    } catch (e) {
      console.warn('revalidatePath warning:', e);
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN'])) {
    return NextResponse.json({ error: 'Forbidden: Super Admin only' }, { status: 403 });
  }

  const deleted = await deletePageAsync(params.slug);
  if (!deleted) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  await addAuditLogAsync({
    userId: user.id,
    userName: user.name,
    action: 'DELETE_PAGE',
    entityType: 'PAGE',
    entityId: params.slug,
    details: `Deleted page: /${params.slug}`,
  });

  try {
    revalidatePath('/', 'layout');
    revalidatePath('/');
  } catch {}

  return NextResponse.json({ success: true, message: 'Page deleted' });
}

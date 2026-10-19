import { NextResponse } from 'next/server';
import { getPageBySlug, savePage, deletePage, addAuditLog } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const page = getPageBySlug(params.slug);
  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }
  return NextResponse.json(page);
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
    const updated = savePage({
      ...body,
      slug: params.slug,
      title: body.title || params.slug,
    });

    addAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_PAGE',
      entityType: 'PAGE',
      entityId: updated.id,
      details: `Updated content & sections for page: "${updated.title}"`,
    });

    return NextResponse.json(updated);
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

  const deleted = deletePage(params.slug);
  if (!deleted) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  addAuditLog({
    userId: user.id,
    userName: user.name,
    action: 'DELETE_PAGE',
    entityType: 'PAGE',
    entityId: params.slug,
    details: `Deleted page: /${params.slug}`,
  });

  return NextResponse.json({ success: true, message: 'Page deleted' });
}

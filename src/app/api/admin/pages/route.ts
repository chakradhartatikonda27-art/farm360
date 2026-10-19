import { NextResponse } from 'next/server';
import { getPages, savePage, addAuditLog } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export async function GET() {
  const pages = getPages();
  return NextResponse.json(pages);
}

export async function POST(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'CONTENT_EDITOR'])) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const saved = savePage(body);
    addAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'CREATE_PAGE',
      entityType: 'PAGE',
      entityId: saved.id,
      details: `Created page: "${saved.title}" (slug: /${saved.slug})`,
    });

    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create page' }, { status: 500 });
  }
}

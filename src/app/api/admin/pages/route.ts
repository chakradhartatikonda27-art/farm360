import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPages, getPagesAsync, savePageAsync, addAuditLogAsync } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const pages = (await getPagesAsync()) || getPages();
  return NextResponse.json({ success: true, data: pages });
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

    const saved = await savePageAsync(body);
    await addAuditLogAsync({
      userId: user.id,
      userName: user.name,
      action: 'CREATE_PAGE',
      entityType: 'PAGE',
      entityId: saved.id,
      details: `Created page: "${saved.title}" (slug: /${saved.slug})`,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch {}

    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create page' }, { status: 500 });
  }
}

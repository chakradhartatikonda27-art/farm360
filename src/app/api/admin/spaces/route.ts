import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSpaces, getSpacesAsync, saveSpaceAsync, addAuditLogAsync } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const spaces = (await getSpacesAsync({ status })) || getSpaces({ status });
  return NextResponse.json({ success: true, data: spaces });
}

export async function POST(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'CONTENT_EDITOR'])) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const saved = await saveSpaceAsync(body);
    await addAuditLogAsync({
      userId: user.id,
      userName: user.name,
      action: 'CREATE_SPACE',
      entityType: 'SPACE',
      entityId: saved.id,
      details: `Created space category: "${saved.title}"`,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch {}

    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create space' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getSpaces, saveSpace, addAuditLog } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const spaces = getSpaces({ status });
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

    const saved = saveSpace(body);
    addAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'CREATE_SPACE',
      entityType: 'SPACE',
      entityId: saved.id,
      details: `Created space category: "${saved.title}"`,
    });

    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create space' }, { status: 500 });
  }
}

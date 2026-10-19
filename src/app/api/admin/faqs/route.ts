import { NextResponse } from 'next/server';
import { getFaqs, saveFaq, addAuditLog } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageAssignment = searchParams.get('page') || undefined;
  const category = searchParams.get('category') || undefined;
  const list = getFaqs({ pageAssignment, category });
  return NextResponse.json({ success: true, data: list });
}

export async function POST(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'CONTENT_EDITOR'])) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.question || !body.answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const saved = saveFaq(body);
    addAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'CREATE_FAQ',
      entityType: 'FAQ',
      entityId: saved.id,
      details: `Created FAQ: "${saved.question}"`,
    });

    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create FAQ' }, { status: 500 });
  }
}

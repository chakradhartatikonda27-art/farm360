import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getFaqs, getFaqsAsync, saveFaqAsync, addAuditLogAsync } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageAssignment = searchParams.get('page') || undefined;
  const category = searchParams.get('category') || undefined;
  const list = (await getFaqsAsync({ pageAssignment, category })) || getFaqs({ pageAssignment, category });
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

    const saved = await saveFaqAsync(body);
    await addAuditLogAsync({
      userId: user.id,
      userName: user.name,
      action: 'CREATE_FAQ',
      entityType: 'FAQ',
      entityId: saved.id,
      details: `Created FAQ: "${saved.question}"`,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch {}

    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create FAQ' }, { status: 500 });
  }
}

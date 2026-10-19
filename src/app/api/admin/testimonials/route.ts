import { NextResponse } from 'next/server';
import { getTestimonials, saveTestimonial, addAuditLog } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const list = getTestimonials({ status });
  return NextResponse.json({ success: true, data: list });
}

export async function POST(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'CONTENT_EDITOR'])) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.quote) {
      return NextResponse.json({ error: 'Client name and quote are required' }, { status: 400 });
    }

    const saved = saveTestimonial(body);
    addAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'CREATE_TESTIMONIAL',
      entityType: 'TESTIMONIAL',
      entityId: saved.id,
      details: `Added testimonial from: "${saved.name}" (${saved.location})`,
    });

    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create testimonial' }, { status: 500 });
  }
}

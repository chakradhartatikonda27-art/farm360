import { NextResponse } from 'next/server';
import { getServices, saveService, addAuditLog } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || undefined;
  const status = searchParams.get('status') || undefined;

  const services = getServices({ category, status });
  return NextResponse.json({ success: true, data: services });
}

export async function POST(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'CONTENT_EDITOR'])) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Service name and slug are required' }, { status: 400 });
    }

    const saved = saveService(body);
    addAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'CREATE_SERVICE',
      entityType: 'SERVICE',
      entityId: saved.id,
      details: `Created service: "${saved.name}" (/services/${saved.slug})`,
    });

    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create service' }, { status: 500 });
  }
}

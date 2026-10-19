import { NextResponse } from 'next/server';
import { getEnquiryById, getEnquiryByIdAsync, saveEnquiryAsync, deleteEnquiryAsync, addAuditLogAsync } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const enquiry = (await getEnquiryByIdAsync(params.id)) || getEnquiryById(params.id);
  if (!enquiry) {
    return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: enquiry });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ENQUIRY_MANAGER', 'CONTENT_EDITOR'])) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const existing = (await getEnquiryByIdAsync(params.id)) || getEnquiryById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    const { status, priority, assignedTo, newNote } = body;

    const notes = [...(existing.internalNotes || [])];
    if (newNote && typeof newNote === 'string' && newNote.trim()) {
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      notes.unshift(`[${timestamp} by ${user.name}]: ${newNote.trim()}`);
    }

    const updated = await saveEnquiryAsync({
      ...existing,
      status: status || existing.status,
      priority: priority || existing.priority,
      assignedTo: assignedTo !== undefined ? assignedTo : existing.assignedTo,
      internalNotes: notes,
    });

    await addAuditLogAsync({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_ENQUIRY',
      entityType: 'ENQUIRY',
      entityId: updated.id,
      details: `Updated enquiry ${updated.referenceId} (${updated.name}): status=${updated.status}`,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update enquiry' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN'])) {
    return NextResponse.json({ error: 'Forbidden: Super Admin only' }, { status: 403 });
  }

  const existing = (await getEnquiryByIdAsync(params.id)) || getEnquiryById(params.id);
  if (!existing) {
    return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
  }

  await deleteEnquiryAsync(existing.id);

  await addAuditLogAsync({
    userId: user.id,
    userName: user.name,
    action: 'DELETE_ENQUIRY',
    entityType: 'ENQUIRY',
    entityId: existing.id,
    details: `Deleted enquiry ${existing.referenceId} (${existing.name})`,
  });

  return NextResponse.json({ success: true, message: 'Enquiry deleted' });
}

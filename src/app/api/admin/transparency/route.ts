import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { 
  getTransparencyData, 
  getTransparencyDataAsync,
  updateTransparencyWorkflowAsync, 
  updateTransparencyPrinciplesAsync, 
  saveTransparencyDocumentAsync, 
  deleteTransparencyDocumentAsync,
  addAuditLogAsync 
} from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = (await getTransparencyDataAsync()) || getTransparencyData();
  return NextResponse.json({ success: true, data: data, ...data });
}

export async function PUT(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'CONTENT_EDITOR'])) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, steps, principles, document, documentId } = body;

    if (action === 'update_steps' && Array.isArray(steps)) {
      const updated = await updateTransparencyWorkflowAsync(steps);
      await addAuditLogAsync({
        userId: user.id,
        userName: user.name,
        action: 'UPDATE_TRANSPARENCY_WORKFLOW',
        entityType: 'TRANSPARENCY',
        entityId: 'workflow_steps',
        details: 'Updated the 7-step customer approval workflow',
      });
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/');
        revalidatePath('/transparency');
      } catch {}
      return NextResponse.json({ success: true, steps: updated });
    }

    if (action === 'update_principles' && Array.isArray(principles)) {
      const updated = await updateTransparencyPrinciplesAsync(principles);
      await addAuditLogAsync({
        userId: user.id,
        userName: user.name,
        action: 'UPDATE_TRANSPARENCY_PRINCIPLES',
        entityType: 'TRANSPARENCY',
        entityId: 'five_principles',
        details: 'Updated the five core operating principles',
      });
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/');
        revalidatePath('/transparency');
      } catch {}
      return NextResponse.json({ success: true, principles: updated });
    }

    if (action === 'save_document' && document) {
      const savedDoc = await saveTransparencyDocumentAsync(document);
      await addAuditLogAsync({
        userId: user.id,
        userName: user.name,
        action: 'SAVE_TRANSPARENCY_DOCUMENT',
        entityType: 'TRANSPARENCY_DOC',
        entityId: savedDoc.id,
        details: `Saved transparency policy document: "${savedDoc.title}"`,
      });
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/');
        revalidatePath('/transparency');
      } catch {}
      return NextResponse.json({ success: true, document: savedDoc });
    }

    if (action === 'delete_document' && documentId) {
      await deleteTransparencyDocumentAsync(documentId);
      await addAuditLogAsync({
        userId: user.id,
        userName: user.name,
        action: 'DELETE_TRANSPARENCY_DOCUMENT',
        entityType: 'TRANSPARENCY_DOC',
        entityId: documentId,
        details: `Deleted transparency document: ${documentId}`,
      });
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/');
        revalidatePath('/transparency');
      } catch {}
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update transparency' }, { status: 500 });
  }
}

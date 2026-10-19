import { NextResponse } from 'next/server';
import { 
  getTransparencyData, 
  updateTransparencyWorkflow, 
  updateTransparencyPrinciples, 
  saveTransparencyDocument, 
  deleteTransparencyDocument,
  addAuditLog 
} from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export async function GET() {
  const data = getTransparencyData();
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
      const updated = updateTransparencyWorkflow(steps);
      addAuditLog({
        userId: user.id,
        userName: user.name,
        action: 'UPDATE_TRANSPARENCY_WORKFLOW',
        entityType: 'TRANSPARENCY',
        entityId: 'workflow_steps',
        details: 'Updated the 7-step customer approval workflow',
      });
      return NextResponse.json({ success: true, steps: updated });
    }

    if (action === 'update_principles' && Array.isArray(principles)) {
      const updated = updateTransparencyPrinciples(principles);
      addAuditLog({
        userId: user.id,
        userName: user.name,
        action: 'UPDATE_TRANSPARENCY_PRINCIPLES',
        entityType: 'TRANSPARENCY',
        entityId: 'five_principles',
        details: 'Updated the five core operating principles',
      });
      return NextResponse.json({ success: true, principles: updated });
    }

    if (action === 'save_document' && document) {
      const savedDoc = saveTransparencyDocument(document);
      addAuditLog({
        userId: user.id,
        userName: user.name,
        action: 'SAVE_TRANSPARENCY_DOCUMENT',
        entityType: 'TRANSPARENCY_DOC',
        entityId: savedDoc.id,
        details: `Saved transparency policy document: "${savedDoc.title}"`,
      });
      return NextResponse.json({ success: true, document: savedDoc });
    }

    if (action === 'delete_document' && documentId) {
      deleteTransparencyDocument(documentId);
      addAuditLog({
        userId: user.id,
        userName: user.name,
        action: 'DELETE_TRANSPARENCY_DOCUMENT',
        entityType: 'TRANSPARENCY_DOC',
        entityId: documentId,
        details: `Deleted transparency document: ${documentId}`,
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update transparency' }, { status: 500 });
  }
}

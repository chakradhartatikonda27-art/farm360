import { NextRequest, NextResponse } from 'next/server';
import { getProjectByIdAsync, saveProjectAsync, deleteProjectAsync } from '@/lib/cms/db';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const project = await getProjectByIdAsync(id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const existing = await getProjectByIdAsync(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const updates = await req.json();

    const updated = await saveProjectAsync({
      ...existing,
      ...updates,
      id: existing.id,
      referenceId: existing.referenceId,
      outstandingBalance:
        updates.totalContractValue !== undefined || updates.amountReceived !== undefined
          ? (updates.totalContractValue ?? existing.totalContractValue) -
            (updates.amountReceived ?? existing.amountReceived)
          : existing.outstandingBalance,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const success = await deleteProjectAsync(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Project not found or could not be deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}

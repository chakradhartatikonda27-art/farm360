import { NextRequest, NextResponse } from 'next/server';
import { getLeadByIdAsync, saveLeadAsync, deleteLeadAsync } from '@/lib/cms/db';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const lead = await getLeadByIdAsync(id);

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lead,
    });
  } catch (error: any) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const existing = await getLeadByIdAsync(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    const updates = await req.json();

    // Check if new activity is passed or notes were added
    const activities = existing.activities ? [...existing.activities] : [];

    if (updates.newNote) {
      activities.unshift({
        id: `act_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'note_added',
        title: 'Internal Note Added',
        description: updates.newNote,
      });
      delete updates.newNote;
    }

    // Merge stage updates carefully
    const updatedLead = {
      ...existing,
      ...updates,
      id: existing.id,
      referenceId: existing.referenceId,
      activities,
      stageProspecting: {
        ...(existing.stageProspecting || {}),
        ...(updates.stageProspecting || {}),
      },
      stageQualification: {
        ...(existing.stageQualification || {}),
        ...(updates.stageQualification || {}),
      },
      stageNeedAnalysis: {
        ...(existing.stageNeedAnalysis || {}),
        ...(updates.stageNeedAnalysis || {}),
      },
      stageValueProposition: {
        ...(existing.stageValueProposition || {}),
        ...(updates.stageValueProposition || {}),
      },
      stageDecisionMakers: {
        ...(existing.stageDecisionMakers || {}),
        ...(updates.stageDecisionMakers || {}),
      },
      stageNegotiation: {
        ...(existing.stageNegotiation || {}),
        ...(updates.stageNegotiation || {}),
      },
      stageClosedWon: {
        ...(existing.stageClosedWon || {}),
        ...(updates.stageClosedWon || {}),
      },
      stageClosedLost: {
        ...(existing.stageClosedLost || {}),
        ...(updates.stageClosedLost || {}),
      },
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveLeadAsync(updatedLead);

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully',
      data: saved,
    });
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const success = await deleteLeadAsync(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Lead not found or could not be deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lead removed successfully',
    });
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete lead' },
      { status: 500 }
    );
  }
}

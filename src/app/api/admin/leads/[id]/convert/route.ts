import { NextRequest, NextResponse } from 'next/server';
import { convertLeadToProjectAsync, getLeadByIdAsync } from '@/lib/cms/db';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));

    const lead = await getLeadByIdAsync(id);
    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    const result = await convertLeadToProjectAsync(id, {
      title: body.title,
      totalContractValue: body.totalContractValue !== undefined ? Number(body.totalContractValue) : undefined,
      amountReceived: body.amountReceived !== undefined ? Number(body.amountReceived) : undefined,
      projectManager: body.projectManager,
      startDate: body.startDate,
      targetCompletionDate: body.targetCompletionDate,
      notes: body.notes,
    });

    return NextResponse.json({
      success: true,
      message: `Lead successfully converted to Project ${result.project.referenceId}`,
      lead: result.lead,
      project: result.project,
    });
  } catch (error: any) {
    console.error('Error converting lead to project:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to convert lead to project' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { addLeadActivityAsync, getLeadByIdAsync } from '@/lib/cms/db';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Activity title is required' },
        { status: 400 }
      );
    }

    const lead = await getLeadByIdAsync(id);
    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    const activity = {
      id: `act_${Date.now()}`,
      timestamp: body.timestamp || new Date().toISOString(),
      userId: body.userId,
      userName: body.userName || 'Sales Executive',
      type: body.type || 'note_added',
      title: body.title,
      description: body.description || '',
      meta: body.meta,
    };

    const updated = await addLeadActivityAsync(id, activity);

    return NextResponse.json({
      success: true,
      message: 'Activity recorded',
      activity,
      lead: updated,
    });
  } catch (error: any) {
    console.error('Error recording activity:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to record activity' },
      { status: 500 }
    );
  }
}

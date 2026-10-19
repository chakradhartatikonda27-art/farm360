import { NextRequest, NextResponse } from 'next/server';
import { getCrmSettingsAsync, updateCrmSettingsAsync } from '@/lib/cms/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getCrmSettingsAsync();
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    console.error('Error fetching CRM settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch CRM settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await updateCrmSettingsAsync(body);

    return NextResponse.json({
      success: true,
      message: 'CRM settings updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating CRM settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update CRM settings' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getCrmStatsAsync } from '@/lib/cms/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getCrmStatsAsync();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Error fetching CRM stats:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch CRM stats' },
      { status: 500 }
    );
  }
}

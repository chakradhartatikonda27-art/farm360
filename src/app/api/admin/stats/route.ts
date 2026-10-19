import { NextResponse } from 'next/server';
import { getDashboardStats, getDashboardStatsAsync } from '@/lib/cms/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = (await getDashboardStatsAsync()) || getDashboardStats();
    return NextResponse.json({ success: true, data: stats, ...stats });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}

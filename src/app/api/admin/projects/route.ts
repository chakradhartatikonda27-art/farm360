import { NextRequest, NextResponse } from 'next/server';
import { getProjectsAsync, saveProjectAsync, generateProjectReferenceId } from '@/lib/cms/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    let projects = await getProjectsAsync({ status, search });

    return NextResponse.json({
      success: true,
      total: projects.length,
      data: projects,
    });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Project title is required' },
        { status: 400 }
      );
    }

    const saved = await saveProjectAsync(body);

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      data: saved,
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}

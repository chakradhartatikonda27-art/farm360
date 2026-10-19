import { NextResponse } from 'next/server';
import { getEnquiries, getEnquiriesAsync, saveEnquiryAsync, saveLeadAsync, generateLeadReferenceId } from '@/lib/cms/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;
  const format = searchParams.get('format') || 'json';

  const enquiries = (await getEnquiriesAsync({ status, search })) || getEnquiries({ status, search });

  // Handle CSV Export
  if (format === 'csv') {
    const headers = ['Reference ID', 'Name', 'Phone', 'Email', 'Location', 'Property Type', 'Status', 'Priority', 'Assigned To', 'Created At', 'Project Description'];
    const rows = enquiries.map((e) => [
      `"${e.referenceId}"`,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.phone.replace(/"/g, '""')}"`,
      `"${e.email.replace(/"/g, '""')}"`,
      `"${(e.location || '').replace(/"/g, '""')}"`,
      `"${(e.propertyType || e.serviceInterest || '').replace(/"/g, '""')}"`,
      `"${e.status}"`,
      `"${e.priority}"`,
      `"${e.assignedTo || 'Unassigned'}"`,
      `"${e.createdAt}"`,
      `"${(e.projectDescription || e.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="farmcare360_enquiries_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  }

  return NextResponse.json({ success: true, data: enquiries });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.phone) {
      return NextResponse.json({ error: 'Name and phone number are required' }, { status: 400 });
    }

    const saved = await saveEnquiryAsync(body);

    // Register into CRM leads as well
    try {
      const leadRef = generateLeadReferenceId();
      await saveLeadAsync({
        referenceId: leadRef,
        name: body.name,
        phone: body.phone,
        email: body.email || '',
        location: body.location || '',
        source: 'website',
        serviceCategory: body.serviceInterest || body.propertyType || 'Agricultural Care',
        subject: body.subject || 'Enquiry form submission',
        message: body.message || body.projectDescription || '',
        priority: body.priority || 'medium',
        currentStage: 'prospecting',
        status: 'open',
        stageProspecting: {
          enquiryReason: body.message || body.projectDescription || 'Submitted via enquiry form',
          customerExpectations: body.serviceInterest || body.propertyType || '',
          initialRequirements: `Location: ${body.location || 'N/A'}, Size: ${body.landSize || 'N/A'}`,
          prospectingNotes: 'Auto-registered from website enquiry submission.',
          qualificationStartDate: new Date().toISOString().split('T')[0],
        },
        activities: [
          {
            id: `act_${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'lead_created',
            title: 'Lead Captured',
            description: `Enquiry received from ${body.name} (${body.phone}). Reference: ${leadRef}`,
          },
        ],
      });
    } catch (leadErr) {
      console.error('Failed to sync enquiry to CRM lead:', leadErr);
    }

    return NextResponse.json({
      success: true,
      referenceId: saved.referenceId,
      message: 'Enquiry received successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit enquiry' }, { status: 500 });
  }
}

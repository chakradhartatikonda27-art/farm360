import { NextRequest, NextResponse } from 'next/server';
import { getLeadsAsync, saveLeadAsync, generateLeadReferenceId, getCrmSettingsAsync } from '@/lib/cms/db';
import { LeadItem, SalesStage, LeadStatus, LeadSource, LeadPriority } from '@/lib/cms/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const stage = searchParams.get('stage') as SalesStage | 'all' | undefined;
    const status = searchParams.get('status') as LeadStatus | 'all' | undefined;
    const source = searchParams.get('source') as LeadSource | 'all' | undefined;
    const executive = searchParams.get('executive') || undefined;
    const format = searchParams.get('format') || 'json';

    let leads = await getLeadsAsync({
      stage: stage && stage !== 'all' ? stage : undefined,
      status: status && status !== 'all' ? status : undefined,
      source: source && source !== 'all' ? source : undefined,
      search,
    });

    if (executive && executive !== 'all') {
      leads = leads.filter(
        (l) => l.assignedExecutive?.toLowerCase() === executive.toLowerCase()
      );
    }

    // CSV Export
    if (format === 'csv') {
      const headers = [
        'Lead ID',
        'Customer Name',
        'Phone',
        'Email',
        'Location',
        'Service Category',
        'Stage',
        'Status',
        'Source',
        'Assigned Executive',
        'Estimated Deal Value',
        'Won Revenue',
        'Priority',
        'Created At',
        'Next Follow Up',
      ];

      const rows = leads.map((l) => [
        `"${l.referenceId}"`,
        `"${(l.name || '').replace(/"/g, '""')}"`,
        `"${(l.phone || '').replace(/"/g, '""')}"`,
        `"${(l.email || '').replace(/"/g, '""')}"`,
        `"${(l.location || '').replace(/"/g, '""')}"`,
        `"${(l.serviceCategory || '').replace(/"/g, '""')}"`,
        `"${l.currentStage}"`,
        `"${l.status}"`,
        `"${l.source}"`,
        `"${(l.assignedExecutive || 'Unassigned').replace(/"/g, '""')}"`,
        `"${l.estimatedDealValue || 0}"`,
        `"${l.finalWonRevenue || 0}"`,
        `"${l.priority}"`,
        `"${l.createdAt}"`,
        `"${l.nextFollowUpDate || ''}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return new Response(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="farmcare360_leads_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      total: leads.length,
      data: leads,
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Customer name and phone number are required' },
        { status: 400 }
      );
    }

    // Check duplicate detection
    const existingLeads = await getLeadsAsync();
    const cleanPhone = body.phone.replace(/[^\d]/g, '');
    const cleanEmail = (body.email || '').trim().toLowerCase();

    const isDuplicate = existingLeads.some((l) => {
      const matchPhone = cleanPhone && l.phone.replace(/[^\d]/g, '') === cleanPhone;
      const matchEmail = cleanEmail && l.email?.trim().toLowerCase() === cleanEmail;
      return matchPhone || matchEmail;
    });

    if (isDuplicate && !body.allowDuplicate) {
      const matched = existingLeads.find((l) => {
        const matchPhone = cleanPhone && l.phone.replace(/[^\d]/g, '') === cleanPhone;
        const matchEmail = cleanEmail && l.email?.trim().toLowerCase() === cleanEmail;
        return matchPhone || matchEmail;
      });

      return NextResponse.json(
        {
          success: false,
          isDuplicate: true,
          matchedLeadId: matched?.id,
          matchedReferenceId: matched?.referenceId,
          message: `A lead with this phone or email already exists (${matched?.referenceId} - ${matched?.name}). Set allowDuplicate=true to register as new anyway.`,
        },
        { status: 409 }
      );
    }

    const settings = await getCrmSettingsAsync();
    const referenceId = generateLeadReferenceId();

    const newLead: LeadItem = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      referenceId,
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: (body.email || '').trim(),
      companyOrLandownerName: body.companyOrLandownerName?.trim(),
      location: body.location?.trim() || 'India',
      source: body.source || 'manual',
      serviceCategory: body.serviceCategory || 'General Agricultural Enquiry',
      subject: body.subject || 'New Customer Enquiry',
      message: body.message || '',
      assignedExecutive: body.assignedExecutive || settings.autoAssignExecutive || 'Suresh Varma',
      priority: body.priority || 'medium',
      currentStage: 'prospecting',
      status: 'open',
      estimatedDealValue: body.estimatedDealValue ? Number(body.estimatedDealValue) : undefined,
      nextFollowUpDate: body.nextFollowUpDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stageProspecting: {
        enquiryReason: body.message || body.subject || 'Direct registration',
        customerExpectations: body.customerExpectations || '',
        initialRequirements: body.initialRequirements || '',
        prospectingNotes: body.prospectingNotes || 'Registered into CRM.',
        initialBudgetEstimate: body.estimatedDealValue ? Number(body.estimatedDealValue) : undefined,
        leadPriority: body.priority || 'medium',
        assignedSalesExecutive: body.assignedExecutive || settings.autoAssignExecutive || 'Suresh Varma',
        nextFollowUpDate: body.nextFollowUpDate,
        qualificationStartDate: new Date().toISOString().split('T')[0],
      },
      activities: [
        {
          id: `act_${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'lead_created',
          title: 'Lead Registered',
          description: `Lead created manually via CRM Desk with Reference ID ${referenceId}`,
        },
      ],
      tags: body.tags || [],
    };

    const saved = await saveLeadAsync(newLead);

    return NextResponse.json({
      success: true,
      message: 'Lead registered successfully',
      lead: saved,
    });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create lead' },
      { status: 500 }
    );
  }
}

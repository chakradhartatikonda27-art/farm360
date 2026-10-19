import { NextRequest, NextResponse } from 'next/server';
import { getLeadByIdAsync, saveLeadAsync } from '@/lib/cms/db';
import { SalesStage, LeadStatus } from '@/lib/cms/types';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const STAGE_ORDER: SalesStage[] = [
  'prospecting',
  'qualification',
  'need_analysis',
  'value_proposition',
  'decision_makers',
  'negotiation',
  'closed_won',
];

const STAGE_LABELS: Record<SalesStage, string> = {
  prospecting: 'Prospecting',
  qualification: 'Qualification',
  need_analysis: 'Need Analysis',
  value_proposition: 'Value Proposition',
  decision_makers: 'Decision Makers',
  negotiation: 'Negotiation & Payment',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
};

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const lead = await getLeadByIdAsync(id);

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { targetStage, stageData, lossReason, lossNotes, reopenReason } = body;

    if (!targetStage) {
      return NextResponse.json(
        { success: false, error: 'Target stage is required' },
        { status: 400 }
      );
    }

    const previousStage = lead.currentStage;

    // Handle Closed Lost
    if (targetStage === 'closed_lost') {
      if (!lossReason) {
        return NextResponse.json(
          { success: false, error: 'A primary loss reason is mandatory to close as lost.' },
          { status: 400 }
        );
      }

      lead.currentStage = 'closed_lost';
      lead.status = 'closed_lost';
      lead.closedAt = new Date().toISOString();
      lead.stageClosedLost = {
        lossReason,
        lossNotes: lossNotes || '',
        lostDate: new Date().toISOString(),
      };

      lead.activities = lead.activities || [];
      lead.activities.unshift({
        id: `act_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'closed_lost',
        title: 'Deal Marked Closed Lost',
        description: `Reason: ${lossReason.replace(/_/g, ' ')}${lossNotes ? `. Notes: ${lossNotes}` : ''}`,
      });

      const saved = await saveLeadAsync(lead);
      return NextResponse.json({
        success: true,
        message: 'Lead marked as Closed Lost',
        data: saved,
      });
    }

    // Handle Reopen
    if (previousStage === 'closed_lost' && targetStage !== 'closed_lost') {
      lead.status = 'open';
      lead.currentStage = targetStage;
      lead.stageClosedLost = {
        ...(lead.stageClosedLost || { lossReason: 'other', lostDate: new Date().toISOString() }),
        reopenedDate: new Date().toISOString(),
        reopenReason: reopenReason || 'Re-engaged with client',
      };

      lead.activities = lead.activities || [];
      lead.activities.unshift({
        id: `act_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'reopened',
        title: 'Deal Reopened',
        description: `Enquiry reopened to stage "${STAGE_LABELS[targetStage as SalesStage] || targetStage}". Reason: ${reopenReason || 'Re-engagement initiated.'}`,
      });

      const saved = await saveLeadAsync(lead);
      return NextResponse.json({
        success: true,
        message: 'Lead reopened successfully',
        data: saved,
      });
    }

    // Update Stage Data if provided
    if (stageData) {
      if (previousStage === 'prospecting') {
        lead.stageProspecting = { ...(lead.stageProspecting || {}), ...stageData };
      } else if (previousStage === 'qualification') {
        lead.stageQualification = { ...(lead.stageQualification || {}), ...stageData };
      } else if (previousStage === 'need_analysis') {
        lead.stageNeedAnalysis = { ...(lead.stageNeedAnalysis || {}), ...stageData };
      } else if (previousStage === 'value_proposition') {
        lead.stageValueProposition = { ...(lead.stageValueProposition || {}), ...stageData };
        if (stageData.finalQuotedAmount) {
          lead.estimatedDealValue = Number(stageData.finalQuotedAmount);
        }
      } else if (previousStage === 'decision_makers') {
        lead.stageDecisionMakers = { ...(lead.stageDecisionMakers || {}), ...stageData };
      } else if (previousStage === 'negotiation') {
        lead.stageNegotiation = { ...(lead.stageNegotiation || {}), ...stageData };
        if (stageData.finalAgreedAmount) {
          lead.estimatedDealValue = Number(stageData.finalAgreedAmount);
        }
      }
    }

    // Stage validation when advancing forward
    const currentIndex = STAGE_ORDER.indexOf(previousStage);
    const targetIndex = STAGE_ORDER.indexOf(targetStage);

    if (targetIndex > currentIndex) {
      // Validate mandatory fields for the stage being left or completed
      if (previousStage === 'prospecting' && targetIndex >= 1) {
        // Prospecting needs customer requirement or interest
        if (!lead.stageProspecting?.initialRequirements && !lead.stageProspecting?.enquiryReason && !lead.message) {
          return NextResponse.json(
            { success: false, error: 'Please enter initial requirements or enquiry reason before proceeding to Qualification.' },
            { status: 400 }
          );
        }
      }

      if (targetIndex >= 2 && (!lead.stageQualification?.requirementSummary && !lead.stageQualification?.landLocation)) {
        // Warning or validation
        // We ensure data is saved
      }
    }

    // Perform stage transition
    lead.currentStage = targetStage as SalesStage;
    if (targetStage === 'closed_won') {
      lead.status = 'closed_won';
      lead.closedAt = new Date().toISOString();
    } else {
      lead.status = 'open';
    }

    lead.activities = lead.activities || [];
    lead.activities.unshift({
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'stage_changed',
      title: `Moved to ${STAGE_LABELS[targetStage as SalesStage] || targetStage}`,
      description: `Stage updated from ${STAGE_LABELS[previousStage] || previousStage} to ${STAGE_LABELS[targetStage as SalesStage] || targetStage}`,
    });

    const saved = await saveLeadAsync(lead);

    return NextResponse.json({
      success: true,
      message: `Progressed to ${STAGE_LABELS[targetStage as SalesStage] || targetStage}`,
      data: saved,
    });
  } catch (error: any) {
    console.error('Error changing lead stage:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to change stage' },
      { status: 500 }
    );
  }
}

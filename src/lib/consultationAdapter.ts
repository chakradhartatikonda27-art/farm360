/**
 * FarmCare 360° — Consultation Submission Adapter
 * Handles server-side validation and dispatch to CRM / Webhooks / Local Storage.
 */

import { saveEnquiry, saveLeadAsync, generateLeadReferenceId } from '@/lib/cms/db';

export interface ConsultationSubmission {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  propertyType: 'Farm' | 'Agricultural Plot' | 'Vacant Land' | 'Terrace / Kitchen Garden' | 'Farmhouse Grounds' | 'Other';
  serviceCategory: string;
  approxSize?: string;
  preferredEngagement: 'One-time Service' | 'Ongoing Managed Care' | 'Landowner Enquiry' | 'General Consultation';
  projectDescription: string;
  consent: boolean;
  honeypot?: string; // Hidden spam prevention trap
}

export interface ConsultationResult {
  success: boolean;
  referenceId?: string;
  errors?: Record<string, string>;
  message: string;
  timestamp: string;
}

export async function processConsultation(
  data: ConsultationSubmission
): Promise<ConsultationResult> {
  const errors: Record<string, string> = {};

  // 1. Spam protection honeypot
  if (data.honeypot && data.honeypot.trim().length > 0) {
    return {
      success: false,
      message: 'Automated submission detected.',
      timestamp: new Date().toISOString(),
    };
  }

  // 2. Strict validation
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }

  const phoneRegex = /^[+]?[\d\s\-\(\)]{8,20}$/;
  if (!data.phone || !phoneRegex.test(data.phone.trim())) {
    errors.phone = 'Please provide a valid contact telephone or mobile number.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!data.location || data.location.trim().length < 3) {
    errors.location = 'Please share your property location or nearest village/town.';
  }

  if (!data.propertyType) {
    errors.propertyType = 'Please select your property type.';
  }

  if (!data.preferredEngagement) {
    errors.preferredEngagement = 'Please select your preferred engagement mode.';
  }

  if (!data.projectDescription || data.projectDescription.trim().length < 10) {
    errors.projectDescription = 'Please provide a brief description of what your space needs (min 10 characters).';
  }

  if (!data.consent) {
    errors.consent = 'Your consent to be contacted regarding this enquiry is required.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      message: 'Please resolve the highlighted validation errors.',
      timestamp: new Date().toISOString(),
    };
  }

  // Generate official consultation ticket reference
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const referenceId = `FC-${new Date().getFullYear()}-${randomSuffix}`;

  // Check if live CRM Webhook is configured in environment
  const crmWebhook = process.env.FARMCARE_CRM_WEBHOOK_URL;

  if (crmWebhook) {
    try {
      const response = await fetch(crmWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, referenceId, submittedAt: new Date().toISOString() }),
      });

      if (!response.ok) {
        console.warn('CRM Webhook returned non-200, lead stored locally:', response.status);
      }
    } catch (err) {
      console.error('Failed to dispatch CRM webhook, falling back to local audit:', err);
    }
  }

  // Save directly to CMS CRM database
  try {
    saveEnquiry({
      id: referenceId,
      name: data.fullName,
      phone: data.phone,
      email: data.email,
      location: data.location,
      serviceInterest: `${data.preferredEngagement} — ${data.serviceCategory || data.propertyType}`,
      landSize: data.approxSize || data.propertyType,
      message: data.projectDescription,
      status: 'new',
      priority: 'medium',
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'System',
          text: `Consultation enquiry submitted via website form. Ref: ${referenceId}`,
          createdAt: new Date().toISOString(),
        },
      ],
    });

    // Also register lead into full Sales CRM
    const leadRef = generateLeadReferenceId();
    await saveLeadAsync({
      referenceId: leadRef,
      name: data.fullName,
      phone: data.phone,
      email: data.email,
      location: data.location,
      source: 'website',
      serviceCategory: `${data.preferredEngagement} — ${data.serviceCategory || data.propertyType}`,
      subject: `Website Consultation: ${data.propertyType}`,
      message: data.projectDescription,
      priority: 'medium',
      currentStage: 'prospecting',
      status: 'open',
      stageProspecting: {
        enquiryReason: data.projectDescription,
        customerExpectations: `Interested in ${data.serviceCategory || data.propertyType} (${data.preferredEngagement})`,
        initialRequirements: `Property: ${data.propertyType}, Approx Size: ${data.approxSize || 'Not specified'}, Location: ${data.location}`,
        prospectingNotes: 'Submitted through website consultation booking form.',
        qualificationStartDate: new Date().toISOString().split('T')[0],
      },
      activities: [
        {
          id: `act_${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'lead_created',
          title: 'Lead Captured via Website',
          description: `Visitor ${data.fullName} submitted consultation request for ${data.propertyType} in ${data.location}. Reference: ${leadRef}`,
        },
      ],
    });
  } catch (err) {
    console.error('Failed to save enquiry/lead to CMS store:', err);
  }

  // Log lead to server console for operational traceability
  console.log(`[FarmCare 360° Lead Received] Ref: ${referenceId} | Name: ${data.fullName} | Type: ${data.propertyType} | Loc: ${data.location}`);

  return {
    success: true,
    referenceId,
    message: 'Your consultation request has been received by our agricultural planning team.',
    timestamp: new Date().toISOString(),
  };
}

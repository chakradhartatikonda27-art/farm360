export type AdminRole = 
  | 'SUPER_ADMIN' 
  | 'CONTENT_EDITOR' 
  | 'MEDIA_MANAGER' 
  | 'ENQUIRY_MANAGER';

export type UserRole = AdminRole;

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  passwordHash?: string;
  isActive: boolean;
  active?: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export type ContentStatus = 'draft' | 'published' | 'archived';

export interface MediaAsset {
  id: string;
  name?: string;
  filename: string;
  originalName?: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  url: string;
  alt: string;
  caption?: string;
  folder?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface SectionBlock {
  id: string;
  name?: string;
  type: string;
  title: string;
  subtitle?: string;
  content?: any;
  mediaUrl?: string;
  secondaryMediaUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  order?: number;
  displayOrder?: number;
  isVisible?: boolean;
  enabled?: boolean;
  config?: Record<string, any>;
}

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  bannerImage?: string;
  ogImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  status?: ContentStatus;
  isPublished?: boolean;
  publishedAt?: string;
  updatedAt: string;
  sections: SectionBlock[];
}

export interface ServiceItem {
  id: string;
  slug: string;
  title?: string;
  name?: string;
  category: string;
  icon?: string;
  shortDescription: string;
  fullDescription: string;
  features?: string[];
  benefits?: string[];
  heroImage?: string;
  images?: string[];
  gallery?: string[];
  pricingNote?: string;
  ctaText?: string;
  ctaLink?: string;
  order?: number;
  displayOrder?: number;
  isFeatured: boolean;
  status?: ContentStatus;
  isActive?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SpaceItem {
  id: string;
  slug: string;
  number?: string;
  title: string;
  subtitle?: string;
  summary?: string;
  category?: string;
  description?: string;
  idealFor?: string;
  keyConsiderations?: string[];
  keyChallenges?: string[];
  solutions?: string[];
  farmcareSolutions?: string[];
  assessmentFactors?: string[];
  image: string;
  gallery?: string[];
  order?: number;
  displayOrder?: number;
  status?: ContentStatus;
  isActive?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessSubModel {
  id: string;
  code?: string;
  title: string;
  subtitle?: string;
  description: string;
  revenueModel?: string;
  targetAudience?: string;
}

export interface BusinessModelItem {
  id: string;
  code?: string;
  slug?: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  problem?: string;
  problemSolved?: string;
  solution: string;
  revenueModel?: string;
  promise?: string;
  servicesIncluded?: string[];
  servicesOffered?: string[];
  image?: string;
  href?: string;
  order?: number;
  displayOrder?: number;
  status?: ContentStatus;
  isActive?: boolean;
  subModels?: BusinessSubModel[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TransparencyStep {
  id?: string;
  step?: string | number;
  stepNumber?: number;
  title: string;
  badge?: string;
  description: string;
  deliverable?: string;
  deliverables?: string[];
  actor?: string;
}

export interface TransparencyPrinciple {
  id?: string;
  number?: string | number;
  title: string;
  name?: string;
  description: string;
  practicalApplication?: string;
}

export interface TransparencyDocument {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  fileSize?: string;
  version?: string;
  effectiveDate?: string;
  lastUpdated?: string;
  isPublic?: boolean;
  displayOrder?: number;
}

export interface TestimonialItem {
  id: string;
  name?: string;
  clientName?: string;
  initial?: string;
  location: string;
  role?: string;
  landType?: string;
  serviceRendered?: string;
  rating: number;
  quote: string;
  fullStory?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  status?: ContentStatus;
  isApproved?: boolean;
  isFeatured: boolean;
  order?: number;
  displayOrder?: number;
  createdAt?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  pageAssignment?: string;
  assignedPage?: string;
  order?: number;
  displayOrder?: number;
  status?: ContentStatus;
}

export type EnquiryStatus = 'new' | 'in_progress' | 'contacted' | 'resolved' | 'archived' | 'spam';
export type EnquiryPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface EnquiryNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface ContactEnquiry {
  id: string;
  referenceId?: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  propertyType?: string;
  serviceInterest?: string;
  landSize?: string;
  message?: string;
  projectDescription?: string;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  internalNotes?: string[];
  notes?: EnquiryNote[];
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NavigationItem {
  id?: string;
  label: string;
  href: string;
  description?: string;
  iconName?: string;
  isDropdown?: boolean;
  isExternal?: boolean;
  children?: Array<{
    label: string;
    href: string;
    description?: string;
    iconName?: string;
  }>;
  order?: number;
  isVisible?: boolean;
}

export interface GlobalSettings {
  brandName?: string;
  siteName?: string;
  tagline?: string;
  siteTagline?: string;
  coreMessage?: string;
  logoUrl?: string;
  lightLogoUrl?: string;
  faviconUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactWhatsapp?: string;
  officeAddress?: string;
  operatingHours?: string;
  contact?: {
    phoneFormatted?: string;
    phoneRaw?: string;
    phoneDisplay?: string;
    email?: string;
    whatsappFormatted?: string;
    officeAddress?: string;
    serviceRegions?: string[];
    businessHours?: string;
    operationalHours?: string;
    mapEmbedUrl?: string;
  };
  socialLinks?: any;
  announcementTicker?: string[];
  seoDefaultDescription?: string;
  footer?: {
    description?: string;
    copyrightText?: string;
    legalLinks?: Array<{ label: string; href: string }>;
  };
  seoDefaults?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  notificationEmails?: string[];
  analyticsId?: string;
}

export interface AuditLogEntry {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  timestamp: string;
}

export interface ContentRevision {
  id: string;
  entityType: string;
  entityId: string;
  versionNumber: number;
  snapshot: any;
  createdBy: string;
  createdAt: string;
  note?: string;
}

export interface DashboardStats {
  totalPages: number;
  publishedPages: number;
  totalServices: number;
  activeServices: number;
  spacesCount: number;
  mediaAssetsCount: number;
  totalTestimonials: number;
  approvedTestimonials: number;
  totalEnquiries: number;
  newEnquiries: number;
  recentEnquiries?: ContactEnquiry[];
  recentActivity?: AuditLogEntry[];
}

/* ==================== LEAD GENERATION & CRM PIPELINE TYPES ==================== */

export type SalesStage =
  | 'prospecting'
  | 'qualification'
  | 'need_analysis'
  | 'value_proposition'
  | 'decision_makers'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export type LeadStatus = 'open' | 'closed_won' | 'closed_lost';
export type LeadSource = 'web' | 'website' | 'admin' | 'api' | 'phone' | 'referral' | 'social' | 'social_media' | 'campaign' | 'manual';
export type LeadPriority = 'low' | 'medium' | 'high' | 'critical';

export interface StageProspectingData {
  initialReason?: string;
  enquiryReason?: string;
  interestAndExpectations?: string;
  customerExpectations?: string;
  initialRequirements?: string;
  prospectingNotes?: string;
  initialBudgetEstimate?: number | string;
  priority?: LeadPriority;
  leadPriority?: LeadPriority;
  assignedExecutive?: string;
  assignedSalesExecutive?: string;
  nextFollowUpDate?: string;
  qualificationStartDate?: string;
}

export interface StageQualificationData {
  qualificationStatus?: 'qualified' | 'needs_more_info' | 'disqualified' | 'pending';
  requirementSummary?: string;
  customerNeed?: string;
  howWeCanHelp?: string;
  projectScale?: 'small' | 'medium' | 'large' | string;
  landArea?: string;
  constraints?: string;
  businessCategory?: string;
  estimatedBudget?: number | string;
  expectedStartDate?: string;
  customerReadiness?: 'immediate' | '1_to_3_months' | '3_to_6_months' | 'exploring';
  qualificationNotes?: string;
  
  // Land details
  totalAreaAcres?: number | string;
  areaUnit?: string;
  ownershipStatus?: 'owned' | 'leased' | 'joint_venture' | 'inherited' | 'other';
  landLocation?: string;
  landUse?: string;
  siteAccessibility?: string;
  landConstraints?: string[];

  // Operation scale
  operationScale?: 'small' | 'medium' | 'large';

  // Agriculture details
  cropType?: string;
  primaryCrop?: string;
  secondaryCrops?: string[];
  croppingPattern?: string;
  waterAvailability?: 'available' | 'limited' | 'seasonal' | 'unavailable' | 'unknown';
  waterSource?: string[];
  irrigationAvailability?: string[];
  infrastructureConstraints?: string[];
  labourAvailability?: string;
  budgetConstraints?: string;
  otherConstraints?: string;

  // Outcome
  disqualificationReason?: string;
  followUpTasks?: string[];
}

export interface StageNeedAnalysisData {
  primaryNeed?: string;
  secondaryNeeds?: string[];
  requiredServices?: string[];
  expectedOutcome?: string;
  currentOperatingProcess?: string;
  customerExpectations?: string;

  // Challenges Identified & Specific Inputs (from screenshot)
  challengesIdentified?: string[];
  pestChallengesText?: string;
  soilChallengesText?: string;
  irrigationChallengesText?: string;
  yieldChallengesText?: string;
  clientGoals?: string;
  currentPractices?: string;
  otherChallengesText?: string;

  // Challenges
  pestChallenges?: boolean;
  pestTypes?: string[];
  pestSeverity?: 'mild' | 'moderate' | 'severe';
  soilType?: string;
  soilCondition?: string;
  soilImprovementRequirements?: string[];
  soilTestResultsSummary?: string;
  soilTestAttachments?: string[];
  irrigationSystemType?: string;
  irrigationEfficiency?: string;
  waterAvailabilityAndQuality?: string;
  drainageProblems?: string;
  cropHealthConcerns?: string;
  labourAndInfrastructureChallenges?: string;
  budgetAndImplementationConstraints?: string;
  otherChallenges?: string;

  // Assessment Records
  siteInspectionRequired?: boolean;
  siteVisitDate?: string;
  assessmentOwner?: string;
  photosAndDocuments?: string[];
  analysisNotes?: string;
  recommendedNextAction?: string;
}

export interface ProposalRevision {
  id: string;
  version: string;
  title: string;
  sentDate: string;
  documentUrl?: string;
  estimatedProjectValue: number;
  quotationAmount: number;
  discountAmount?: number;
  taxAmount?: number;
  finalAmount: number;
  notes?: string;
}

export interface StageValuePropositionData {
  valuePropositionText?: string;
  expectedBenefitsText?: string;
  roiStatement?: string;
  proposedSolution?: string;
  recommendedServices?: string[];
  scopeOfWork?: string;
  deliverables?: string[];
  expectedBenefits?: string[];
  implementationApproach?: string;
  estimatedProjectValue?: number;
  quotationAmount?: number;
  applicableTaxes?: number;
  applicableDiscounts?: number;
  finalQuotedAmount?: number;
  proposalDocumentUrl?: string;
  proposalVersion?: string;
  proposalSentDate?: string;
  customerFeedback?: string;
  expectedOutcomeROI?: string;
  proposedTimeline?: string;
  nextFollowUpDate?: string;
  notes?: string;
  proposals?: ProposalRevision[];
}

export interface DecisionMaker {
  id: string;
  fullName: string;
  designation?: string;
  phone?: string;
  email?: string;
  organization?: string;
  roleInDecision: 'primary_decision_maker' | 'technical_evaluator' | 'financial_approver' | 'influencer' | 'family_member' | 'other';
  decisionAuthority: 'full' | 'shared' | 'advisory' | 'none';
  budgetApprovalAuthority?: boolean;
  preferredCommunicationMethod?: 'phone' | 'email' | 'whatsapp' | 'in_person';
  approvalStatus: 'pending' | 'approved' | 'objected' | 'abstained';
  expectedDecisionDate?: string;
  notes?: string;
}

export interface StageDecisionMakersData {
  decisionNotes?: string;
  approvedScope?: string;
  feasibilityOutcome?: 'Feasible' | 'Not Feasible' | 'Conditional' | string;
  verifiedServices?: string;
  quoteApproved?: boolean;
  revisionNotes?: string;
  decisionMakers?: DecisionMaker[];
  decisionMakingProcess?: string;
  otherStakeholders?: string;
  outstandingApprovals?: string[];
  customerObjections?: string[];
  risksAndBlockers?: string[];
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  type: 'advance' | 'milestone' | 'final' | 'refund';
  paymentMethod: 'bank_transfer' | 'cheque' | 'upi' | 'cash' | 'other';
  referenceNumber: string;
  receiptUrl?: string;
  receivedBy: string;
  notes?: string;
}

export interface StageNegotiationPaymentData {
  originalQuotationAmount?: number;
  negotiatedAmount?: number;
  discountAmount?: number;
  applicableTaxes?: number;
  finalAgreedAmount?: number;
  scopeChanges?: string;
  paymentTerms?: string;
  contractStatus?: 'draft' | 'under_review' | 'signed' | 'disputed';
  agreementDocumentUrl?: string;
  negotiationHistory?: string[];
  customerObjections?: string[];
  expectedClosingDate?: string;
  nextFollowUpDate?: string;

  // Payment tracking
  paymentStatus: 'pending' | 'partially_paid' | 'paid' | 'overdue' | 'refunded';
  advanceAmountRequired?: number;
  totalReceived?: number;
  outstandingBalance?: number;
  paymentDueDate?: string;
  paymentRecords?: PaymentRecord[];
}

export interface StageClosedWonData {
  wonDate: string;
  projectId?: string;
  projectCreated: boolean;
  transferredDataSummary?: string;
  assignedProjectManager?: string;
  projectStartDate?: string;
  projectTargetCompletionDate?: string;
  notes?: string;
}

export interface StageClosedLostData {
  lossReason:
    | 'budget_limitations'
    | 'chose_competitor'
    | 'project_postponed'
    | 'requirements_not_suitable'
    | 'no_response'
    | 'timing_not_suitable'
    | 'commercial_disagreement'
    | 'infeasible'
    | 'other';
  lossNotes?: string;
  lostDate: string;
  futureReEngagementDate?: string;
  reopenedDate?: string;
  reopenReason?: string;
}

export interface LeadActivity {
  id: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  type:
    | 'lead_created'
    | 'stage_changed'
    | 'details_updated'
    | 'note_added'
    | 'phone_call'
    | 'email_sent'
    | 'whatsapp_sent'
    | 'meeting_held'
    | 'site_visit'
    | 'proposal_sent'
    | 'payment_recorded'
    | 'converted_to_project'
    | 'closed_lost'
    | 'reopened';
  title: string;
  description?: string;
  meta?: any;
}

export interface LeadItem {
  id: string;
  referenceId: string; // e.g. "F360-261019-5A44D9"
  name: string;
  phone: string;
  email: string;
  companyOrLandownerName?: string;
  location: string;
  source: LeadSource;
  serviceCategory?: string;
  subject?: string;
  message?: string;
  assignedExecutive?: string;
  priority: LeadPriority;
  currentStage: SalesStage;
  status: LeadStatus;
  estimatedDealValue?: number;
  finalWonRevenue?: number;
  nextFollowUpDate?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;

  // Stage-specific structured data
  stageProspecting?: StageProspectingData;
  stageQualification?: StageQualificationData;
  stageNeedAnalysis?: StageNeedAnalysisData;
  stageValueProposition?: StageValuePropositionData;
  stageDecisionMakers?: StageDecisionMakersData;
  stageNegotiation?: StageNegotiationPaymentData;
  stageClosedWon?: StageClosedWonData;
  stageClosedLost?: StageClosedLostData;

  // Timeline & Attachments
  activities: LeadActivity[];
  attachments?: Array<{ id: string; name: string; url: string; uploadedAt: string; size?: string }>;
  tags?: string[];
  projectId?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  deliverables?: string[];
}

export interface ProjectItem {
  id: string;
  referenceId: string; // e.g. "PRJ-261019-8921"
  leadId: string;
  leadReferenceId: string;
  title: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  location: string;
  serviceCategory: string;
  landAreaAcres?: number | string;
  cropType?: string;
  scopeOfWork?: string;
  totalContractValue: number;
  amountReceived: number;
  outstandingBalance: number;
  projectManager: string;
  status: 'planning' | 'mobilization' | 'in_progress' | 'on_hold' | 'completed';
  startDate?: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  milestones: ProjectMilestone[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrmSettings {
  leadSources: Array<{ id: string; label: string; active: boolean }>;
  scaleAcreageRanges: {
    small: { min: number; max: number; label: string };
    medium: { min: number; max: number; label: string };
    large: { min: number; max: number; label: string };
  };
  cropTypes: string[];
  soilTypes: string[];
  pestTypes: string[];
  irrigationTypes: string[];
  lossReasons: Array<{ id: string; label: string }>;
  paymentTerms: string[];
  notificationRecipients: string[];
  autoAssignExecutive?: string;
  sendCustomerAcknowledgement: boolean;
}


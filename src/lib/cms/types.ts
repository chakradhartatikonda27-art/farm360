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

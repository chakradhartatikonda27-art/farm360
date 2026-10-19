import fs from 'fs';
import path from 'path';
import { 
  AdminUser, 
  CmsPage, 
  ServiceItem, 
  SpaceItem, 
  BusinessModelItem, 
  TransparencyStep, 
  TransparencyPrinciple, 
  TransparencyDocument, 
  TestimonialItem, 
  FAQItem, 
  ContactEnquiry, 
  NavigationItem, 
  GlobalSettings, 
  MediaAsset,
  AuditLogEntry,
  ContentRevision,
  DashboardStats
} from './types';
import { getInitialSeedData } from './seedData';

interface DatabaseSchema {
  version: number;
  lastUpdated: string;
  users: AdminUser[];
  globalSettings: GlobalSettings;
  navigation: { header: NavigationItem[]; footer: NavigationItem[] };
  pages: CmsPage[];
  services: ServiceItem[];
  spaces: SpaceItem[];
  businessModels: BusinessModelItem[];
  transparencySteps: TransparencyStep[];
  transparencyPrinciples: TransparencyPrinciple[];
  transparencyDocuments: TransparencyDocument[];
  testimonials: TestimonialItem[];
  faqs: FAQItem[];
  enquiries: ContactEnquiry[];
  mediaAssets: MediaAsset[];
  auditLogs: AuditLogEntry[];
  revisions: ContentRevision[];
}

const IS_VERCEL = !!process.env.VERCEL;
const BUNDLED_DB_DIR = path.join(process.cwd(), 'data', 'cms-store');
const BUNDLED_DB_FILE = path.join(BUNDLED_DB_DIR, 'database.json');

const DB_DIR = IS_VERCEL
  ? path.join('/tmp', 'cms-store')
  : BUNDLED_DB_DIR;
const DB_FILE = path.join(DB_DIR, 'database.json');

// In-memory cache for fast read access
let memoryDb: DatabaseSchema | null = null;

function ensureDbDirectory() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  } catch (err) {
    // Read-only filesystem warning
  }
}

export function loadDatabase(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  ensureDbDirectory();

  // Try reading from writable location first (/tmp/cms-store/database.json on Vercel)
  try {
    if (fs.existsSync(DB_FILE)) {
      const fileContent = fs.readFileSync(DB_FILE, 'utf8');
      memoryDb = JSON.parse(fileContent);
      return memoryDb!;
    }
  } catch (e) {
    // Ignore and proceed to bundled
  }

  // Next, try reading from bundled file (data/cms-store/database.json)
  try {
    if (fs.existsSync(BUNDLED_DB_FILE)) {
      const fileContent = fs.readFileSync(BUNDLED_DB_FILE, 'utf8');
      memoryDb = JSON.parse(fileContent);

      // On Vercel, copy bundled to writable /tmp for future updates
      if (IS_VERCEL) {
        try {
          fs.writeFileSync(DB_FILE, fileContent, 'utf8');
        } catch {}
      }

      return memoryDb!;
    }
  } catch (e) {
    // Ignore and proceed to seedData
  }

  // Fallback to code seed data
  const seed = getInitialSeedData();
  const initialDb: DatabaseSchema = {
    version: 2,
    lastUpdated: new Date().toISOString(),
    ...seed,
  };
  saveDatabase(initialDb);
  memoryDb = initialDb;
  return memoryDb;
}

export function saveDatabase(db: DatabaseSchema) {
  memoryDb = db;
  db.lastUpdated = new Date().toISOString();

  try {
    ensureDbDirectory();
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    // In read-only serverless environments, in-memory state is preserved for the instance lifetime
    console.warn('Persistent disk write skipped/failed:', err);
  }
}

/* ==================== AUDIT LOGS ==================== */
export function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  const db = loadDatabase();
  const newLog: AuditLogEntry = {
    id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  db.auditLogs.unshift(newLog);
  // Keep last 500 logs
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  saveDatabase(db);
  return newLog;
}

export function getAuditLogs(limit: number = 50) {
  const db = loadDatabase();
  return db.auditLogs.slice(0, limit);
}

/* ==================== USERS & AUTH ==================== */
export function getUsers(): AdminUser[] {
  const db = loadDatabase();
  return db.users;
}

export function getUserByEmail(email: string): AdminUser | undefined {
  const db = loadDatabase();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): AdminUser | undefined {
  const db = loadDatabase();
  return db.users.find((u) => u.id === id);
}

export function saveUser(user: Partial<AdminUser> & { email: string }): AdminUser {
  const db = loadDatabase();
  const existingIdx = db.users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase() || (user.id && u.id === user.id));
  
  if (existingIdx >= 0) {
    const updated = {
      ...db.users[existingIdx],
      ...user,
      updatedAt: new Date().toISOString(),
    };
    db.users[existingIdx] = updated;
    saveDatabase(db);
    return updated;
  } else {
    const isActive = user.isActive !== undefined ? user.isActive : (user.active !== undefined ? user.active : true);
    const newUser: AdminUser = {
      id: user.id || `usr_${Date.now()}`,
      email: user.email,
      passwordHash: user.passwordHash || '',
      name: user.name || user.email.split('@')[0],
      role: user.role || 'CONTENT_EDITOR',
      isActive,
      active: isActive,
      avatar: user.avatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveDatabase(db);
    return newUser;
  }
}

export function deleteUser(id: string): boolean {
  const db = loadDatabase();
  const initialLen = db.users.length;
  db.users = db.users.filter((u) => u.id !== id);
  if (db.users.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

/* ==================== GLOBAL SETTINGS ==================== */
export function getGlobalSettings(): GlobalSettings {
  const db = loadDatabase();
  return db.globalSettings;
}

export function updateGlobalSettings(settings: Partial<GlobalSettings>): GlobalSettings {
  const db = loadDatabase();
  db.globalSettings = {
    ...db.globalSettings,
    ...settings,
    contact: {
      ...db.globalSettings.contact,
      ...(settings.contact || {}),
    },
    footer: {
      ...db.globalSettings.footer,
      ...(settings.footer || {}),
    },
    seoDefaults: {
      ...db.globalSettings.seoDefaults,
      ...(settings.seoDefaults || {}),
    },
  };
  saveDatabase(db);
  return db.globalSettings;
}

/* ==================== NAVIGATION ==================== */
export function getNavigation() {
  const db = loadDatabase();
  return db.navigation;
}

export function updateNavigation(nav: { header?: NavigationItem[]; footer?: NavigationItem[] }) {
  const db = loadDatabase();
  if (nav.header) db.navigation.header = nav.header;
  if (nav.footer) db.navigation.footer = nav.footer;
  saveDatabase(db);
  return db.navigation;
}

/* ==================== PAGES & PAGE BUILDER ==================== */
export function getPages(): CmsPage[] {
  const db = loadDatabase();
  return db.pages;
}

export function getPageBySlug(slug: string): CmsPage | undefined {
  const db = loadDatabase();
  return db.pages.find((p) => p.slug === slug);
}

export function savePage(page: Partial<CmsPage> & { slug: string; title: string }): CmsPage {
  const db = loadDatabase();
  const existingIdx = db.pages.findIndex((p) => p.slug === page.slug || (page.id && p.id === page.id));

  if (existingIdx >= 0) {
    const updated: CmsPage = {
      ...db.pages[existingIdx],
      ...page,
      updatedAt: new Date().toISOString(),
    };
    db.pages[existingIdx] = updated;
    saveDatabase(db);
    return updated;
  } else {
    const newPage: CmsPage = {
      id: page.id || `page_${Date.now()}`,
      slug: page.slug,
      title: page.title,
      bannerImage: page.bannerImage,
      seoTitle: page.seoTitle || page.title,
      seoDescription: page.seoDescription || '',
      seoKeywords: page.seoKeywords || [],
      status: page.status || 'draft',
      publishedAt: page.status === 'published' ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
      sections: page.sections || [],
    };
    db.pages.push(newPage);
    saveDatabase(db);
    return newPage;
  }
}

export function deletePage(idOrSlug: string): boolean {
  const db = loadDatabase();
  const initialLen = db.pages.length;
  db.pages = db.pages.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug);
  if (db.pages.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

/* ==================== SERVICES ==================== */
export function getServices(filter?: { status?: string; category?: string }): ServiceItem[] {
  const db = loadDatabase();
  let list = db.services;
  if (filter?.status) {
    list = list.filter((s) => s.status === filter.status);
  }
  if (filter?.category && filter.category !== 'all') {
    list = list.filter((s) => s.category === filter.category);
  }
  return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  const db = loadDatabase();
  return db.services.find((s) => s.slug === slug);
}

export function getServiceById(id: string): ServiceItem | undefined {
  const db = loadDatabase();
  return db.services.find((s) => s.id === id);
}

export function saveService(service: Partial<ServiceItem> & { name: string; slug: string }): ServiceItem {
  const db = loadDatabase();
  const existingIdx = db.services.findIndex((s) => s.id === service.id || s.slug === service.slug);

  if (existingIdx >= 0) {
    const updated: ServiceItem = {
      ...db.services[existingIdx],
      ...service,
      updatedAt: new Date().toISOString(),
    };
    db.services[existingIdx] = updated;
    saveDatabase(db);
    return updated;
  } else {
    const newService: ServiceItem = {
      id: service.id || `srv_${Date.now()}`,
      slug: service.slug,
      name: service.name,
      category: service.category || 'one-time',
      shortDescription: service.shortDescription || '',
      fullDescription: service.fullDescription || '',
      features: service.features || [],
      benefits: service.benefits || [],
      images: service.images || [],
      ctaText: service.ctaText || 'Plan a Consultation',
      ctaLink: service.ctaLink || '/contact',
      order: service.order !== undefined ? service.order : db.services.length + 1,
      isFeatured: service.isFeatured || false,
      status: service.status || 'published',
      seoTitle: service.seoTitle || service.name,
      seoDescription: service.seoDescription || service.shortDescription,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.services.push(newService);
    saveDatabase(db);
    return newService;
  }
}

export function deleteService(idOrSlug: string): boolean {
  const db = loadDatabase();
  const initialLen = db.services.length;
  db.services = db.services.filter((s) => s.id !== idOrSlug && s.slug !== idOrSlug);
  if (db.services.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

/* ==================== SPACES ==================== */
export function getSpaces(filter?: { status?: string }): SpaceItem[] {
  const db = loadDatabase();
  let list = db.spaces;
  if (filter?.status) {
    list = list.filter((s) => s.status === filter.status);
  }
  return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getSpaceById(id: string): SpaceItem | undefined {
  const db = loadDatabase();
  return db.spaces.find((s) => s.id === id || s.slug === id);
}

export function saveSpace(space: Partial<SpaceItem> & { title: string }): SpaceItem {
  const db = loadDatabase();
  const existingIdx = db.spaces.findIndex((s) => s.id === space.id || s.slug === space.slug);

  if (existingIdx >= 0) {
    const updated: SpaceItem = {
      ...db.spaces[existingIdx],
      ...space,
      updatedAt: new Date().toISOString(),
    };
    db.spaces[existingIdx] = updated;
    saveDatabase(db);
    return updated;
  } else {
    const newSpace: SpaceItem = {
      id: space.id || `spc_${Date.now()}`,
      slug: space.slug || space.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      number: space.number || `0${db.spaces.length + 1}`,
      title: space.title,
      subtitle: space.subtitle || '',
      summary: space.summary || '',
      idealFor: space.idealFor || '',
      keyConsiderations: space.keyConsiderations || [],
      solutions: space.solutions || [],
      image: space.image || '/images/managed/cat-managed-farms.jpg',
      gallery: space.gallery || [],
      order: space.order !== undefined ? space.order : db.spaces.length + 1,
      status: space.status || 'published',
      seoTitle: space.seoTitle || space.title,
      seoDescription: space.seoDescription || space.summary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.spaces.push(newSpace);
    saveDatabase(db);
    return newSpace;
  }
}

export function deleteSpace(id: string): boolean {
  const db = loadDatabase();
  const initialLen = db.spaces.length;
  db.spaces = db.spaces.filter((s) => s.id !== id && s.slug !== id);
  if (db.spaces.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

/* ==================== BUSINESS MODELS ==================== */
export function getBusinessModels(): BusinessModelItem[] {
  const db = loadDatabase();
  return db.businessModels.sort((a, b) => (a.order ?? a.displayOrder ?? 0) - (b.order ?? b.displayOrder ?? 0));
}

export function saveBusinessModel(model: Partial<BusinessModelItem> & { title: string }): BusinessModelItem {
  const db = loadDatabase();
  const existingIdx = db.businessModels.findIndex((m) => m.id === model.id);

  if (existingIdx >= 0) {
    const updated: BusinessModelItem = {
      ...db.businessModels[existingIdx],
      ...model,
      updatedAt: new Date().toISOString(),
    };
    db.businessModels[existingIdx] = updated;
    saveDatabase(db);
    return updated;
  } else {
    const newModel: BusinessModelItem = {
      id: model.id || `bm_${Date.now()}`,
      code: model.code || `Model ${db.businessModels.length + 1}`,
      title: model.title,
      tagline: model.tagline || '',
      problem: model.problem || '',
      solution: model.solution || '',
      revenueModel: model.revenueModel || '',
      promise: model.promise || '',
      servicesIncluded: model.servicesIncluded || [],
      image: model.image || '/images/managed/cat-managed-farms.jpg',
      href: model.href || '/services',
      order: model.order !== undefined ? model.order : db.businessModels.length + 1,
      status: model.status || 'published',
      subModels: model.subModels,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.businessModels.push(newModel);
    saveDatabase(db);
    return newModel;
  }
}

/* ==================== TRANSPARENCY ==================== */
export function getTransparencyData() {
  const db = loadDatabase();
  return {
    steps: db.transparencySteps,
    principles: db.transparencyPrinciples,
    documents: db.transparencyDocuments,
  };
}

export function updateTransparencyWorkflow(steps: TransparencyStep[]) {
  const db = loadDatabase();
  db.transparencySteps = steps;
  saveDatabase(db);
  return db.transparencySteps;
}

export function updateTransparencyPrinciples(principles: TransparencyPrinciple[]) {
  const db = loadDatabase();
  db.transparencyPrinciples = principles;
  saveDatabase(db);
  return db.transparencyPrinciples;
}

export function saveTransparencyDocument(doc: Partial<TransparencyDocument> & { title: string; fileUrl: string }): TransparencyDocument {
  const db = loadDatabase();
  const existingIdx = db.transparencyDocuments.findIndex((d) => d.id === doc.id);

  if (existingIdx >= 0) {
    const updated: TransparencyDocument = {
      ...db.transparencyDocuments[existingIdx],
      ...doc,
      lastUpdated: new Date().toISOString(),
    };
    db.transparencyDocuments[existingIdx] = updated;
    saveDatabase(db);
    return updated;
  } else {
    const newDoc: TransparencyDocument = {
      id: doc.id || `doc_${Date.now()}`,
      title: doc.title,
      category: doc.category || 'General Governance',
      fileUrl: doc.fileUrl,
      fileSize: doc.fileSize || '1 MB',
      version: doc.version || 'v1.0',
      effectiveDate: doc.effectiveDate || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString(),
      isPublic: doc.isPublic !== undefined ? doc.isPublic : true,
    };
    db.transparencyDocuments.push(newDoc);
    saveDatabase(db);
    return newDoc;
  }
}

export function deleteTransparencyDocument(id: string): boolean {
  const db = loadDatabase();
  const initialLen = db.transparencyDocuments.length;
  db.transparencyDocuments = db.transparencyDocuments.filter((d) => d.id !== id);
  if (db.transparencyDocuments.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

/* ==================== TESTIMONIALS ==================== */
export function getTestimonials(filter?: { status?: string }): TestimonialItem[] {
  const db = loadDatabase();
  let list = db.testimonials;
  if (filter?.status) {
    list = list.filter((t) => t.status === filter.status);
  }
  return list.sort((a, b) => (a.order ?? a.displayOrder ?? 0) - (b.order ?? b.displayOrder ?? 0));
}

export function getTestimonialById(id: string): TestimonialItem | undefined {
  const db = loadDatabase();
  return db.testimonials.find((t) => t.id === id);
}

export function saveTestimonial(testimonial: Partial<TestimonialItem> & { name: string; quote: string }): TestimonialItem {
  const db = loadDatabase();
  const existingIdx = db.testimonials.findIndex((t) => t.id === testimonial.id);

  if (existingIdx >= 0) {
    const updated: TestimonialItem = {
      ...db.testimonials[existingIdx],
      ...testimonial,
    };
    db.testimonials[existingIdx] = updated;
    saveDatabase(db);
    return updated;
  } else {
    const newTestimonial: TestimonialItem = {
      id: testimonial.id || `test_${Date.now()}`,
      name: testimonial.name,
      initial: testimonial.initial || testimonial.name.charAt(0).toUpperCase(),
      location: testimonial.location || 'India',
      role: testimonial.role,
      serviceRendered: testimonial.serviceRendered || 'General Care',
      rating: testimonial.rating || 5,
      quote: testimonial.quote,
      fullStory: testimonial.fullStory,
      avatarUrl: testimonial.avatarUrl,
      status: testimonial.status || 'published',
      isFeatured: testimonial.isFeatured || false,
      order: testimonial.order !== undefined ? testimonial.order : db.testimonials.length + 1,
      createdAt: new Date().toISOString(),
    };
    db.testimonials.push(newTestimonial);
    saveDatabase(db);
    return newTestimonial;
  }
}

export function deleteTestimonial(id: string): boolean {
  const db = loadDatabase();
  const initialLen = db.testimonials.length;
  db.testimonials = db.testimonials.filter((t) => t.id !== id);
  if (db.testimonials.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

/* ==================== FAQS ==================== */
export function getFaqs(filter?: { pageAssignment?: string; category?: string }): FAQItem[] {
  const db = loadDatabase();
  let list = db.faqs;
  if (filter?.pageAssignment && filter.pageAssignment !== 'all') {
    list = list.filter((f) => f.pageAssignment === filter.pageAssignment || f.pageAssignment === 'all');
  }
  if (filter?.category && filter.category !== 'all') {
    list = list.filter((f) => f.category === filter.category);
  }
  return list.sort((a, b) => (a.order ?? a.displayOrder ?? 0) - (b.order ?? b.displayOrder ?? 0));
}

export function saveFaq(faq: Partial<FAQItem> & { question: string; answer: string }): FAQItem {
  const db = loadDatabase();
  const existingIdx = db.faqs.findIndex((f) => f.id === faq.id);

  if (existingIdx >= 0) {
    const updated: FAQItem = {
      ...db.faqs[existingIdx],
      ...faq,
    };
    db.faqs[existingIdx] = updated;
    saveDatabase(db);
    return updated;
  } else {
    const newFaq: FAQItem = {
      id: faq.id || `faq_${Date.now()}`,
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      pageAssignment: faq.pageAssignment || 'all',
      order: faq.order !== undefined ? faq.order : db.faqs.length + 1,
      status: faq.status || 'published',
    };
    db.faqs.push(newFaq);
    saveDatabase(db);
    return newFaq;
  }
}

export function deleteFaq(id: string): boolean {
  const db = loadDatabase();
  const initialLen = db.faqs.length;
  db.faqs = db.faqs.filter((f) => f.id !== id);
  if (db.faqs.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

/* ==================== CONTACT ENQUIRIES CRM ==================== */
export function getEnquiries(filter?: { status?: string; search?: string }): ContactEnquiry[] {
  const db = loadDatabase();
  let list = db.enquiries;
  if (filter?.status && filter.status !== 'all') {
    list = list.filter((e) => e.status === filter.status);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.phone.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        Boolean(e.referenceId && e.referenceId.toLowerCase().includes(q))
    );
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getEnquiryById(id: string): ContactEnquiry | undefined {
  const db = loadDatabase();
  return db.enquiries.find((e) => e.id === id || e.referenceId === id);
}

export function saveEnquiry(enquiry: Partial<ContactEnquiry> & { name: string; phone: string }): ContactEnquiry {
  const db = loadDatabase();
  const existingIdx = db.enquiries.findIndex((e) => e.id === enquiry.id);

  if (existingIdx >= 0) {
    const updated: ContactEnquiry = {
      ...db.enquiries[existingIdx],
      ...enquiry,
      updatedAt: new Date().toISOString(),
    };
    db.enquiries[existingIdx] = updated;
    saveDatabase(db);
    return updated;
  } else {
    const refNum = Math.floor(1000 + Math.random() * 9000);
    const newEnquiry: ContactEnquiry = {
      id: enquiry.id || `enq_${Date.now()}`,
      referenceId: enquiry.referenceId || `FC-2026-${refNum}`,
      name: enquiry.name,
      phone: enquiry.phone,
      email: enquiry.email || '',
      location: enquiry.location || '',
      propertyType: enquiry.propertyType || 'Agricultural Land',
      projectDescription: enquiry.projectDescription || '',
      status: enquiry.status || 'new',
      priority: enquiry.priority || 'medium',
      internalNotes: enquiry.internalNotes || [],
      assignedTo: enquiry.assignedTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.enquiries.unshift(newEnquiry);
    saveDatabase(db);
    return newEnquiry;
  }
}

export function deleteEnquiry(id: string): boolean {
  const db = loadDatabase();
  const initialLen = db.enquiries.length;
  db.enquiries = db.enquiries.filter((e) => e.id !== id);
  if (db.enquiries.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

/* ==================== MEDIA LIBRARY ==================== */
export function getMediaAssets(filter?: { folder?: string; tag?: string }): MediaAsset[] {
  const db = loadDatabase();
  let list = db.mediaAssets;
  if (filter?.folder && filter.folder !== 'all') {
    list = list.filter((m) => m.folder === filter.folder);
  }
  if (filter?.tag) {
    list = list.filter((m) => m.tags?.includes(filter.tag!));
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function saveMediaAsset(asset: Partial<MediaAsset> & { url: string; filename: string }): MediaAsset {
  const db = loadDatabase();
  const existingIdx = db.mediaAssets.findIndex((m) => m.id === asset.id || m.url === asset.url);

  if (existingIdx >= 0) {
    const updated: MediaAsset = {
      ...db.mediaAssets[existingIdx],
      ...asset,
      updatedAt: new Date().toISOString(),
    };
    db.mediaAssets[existingIdx] = updated;
    saveDatabase(db);
    return updated;
  } else {
    const newAsset: MediaAsset = {
      id: asset.id || `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      filename: asset.filename,
      originalName: asset.originalName || asset.filename,
      mimeType: asset.mimeType || 'image/jpeg',
      size: asset.size || 0,
      url: asset.url,
      alt: asset.alt || asset.filename,
      caption: asset.caption,
      folder: asset.folder || 'general',
      tags: asset.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.mediaAssets.unshift(newAsset);
    saveDatabase(db);
    return newAsset;
  }
}

export function deleteMediaAsset(id: string): boolean {
  const db = loadDatabase();
  const initialLen = db.mediaAssets.length;
  db.mediaAssets = db.mediaAssets.filter((m) => m.id !== id);
  if (db.mediaAssets.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

/* ==================== DASHBOARD STATS ==================== */
export function getDashboardStats(): DashboardStats & Record<string, any> {
  const db = loadDatabase();
  const totalPages = db.pages.length;
  const publishedPages = db.pages.filter((p) => p.status === 'published' || p.isPublished).length;
  const totalServices = db.services.length;
  const activeServices = db.services.filter((s) => s.status === 'published' || s.isActive).length;
  const spacesCount = db.spaces.length;
  const mediaAssetsCount = db.mediaAssets.length;
  const totalTestimonials = db.testimonials.length;
  const approvedTestimonials = db.testimonials.filter((t) => t.isApproved ?? (t.status === 'published')).length;
  const totalEnquiries = db.enquiries.length;
  const newEnquiries = db.enquiries.filter((e) => e.status === 'new').length;

  return {
    totalPages,
    publishedPages,
    totalServices,
    activeServices,
    spacesCount,
    mediaAssetsCount,
    totalTestimonials,
    approvedTestimonials,
    totalEnquiries,
    newEnquiries,
    recentEnquiries: db.enquiries.slice(0, 5),
    recentActivity: db.auditLogs.slice(0, 8),
    pages: {
      total: totalPages,
      published: publishedPages,
    },
    services: {
      total: totalServices,
      published: activeServices,
      categories: Array.from(new Set(db.services.map((s) => s.category))),
    },
    spaces: {
      total: spacesCount,
      published: db.spaces.filter((s) => s.status === 'published' || s.isActive).length,
    },
    models: {
      total: db.businessModels.length,
    },
    media: {
      total: mediaAssetsCount,
      totalSize: db.mediaAssets.reduce((acc, m) => acc + (m.size || 0), 0),
    },
    testimonials: {
      total: totalTestimonials,
      published: approvedTestimonials,
      featured: db.testimonials.filter((t) => t.isFeatured).length,
    },
    faqs: {
      total: db.faqs.length,
      published: db.faqs.filter((f) => f.status === 'published').length,
    },
    enquiries: {
      total: totalEnquiries,
      new: newEnquiries,
      inProgress: db.enquiries.filter((e) => e.status === 'in_progress').length,
      resolved: db.enquiries.filter((e) => e.status === 'resolved').length,
      archived: db.enquiries.filter((e) => e.status === 'archived').length,
    },
    recentAudits: db.auditLogs.slice(0, 8),
  };
}

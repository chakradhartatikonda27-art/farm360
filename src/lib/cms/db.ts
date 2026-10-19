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
  DashboardStats,
  LeadItem,
  ProjectItem,
  CrmSettings,
  SalesStage,
  LeadStatus,
  LeadSource,
  LeadPriority,
  LeadActivity
} from './types';
import { getInitialSeedData } from './seedData';

export interface DatabaseSchema {
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
  leads: LeadItem[];
  projects: ProjectItem[];
  crmSettings: CrmSettings;
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

// In-memory cache for ultra-fast response
let memoryDb: DatabaseSchema | null = null;
let latestBlobTime = 0;
let lastCloudCheckTime = 0;
const CLOUD_CHECK_INTERVAL_MS = 2000;

function ensureDbDirectory() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  } catch {
    // Read-only filesystem warning
  }
}

// Global synchronization lock for Vercel Blob updates
let isSyncing = false;
let pendingDb: DatabaseSchema | null = null;

export async function syncToCloudAsync(db: DatabaseSchema): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return;
  }

  if (isSyncing) {
    pendingDb = db;
    return;
  }

  isSyncing = true;
  try {
    const { put, list, del } = await import('@vercel/blob');
    const timestamp = Date.now();
    const pathname = `cms/db-${timestamp}.json`;

    await put(pathname, JSON.stringify(db, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      token,
    });

    latestBlobTime = timestamp;

    // Prune older blobs in the background, keeping only the 3 newest
    try {
      const listRes = await list({ prefix: 'cms/db-', token });
      if (listRes.blobs && listRes.blobs.length > 3) {
        const sorted = listRes.blobs.sort(
          (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
        const toDelete = sorted.slice(3).map((b) => b.url);
        if (toDelete.length > 0) {
          await del(toDelete, { token });
        }
      }
    } catch (pruneErr) {
      console.warn('Vercel Blob prune notice:', pruneErr);
    }
  } catch (err) {
    console.warn('Vercel Blob sync error:', err);
  } finally {
    isSyncing = false;
    if (pendingDb) {
      const next = pendingDb;
      pendingDb = null;
      await syncToCloudAsync(next);
    }
  }
}

function normalizeDb(db: any): DatabaseSchema {
  if (!db) return db;
  const seed = getInitialSeedData();
  if (!db.users || !Array.isArray(db.users)) {
    db.users = seed.users;
  } else if (!db.users.some((u: any) => u.email?.toLowerCase() === 'admin@gmail.com')) {
    const gmailUser = seed.users.find((u: any) => u.email?.toLowerCase() === 'admin@gmail.com');
    if (gmailUser) db.users.push(gmailUser);
  }
  if (!db.leads || !Array.isArray(db.leads) || db.leads.length === 0) {
    db.leads = seed.leads;
  }
  if (!db.projects || !Array.isArray(db.projects) || db.projects.length === 0) {
    db.projects = seed.projects;
  }
  if (!db.crmSettings) {
    db.crmSettings = seed.crmSettings;
  }
  return db as DatabaseSchema;
}

export function loadDatabase(): DatabaseSchema {
  if (memoryDb) {
    return normalizeDb(memoryDb);
  }

  ensureDbDirectory();

  // Try reading from writable location first (/tmp/cms-store/database.json on Vercel)
  try {
    if (fs.existsSync(DB_FILE)) {
      const fileContent = fs.readFileSync(DB_FILE, 'utf8');
      memoryDb = normalizeDb(JSON.parse(fileContent));
      return memoryDb!;
    }
  } catch {}

  // Next, try reading from bundled file (data/cms-store/database.json)
  try {
    if (fs.existsSync(BUNDLED_DB_FILE)) {
      const fileContent = fs.readFileSync(BUNDLED_DB_FILE, 'utf8');
      memoryDb = normalizeDb(JSON.parse(fileContent));

      // On Vercel, copy bundled to writable /tmp for future updates
      if (IS_VERCEL) {
        try {
          fs.writeFileSync(DB_FILE, fileContent, 'utf8');
        } catch {}
      }

      return memoryDb!;
    }
  } catch {}

  // Fallback to code seed data
  const seed = getInitialSeedData();
  const initialDb: DatabaseSchema = {
    version: 2,
    lastUpdated: new Date().toISOString(),
    ...seed,
  };
  saveDatabase(initialDb);
  memoryDb = normalizeDb(initialDb);
  return memoryDb;
}

export async function loadDatabaseAsync(): Promise<DatabaseSchema> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (token) {
    const now = Date.now();
    const shouldCheck = !memoryDb || (now - lastCloudCheckTime > CLOUD_CHECK_INTERVAL_MS);

    if (shouldCheck) {
      lastCloudCheckTime = now;
      try {
        const { list } = await import('@vercel/blob');
        const abortCtrl = new AbortController();
        const timer = setTimeout(() => abortCtrl.abort(), 4000);

        const listRes = await list({ prefix: 'cms/db-', token, abortSignal: abortCtrl.signal });
        clearTimeout(timer);

        if (listRes.blobs && listRes.blobs.length > 0) {
          const sorted = listRes.blobs.sort(
            (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
          );
          const newest = sorted[0];
          const newestTime = new Date(newest.uploadedAt).getTime();

          if (!memoryDb || newestTime > latestBlobTime) {
            const res = await fetch(newest.url, {
              cache: 'no-store',
              headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
            });
            if (res.ok) {
              const cloudDb = await res.json();
              memoryDb = cloudDb;
              latestBlobTime = newestTime;

              try {
                ensureDbDirectory();
                fs.writeFileSync(DB_FILE, JSON.stringify(cloudDb, null, 2), 'utf8');
              } catch {}

              return memoryDb!;
            }
          } else if (memoryDb) {
            return memoryDb;
          }
        } else {
          // No blobs in cloud store yet, upload bundled/initial database to cloud
          const localDb = loadDatabase();
          syncToCloudAsync(localDb).catch(() => {});
          return localDb;
        }
      } catch (err) {
        console.warn('loadDatabaseAsync Vercel Blob notice:', err);
      }
    } else if (memoryDb) {
      return memoryDb;
    }
  }

  return loadDatabase();
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
    console.warn('Persistent disk write skipped/failed:', err);
  }

  // Push to Vercel Blob cloud in background
  syncToCloudAsync(db).catch((e) => console.warn('Background cloud sync failed:', e));
}

export async function saveDatabaseAsync(db: DatabaseSchema): Promise<void> {
  memoryDb = db;
  db.lastUpdated = new Date().toISOString();

  try {
    ensureDbDirectory();
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.warn('Persistent disk write skipped/failed:', err);
  }

  // Await cloud persistence so live updates are instantly distributed
  await syncToCloudAsync(db);
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
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  saveDatabase(db);
  return newLog;
}

export async function addAuditLogAsync(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  const db = await loadDatabaseAsync();
  const newLog: AuditLogEntry = {
    id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  db.auditLogs.unshift(newLog);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  await saveDatabaseAsync(db);
  return newLog;
}

export function getAuditLogs(limit: number = 50) {
  const db = loadDatabase();
  return db.auditLogs.slice(0, limit);
}

export async function getAuditLogsAsync(limit: number = 50) {
  const db = await loadDatabaseAsync();
  return db.auditLogs.slice(0, limit);
}

/* ==================== USERS & AUTH ==================== */
export function getUsers(): AdminUser[] {
  const db = loadDatabase();
  return db.users;
}

export async function getUsersAsync(): Promise<AdminUser[]> {
  const db = await loadDatabaseAsync();
  return db.users;
}

export function getUserByEmail(email: string): AdminUser | undefined {
  const db = loadDatabase();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function getUserByEmailAsync(email: string): Promise<AdminUser | undefined> {
  const db = await loadDatabaseAsync();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): AdminUser | undefined {
  const db = loadDatabase();
  return db.users.find((u) => u.id === id);
}

export async function getUserByIdAsync(id: string): Promise<AdminUser | undefined> {
  const db = await loadDatabaseAsync();
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

export async function saveUserAsync(user: Partial<AdminUser> & { email: string }): Promise<AdminUser> {
  const db = await loadDatabaseAsync();
  const existingIdx = db.users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase() || (user.id && u.id === user.id));
  
  if (existingIdx >= 0) {
    const updated = {
      ...db.users[existingIdx],
      ...user,
      updatedAt: new Date().toISOString(),
    };
    db.users[existingIdx] = updated;
    await saveDatabaseAsync(db);
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
    await saveDatabaseAsync(db);
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

export async function deleteUserAsync(id: string): Promise<boolean> {
  const db = await loadDatabaseAsync();
  const initialLen = db.users.length;
  db.users = db.users.filter((u) => u.id !== id);
  if (db.users.length !== initialLen) {
    await saveDatabaseAsync(db);
    return true;
  }
  return false;
}

/* ==================== GLOBAL SETTINGS ==================== */
export function getGlobalSettings(): GlobalSettings {
  const db = loadDatabase();
  return db.globalSettings;
}

export async function getGlobalSettingsAsync(): Promise<GlobalSettings> {
  const db = await loadDatabaseAsync();
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

export async function updateGlobalSettingsAsync(settings: Partial<GlobalSettings>): Promise<GlobalSettings> {
  const db = await loadDatabaseAsync();
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
  await saveDatabaseAsync(db);
  return db.globalSettings;
}

/* ==================== NAVIGATION ==================== */
export function getNavigation() {
  const db = loadDatabase();
  return db.navigation;
}

export async function getNavigationAsync() {
  const db = await loadDatabaseAsync();
  return db.navigation;
}

export function updateNavigation(nav: { header?: NavigationItem[]; footer?: NavigationItem[] }) {
  const db = loadDatabase();
  if (nav.header) db.navigation.header = nav.header;
  if (nav.footer) db.navigation.footer = nav.footer;
  saveDatabase(db);
  return db.navigation;
}

export async function updateNavigationAsync(nav: { header?: NavigationItem[]; footer?: NavigationItem[] }) {
  const db = await loadDatabaseAsync();
  if (nav.header) db.navigation.header = nav.header;
  if (nav.footer) db.navigation.footer = nav.footer;
  await saveDatabaseAsync(db);
  return db.navigation;
}

/* ==================== PAGES & PAGE BUILDER ==================== */
export function getPages(): CmsPage[] {
  const db = loadDatabase();
  return db.pages;
}

export async function getPagesAsync(): Promise<CmsPage[]> {
  const db = await loadDatabaseAsync();
  return db.pages;
}

export function getPageBySlug(slug: string): CmsPage | undefined {
  const db = loadDatabase();
  return db.pages.find((p) => p.slug === slug);
}

export async function getPageBySlugAsync(slug: string): Promise<CmsPage | undefined> {
  const db = await loadDatabaseAsync();
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

export async function savePageAsync(page: Partial<CmsPage> & { slug: string; title: string }): Promise<CmsPage> {
  const db = await loadDatabaseAsync();
  const existingIdx = db.pages.findIndex((p) => p.slug === page.slug || (page.id && p.id === page.id));

  let savedPage: CmsPage;
  if (existingIdx >= 0) {
    savedPage = {
      ...db.pages[existingIdx],
      ...page,
      updatedAt: new Date().toISOString(),
    };
    db.pages[existingIdx] = savedPage;
  } else {
    savedPage = {
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
    db.pages.push(savedPage);
  }

  await saveDatabaseAsync(db);
  return savedPage;
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

export async function deletePageAsync(idOrSlug: string): Promise<boolean> {
  const db = await loadDatabaseAsync();
  const initialLen = db.pages.length;
  db.pages = db.pages.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug);
  if (db.pages.length !== initialLen) {
    await saveDatabaseAsync(db);
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

export async function getServicesAsync(filter?: { status?: string; category?: string }): Promise<ServiceItem[]> {
  const db = await loadDatabaseAsync();
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

export async function getServiceBySlugAsync(slug: string): Promise<ServiceItem | undefined> {
  const db = await loadDatabaseAsync();
  return db.services.find((s) => s.slug === slug);
}

export function getServiceById(id: string): ServiceItem | undefined {
  const db = loadDatabase();
  return db.services.find((s) => s.id === id);
}

export async function getServiceByIdAsync(id: string): Promise<ServiceItem | undefined> {
  const db = await loadDatabaseAsync();
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

export async function saveServiceAsync(service: Partial<ServiceItem> & { name: string; slug: string }): Promise<ServiceItem> {
  const db = await loadDatabaseAsync();
  const existingIdx = db.services.findIndex((s) => s.id === service.id || s.slug === service.slug);

  let savedService: ServiceItem;
  if (existingIdx >= 0) {
    savedService = {
      ...db.services[existingIdx],
      ...service,
      updatedAt: new Date().toISOString(),
    };
    db.services[existingIdx] = savedService;
  } else {
    savedService = {
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
    db.services.push(savedService);
  }

  await saveDatabaseAsync(db);
  return savedService;
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

export async function deleteServiceAsync(idOrSlug: string): Promise<boolean> {
  const db = await loadDatabaseAsync();
  const initialLen = db.services.length;
  db.services = db.services.filter((s) => s.id !== idOrSlug && s.slug !== idOrSlug);
  if (db.services.length !== initialLen) {
    await saveDatabaseAsync(db);
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

export async function getSpacesAsync(filter?: { status?: string }): Promise<SpaceItem[]> {
  const db = await loadDatabaseAsync();
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

export async function getSpaceByIdAsync(id: string): Promise<SpaceItem | undefined> {
  const db = await loadDatabaseAsync();
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

export async function saveSpaceAsync(space: Partial<SpaceItem> & { title: string }): Promise<SpaceItem> {
  const db = await loadDatabaseAsync();
  const existingIdx = db.spaces.findIndex((s) => s.id === space.id || s.slug === space.slug);

  let savedSpace: SpaceItem;
  if (existingIdx >= 0) {
    savedSpace = {
      ...db.spaces[existingIdx],
      ...space,
      updatedAt: new Date().toISOString(),
    };
    db.spaces[existingIdx] = savedSpace;
  } else {
    savedSpace = {
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
    db.spaces.push(savedSpace);
  }

  await saveDatabaseAsync(db);
  return savedSpace;
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

export async function deleteSpaceAsync(id: string): Promise<boolean> {
  const db = await loadDatabaseAsync();
  const initialLen = db.spaces.length;
  db.spaces = db.spaces.filter((s) => s.id !== id && s.slug !== id);
  if (db.spaces.length !== initialLen) {
    await saveDatabaseAsync(db);
    return true;
  }
  return false;
}

/* ==================== BUSINESS MODELS ==================== */
export function getBusinessModels(): BusinessModelItem[] {
  const db = loadDatabase();
  return db.businessModels.sort((a, b) => (a.order ?? a.displayOrder ?? 0) - (b.order ?? b.displayOrder ?? 0));
}

export async function getBusinessModelsAsync(): Promise<BusinessModelItem[]> {
  const db = await loadDatabaseAsync();
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

export async function saveBusinessModelAsync(model: Partial<BusinessModelItem> & { title: string }): Promise<BusinessModelItem> {
  const db = await loadDatabaseAsync();
  const existingIdx = db.businessModels.findIndex((m) => m.id === model.id);

  let savedModel: BusinessModelItem;
  if (existingIdx >= 0) {
    savedModel = {
      ...db.businessModels[existingIdx],
      ...model,
      updatedAt: new Date().toISOString(),
    };
    db.businessModels[existingIdx] = savedModel;
  } else {
    savedModel = {
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
    db.businessModels.push(savedModel);
  }

  await saveDatabaseAsync(db);
  return savedModel;
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

export async function getTransparencyDataAsync() {
  const db = await loadDatabaseAsync();
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

export async function updateTransparencyWorkflowAsync(steps: TransparencyStep[]) {
  const db = await loadDatabaseAsync();
  db.transparencySteps = steps;
  await saveDatabaseAsync(db);
  return db.transparencySteps;
}

export function updateTransparencyPrinciples(principles: TransparencyPrinciple[]) {
  const db = loadDatabase();
  db.transparencyPrinciples = principles;
  saveDatabase(db);
  return db.transparencyPrinciples;
}

export async function updateTransparencyPrinciplesAsync(principles: TransparencyPrinciple[]) {
  const db = await loadDatabaseAsync();
  db.transparencyPrinciples = principles;
  await saveDatabaseAsync(db);
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

export async function saveTransparencyDocumentAsync(doc: Partial<TransparencyDocument> & { title: string; fileUrl: string }): Promise<TransparencyDocument> {
  const db = await loadDatabaseAsync();
  const existingIdx = db.transparencyDocuments.findIndex((d) => d.id === doc.id);

  let savedDoc: TransparencyDocument;
  if (existingIdx >= 0) {
    savedDoc = {
      ...db.transparencyDocuments[existingIdx],
      ...doc,
      lastUpdated: new Date().toISOString(),
    };
    db.transparencyDocuments[existingIdx] = savedDoc;
  } else {
    savedDoc = {
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
    db.transparencyDocuments.push(savedDoc);
  }

  await saveDatabaseAsync(db);
  return savedDoc;
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

export async function deleteTransparencyDocumentAsync(id: string): Promise<boolean> {
  const db = await loadDatabaseAsync();
  const initialLen = db.transparencyDocuments.length;
  db.transparencyDocuments = db.transparencyDocuments.filter((d) => d.id !== id);
  if (db.transparencyDocuments.length !== initialLen) {
    await saveDatabaseAsync(db);
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

export async function getTestimonialsAsync(filter?: { status?: string }): Promise<TestimonialItem[]> {
  const db = await loadDatabaseAsync();
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

export async function getTestimonialByIdAsync(id: string): Promise<TestimonialItem | undefined> {
  const db = await loadDatabaseAsync();
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

export async function saveTestimonialAsync(testimonial: Partial<TestimonialItem> & { name: string; quote: string }): Promise<TestimonialItem> {
  const db = await loadDatabaseAsync();
  const existingIdx = db.testimonials.findIndex((t) => t.id === testimonial.id);

  let savedTestimonial: TestimonialItem;
  if (existingIdx >= 0) {
    savedTestimonial = {
      ...db.testimonials[existingIdx],
      ...testimonial,
    };
    db.testimonials[existingIdx] = savedTestimonial;
  } else {
    savedTestimonial = {
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
    db.testimonials.push(savedTestimonial);
  }

  await saveDatabaseAsync(db);
  return savedTestimonial;
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

export async function deleteTestimonialAsync(id: string): Promise<boolean> {
  const db = await loadDatabaseAsync();
  const initialLen = db.testimonials.length;
  db.testimonials = db.testimonials.filter((t) => t.id !== id);
  if (db.testimonials.length !== initialLen) {
    await saveDatabaseAsync(db);
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

export async function getFaqsAsync(filter?: { pageAssignment?: string; category?: string }): Promise<FAQItem[]> {
  const db = await loadDatabaseAsync();
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

export async function saveFaqAsync(faq: Partial<FAQItem> & { question: string; answer: string }): Promise<FAQItem> {
  const db = await loadDatabaseAsync();
  const existingIdx = db.faqs.findIndex((f) => f.id === faq.id);

  let savedFaq: FAQItem;
  if (existingIdx >= 0) {
    savedFaq = {
      ...db.faqs[existingIdx],
      ...faq,
    };
    db.faqs[existingIdx] = savedFaq;
  } else {
    savedFaq = {
      id: faq.id || `faq_${Date.now()}`,
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      pageAssignment: faq.pageAssignment || 'all',
      order: faq.order !== undefined ? faq.order : db.faqs.length + 1,
      status: faq.status || 'published',
    };
    db.faqs.push(savedFaq);
  }

  await saveDatabaseAsync(db);
  return savedFaq;
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

export async function deleteFaqAsync(id: string): Promise<boolean> {
  const db = await loadDatabaseAsync();
  const initialLen = db.faqs.length;
  db.faqs = db.faqs.filter((f) => f.id !== id);
  if (db.faqs.length !== initialLen) {
    await saveDatabaseAsync(db);
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

export async function getEnquiriesAsync(filter?: { status?: string; search?: string }): Promise<ContactEnquiry[]> {
  const db = await loadDatabaseAsync();
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

export async function getEnquiryByIdAsync(id: string): Promise<ContactEnquiry | undefined> {
  const db = await loadDatabaseAsync();
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

export async function saveEnquiryAsync(enquiry: Partial<ContactEnquiry> & { name: string; phone: string }): Promise<ContactEnquiry> {
  const db = await loadDatabaseAsync();
  const existingIdx = db.enquiries.findIndex((e) => e.id === enquiry.id);

  let savedEnquiry: ContactEnquiry;
  if (existingIdx >= 0) {
    savedEnquiry = {
      ...db.enquiries[existingIdx],
      ...enquiry,
      updatedAt: new Date().toISOString(),
    };
    db.enquiries[existingIdx] = savedEnquiry;
  } else {
    const refNum = Math.floor(1000 + Math.random() * 9000);
    savedEnquiry = {
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
    db.enquiries.unshift(savedEnquiry);
  }

  await saveDatabaseAsync(db);
  return savedEnquiry;
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

export async function deleteEnquiryAsync(id: string): Promise<boolean> {
  const db = await loadDatabaseAsync();
  const initialLen = db.enquiries.length;
  db.enquiries = db.enquiries.filter((e) => e.id !== id);
  if (db.enquiries.length !== initialLen) {
    await saveDatabaseAsync(db);
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

export async function getMediaAssetsAsync(filter?: { folder?: string; tag?: string }): Promise<MediaAsset[]> {
  const db = await loadDatabaseAsync();
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

export async function saveMediaAssetAsync(asset: Partial<MediaAsset> & { url: string; filename: string }): Promise<MediaAsset> {
  const db = await loadDatabaseAsync();
  const existingIdx = db.mediaAssets.findIndex((m) => m.id === asset.id || m.url === asset.url);

  let savedAsset: MediaAsset;
  if (existingIdx >= 0) {
    savedAsset = {
      ...db.mediaAssets[existingIdx],
      ...asset,
      updatedAt: new Date().toISOString(),
    };
    db.mediaAssets[existingIdx] = savedAsset;
  } else {
    savedAsset = {
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
    db.mediaAssets.unshift(savedAsset);
  }

  await saveDatabaseAsync(db);
  return savedAsset;
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

export async function deleteMediaAssetAsync(id: string): Promise<boolean> {
  const db = await loadDatabaseAsync();
  const initialLen = db.mediaAssets.length;
  db.mediaAssets = db.mediaAssets.filter((m) => m.id !== id);
  if (db.mediaAssets.length !== initialLen) {
    await saveDatabaseAsync(db);
    return true;
  }
  return false;
}

/* ==================== DASHBOARD STATS ==================== */
export function getDashboardStats(): DashboardStats & Record<string, any> {
  const db = loadDatabase();
  return computeDashboardStats(db);
}

export async function getDashboardStatsAsync(): Promise<DashboardStats & Record<string, any>> {
  const db = await loadDatabaseAsync();
  return computeDashboardStats(db);
}

function computeDashboardStats(db: DatabaseSchema): DashboardStats & Record<string, any> {
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

/* ==================== LEADS & SALES PIPELINE CRM ==================== */

export function getLeads(filter?: { stage?: string; status?: string; source?: string; search?: string }): LeadItem[] {
  const db = loadDatabase();
  let list = db.leads || [];

  if (filter?.stage && filter.stage !== 'all') {
    list = list.filter((l) => l.currentStage === filter.stage);
  }
  if (filter?.status && filter.status !== 'all') {
    list = list.filter((l) => l.status === filter.status);
  }
  if (filter?.source && filter.source !== 'all') {
    list = list.filter((l) => l.source === filter.source);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.referenceId && l.referenceId.toLowerCase().includes(q)) ||
        (l.location && l.location.toLowerCase().includes(q)) ||
        (l.serviceCategory && l.serviceCategory.toLowerCase().includes(q))
    );
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getLeadsAsync(filter?: { stage?: string; status?: string; source?: string; search?: string }): Promise<LeadItem[]> {
  const db = await loadDatabaseAsync();
  let list = db.leads || [];

  if (filter?.stage && filter.stage !== 'all') {
    list = list.filter((l) => l.currentStage === filter.stage);
  }
  if (filter?.status && filter.status !== 'all') {
    list = list.filter((l) => l.status === filter.status);
  }
  if (filter?.source && filter.source !== 'all') {
    list = list.filter((l) => l.source === filter.source);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.referenceId && l.referenceId.toLowerCase().includes(q)) ||
        (l.location && l.location.toLowerCase().includes(q)) ||
        (l.serviceCategory && l.serviceCategory.toLowerCase().includes(q))
    );
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getLeadById(idOrRef: string): LeadItem | undefined {
  if (!idOrRef) return undefined;
  const db = loadDatabase();
  const leads = db.leads || [];
  const target = String(idOrRef).toLowerCase();
  return leads.find(
    (l) =>
      l.id === idOrRef ||
      l.id.toLowerCase() === target ||
      l.id.replace(/^lead_/, '').toLowerCase() === target ||
      `lead_${target}` === l.id.toLowerCase() ||
      (Boolean(l.referenceId) && l.referenceId.toLowerCase() === target)
  );
}

export async function getLeadByIdAsync(idOrRef: string): Promise<LeadItem | undefined> {
  if (!idOrRef) return undefined;
  const db = await loadDatabaseAsync();
  const leads = db.leads || [];
  const target = String(idOrRef).toLowerCase();
  return leads.find(
    (l) =>
      l.id === idOrRef ||
      l.id.toLowerCase() === target ||
      l.id.replace(/^lead_/, '').toLowerCase() === target ||
      `lead_${target}` === l.id.toLowerCase() ||
      (Boolean(l.referenceId) && l.referenceId.toLowerCase() === target)
  );
}

export function generateLeadReferenceId(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `F360-${yy}${mm}${dd}-${randomHex}`;
}

export function saveLead(lead: Partial<LeadItem> & { name: string; phone: string }): LeadItem {
  const db = loadDatabase();
  db.leads = db.leads || [];
  const existingIdx = db.leads.findIndex((l) => (lead.id && l.id === lead.id) || (lead.referenceId && l.referenceId === lead.referenceId));

  if (existingIdx >= 0) {
    const updated: LeadItem = {
      ...db.leads[existingIdx],
      ...lead,
      updatedAt: new Date().toISOString(),
    };
    db.leads[existingIdx] = updated;
    saveDatabase(db);
    return updated;
  } else {
    const newLead: LeadItem = {
      id: lead.id || `lead_${Date.now()}`,
      referenceId: lead.referenceId || generateLeadReferenceId(),
      name: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      companyOrLandownerName: lead.companyOrLandownerName,
      location: lead.location || 'India',
      source: lead.source || 'web',
      serviceCategory: lead.serviceCategory || 'Agricultural Land Planning',
      subject: lead.subject,
      message: lead.message,
      assignedExecutive: lead.assignedExecutive || 'Client Relations Officer',
      priority: lead.priority || 'medium',
      currentStage: lead.currentStage || 'prospecting',
      status: lead.status || 'open',
      estimatedDealValue: lead.estimatedDealValue || 0,
      nextFollowUpDate: lead.nextFollowUpDate,
      stageProspecting: lead.stageProspecting || {
        initialReason: lead.message || 'Website Consultation Request',
        priority: lead.priority || 'medium',
      },
      activities: lead.activities || [
        {
          id: `act_${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'lead_created',
          title: 'Lead created',
          description: `Enquiry received from ${lead.source || 'web'}`,
        },
      ],
      tags: lead.tags || [lead.serviceCategory || 'General', lead.location || 'India'],
      createdAt: lead.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.leads.unshift(newLead);
    saveDatabase(db);
    return newLead;
  }
}

export async function saveLeadAsync(lead: Partial<LeadItem> & { name: string; phone: string }): Promise<LeadItem> {
  const db = await loadDatabaseAsync();
  db.leads = db.leads || [];
  const existingIdx = db.leads.findIndex((l) => (lead.id && l.id === lead.id) || (lead.referenceId && l.referenceId === lead.referenceId));

  let savedLead: LeadItem;
  if (existingIdx >= 0) {
    savedLead = {
      ...db.leads[existingIdx],
      ...lead,
      updatedAt: new Date().toISOString(),
    };
    db.leads[existingIdx] = savedLead;
  } else {
    savedLead = {
      id: lead.id || `lead_${Date.now()}`,
      referenceId: lead.referenceId || generateLeadReferenceId(),
      name: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      companyOrLandownerName: lead.companyOrLandownerName,
      location: lead.location || 'India',
      source: lead.source || 'web',
      serviceCategory: lead.serviceCategory || 'Agricultural Land Planning',
      subject: lead.subject,
      message: lead.message,
      assignedExecutive: lead.assignedExecutive || 'Client Relations Officer',
      priority: lead.priority || 'medium',
      currentStage: lead.currentStage || 'prospecting',
      status: lead.status || 'open',
      estimatedDealValue: lead.estimatedDealValue || 0,
      nextFollowUpDate: lead.nextFollowUpDate,
      stageProspecting: lead.stageProspecting || {
        initialReason: lead.message || 'Website Consultation Request',
        priority: lead.priority || 'medium',
      },
      activities: lead.activities || [
        {
          id: `act_${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'lead_created',
          title: 'Lead created',
          description: `Enquiry received from ${lead.source || 'web'}`,
        },
      ],
      tags: lead.tags || [lead.serviceCategory || 'General', lead.location || 'India'],
      createdAt: lead.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.leads.unshift(savedLead);
  }

  await saveDatabaseAsync(db);
  return savedLead;
}

export function deleteLead(id: string): boolean {
  const db = loadDatabase();
  db.leads = db.leads || [];
  const initialLen = db.leads.length;
  db.leads = db.leads.filter((l) => l.id !== id && l.referenceId !== id);
  if (db.leads.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

export async function deleteLeadAsync(id: string): Promise<boolean> {
  const db = await loadDatabaseAsync();
  db.leads = db.leads || [];
  const initialLen = db.leads.length;
  const target = String(id).toLowerCase();
  db.leads = db.leads.filter(
    (l) =>
      !(l.id === id ||
        l.id.toLowerCase() === target ||
        l.id.replace(/^lead_/, '').toLowerCase() === target ||
        `lead_${target}` === l.id.toLowerCase() ||
        (Boolean(l.referenceId) && l.referenceId.toLowerCase() === target))
  );
  if (db.leads.length !== initialLen) {
    await saveDatabaseAsync(db);
    return true;
  }
  return false;
}

export async function addLeadActivityAsync(
  leadId: string,
  activity: Omit<LeadActivity, 'id' | 'timestamp'>
): Promise<LeadActivity | undefined> {
  const db = await loadDatabaseAsync();
  const target = String(leadId).toLowerCase();
  const lead = (db.leads || []).find(
    (l) =>
      l.id === leadId ||
      l.id.toLowerCase() === target ||
      l.id.replace(/^lead_/, '').toLowerCase() === target ||
      `lead_${target}` === l.id.toLowerCase() ||
      (Boolean(l.referenceId) && l.referenceId.toLowerCase() === target)
  );
  if (!lead) return undefined;

  const newActivity: LeadActivity = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...activity,
  };

  lead.activities = lead.activities || [];
  lead.activities.unshift(newActivity);
  lead.updatedAt = new Date().toISOString();

  await saveDatabaseAsync(db);
  return newActivity;
}

/* ==================== PROJECTS & CONVERSION ==================== */

export function getProjects(filter?: { status?: string; search?: string }): ProjectItem[] {
  const db = loadDatabase();
  let list = db.projects || [];
  if (filter?.status && filter.status !== 'all') {
    list = list.filter((p) => p.status === filter.status);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.referenceId.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
    );
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getProjectsAsync(filter?: { status?: string; search?: string }): Promise<ProjectItem[]> {
  const db = await loadDatabaseAsync();
  let list = db.projects || [];
  if (filter?.status && filter.status !== 'all') {
    list = list.filter((p) => p.status === filter.status);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.referenceId.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
    );
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getProjectById(idOrRef: string): ProjectItem | undefined {
  if (!idOrRef) return undefined;
  const db = loadDatabase();
  const projects = db.projects || [];
  const target = String(idOrRef).toLowerCase();
  return projects.find((p) => p.id === idOrRef || (Boolean(p.referenceId) && p.referenceId.toLowerCase() === target));
}

export async function getProjectByIdAsync(idOrRef: string): Promise<ProjectItem | undefined> {
  if (!idOrRef) return undefined;
  const db = await loadDatabaseAsync();
  const projects = db.projects || [];
  const target = String(idOrRef).toLowerCase();
  return projects.find((p) => p.id === idOrRef || (Boolean(p.referenceId) && p.referenceId.toLowerCase() === target));
}

export function generateProjectReferenceId(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PRJ-${yy}${mm}${dd}-${randomHex}`;
}

export async function saveProjectAsync(project: Partial<ProjectItem> & { title: string }): Promise<ProjectItem> {
  const db = await loadDatabaseAsync();
  db.projects = db.projects || [];
  const existingIdx = db.projects.findIndex((p) => (project.id && p.id === project.id) || (project.referenceId && p.referenceId === project.referenceId));

  let savedProject: ProjectItem;
  if (existingIdx >= 0) {
    savedProject = {
      ...db.projects[existingIdx],
      ...project,
      updatedAt: new Date().toISOString(),
    };
    db.projects[existingIdx] = savedProject;
  } else {
    savedProject = {
      id: project.id || `prj_${Date.now()}`,
      referenceId: project.referenceId || generateProjectReferenceId(),
      leadId: project.leadId || '',
      leadReferenceId: project.leadReferenceId || '',
      title: project.title,
      customerName: project.customerName || 'Client',
      customerPhone: project.customerPhone || '',
      customerEmail: project.customerEmail || '',
      location: project.location || 'India',
      serviceCategory: project.serviceCategory || 'Agricultural Land Planning',
      landAreaAcres: project.landAreaAcres || 0,
      cropType: project.cropType || '',
      scopeOfWork: project.scopeOfWork || '',
      totalContractValue: project.totalContractValue || 0,
      amountReceived: project.amountReceived || 0,
      outstandingBalance: (project.totalContractValue || 0) - (project.amountReceived || 0),
      projectManager: project.projectManager || 'Senior Project Agronomist',
      status: project.status || 'planning',
      startDate: project.startDate || new Date().toISOString().split('T')[0],
      targetCompletionDate: project.targetCompletionDate,
      milestones: project.milestones || [
        {
          id: `m_${Date.now()}_1`,
          title: 'Site Demarcation & Soil Compaction Audit',
          description: 'Establish GPS boundaries, assess soil viability, and finalize infrastructure plans.',
          status: 'in_progress',
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        },
        {
          id: `m_${Date.now()}_2`,
          title: 'Infrastructure & Irrigation Mobilization',
          description: 'Deploy boundary protection, water supply lines, and drip valves.',
          status: 'pending',
          dueDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
        },
        {
          id: `m_${Date.now()}_3`,
          title: 'Plantation & Commissioning Handover',
          description: 'Nursery planting, system testing, and digital logbook handover.',
          status: 'pending',
          dueDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
        },
      ],
      notes: project.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.projects.unshift(savedProject);
  }

  await saveDatabaseAsync(db);
  return savedProject;
}

export async function deleteProjectAsync(id: string): Promise<boolean> {
  const db = await loadDatabaseAsync();
  db.projects = db.projects || [];
  const initialLen = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id && p.referenceId !== id);
  if (db.projects.length !== initialLen) {
    await saveDatabaseAsync(db);
    return true;
  }
  return false;
}

export async function convertLeadToProjectAsync(
  leadId: string,
  overrides?: Partial<ProjectItem>
): Promise<{ lead: LeadItem; project: ProjectItem }> {
  const db = await loadDatabaseAsync();
  const target = String(leadId).toLowerCase();
  const lead = (db.leads || []).find(
    (l) =>
      l.id === leadId ||
      l.id.toLowerCase() === target ||
      l.id.replace(/^lead_/, '').toLowerCase() === target ||
      `lead_${target}` === l.id.toLowerCase() ||
      (Boolean(l.referenceId) && l.referenceId.toLowerCase() === target)
  );
  if (!lead) {
    throw new Error('Lead not found');
  }

  // Idempotency: Prevent duplicate project creation if already converted
  if (lead.projectId) {
    const existingProject = (db.projects || []).find((p) => p.id === lead.projectId);
    if (existingProject) {
      return { lead, project: existingProject };
    }
  }

  const projectRef = generateProjectReferenceId();
  const projectId = `prj_${Date.now()}`;
  const totalValue =
    lead.stageNegotiation?.finalAgreedAmount ||
    lead.stageValueProposition?.finalQuotedAmount ||
    lead.estimatedDealValue ||
    0;
  const received = lead.stageNegotiation?.totalReceived || 0;

  const newProject: ProjectItem = {
    id: projectId,
    referenceId: projectRef,
    leadId: lead.id,
    leadReferenceId: lead.referenceId,
    title: overrides?.title || `${lead.name} — ${lead.serviceCategory || 'Agricultural Project'}`,
    customerName: lead.name,
    customerPhone: lead.phone,
    customerEmail: lead.email,
    location: lead.location,
    serviceCategory: lead.serviceCategory || 'Agricultural Care',
    landAreaAcres: lead.stageQualification?.totalAreaAcres || 0,
    cropType: lead.stageQualification?.cropType || lead.stageQualification?.primaryCrop || '',
    scopeOfWork:
      lead.stageValueProposition?.scopeOfWork ||
      lead.stageValueProposition?.proposedSolution ||
      lead.stageQualification?.requirementSummary ||
      '',
    totalContractValue: overrides?.totalContractValue !== undefined ? overrides.totalContractValue : totalValue,
    amountReceived: overrides?.amountReceived !== undefined ? overrides.amountReceived : received,
    outstandingBalance: Math.max(0, (overrides?.totalContractValue || totalValue) - (overrides?.amountReceived || received)),
    projectManager: overrides?.projectManager || 'Suresh Varma (Senior Agronomist)',
    status: 'planning',
    startDate: overrides?.startDate || new Date().toISOString().split('T')[0],
    targetCompletionDate:
      overrides?.targetCompletionDate ||
      new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    milestones: [
      {
        id: `m_${Date.now()}_1`,
        title: 'Project Kickoff & Agronomic Site Verification',
        description: 'Verify soil parameters, GPS boundaries, and finalize mobilization team.',
        status: 'in_progress',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      },
      {
        id: `m_${Date.now()}_2`,
        title: 'Irrigation, Fencing & Infrastructure Setup',
        description: 'Deploy micro-drip systems, boundary trenches/fencing, and power/borewell connections.',
        status: 'pending',
        dueDate: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
      },
      {
        id: `m_${Date.now()}_3`,
        title: 'Input Procurement & Crop Plantation',
        description: 'Procure certified saplings/seeds, prepare soil beds with organic bio-fertilizers, and execute planting.',
        status: 'pending',
        dueDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
      },
      {
        id: `m_${Date.now()}_4`,
        title: 'Commissioning & Client Handover',
        description: 'Complete joint agronomy audit, deliver digital dashboard credentials & season ledger.',
        status: 'pending',
        dueDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      },
    ],
    notes: overrides?.notes || `Converted from Deal ${lead.referenceId}. All qualification and proposal data linked.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.projects = db.projects || [];
  db.projects.unshift(newProject);

  // Update lead to Closed Won
  lead.currentStage = 'closed_won';
  lead.status = 'closed_won';
  lead.projectId = projectId;
  lead.finalWonRevenue = totalValue;
  lead.closedAt = new Date().toISOString();
  lead.updatedAt = new Date().toISOString();
  lead.stageClosedWon = {
    wonDate: new Date().toISOString(),
    projectId: projectId,
    projectCreated: true,
    transferredDataSummary: `Transferred customer details, ${lead.stageQualification?.totalAreaAcres || 0} acres land specs, and Rs ${totalValue} commercial quotation.`,
    assignedProjectManager: newProject.projectManager,
    projectStartDate: newProject.startDate,
    projectTargetCompletionDate: newProject.targetCompletionDate,
  };

  // Add conversion activity
  lead.activities = lead.activities || [];
  lead.activities.unshift({
    id: `act_${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'converted_to_project',
    title: 'Closed Won - Project Created',
    description: `Successfully converted deal to Project ${newProject.referenceId} (${newProject.title})`,
  });

  await saveDatabaseAsync(db);
  return { lead, project: newProject };
}

/* ==================== CRM SETTINGS ==================== */

export function getCrmSettings(): CrmSettings {
  const db = loadDatabase();
  return db.crmSettings || getInitialSeedData().crmSettings;
}

export async function getCrmSettingsAsync(): Promise<CrmSettings> {
  const db = await loadDatabaseAsync();
  return db.crmSettings || getInitialSeedData().crmSettings;
}

export async function updateCrmSettingsAsync(settings: Partial<CrmSettings>): Promise<CrmSettings> {
  const db = await loadDatabaseAsync();
  db.crmSettings = {
    ...db.crmSettings,
    ...settings,
  };
  await saveDatabaseAsync(db);
  return db.crmSettings;
}

/* ==================== CRM STATS & REPORTING ==================== */

export async function getCrmStatsAsync(): Promise<Record<string, any>> {
  const db = await loadDatabaseAsync();
  const leads = db.leads || [];
  const projects = db.projects || [];

  const totalLeads = leads.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const newLeadsToday = leads.filter((l) => l.createdAt.startsWith(todayStr)).length;
  const unassignedLeads = leads.filter((l) => !l.assignedExecutive || l.assignedExecutive === 'Unassigned').length;

  const closedWon = leads.filter((l) => l.status === 'closed_won' || l.currentStage === 'closed_won');
  const closedLost = leads.filter((l) => l.status === 'closed_lost' || l.currentStage === 'closed_lost');
  const openLeads = leads.filter((l) => l.status === 'open');

  const wonRevenue = closedWon.reduce((acc, l) => acc + (l.finalWonRevenue || l.estimatedDealValue || 0), 0);
  const totalPipelineValue = openLeads.reduce((acc, l) => acc + (l.estimatedDealValue || 0), 0);

  const decidedCount = closedWon.length + closedLost.length;
  const conversionRate = decidedCount > 0 ? Math.round((closedWon.length / decidedCount) * 100) : 0;

  const leadsByStage: Record<string, number> = {
    prospecting: leads.filter((l) => l.currentStage === 'prospecting').length,
    qualification: leads.filter((l) => l.currentStage === 'qualification').length,
    need_analysis: leads.filter((l) => l.currentStage === 'need_analysis').length,
    value_proposition: leads.filter((l) => l.currentStage === 'value_proposition').length,
    decision_makers: leads.filter((l) => l.currentStage === 'decision_makers').length,
    negotiation: leads.filter((l) => l.currentStage === 'negotiation').length,
    closed_won: closedWon.length,
    closed_lost: closedLost.length,
  };

  const leadsBySource: Record<string, number> = {};
  leads.forEach((l) => {
    leadsBySource[l.source] = (leadsBySource[l.source] || 0) + 1;
  });

  return {
    totalLeads,
    newLeadsToday,
    unassignedLeads,
    openLeadsCount: openLeads.length,
    closedWonCount: closedWon.length,
    closedLostCount: closedLost.length,
    totalPipelineValue,
    wonRevenue,
    conversionRate,
    leadsByStage,
    leadsBySource,
    qualificationPending: leads.filter((l) => l.currentStage === 'prospecting' || l.currentStage === 'qualification').length,
    proposalsSubmitted: leads.filter((l) => l.currentStage === 'value_proposition' || l.currentStage === 'decision_makers').length,
    negotiationsInProgress: leads.filter((l) => l.currentStage === 'negotiation').length,
    activeProjectsCount: projects.filter((p) => p.status !== 'completed').length,
    totalProjectsCount: projects.length,
    recentLeads: leads.slice(0, 5),
  };
}


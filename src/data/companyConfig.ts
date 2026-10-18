/**
 * FarmCare 360° — Authoritative Brand & Business Configuration
 * Where real business details are pending client verification, configurable placeholders are provided.
 */

export interface CompanyConfig {
  brandName: string;
  legalEntityName: string;
  tagline: string;
  primaryIdentity: string;
  coreMessage: string;
  supportingMessage: string;
  philosophy: string;
  contact: {
    // Configurable placeholders clearly identified
    phoneDisplay: string;
    phoneRaw: string;
    isPhoneVerified: boolean;
    email: string;
    isEmailVerified: boolean;
    whatsappNumber: string | null;
    isWhatsappVerified: boolean;
    serviceRegions: string[];
    headquartersPlaceholder: string;
    operationalHours: string;
  };
  navigation: {
    main: Array<{ label: string; href: string; badge?: string }>;
    serviceCategories: Array<{ label: string; href: string; description: string }>;
  };
  socialLinks: Array<{ platform: string; url: string; isConfigured: boolean }>;
}

export const companyConfig: CompanyConfig = {
  brandName: 'FarmCare 360°',
  legalEntityName: 'FarmCare 360° Solutions Private Limited [Configurable Placeholder]',
  tagline: 'Complete Agricultural Solutions',
  primaryIdentity: 'Comprehensive care for land, farms, gardens, and agricultural projects.',
  coreMessage: 'Your land. Our care. Every step.',
  supportingMessage: 'Plan. Develop. Protect. Grow. Harvest.',
  philosophy: 'Healthy land, brighter tomorrows.',
  contact: {
    phoneDisplay: '+91 (0) 800-FARMCARE [Pending Verification]',
    phoneRaw: '',
    isPhoneVerified: false, // Set to true once client provides verified business telephone
    email: 'contact@farmcare360.com [Configurable Placeholder]',
    isEmailVerified: false,
    whatsappNumber: null, // Disabled until verified business number is supplied per rules
    isWhatsappVerified: false,
    serviceRegions: [
      'Bangalore & Surrounding Rural Districts',
      'Hyderabad & Deccan Agricultural Belts',
      'Select Farm Clusters across South India',
    ],
    headquartersPlaceholder: 'FarmCare Hub, Agricultural Services Center [Location to be confirmed with client]',
    operationalHours: 'Monday – Saturday: 8:00 AM – 6:30 PM IST',
  },
  navigation: {
    main: [
      { label: 'Home', href: '/' },
      { label: 'Our Services', href: '/services' },
      { label: 'Managed Care', href: '/managed-care' },
      { label: 'For Landowners', href: '/landowners' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    serviceCategories: [
      {
        label: 'One-Time Services',
        href: '/services#one-time',
        description: 'Single-engagement setups, soil testing, fencing, and infrastructure installation.',
      },
      {
        label: 'Managed Care',
        href: '/managed-care',
        description: 'Year-round and seasonal stewardship for farms, orchards, vacant sites, and gardens.',
      },
      {
        label: 'Landowner Partnerships',
        href: '/landowners',
        description: 'Direct agricultural leasing, operator matchmaking, and productive land management.',
      },
    ],
  },
  socialLinks: [
    // Verified official links only. Per instructions: "Social links only when official profiles are provided."
  ],
};

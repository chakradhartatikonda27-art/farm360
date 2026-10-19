import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { FloatingWhatsApp } from '@/components/common/FloatingWhatsApp';
import { companyConfig } from '@/data/companyConfig';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#064B35' },
    { media: '(prefers-color-scheme: dark)', color: '#033D2B' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://farmcare360.com'),
  title: `${companyConfig.brandName} — ${companyConfig.tagline}`,
  description: 'Comprehensive care for land, farms, gardens, and agricultural projects across India. Plan, develop, protect, grow, and harvest with expert agronomic stewardship.',
  keywords: [
    'agricultural services',
    'farm management',
    'terrace garden setup',
    'land cleaning levelling',
    'drip irrigation installation',
    'farm fencing boundary',
    'soil testing agriculture',
    'high density orchard setup',
    'agricultural leasing India',
    'vacant plot maintenance',
  ],
  authors: [{ name: companyConfig.brandName }],
  creator: companyConfig.brandName,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://farmcare360.com',
    title: `${companyConfig.brandName} — ${companyConfig.tagline}`,
    description: companyConfig.primaryIdentity,
    siteName: companyConfig.brandName,
    images: [
      {
        url: '/images/hero/hero-terrace-farm.jpg',
        width: 1200,
        height: 630,
        alt: `${companyConfig.brandName} — Complete Agricultural Solutions`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${companyConfig.brandName} — ${companyConfig.tagline}`,
    description: companyConfig.coreMessage,
    images: ['/images/hero/hero-terrace-farm.jpg'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: companyConfig.brandName,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: companyConfig.brandName,
    description: companyConfig.primaryIdentity,
    slogan: companyConfig.tagline,
    telephone: companyConfig.contact.phoneRaw || undefined,
    email: companyConfig.contact.email,
    url: 'https://farmcare360.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: 'Karnataka & Telangana',
    },
    areaServed: companyConfig.contact.serviceRegions,
    sameAs: companyConfig.socialLinks.map((s) => s.url),
    knowsAbout: [
      'Agricultural Land Planning',
      'Orchard Establishment',
      'Micro-Irrigation Systems',
      'Terrace Garden Setup',
      'Farmland Leasing',
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body 
        className="bg-ivory text-charcoal min-h-screen flex flex-col font-sans selection:bg-forest selection:text-ivory"
        suppressHydrationWarning
      >
        <SiteHeader />
        <main className="flex-1 w-full">{children}</main>
        <SiteFooter />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { TestimonialsView } from '@/components/testimonials/TestimonialsView';
import { WhatsAppIcon } from '@/components/common/FloatingWhatsApp';
import { companyConfig } from '@/data/companyConfig';

export const metadata: Metadata = {
  title: `Client Testimonials | ${companyConfig.brandName} — Verified Reviews & Case Studies`,
  description:
    'Read verified reviews and agricultural case studies from orchard owners, NRI landowners, terrace gardeners, and estate managers partnering with FarmCare 360°.',
  openGraph: {
    title: `Client Testimonials | ${companyConfig.brandName}`,
    description:
      'Verified agricultural outcomes, orchard yields, and land protection stories from landowners across India.',
  },
};

export default function TestimonialsPage() {
  return (
    <div className="w-full bg-ivory">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-charcoal/10 py-3.5 px-5 bg-cream/40">
        <div className="max-w-[1280px] mx-auto">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Client Testimonials' }]} />
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="pt-12 sm:pt-16 pb-8 bg-cream/30 border-b border-charcoal/10">
        <div className="max-w-[1280px] mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase mx-auto mb-3">
            <span>Client Experiences & Outcomes</span>
            <span className="w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h1 className="font-serif text-forest-deep text-[clamp(2.4rem,5.2vw,4.5rem)] font-normal leading-[1.05] tracking-tight max-w-[20em] mx-auto">
            Real land. Real results. Trusted agricultural stewardship.
          </h1>
          <p className="mt-4 text-[17px] sm:text-[18px] text-charcoal/80 max-w-[34em] mx-auto font-sans font-light leading-relaxed">
            Discover how orchard owners, non-resident landowners, and urban gardeners rely on our end-to-end care to make their land healthy and productive.
          </p>
        </div>
      </section>

      {/* Main Testimonials Section */}
      <main className="py-12 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-5">
          <TestimonialsView />
        </div>
      </main>

      {/* Conversion Banner Section */}
      <section className="bg-forest-dark text-white py-14 border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
              Ready to experience dedicated care for your property?
            </h2>
            <p className="text-white/80 text-sm sm:text-base max-w-[34em]">
              Connect with an agronomic specialist today to discuss one-time setups or recurring managed care.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href="https://wa.me/919876543210?text=Hello%20FarmCare%20360%C2%B0%2C%20I%20would%20like%20to%20discuss%20my%20property%20requirements."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-sans font-semibold text-sm transition-all shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>WhatsApp Us</span>
            </a>
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-8 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-sm transition-all shadow-sm"
            >
              Plan a Consultation →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

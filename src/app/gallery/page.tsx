import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { companyConfig } from '@/data/companyConfig';

export const metadata: Metadata = {
  title: `Photo Gallery | ${companyConfig.brandName} — Agricultural Transformations`,
  description:
    'Explore high-resolution visual blueprints, orchard setups, terrace gardens, drip irrigation systems, and perimeter fencing projects across India.',
  openGraph: {
    title: `Photo Gallery | ${companyConfig.brandName}`,
    description:
      'Curated field blueprints, fruit orchards, terrace gardens, and modern agricultural engineering projects.',
    images: ['/images/services/card-managed-orchard.jpg'],
  },
};

export default function GalleryPage() {
  return (
    <div className="w-full bg-ivory">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-charcoal/10 py-3.5 px-5 bg-cream/40">
        <div className="max-w-[1280px] mx-auto">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Photo Gallery' }]} />
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="pt-12 sm:pt-16 pb-8 bg-cream/30 border-b border-charcoal/10">
        <div className="max-w-[1280px] mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase mx-auto mb-3">
            <span>Visual Blueprints & Execution</span>
            <span className="w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h1 className="font-serif text-forest-deep text-[clamp(2.4rem,5.2vw,4.5rem)] font-normal leading-[1.05] tracking-tight max-w-[20em] mx-auto">
            Possibilities start with a scientific plan.
          </h1>
          <p className="mt-4 text-[17px] sm:text-[18px] text-charcoal/80 max-w-[34em] mx-auto font-sans font-light leading-relaxed">
            From barren acreage to flourishing high-density orchards and urban rooftop food forests. Explore how we plan, develop, and protect agricultural spaces.
          </p>
        </div>
      </section>

      {/* Main Interactive Grid Section */}
      <main className="py-12 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-5">
          <GalleryGrid />
        </div>
      </main>

      {/* Call to Action Section */}
      <section className="bg-forest-dark text-white py-14 border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
              Have a piece of land waiting for transformation?
            </h2>
            <p className="text-white/80 text-sm sm:text-base max-w-[32em]">
              Tell us your acreage, soil type, and aspirations. We will craft a bespoke agronomic blueprint.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center min-h-[48px] px-8 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-sm transition-all shadow-sm"
          >
            Plan a Consultation →
          </Link>
        </div>
      </section>
    </div>
  );
}

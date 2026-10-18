import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import referencePagesRaw from '@/data/referencePages.json';
import { FAQAccordion } from '@/components/common/FAQAccordion';

interface ReferencePageData {
  id: string;
  h1: string;
  eyebrow: string;
  lead: string;
  tag?: string;
  challenge: string;
  benefits: string[];
  whatsIncluded: string[];
  steps: Array<{ step: string; title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ slug: string; title: string; description: string }>;
}

const referencePages = referencePagesRaw as Record<string, ReferencePageData>;

const LANDOWNER_IMAGES: Record<string, string> = {
  'landowner-enquiries': '/images/landowners/lease-directly.jpg',
  'farm-leasing-operator-partnerships': '/images/landowners/lease-partner.jpg',
  'agricultural-project-enquiries': '/images/landowners/future-project-participation.jpg',
};

const LANDOWNER_ALIASES: Record<string, string> = {
  'landowner-enquiries': 'p-landowner-enquiries',
  'agricultural-landowner-enquiries': 'p-landowner-enquiries',
  'farm-leasing-operator-partnerships': 'p-farm-leasing-operator-partnerships',
  'agricultural-project-enquiries': 'p-agricultural-project-enquiries',
};

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(LANDOWNER_ALIASES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pageId = LANDOWNER_ALIASES[params.slug] || `p-${params.slug}`;
  const data = referencePages[pageId];
  if (!data) return { title: 'Landowner Service Not Found | FarmCare 360°' };

  return {
    title: `${data.h1.replace(/&amp;/g, '&')} | For Landowners | FarmCare 360°`,
    description: data.lead,
  };
}

export default function LandownerDetailPage({ params }: Props) {
  const pageId = LANDOWNER_ALIASES[params.slug] || `p-${params.slug}`;
  const data = referencePages[pageId];

  if (!data) {
    notFound();
  }

  const canonicalSlug = pageId.replace('p-', '');
  const imageSrc = LANDOWNER_IMAGES[canonicalSlug] || '/images/landowners/lease-directly.jpg';

  return (
    <div className="w-full bg-ivory">
      {/* 1. Page Hero Banner with Dark Evergreen Background */}
      <section className="relative text-white bg-forest-dark isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
          <Image
            src={imageSrc}
            alt={data.h1.replace(/&amp;/g, '&')}
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-dark via-forest-dark/75 to-forest-dark/40" />

        <div className="max-w-[1280px] mx-auto px-5 pt-8 pb-14 sm:pb-20">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-10 sm:mb-16">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/80 font-sans">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/landowners" className="hover:text-gold transition-colors">
                  For Landowners
                </Link>
              </li>
              <li>/</li>
              <li aria-current="page" className="text-white font-medium">
                {data.h1.replace(/&amp;/g, '&')}
              </li>
            </ol>
          </nav>

          <p className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase mb-3">
            <span>{data.eyebrow}</span>
            <span className="w-10 h-[1px] bg-gold inline-block" />
          </p>

          <h1 className="font-serif text-white font-normal text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1.05] tracking-tight my-4 max-w-[14em] text-balance">
            {data.h1.replace(/&amp;/g, '&')}
          </h1>

          <p className="text-[18px] sm:text-[20px] text-white/90 font-light max-w-[32em] leading-relaxed font-sans mt-3">
            {data.lead}
          </p>

          {data.tag && (
            <span className="inline-block mt-4 text-xs font-semibold px-3 py-1 rounded-full bg-white/15 text-gold border border-gold/30">
              {data.tag}
            </span>
          )}
        </div>
      </section>

      {/* 2. Challenge & Benefits (Split Layout) */}
      <section className="py-16 sm:py-24">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 sm:gap-12 lg:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase mb-4">
                <span>The challenge</span>
                <span className="w-10 h-[1px] bg-gold inline-block" />
              </div>
              <p className="text-[18px] sm:text-[20px] text-charcoal/90 leading-relaxed font-sans font-normal">
                {data.challenge}
              </p>
            </div>

            <div>
              <h2 className="font-serif text-forest-deep text-[28px] sm:text-[30px] font-normal mb-2">
                Benefits
              </h2>
              <ul className="divide-y divide-charcoal/10">
                {data.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-3 py-3 text-[16px] text-charcoal/85">
                    <span className="text-gold text-xs">◆</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What's Included (Cream Surface with Photo) */}
      <section className="py-16 sm:py-24 bg-cream">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-serif text-forest-deep text-[clamp(2rem,3.4vw,2.8rem)] font-normal leading-[1.05] mb-4">
                What&apos;s included
              </h2>
              <ul className="divide-y divide-charcoal/10">
                {data.whatsIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 py-3 text-[16px] text-charcoal/85">
                    <span className="text-gold text-xs">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[14px] text-charcoal/65 font-sans">
                Scope, timing and pricing are agreed after assessment.
              </p>
            </div>

            <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden bg-cream-dark shadow-soft">
              <Image
                src={imageSrc}
                alt={data.h1.replace(/&amp;/g, '&')}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works (3 Numbered Steps) */}
      <section className="py-16 sm:py-24">
        <div className="max-w-[1280px] mx-auto px-5">
          <h2 className="font-serif text-forest-deep text-[clamp(2rem,3.6vw,3rem)] font-normal mb-8">
            How it works
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-6 list-none p-0 m-0">
            {data.steps.map((step, idx) => (
              <li key={idx} className="border-t border-gold pt-5 space-y-2">
                <b className="font-serif text-[38px] text-gold font-normal block leading-none">
                  {step.step}
                </b>
                <h3 className="font-serif text-[24px] text-forest-deep font-normal pt-1">
                  {step.title}
                </h3>
                <p className="font-sans text-[14.5px] text-charcoal/75 leading-relaxed">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Frequently Asked Questions */}
      {data.faqs && data.faqs.length > 0 && (
        <section className="py-16 sm:py-24 bg-cream">
          <div className="max-w-[1280px] mx-auto px-5">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 sm:gap-12 items-start">
              <h2 className="font-serif text-forest-deep text-[clamp(2rem,3.6vw,3rem)] font-normal leading-[1.1]">
                Frequently asked questions
              </h2>
              <div className="bg-white/60 rounded-xl p-5 border border-charcoal/10">
                <FAQAccordion items={data.faqs} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Plan a Consultation CTA Banner */}
      <section className="bg-forest-dark text-white py-16">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="flex flex-wrap gap-7 items-center justify-between">
            <div className="max-w-[34em] space-y-3.5">
              <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
                <span>Plan a consultation</span>
                <span className="w-10 h-[1px] bg-gold inline-block" />
              </div>
              <h2 className="font-serif text-white text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.08] tracking-tight">
                Interested in {data.h1.toLowerCase().replace(/&amp;/g, '&')}?
              </h2>
              <p className="text-[17px] sm:text-[18px] text-white/80 leading-relaxed font-sans">
                Share your location, your plans, and the kind of support you are looking for. Our team can help you explore the next steps.
              </p>
            </div>

            <div className="w-full sm:w-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[50px] px-8 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-[15px] transition-all shadow-sm text-center"
              >
                Request a Consultation →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

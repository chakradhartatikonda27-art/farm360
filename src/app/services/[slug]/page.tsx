import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import referencePagesRaw from '@/data/referencePages.json';
import { FAQAccordion } from '@/components/common/FAQAccordion';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

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

// Canonical slug to image mapping
const SERVICE_IMAGES: Record<string, string> = {
  'land-cleaning-levelling': '/images/services/grid-land-cleaning.jpg',
  'farm-land-planning': '/images/services/card-land-design.jpg',
  'land-preparation': '/images/services/brochure-tractor.jpg',
  'fencing-boundary-protection': '/images/services/feat-fencing-boundary.jpg',
  'borewell-coordination': '/images/services/grid-borewell-coordination.jpg',
  'drip-irrigation-sprinklers': '/images/services/grid-drip-sprinkler.jpg',
  'soil-water-testing': '/images/services/grid-soil-water-testing.jpg',
  'planting-orchard-setup': '/images/services/grid-planting-orchard.jpg',
  'pruning-tree-care': '/images/services/grid-pruning-treecare.jpg',
  'farm-electrical-work': '/images/services/grid-electrical-work.jpg',
  'one-time-harvest-support': '/images/services/grid-one-time-harvest.jpg',
  'kitchen-gardens-landscaping': '/images/services/grid-kitchen-gardens.jpg',
  'construction-development-coordination': '/images/services/grid-agri-construction.jpg',
};

// Aliases mapping old or variant URLs to canonical IDs
const ALIASES: Record<string, string> = {
  'land-cleaning-and-levelling': 'p-land-cleaning-levelling',
  'land-cleaning-levelling': 'p-land-cleaning-levelling',
  'farm-and-land-planning': 'p-farm-land-planning',
  'farm-land-planning': 'p-farm-land-planning',
  'land-preparation': 'p-land-preparation',
  'fencing-and-boundary-protection': 'p-fencing-boundary-protection',
  'fencing-boundary-protection': 'p-fencing-boundary-protection',
  'borewell-coordination': 'p-borewell-coordination',
  'drip-and-sprinkler-installation': 'p-drip-irrigation-sprinklers',
  'drip-irrigation-sprinklers': 'p-drip-irrigation-sprinklers',
  'soil-and-water-testing': 'p-soil-water-testing',
  'soil-water-testing': 'p-soil-water-testing',
  'planting-and-orchard-setup': 'p-planting-orchard-setup',
  'planting-orchard-setup': 'p-planting-orchard-setup',
  'pruning-and-tree-care': 'p-pruning-tree-care',
  'pruning-tree-care': 'p-pruning-tree-care',
  'farm-electrical-work': 'p-farm-electrical-work',
  'one-time-harvest-support': 'p-one-time-harvest-support',
  'kitchen-gardens-and-landscaping': 'p-kitchen-gardens-landscaping',
  'kitchen-gardens-landscaping': 'p-kitchen-gardens-landscaping',
  'agricultural-construction': 'p-construction-development-coordination',
  'construction-development-coordination': 'p-construction-development-coordination',
};

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(ALIASES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pageId = ALIASES[params.slug] || `p-${params.slug}`;
  const data = referencePages[pageId];
  if (!data) return { title: 'Service Not Found | FarmCare 360°' };

  return {
    title: `${data.h1.replace(/&amp;/g, '&')} | FarmCare 360°`,
    description: data.lead,
  };
}

export default function ServiceDetailPage({ params }: Props) {
  const pageId = ALIASES[params.slug] || `p-${params.slug}`;
  const data = referencePages[pageId];

  if (!data) {
    notFound();
  }

  const canonicalSlug = pageId.replace('p-', '');
  const imageSrc = SERVICE_IMAGES[canonicalSlug] || '/images/hero/hero-terrace-farm.jpg';

  return (
    <div className="w-full bg-ivory">
      {/* 1. Page Hero Banner with Dark Evergreen Background */}
      <section className="relative text-white bg-forest-dark isolate overflow-hidden">
        {/* Subtle photo background with deep green overlay */}
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
                <Link href="/services" className="hover:text-gold transition-colors">
                  Our Services
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

      {/* 6. Related Services */}
      {data.related && data.related.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="max-w-[1280px] mx-auto px-5">
            <h2 className="font-serif text-forest-deep text-[2.2rem] font-normal mb-7">
              Related services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.related.map((rel, idx) => {
                const relImg = SERVICE_IMAGES[rel.slug] || '/images/services/grid-land-cleaning.jpg';
                return (
                  <Link
                    key={idx}
                    href={`/services/${rel.slug}`}
                    className="group flex flex-col bg-white/60 border border-charcoal/10 rounded-xl overflow-hidden hover:border-gold hover:shadow-soft transition-all duration-300"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                      <Image
                        src={relImg}
                        alt={rel.title.replace(/&amp;/g, '&')}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-5 flex flex-col gap-2 flex-1">
                      <h3 className="font-serif text-[24px] text-forest-deep leading-snug group-hover:text-botanical transition-colors">
                        {rel.title.replace(/&amp;/g, '&')}
                      </h3>
                      <p className="text-[14.5px] text-charcoal/70 leading-relaxed font-sans">
                        {rel.description}
                      </p>
                      <span className="mt-auto pt-3 text-[14px] font-semibold text-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Learn more →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7. Plan a Consultation CTA Banner */}
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

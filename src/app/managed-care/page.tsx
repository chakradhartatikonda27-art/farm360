'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

export default function ManagedCarePage() {
  const managedServices = [
    {
      title: 'Managed farms & orchards',
      description: 'Ongoing care for productive land.',
      href: '/managed-care/managed-farms-orchards',
      image: '/images/managed/cat-managed-farms.jpg',
    },
    {
      title: 'Vacant-land upkeep',
      description: 'Keep an unused plot clean, visible and cared for.',
      href: '/managed-care/vacant-land-upkeep',
      image: '/images/managed/cat-vacant-site.jpg',
    },
    {
      title: 'Farmhouse garden care',
      description: 'Landscape and lawn care for farmhouses and weekend homes.',
      href: '/managed-care/farmhouse-garden-care',
      image: '/images/managed/cat-farmhouse-landscape.jpg',
    },
    {
      title: 'Terrace garden maintenance',
      description: 'Scheduled care so your terrace stays green.',
      href: '/managed-care/terrace-garden-maintenance',
      image: '/images/managed/cat-terrace-gardens.jpg',
    },
    {
      title: 'Seasonal planting & upkeep',
      description: 'Plan and grow what suits your space and the season.',
      href: '/managed-care/seasonal-planting-upkeep',
      image: '/images/managed/plot-after.jpg',
    },
    {
      title: 'Harvest assistance',
      description: 'Support through each harvest, including surplus.',
      href: '/managed-care/harvest-assistance',
      image: '/images/managed/harvest-surplus-basket.jpg',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Share your space',
      description: 'Tell us about the land or garden and what you want from it.',
    },
    {
      number: '02',
      title: 'Site assessment',
      description: 'We visit and note what care it needs.',
    },
    {
      number: '03',
      title: 'Agreed plan',
      description: 'Visit frequency, scope and pricing are set out for your approval.',
    },
  ];

  return (
    <div className="w-full bg-ivory">
      {/* Breadcrumbs */}
      <div className="border-b border-charcoal/10 py-3.5 px-5 bg-cream/40">
        <div className="max-w-[1280px] mx-auto">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Managed Care' }]} />
        </div>
      </div>

      {/* Header Intro (Split Layout) */}
      <section className="py-14 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
                <span>Managed care</span>
                <span className="w-10 h-[1px] bg-gold inline-block" />
              </div>
              <h1 className="font-serif text-forest-deep text-[clamp(2.2rem,4.8vw,3.6rem)] font-normal leading-[1.05] tracking-tight">
                Your space, cared for. Season after season.
              </h1>
              <p className="text-[17px] sm:text-[18px] text-charcoal/80 leading-relaxed font-sans">
                Ongoing care for farms, orchards, small plots, vacant land and gardens. Frequency and scope are agreed with each customer.
              </p>
            </div>

            <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden bg-forest shadow-soft">
              <Image
                src="/images/managed/cat-managed-farms.jpg"
                alt="Managed farm rows"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6 Cards Grid */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {managedServices.map((card, idx) => (
              <Link
                key={idx}
                href={card.href}
                className="group flex flex-col bg-white/60 border border-charcoal/10 rounded-xl overflow-hidden hover:border-gold hover:shadow-soft transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3 className="font-serif text-[24px] text-forest-deep leading-snug group-hover:text-botanical transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[14.5px] text-charcoal/70 leading-relaxed font-sans">
                    {card.description}
                  </p>
                  <span className="mt-auto pt-3 text-[14px] font-semibold text-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How Managed Care Begins (Cream Section) */}
      <section className="py-16 sm:py-24 bg-cream border-t border-charcoal/10">
        <div className="max-w-[1280px] mx-auto px-5">
          <h2 className="font-serif text-forest-deep text-[clamp(2rem,3.6vw,3rem)] font-normal mb-8">
            How managed care begins
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-6 list-none p-0 m-0">
            {steps.map((step, idx) => (
              <li key={idx} className="border-t border-gold pt-5 space-y-2">
                <b className="font-serif text-[38px] text-gold font-normal block leading-none">
                  {step.number}
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

      {/* Plan a Consultation CTA Banner */}
      <section className="bg-forest-dark text-white py-16">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="flex flex-wrap gap-7 items-center justify-between">
            <div className="max-w-[34em] space-y-3.5">
              <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
                <span>Plan a consultation</span>
                <span className="w-10 h-[1px] bg-gold inline-block" />
              </div>
              <h2 className="font-serif text-white text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.08] tracking-tight">
                Plan your care.
              </h2>
              <p className="text-[17px] sm:text-[18px] text-white/80 leading-relaxed font-sans">
                Share your location, your plans, and the kind of support you are looking for. Our team can help you explore the next steps.
              </p>
            </div>

            <div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center min-h-[48px] px-8 rounded-full bg-gold hover:bg-[#D4B66B] text-forest-deep font-sans font-semibold text-[15px] transition-colors shadow-sm"
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

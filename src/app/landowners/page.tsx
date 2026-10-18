'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

export default function LandownersPage() {
  const landownerServices = [
    {
      title: 'Agricultural landowner enquiries',
      description: 'Tell us about your land and what you are considering.',
      href: '/landowners/landowner-enquiries',
      image: '/images/landowners/lease-directly.jpg',
    },
    {
      title: 'Farm leasing & operator partnerships',
      description: 'Direct leasing or an introduction to a suitable operator, where offered.',
      href: '/landowners/farm-leasing-operator-partnerships',
      image: '/images/landowners/lease-partner.jpg',
    },
    {
      title: 'Agricultural project enquiries',
      description: 'Discuss an agricultural project involving your land.',
      href: '/landowners/agricultural-project-enquiries',
      image: '/images/landowners/future-project-participation.jpg',
    },
  ];

  return (
    <div className="w-full bg-ivory">
      {/* Breadcrumbs */}
      <div className="border-b border-charcoal/10 py-3.5 px-5 bg-cream/40">
        <div className="max-w-[1280px] mx-auto">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'For Landowners' }]} />
        </div>
      </div>

      {/* Header Intro */}
      <section className="pt-14 pb-8 sm:pt-20 sm:pb-12">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="space-y-3.5 max-w-[42em]">
            <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
              <span>For landowners</span>
              <span className="w-10 h-[1px] bg-gold inline-block" />
            </div>
            <h1 className="font-serif text-forest-deep text-[clamp(2.2rem,4.8vw,3.6rem)] font-normal leading-[1.05] tracking-tight">
              Your land. The right arrangement.
            </h1>
            <p className="text-[17px] sm:text-[18px] text-charcoal/80 leading-relaxed font-sans">
              We assess your land and discuss the options that may suit it. Structure, term and responsibilities are agreed after assessment.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Main Cards */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {landownerServices.map((card, idx) => (
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

          {/* Transparent Notice Box with Gold Border */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-9 border border-gold rounded-[14px] p-6 bg-white/40 text-charcoal/90 font-sans text-[15px] leading-relaxed">
            <p>
              <strong className="text-forest-deep font-semibold">What we do not promise.</strong> We do not guarantee lease income, buyers or investment returns.
            </p>
            <p>
              <strong className="text-forest-deep font-semibold">Coming later.</strong> Land selling and farm project participation are planned services and are not available yet.
            </p>
          </div>

          {/* 2 Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
            <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden bg-forest">
              <Image
                src="/images/landowners/future-land-selling.jpg"
                alt="Farmland review with landowner"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden bg-forest">
              <Image
                src="/images/landowners/future-project-participation.jpg"
                alt="Orchard land assessment"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          </div>
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
                Discuss your land.
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

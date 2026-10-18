'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function LandownersPreview() {
  return (
    <section className="py-16 sm:py-24 bg-forest-dark text-white">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Section Header */}
        <div className="space-y-3.5 max-w-[42em]">
          <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
            <span>For landowners</span>
            <span className="w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h2 className="font-serif text-white text-[clamp(2rem,4.6vw,3.5rem)] font-normal leading-[1.05] tracking-tight">
            Your land. The right arrangement.
          </h2>
          <p className="text-[17px] sm:text-[18px] text-white/80 leading-relaxed font-sans">
            Direct farm or land leasing, landowner and operator introductions, project discussions, and property assessment, subject to assessment and availability.
          </p>
        </div>

        {/* 2 Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
          <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden bg-forest">
            <Image
              src="/images/landowners/lease-directly.jpg"
              alt="FarmCare team member discussing land with a landowner"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden bg-forest">
            <Image
              src="/images/landowners/lease-partner.jpg"
              alt="Team reviewing plans on a tablet in the field"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8">
          <Link
            href="/landowners"
            className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-full bg-gold hover:bg-[#D4B66B] text-forest-deep font-sans font-semibold text-[15px] transition-colors shadow-sm"
          >
            Discuss Your Land
          </Link>
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { BeforeAfterSlider } from '../common/BeforeAfterSlider';

export function ManagedCarePreview() {
  const tickItems = [
    'Farms and orchards',
    'Small agricultural plots',
    'Vacant land and site care',
    'Terrace and kitchen gardens',
    'Farmhouse and landscape gardens',
  ];

  return (
    <section className="py-16 sm:py-24 bg-ivory">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left: Interactive Before / After Comparison */}
          <div className="rounded-[14px] overflow-hidden bg-cream shadow-soft border border-charcoal/10">
            <BeforeAfterSlider
              beforeImage="/images/managed/plot-before.jpg"
              afterImage="/images/managed/plot-after.jpg"
              beforeLabel="Before"
              afterLabel="Possibilities after care"
            />
          </div>

          {/* Right: Editorial Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
              <span>Managed care</span>
              <span className="w-10 h-[1px] bg-gold inline-block" />
            </div>

            <h2 className="font-serif text-forest-deep text-[clamp(2rem,4.6vw,3.5rem)] font-normal leading-[1.05] tracking-tight">
              Your space, cared for. Season after season.
            </h2>

            <p className="text-[17px] sm:text-[18px] text-charcoal/80 leading-relaxed font-sans">
              Service frequency and scope are agreed with each customer.
            </p>

            {/* Diamond Ticks List */}
            <ul className="mt-5 space-y-0 divide-y divide-charcoal/10">
              {tickItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 py-3 text-base sm:text-[16.5px] text-charcoal/90 font-medium">
                  <span className="text-gold text-xs">◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                href="/managed-care"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[50px] px-8 rounded-full bg-forest hover:bg-forest-deep active:scale-[0.98] text-white font-sans font-semibold text-[15px] transition-all shadow-sm text-center"
              >
                Explore Managed Care
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

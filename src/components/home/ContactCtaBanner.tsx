'use client';

import React from 'react';
import Link from 'next/link';

export function ContactCtaBanner() {
  return (
    <section className="bg-forest-dark text-white py-16">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="flex flex-wrap gap-7 items-center justify-between">
          <div className="max-w-[34em] space-y-3.5">
            <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
              <span>Plan a consultation</span>
              <span className="w-10 h-[1px] bg-gold inline-block" />
            </div>
            <h2 className="font-serif text-white text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.08] tracking-tight">
              Tell us what your space needs.
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
  );
}

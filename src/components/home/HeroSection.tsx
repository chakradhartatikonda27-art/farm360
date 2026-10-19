'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] min-h-[580px] lg:min-h-[660px] bg-forest-dark text-white">
      {/* Editorial Content Column */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:pl-12 lg:pr-16 py-12 sm:py-16 lg:py-20 max-w-[760px] lg:ml-auto w-full order-2 lg:order-1">
        {/* Eyebrow with Gold Accent */}
        <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
          <span>Complete Agricultural Solutions</span>
          <span className="w-10 h-[1px] bg-gold inline-block" />
        </div>

        {/* Editorial Headline */}
        <h1 className="font-serif text-white font-normal text-[clamp(2.4rem,6.2vw,4.8rem)] leading-[1.03] tracking-tight my-4 sm:my-5 text-balance">
          Owning land is a privilege. <br />
          We make it productive.
        </h1>

        {/* Subcopy rooted in user vision */}
        <p className="text-[clamp(15px,1.6vw,18px)] text-white/90 leading-relaxed font-sans max-w-[34em] font-light">
          Many agricultural lands, open plots, and terraces remain idle, while people dream of farming and rural living. FarmCare360 bridges that gap through end-to-end management, agronomic science, and radical transparency.
        </p>

        {/* Dual Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mt-7 sm:mt-8 w-full sm:w-auto">
          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-7 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-[15px] transition-all shadow-sm text-center"
          >
            Explore Our 4 Models
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-7 rounded-full bg-transparent border-1.5 border-white text-white hover:bg-white/10 active:scale-[0.98] font-sans font-semibold text-[15px] transition-all text-center"
          >
            Discuss Your Land
          </Link>
        </div>

        {/* Trust badge link */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-white/80">
          <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
          <span>Our Customer Transparency Model: Zero unexplained bills</span>
          <Link href="/transparency" className="text-gold font-semibold hover:underline ml-1 inline-flex items-center gap-0.5">
            <span>Learn how</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Hero Photograph */}
      <div 
        className="relative min-h-[280px] sm:min-h-[380px] lg:min-h-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto w-full order-1 lg:order-2 overflow-hidden"
        role="img"
        aria-label="Terrace garden overlooking a green agricultural landscape"
      >
        <Image
          src="/images/hero/hero-terrace-farm.jpg"
          alt="Terrace garden overlooking a green agricultural landscape"
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-forest-dark/30 lg:to-transparent pointer-events-none" />
      </div>
    </section>
  );
}

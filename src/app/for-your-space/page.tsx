'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ArrowRight, ArrowUpRight, CheckCircle2, Compass } from 'lucide-react';
import { spacesWeServe } from '@/data/visionData';

export default function ForYourSpacePage() {
  const [activeTab, setActiveTab] = useState<string>(spacesWeServe[0].id);
  const currentSpace = spacesWeServe.find((s) => s.id === activeTab) || spacesWeServe[0];

  const feasibilityFactors = [
    { title: 'Property Size & Topography', desc: 'From 500 sq.ft. rooftops to 50+ acre agricultural holdings.' },
    { title: "Owner's Objectives", desc: 'Weekend retreat, commercial fruit harvest, or interim land preservation.' },
    { title: 'Water Availability', desc: 'Groundwater borewells, rainwater storage, municipal lines, or tanker supply.' },
    { title: 'Sunlight Exposure', desc: 'Full-day solar exposure for crops or filtered shade-tolerant plantings.' },
    { title: 'Soil & Drainage Profile', desc: 'Depth, pH balance, organic matter content, and natural gradient flow.' },
    { title: 'Budget & Practical Feasibility', desc: 'Phase-wise capital investment and sustainable operational maintenance.' },
  ];

  return (
    <div className="w-full bg-ivory">
      {/* Breadcrumbs */}
      <div className="border-b border-charcoal/10 py-3.5 px-4 sm:px-6 bg-cream/40">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'The Spaces We Serve' }]} />
          <span className="text-xs text-charcoal/50 uppercase tracking-widest hidden sm:inline">
            Four Core Property Categories
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="pt-10 sm:pt-16 pb-10 sm:pb-12 bg-cream/30 border-b border-charcoal/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2.5 text-gold text-[11px] sm:text-[11.5px] font-bold tracking-[0.2em] sm:tracking-[0.22em] uppercase mx-auto mb-2.5">
            <span>Tailored Agricultural Stewardship</span>
            <span className="w-8 sm:w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h1 className="font-serif text-forest-deep text-[clamp(2.1rem,5.5vw,4.5rem)] font-normal leading-[1.08] tracking-tight max-w-[22em] mx-auto text-balance">
            The types of land and spaces we serve.
          </h1>
          <p className="mt-3 sm:mt-4 text-[15px] sm:text-[17px] text-charcoal/80 max-w-[34em] mx-auto font-sans font-light leading-relaxed">
            FarmCare360 initially focuses on four distinct categories—from commercial acreage to residential rooftops—designed around your objectives and site feasibility.
          </p>
        </div>
      </section>

      {/* Main Interactive Tabs Section */}
      <section className="py-10 sm:py-16 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          
          {/* 4 Tabs Selector (2x2 on mobile, 4 columns on tablet/desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-8 sm:mb-10" role="tablist">
            {spacesWeServe.map((space) => {
              const isSelected = space.id === activeTab;
              return (
                <button
                  key={space.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveTab(space.id)}
                  className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between active:scale-[0.98] touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    isSelected
                      ? 'bg-forest text-ivory border-forest shadow-md'
                      : 'bg-white hover:bg-cream text-charcoal/80 border-charcoal/10 shadow-2xs'
                  }`}
                >
                  <span className="flex items-center justify-between w-full mb-2 sm:mb-3">
                    <span className={`font-mono text-xs font-bold ${isSelected ? 'text-gold' : 'text-charcoal/40'}`}>
                      {space.number}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-gold' : 'bg-charcoal/25'}`} />
                  </span>
                  <span className={`block font-serif text-[14px] sm:text-lg font-medium leading-tight ${isSelected ? 'text-white' : 'text-forest-deep'}`}>
                    {space.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Space Detail Panel */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-charcoal/10 overflow-hidden shadow-soft mb-12 sm:mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              
              {/* Image */}
              <div className="relative lg:col-span-5 aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto min-h-[220px] sm:min-h-[320px] lg:min-h-full bg-forest-dark overflow-hidden">
                <Image
                  src={currentSpace.image}
                  alt={currentSpace.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-forest-dark/30 to-transparent" />
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white space-y-0.5 sm:space-y-1">
                  <span className="text-[11px] uppercase tracking-widest text-gold font-bold">Category {currentSpace.number}</span>
                  <h3 className="font-serif text-xl sm:text-3xl font-medium">{currentSpace.title}</h3>
                  <p className="text-xs text-white/80">{currentSpace.subtitle}</p>
                </div>
              </div>

              {/* Text & Delivery Specs */}
              <div className="lg:col-span-7 p-5 sm:p-8 lg:p-11 flex flex-col justify-between space-y-5 sm:space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gold block mb-1">
                      Target Environment & Scope
                    </span>
                    <p className="text-[15px] sm:text-[17px] text-charcoal/90 leading-relaxed font-sans font-light">
                      {currentSpace.summary}
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-cream/50 border border-charcoal/10 text-xs sm:text-sm text-charcoal/80">
                    <strong className="text-forest-deep font-semibold">Ideal For: </strong>
                    <span>{currentSpace.idealFor}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
                    <div>
                      <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                        <span>Key Assessment Factors</span>
                      </h4>
                      <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13px] text-charcoal/80 font-sans">
                        {currentSpace.keyConsiderations.map((c, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-gold font-bold">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-botanical flex-shrink-0" />
                        <span>What FarmCare360 Delivers</span>
                      </h4>
                      <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13px] text-charcoal/80 font-sans">
                        {currentSpace.solutions.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-botanical flex-shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4 sm:pt-6 border-t border-charcoal/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                  <Link
                    href={currentSpace.href}
                    className="text-xs font-semibold text-forest hover:text-gold transition-colors inline-flex items-center justify-center sm:justify-start gap-1 touch-manipulation"
                  >
                    <span>View Related Managed Programs</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/contact"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[46px] px-6 rounded-full bg-forest text-ivory hover:bg-forest-dark font-sans font-semibold text-xs sm:text-sm transition-all active:scale-[0.98] shadow-xs touch-manipulation"
                  >
                    <span>Book Property Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Feasibility Framework Cards */}
          <div className="space-y-5 sm:space-y-6">
            <div className="text-center max-w-[36em] mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gold block mb-1">
                Our Assessment Methodology
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-forest-deep font-medium">
                Six factors we evaluate on every property.
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {feasibilityFactors.map((factor, idx) => (
                <div key={idx} className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-charcoal/10 shadow-2xs">
                  <span className="font-mono text-xs font-bold text-gold block mb-1">0{idx + 1}</span>
                  <h4 className="font-serif text-base text-forest-deep font-semibold mb-1">{factor.title}</h4>
                  <p className="text-xs text-charcoal/70 leading-relaxed font-sans">{factor.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-forest-dark text-white py-12 sm:py-14 border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
              Have questions about your specific plot or terrace?
            </h2>
            <p className="text-white/80 text-sm max-w-[32em]">
              Our agricultural consultants will evaluate your space and prepare a custom feasibility plan.
            </p>
          </div>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-8 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-sm transition-all shadow-sm touch-manipulation"
          >
            Request Free Assessment →
          </Link>
        </div>
      </section>
    </div>
  );
}

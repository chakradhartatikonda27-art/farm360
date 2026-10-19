'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ArrowRight, ArrowUpRight, CheckCircle2, Trees, Layers, Sprout, Home, Compass } from 'lucide-react';
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
      <div className="border-b border-charcoal/10 py-3.5 px-5 bg-cream/40">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'The Spaces We Serve' }]} />
          <span className="text-xs text-charcoal/50 uppercase tracking-widest hidden sm:inline">
            Four Core Property Categories
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="pt-12 sm:pt-16 pb-12 bg-cream/30 border-b border-charcoal/10">
        <div className="max-w-[1280px] mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase mx-auto mb-3">
            <span>Tailored Agricultural Stewardship</span>
            <span className="w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h1 className="font-serif text-forest-deep text-[clamp(2.4rem,5.2vw,4.5rem)] font-normal leading-[1.05] tracking-tight max-w-[22em] mx-auto">
            The types of land and spaces we serve.
          </h1>
          <p className="mt-4 text-[17px] sm:text-[18px] text-charcoal/80 max-w-[34em] mx-auto font-sans font-light leading-relaxed">
            FarmCare360 initially focuses on four distinct categories—from commercial acreage to residential rooftops—designed around your objectives and site feasibility.
          </p>
        </div>
      </section>

      {/* Main Interactive Tabs Section */}
      <section className="py-14 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-5">
          
          {/* 4 Tabs Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10" role="tablist">
            {spacesWeServe.map((space) => {
              const isSelected = space.id === activeTab;
              return (
                <button
                  key={space.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveTab(space.id)}
                  className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    isSelected
                      ? 'bg-forest text-ivory border-forest shadow-md scale-[1.02]'
                      : 'bg-white hover:bg-cream text-charcoal/80 border-charcoal/10 hover:border-gold/50 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className={`font-mono text-xs font-bold ${isSelected ? 'text-gold' : 'text-charcoal/40'}`}>
                      {space.number}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-gold' : 'bg-charcoal/20'}`} />
                  </div>
                  <h2 className={`font-serif text-base sm:text-lg font-medium leading-snug ${isSelected ? 'text-white' : 'text-forest-deep'}`}>
                    {space.title}
                  </h2>
                </button>
              );
            })}
          </div>

          {/* Active Space Detail Panel */}
          <div className="bg-white rounded-3xl border border-charcoal/10 overflow-hidden shadow-soft mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              
              {/* Image */}
              <div className="relative lg:col-span-5 min-h-[300px] sm:min-h-[400px] lg:min-h-full bg-forest-dark overflow-hidden">
                <Image
                  src={currentSpace.image}
                  alt={currentSpace.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-forest-dark/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-xs uppercase tracking-widest text-gold font-bold">Category {currentSpace.number}</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium">{currentSpace.title}</h3>
                  <p className="text-xs text-white/80">{currentSpace.subtitle}</p>
                </div>
              </div>

              {/* Text & Delivery Specs */}
              <div className="lg:col-span-7 p-6 sm:p-9 lg:p-11 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gold block mb-1">
                      Target Environment & Scope
                    </span>
                    <p className="text-[17px] sm:text-[18px] text-charcoal/90 leading-relaxed font-sans font-light">
                      {currentSpace.summary}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-cream/50 border border-charcoal/10 text-xs sm:text-sm text-charcoal/80">
                    <strong className="text-forest-deep font-semibold">Ideal For: </strong>
                    <span>{currentSpace.idealFor}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2.5 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-gold" />
                        <span>Key Assessment Factors</span>
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-[13px] text-charcoal/80 font-sans">
                        {currentSpace.keyConsiderations.map((c, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-gold font-bold">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-botanical" />
                        <span>What FarmCare360 Delivers</span>
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-[13px] text-charcoal/80 font-sans">
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

                <div className="pt-6 border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href={currentSpace.href}
                    className="text-xs font-semibold text-forest hover:text-gold transition-colors inline-flex items-center gap-1"
                  >
                    <span>View Related Managed Programs</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest text-ivory hover:bg-forest-dark font-sans font-semibold text-xs sm:text-sm transition-all active:scale-95 shadow-xs"
                  >
                    <span>Book Property Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Feasibility Framework Cards */}
          <div className="space-y-6">
            <div className="text-center max-w-[36em] mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-1">
                Our Assessment Methodology
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-forest-deep font-medium">
                Six factors we evaluate on every property.
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {feasibilityFactors.map((factor, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-charcoal/10 shadow-2xs">
                  <span className="font-mono text-xs font-bold text-gold block mb-1.5">0{idx + 1}</span>
                  <h4 className="font-serif text-base text-forest-deep font-semibold mb-1">{factor.title}</h4>
                  <p className="text-xs text-charcoal/70 leading-relaxed font-sans">{factor.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-forest-dark text-white py-14 border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
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
            className="inline-flex items-center justify-center min-h-[48px] px-8 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-sm transition-all shadow-sm"
          >
            Request Free Assessment →
          </Link>
        </div>
      </section>
    </div>
  );
}

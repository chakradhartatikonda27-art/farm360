'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Compass } from 'lucide-react';
import { spacesWeServe } from '@/data/visionData';

export function SpacesWeServeSection() {
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>(spacesWeServe[0].id);

  const activeSpace = spacesWeServe.find((s) => s.id === selectedSpaceId) || spacesWeServe[0];

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-ivory border-t border-charcoal/10" aria-labelledby="spaces-heading">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="max-w-[42em] space-y-2.5 sm:space-y-3.5 mb-8 sm:mb-12">
          <div className="flex items-center gap-2.5 text-gold text-[11px] sm:text-[11.5px] font-bold tracking-[0.2em] sm:tracking-[0.22em] uppercase">
            <span>The Spaces We Serve</span>
            <span className="w-8 sm:w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h2 id="spaces-heading" className="font-serif text-forest-deep text-[clamp(2rem,5.5vw,3.6rem)] font-normal leading-[1.08] tracking-tight text-balance">
            Tailored agricultural stewardship for every type of property.
          </h2>
          <p className="text-[15px] sm:text-[17px] text-charcoal/80 leading-relaxed font-sans font-light">
            Our approach depends on your property’s size, your objectives, water availability, sunlight, soil conditions, budget, and practical feasibility.
          </p>
        </div>

        {/* 4 Space Selector Pills (2x2 on mobile, 4 columns on tablet/desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5 mb-6 sm:mb-10" role="tablist" aria-label="Spaces we serve">
          {spacesWeServe.map((space) => {
            const isSelected = space.id === selectedSpaceId;
            return (
              <button
                key={space.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedSpaceId(space.id)}
                className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between min-h-[96px] sm:min-h-[120px] active:scale-[0.98] touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  isSelected
                    ? 'bg-forest text-ivory border-forest shadow-md'
                    : 'bg-white hover:bg-cream/60 text-charcoal/80 border-charcoal/10 shadow-2xs'
                }`}
              >
                <span className="flex items-center justify-between w-full">
                  <span className={`font-mono text-[11px] sm:text-xs font-bold tracking-widest ${isSelected ? 'text-gold' : 'text-charcoal/40'}`}>
                    {space.number}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-gold' : 'bg-charcoal/25'}`} />
                </span>
                <span className="block mt-2 sm:mt-3">
                  <span className={`block font-serif text-[14.5px] sm:text-lg font-medium leading-tight ${isSelected ? 'text-white' : 'text-forest-deep'}`}>
                    {space.title}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Space Detail Showcase */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-charcoal/10 overflow-hidden shadow-soft transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Image Column */}
            <div className="relative lg:col-span-5 aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto min-h-[220px] sm:min-h-[300px] lg:min-h-full bg-forest-dark overflow-hidden">
              <Image
                src={activeSpace.image}
                alt={activeSpace.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] uppercase tracking-widest text-gold font-bold">Space Category {activeSpace.number}</span>
                <h4 className="font-serif text-xl sm:text-2xl text-white font-medium">{activeSpace.title}</h4>
              </div>
            </div>

            {/* Details Content Column */}
            <div className="lg:col-span-7 p-5 sm:p-8 lg:p-11 flex flex-col justify-between space-y-5 sm:space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gold block mb-1">
                    {activeSpace.subtitle}
                  </span>
                  <p className="text-[15px] sm:text-[17px] text-charcoal/90 leading-relaxed font-sans">
                    {activeSpace.summary}
                  </p>
                </div>

                {/* Ideal For Callout */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-cream/50 border border-charcoal/10 text-xs sm:text-sm text-charcoal/80">
                  <strong className="text-forest-deep font-semibold">Ideal For: </strong>
                  <span>{activeSpace.idealFor}</span>
                </div>

                {/* Two Columns: Key Considerations & Solutions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
                  <div>
                    <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                      <span>Key Assessment Factors</span>
                    </h4>
                    <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13.5px] text-charcoal/80 font-sans">
                      {activeSpace.keyConsiderations.map((c, idx) => (
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
                      <span>What We Deliver</span>
                    </h4>
                    <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13.5px] text-charcoal/80 font-sans">
                      {activeSpace.solutions.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-botanical flex-shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action row (Full-width button on mobile) */}
              <div className="pt-4 sm:pt-6 border-t border-charcoal/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <span className="text-xs text-charcoal/60 font-sans text-center sm:text-left">
                  Ready to assess your {activeSpace.title.toLowerCase()}?
                </span>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[46px] px-6 rounded-full bg-forest text-ivory hover:bg-forest-dark font-sans font-semibold text-xs sm:text-sm transition-all active:scale-[0.98] shadow-xs touch-manipulation"
                >
                  <span>Request Assessment Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

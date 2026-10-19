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
    <section className="py-16 sm:py-24 bg-ivory border-t border-charcoal/10" aria-labelledby="spaces-heading">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Header */}
        <div className="max-w-[42em] space-y-3.5 mb-10 sm:mb-14">
          <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
            <span>The Spaces We Serve</span>
            <span className="w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h2 id="spaces-heading" className="font-serif text-forest-deep text-[clamp(2.2rem,4.8vw,3.6rem)] font-normal leading-[1.05] tracking-tight text-balance">
            Tailored agricultural stewardship for every type of property.
          </h2>
          <p className="text-[17px] sm:text-[18px] text-charcoal/80 leading-relaxed font-sans font-light">
            Our approach depends on your property’s size, your objectives, water availability, sunlight, soil conditions, budget, and practical feasibility.
          </p>
        </div>

        {/* 4 Space Selector Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 mb-10" role="tablist" aria-label="Spaces we serve">
          {spacesWeServe.map((space) => {
            const isSelected = space.id === selectedSpaceId;
            return (
              <button
                key={space.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedSpaceId(space.id)}
                className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between min-h-[110px] sm:min-h-[120px] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  isSelected
                    ? 'bg-forest text-ivory border-forest shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-cream/60 text-charcoal/80 border-charcoal/10 hover:border-gold/50 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`font-mono text-xs font-bold tracking-widest ${isSelected ? 'text-gold' : 'text-charcoal/40'}`}>
                    {space.number}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-gold' : 'bg-charcoal/20'}`} />
                </div>
                <div className="mt-3">
                  <h3 className={`font-serif text-base sm:text-lg font-medium leading-tight ${isSelected ? 'text-white' : 'text-forest-deep'}`}>
                    {space.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Space Detail Showcase */}
        <div className="bg-white rounded-3xl border border-charcoal/10 overflow-hidden shadow-soft transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Image Column */}
            <div className="relative lg:col-span-5 min-h-[280px] sm:min-h-[360px] lg:min-h-full bg-forest-dark overflow-hidden">
              <Image
                src={activeSpace.image}
                alt={activeSpace.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/75 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-xs uppercase tracking-widest text-gold font-bold">Space Category {activeSpace.number}</span>
                <h4 className="font-serif text-2xl text-white font-medium">{activeSpace.title}</h4>
              </div>
            </div>

            {/* Details Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-9 lg:p-11 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gold block mb-1">
                    {activeSpace.subtitle}
                  </span>
                  <p className="text-[17px] sm:text-[18px] text-charcoal/90 leading-relaxed font-sans">
                    {activeSpace.summary}
                  </p>
                </div>

                {/* Ideal For Callout */}
                <div className="p-4 rounded-xl bg-cream/50 border border-charcoal/10 text-xs sm:text-sm text-charcoal/80">
                  <strong className="text-forest-deep font-semibold">Ideal For: </strong>
                  <span>{activeSpace.idealFor}</span>
                </div>

                {/* Two Columns: Key Considerations & Solutions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2.5 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-gold" />
                      <span>Key Assessment Factors</span>
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-[13.5px] text-charcoal/80 font-sans">
                      {activeSpace.keyConsiderations.map((c, idx) => (
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
                      <span>What We Deliver</span>
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-[13.5px] text-charcoal/80 font-sans">
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

              {/* Action row */}
              <div className="pt-6 border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-charcoal/60 font-sans">
                  Ready to assess your {activeSpace.title.toLowerCase()}?
                </span>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest text-ivory hover:bg-forest-dark font-sans font-semibold text-xs sm:text-sm transition-all active:scale-95 shadow-xs"
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

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { businessModels } from '@/data/visionData';

export function BusinessModelsSection() {
  const [activeModelId, setActiveModelId] = useState<string>(businessModels[0].id);

  const activeModel = businessModels.find((m) => m.id === activeModelId) || businessModels[0];

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-cream/40 border-t border-charcoal/10" aria-labelledby="models-heading">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="max-w-[44em] space-y-2.5 sm:space-y-3.5 mb-8 sm:mb-12">
          <div className="flex items-center gap-2.5 text-gold text-[11px] sm:text-[11.5px] font-bold tracking-[0.2em] sm:tracking-[0.22em] uppercase">
            <span>Our Business Models</span>
            <span className="w-8 sm:w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h2 id="models-heading" className="font-serif text-forest-deep text-[clamp(2rem,5.5vw,3.6rem)] font-normal leading-[1.08] tracking-tight text-balance">
            Four structured pathways to make your land productive.
          </h2>
          <p className="text-[15px] sm:text-[17px] text-charcoal/80 leading-relaxed font-sans font-light">
            Whether you want hands-off farm stewardship, a weekend farmhouse retreat, land leasing facilitation, or a rooftop kitchen garden—we provide clear, transparent models.
          </p>
        </div>

        {/* 4 Model Selector Tabs (Swipeable row on mobile with snap-start, grid on tablet/desktop) */}
        <div 
          className="flex overflow-x-auto no-scrollbar snap-x gap-2.5 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 mb-6 sm:mb-10 pb-2 sm:pb-0"
          role="tablist" 
          aria-label="Business model tabs"
        >
          {businessModels.map((m) => {
            const isSelected = m.id === activeModelId;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveModelId(m.id)}
                className={`min-w-[230px] sm:min-w-0 snap-start flex-shrink-0 sm:flex-shrink p-4 sm:p-5 rounded-xl sm:rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between active:scale-[0.98] touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  isSelected
                    ? 'bg-forest text-ivory border-forest shadow-md'
                    : 'bg-white hover:bg-cream text-charcoal/80 border-charcoal/10 shadow-2xs'
                }`}
              >
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10.5px] sm:text-[11px] font-bold tracking-wider uppercase mb-1.5 sm:mb-2 ${
                    isSelected ? 'bg-gold/25 text-gold' : 'bg-charcoal/10 text-charcoal/70'
                  }`}>
                    {m.code}
                  </span>
                  <h3 className={`font-serif text-base sm:text-lg font-medium leading-snug ${isSelected ? 'text-white' : 'text-forest-deep'}`}>
                    {m.title}
                  </h3>
                </div>
                <p className={`text-xs mt-2 sm:mt-3 line-clamp-2 ${isSelected ? 'text-white/80' : 'text-charcoal/60'}`}>
                  {m.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Model Deep Dive Box */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-charcoal/10 p-5 sm:p-8 lg:p-12 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Context, Problem & Solution */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              <div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-gold block mb-1">
                  {activeModel.code} · Operational Blueprint
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-forest-deep font-medium">
                  {activeModel.title}
                </h3>
                <p className="text-sm sm:text-base text-charcoal/70 font-sans mt-0.5">
                  {activeModel.tagline}
                </p>
              </div>

              {/* The Problem & Solution Cards */}
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 rounded-xl bg-cream/35 border border-charcoal/10">
                  <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-forest-deep mb-1 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span>The Problem We Solve</span>
                  </h4>
                  <p className="text-xs sm:text-[14px] text-charcoal/80 leading-relaxed font-sans">
                    {activeModel.problem}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-forest/5 border border-forest/15">
                  <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-forest mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-forest flex-shrink-0" />
                    <span>Our Solution</span>
                  </h4>
                  <p className="text-xs sm:text-[14px] text-charcoal/85 leading-relaxed font-sans">
                    {activeModel.solution}
                  </p>
                </div>
              </div>

              {/* If Model 3 (Has Sub-models 3.1, 3.2, 3.3) */}
              {activeModel.subModels && (
                <div className="space-y-2.5 pt-1">
                  <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-charcoal/60">
                    Three Distinct Leasing & Partnership Opportunities:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {activeModel.subModels.map((sub) => (
                      <div key={sub.id} className="p-3.5 rounded-xl bg-ivory border border-charcoal/10 flex flex-col justify-between">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-gold uppercase">{sub.code}</span>
                          <h5 className="font-serif text-[13.5px] font-semibold text-forest-deep mt-0.5 leading-snug">{sub.title}</h5>
                          <p className="text-[11px] text-charcoal/70 mt-1 line-clamp-3 leading-relaxed">{sub.description}</p>
                        </div>
                        <span className="text-[10px] text-forest font-semibold mt-2 pt-1 border-t border-charcoal/10 block">
                          {sub.revenueModel.split('+')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services Included */}
              <div className="pt-1">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2.5">
                  Scope of Services Included:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-[13px] text-charcoal/80 font-sans">
                  {activeModel.servicesIncluded.slice(0, 6).map((service, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-botanical flex-shrink-0 mt-0.5" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Visual Image & Commercial Framework */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-5 sm:space-y-6">
              <div className="relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-forest-dark border border-charcoal/10 shadow-xs">
                <Image
                  src={activeModel.image}
                  alt={activeModel.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                />
              </div>

              {/* Revenue Model & Core Promise */}
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-cream/50 border border-charcoal/10 space-y-3">
                <div>
                  <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-charcoal/60 block mb-0.5">
                    Revenue & Financial Structure
                  </span>
                  <p className="text-xs sm:text-sm text-charcoal/85 leading-relaxed font-sans">
                    {activeModel.revenueModel}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-charcoal/10">
                  <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-gold block mb-0.5">
                    Our Core Promise
                  </span>
                  <p className="font-serif text-sm sm:text-base text-forest-deep italic font-medium">
                    &ldquo;{activeModel.promise}&rdquo;
                  </p>
                </div>
              </div>

              {/* Direct Action Link (Full width button) */}
              <div className="pt-1">
                <Link
                  href={activeModel.href}
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full bg-forest text-ivory hover:bg-forest-dark active:scale-[0.98] font-sans font-semibold text-sm transition-all shadow-sm touch-manipulation"
                >
                  <span>Explore {activeModel.title}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

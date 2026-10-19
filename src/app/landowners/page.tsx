'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { CheckCircle2, ShieldCheck, ArrowRight, FileCheck, TrendingUp, Handshake, Compass } from 'lucide-react';
import { businessModels } from '@/data/visionData';

export default function LandownersPage() {
  const model3 = businessModels.find((m) => m.id === 'model-3-land-leasing-partnerships') || businessModels[2];
  const subModels = model3.subModels || [];

  const [activeSubId, setActiveSubId] = useState<string>(subModels[0]?.id || 'model-3-1');
  const activeSub = subModels.find((s) => s.id === activeSubId) || subModels[0];

  return (
    <div className="w-full bg-ivory">
      {/* Breadcrumbs */}
      <div className="border-b border-charcoal/10 py-3.5 px-5 bg-cream/40">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'For Landowners' }]} />
          <span className="text-xs text-charcoal/50 uppercase tracking-widest hidden sm:inline">
            Model 3: Land Leasing & Utilization
          </span>
        </div>
      </div>

      {/* Header Intro */}
      <section className="pt-12 sm:pt-16 pb-12 bg-cream/30 border-b border-charcoal/10">
        <div className="max-w-[1280px] mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase mx-auto mb-3">
            <span>Model 3 · Landowner Partnerships</span>
            <span className="w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h1 className="font-serif text-forest-deep text-[clamp(2.4rem,5.2vw,4.5rem)] font-normal leading-[1.05] tracking-tight max-w-[22em] mx-auto">
            Your land. The right productive arrangement.
          </h1>
          <p className="mt-4 text-[17px] sm:text-[18px] text-charcoal/80 max-w-[34em] mx-auto font-sans font-light leading-relaxed">
            Connecting landowners who want to lease or utilize their land with verified operators and viable commercial agricultural models.
          </p>
        </div>
      </section>

      {/* Main Model 3 Showcase */}
      <section className="py-14 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-5">
          
          {/* Sub-models Selector: 3.1, 3.2, 3.3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10" role="tablist">
            {subModels.map((sub) => {
              const isSelected = sub.id === activeSubId;
              return (
                <button
                  key={sub.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveSubId(sub.id)}
                  className={`p-5 sm:p-6 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    isSelected
                      ? 'bg-forest text-ivory border-forest shadow-md scale-[1.02]'
                      : 'bg-white hover:bg-cream text-charcoal/80 border-charcoal/10 hover:border-gold/50 shadow-2xs'
                  }`}
                >
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase mb-2 ${
                      isSelected ? 'bg-gold/25 text-gold' : 'bg-charcoal/10 text-charcoal/70'
                    }`}>
                      {sub.code}
                    </span>
                    <h2 className={`font-serif text-lg sm:text-xl font-medium leading-snug ${isSelected ? 'text-white' : 'text-forest-deep'}`}>
                      {sub.title}
                    </h2>
                  </div>
                  <p className={`text-xs mt-3 line-clamp-2 ${isSelected ? 'text-white/80' : 'text-charcoal/60'}`}>
                    {sub.targetAudience}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Sub-Model Deep Dive */}
          <div className="bg-white rounded-3xl border border-charcoal/10 p-6 sm:p-10 shadow-soft mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Scope & How We Help */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-1">
                    {activeSub.code} · Detailed Framework
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-forest-deep font-medium">
                    {activeSub.title}
                  </h3>
                  <p className="text-sm sm:text-base text-charcoal/80 font-sans mt-2 leading-relaxed">
                    {activeSub.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cream/50 border border-charcoal/10 text-xs sm:text-sm text-charcoal/80">
                  <strong className="text-forest-deep font-semibold">Best Suited For: </strong>
                  <span>{activeSub.targetAudience}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-botanical" />
                    <span>How FarmCare360 Coordinates & Protects</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs sm:text-[13.5px] text-charcoal/80 font-sans">
                    {activeSub.howWeHelp.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-botanical flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {activeSub.keyCriteria && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2.5 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-gold" />
                      <span>Our Strict Direct Lease Viability Criteria:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal/80">
                      {activeSub.keyCriteria.map((crit, cIdx) => (
                        <div key={cIdx} className="p-2.5 rounded-lg bg-ivory border border-charcoal/10 flex items-start gap-2">
                          <span className="text-gold font-bold">•</span>
                          <span>{crit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Commercial Terms & Action */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-forest-dark border border-charcoal/10 shadow-xs">
                  <Image
                    src="/images/landowners/lease-partner.jpg"
                    alt={activeSub.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 38vw"
                  />
                </div>

                <div className="p-5 rounded-2xl bg-cream/40 border border-charcoal/10 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/60 block">
                    Commercial & Revenue Structure
                  </span>
                  <p className="text-xs sm:text-sm text-charcoal/85 leading-relaxed font-sans font-medium">
                    {activeSub.revenueModel}
                  </p>
                  <p className="text-[11.5px] text-charcoal/60 leading-normal pt-2 border-t border-charcoal/10">
                    The landowner and operator agree on all lease parameters, rent, permitted activities, maintenance obligations, and exit terms prior to execution.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center min-h-[48px] px-6 rounded-full bg-forest text-ivory hover:bg-forest-dark active:scale-[0.98] font-sans font-semibold text-sm transition-all shadow-sm"
                >
                  <span>Submit Land Details for Assessment →</span>
                </Link>
              </div>

            </div>
          </div>

          {/* Clear Commercial Guardrails */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-charcoal/10 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-gold block mb-1.5">Zero Speculation</span>
              <h4 className="font-serif text-base text-forest-deep font-semibold mb-1">No Guarantees Without Audit</h4>
              <p className="text-xs text-charcoal/70 leading-relaxed font-sans">
                We never make unrealistic yield or rental promises. All arrangements are grounded in soil and water testing and market economics.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-charcoal/10 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-gold block mb-1.5">Legal Demarcation</span>
              <h4 className="font-serif text-base text-forest-deep font-semibold mb-1">Clear Documentation</h4>
              <p className="text-xs text-charcoal/70 leading-relaxed font-sans">
                All agreements clearly define permitted agricultural activities, resource utilization limits, term duration, and return-of-land condition.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-charcoal/10 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-gold block mb-1.5">Stewardship First</span>
              <h4 className="font-serif text-base text-forest-deep font-semibold mb-1">Soil Health Protection</h4>
              <p className="text-xs text-charcoal/70 leading-relaxed font-sans">
                Lease contracts mandate regenerative practices, organic soil enrichment, and prevent harmful chemical depletion of your soil.
              </p>
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
                Discuss your land with our partnership team.
              </h2>
              <p className="text-[17px] sm:text-[18px] text-white/80 leading-relaxed font-sans">
                Share your property location, acreage, and objectives. We will review its suitability and schedule a preliminary assessment.
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

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Eye, 
  Cpu, 
  Award, 
  HeartHandshake, 
  CheckCircle2, 
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { transparencyWorkflow, fiveCorePrinciples } from '@/data/visionData';

export function CustomerTransparencySection() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeStep = transparencyWorkflow[activeStepIndex];

  const handleNextStep = () => {
    setActiveStepIndex((prev) => (prev + 1) % transparencyWorkflow.length);
  };

  const handlePrevStep = () => {
    setActiveStepIndex((prev) => (prev - 1 + transparencyWorkflow.length) % transparencyWorkflow.length);
  };

  const principleIcons = [
    <ShieldCheck key="p1" className="w-5 h-5 text-gold flex-shrink-0" />,
    <Eye key="p2" className="w-5 h-5 text-gold flex-shrink-0" />,
    <Cpu key="p3" className="w-5 h-5 text-gold flex-shrink-0" />,
    <Award key="p4" className="w-5 h-5 text-gold flex-shrink-0" />,
    <HeartHandshake key="p5" className="w-5 h-5 text-gold flex-shrink-0" />,
  ];

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-forest-dark text-white relative overflow-hidden" aria-labelledby="transparency-heading">
      {/* Background ambient pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#C7A65A_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="max-w-[44em] space-y-2.5 sm:space-y-3.5 mb-8 sm:mb-14">
          <div className="flex items-center gap-2.5 text-gold text-[11px] sm:text-[11.5px] font-bold tracking-[0.2em] sm:tracking-[0.22em] uppercase">
            <span>Customer Transparency Model</span>
            <span className="w-8 sm:w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h2 id="transparency-heading" className="font-serif text-white text-[clamp(2rem,5.5vw,3.6rem)] font-normal leading-[1.08] tracking-tight text-balance">
            Customers should not have to blindly trust us.
          </h2>
          <p className="text-[15px] sm:text-[17px] text-white/85 leading-relaxed font-sans font-light">
            Our processes give you clear reasons to trust us. Explore our defined 7-step approval protocol for every operational decision and expense.
          </p>
        </div>

        {/* 7-Step Approval Timeline / Stepper */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-white/10 mb-6">
            <div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-gold uppercase block">The 7-Step Approval Flow</span>
              <h3 className="font-serif text-lg sm:text-2xl text-white font-medium mt-0.5">
                How field expenses are proposed, approved & audited
              </h3>
            </div>
            <Link
              href="/transparency"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gold hover:text-white transition-colors touch-manipulation"
            >
              <span>View Full Protocol</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stepper Tabs Bar (Horizontal swipeable on mobile, 7-col grid on desktop) */}
          <div 
            className="flex overflow-x-auto no-scrollbar snap-x gap-2 mb-6 pb-1.5 lg:grid lg:grid-cols-7"
            role="tablist"
            aria-label="7-step approval process"
          >
            {transparencyWorkflow.map((step, idx) => {
              const isSelected = idx === activeStepIndex;
              return (
                <button
                  key={step.step}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`min-w-[130px] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink p-3 rounded-xl text-left transition-all duration-200 border flex flex-col justify-between active:scale-[0.98] touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    isSelected
                      ? 'bg-gold text-forest-deep border-gold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10'
                  }`}
                >
                  <span className={`font-mono text-[10.5px] font-bold ${isSelected ? 'text-forest-deep' : 'text-gold'}`}>
                    STEP {step.step}
                  </span>
                  <span className="font-sans text-xs font-semibold mt-1 leading-snug line-clamp-1">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Showcase Card */}
          <div className="p-5 sm:p-7 lg:p-8 rounded-xl sm:rounded-2xl bg-white/10 border border-white/15">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
              
              <div className="md:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold">
                  <span>Step {activeStep.step} of 07</span>
                  <span>·</span>
                  <span className="text-white/70">Role: {activeStep.actor}</span>
                </div>
                <h4 className="font-serif text-xl sm:text-3xl text-white font-medium">
                  {activeStep.title}
                </h4>
                <p className="text-white/85 text-sm sm:text-base leading-relaxed font-sans font-light">
                  {activeStep.description}
                </p>
              </div>

              <div className="md:col-span-4 p-4 rounded-xl bg-forest-dark/90 border border-white/10 space-y-2">
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-gold block">
                  Documented Evidence / Output
                </span>
                <p className="text-xs sm:text-[13px] text-white/95 leading-snug font-sans flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-botanical flex-shrink-0 mt-0.5" />
                  <span>{activeStep.deliverable}</span>
                </p>
              </div>

            </div>

            {/* Mobile Thumb Navigation (Prev / Next Step buttons) */}
            <div className="flex items-center justify-between pt-4 mt-5 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 font-medium transition-all touch-manipulation"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Step</span>
              </button>
              <span className="font-mono text-white/60 text-[11px]">
                {activeStepIndex + 1} / {transparencyWorkflow.length}
              </span>
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/90 hover:bg-gold active:scale-95 text-forest-deep font-semibold transition-all touch-manipulation"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* The 5 Principles Section */}
        <div>
          <div className="text-center max-w-[36em] mx-auto mb-8 sm:mb-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gold block mb-1.5">Our Operating Philosophy</span>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-medium">
              Five principles that make FarmCare360 different.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {fiveCorePrinciples.map((p, idx) => (
              <div
                key={p.number}
                className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:border-gold/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className="font-mono text-xs font-bold text-gold">{p.number}</span>
                    {principleIcons[idx]}
                  </div>
                  <h4 className="font-serif text-base sm:text-lg text-white font-medium mb-1.5">{p.title}</h4>
                  <p className="text-xs text-white/75 leading-relaxed font-sans">{p.description}</p>
                </div>
                <div className="mt-3.5 pt-2.5 border-t border-white/10 text-[11px] text-gold font-medium">
                  {p.practicalApplication}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

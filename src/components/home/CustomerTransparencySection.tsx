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
import { transparencyWorkflow as defaultSteps, fiveCorePrinciples as defaultPrinciples } from '@/data/visionData';
import { TransparencyStep, TransparencyPrinciple } from '@/lib/cms/types';

interface TransparencySectionProps {
  steps?: TransparencyStep[];
  principles?: TransparencyPrinciple[];
  title?: string;
  subtitle?: string;
}

export function CustomerTransparencySection({
  steps,
  principles,
  title,
  subtitle,
}: TransparencySectionProps = {}) {
  const workflowItems =
    steps && steps.length > 0
      ? steps.map((s) => ({
          step: s.stepNumber,
          title: s.title,
          badge: s.badge || `Stage ${s.stepNumber}`,
          description: s.description,
          deliverables: [
            'Documented client signoff',
            'Full receipt & photo log',
            'Independent agronomist review',
          ],
        }))
      : defaultSteps;

  const principleItems =
    principles && principles.length > 0
      ? principles.map((p, idx) => ({
          id: p.id || `p-${idx}`,
          name: p.title || p.name || `Principle ${idx + 1}`,
          description: p.description,
        }))
      : defaultPrinciples.map((p) => ({
          id: p.number,
          name: p.title,
          description: p.description,
        }));

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeStep = workflowItems[activeStepIndex] || workflowItems[0];

  const handleNextStep = () => {
    setActiveStepIndex((prev) => (prev + 1) % workflowItems.length);
  };

  const handlePrevStep = () => {
    setActiveStepIndex((prev) => (prev - 1 + workflowItems.length) % workflowItems.length);
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
            {title || 'Customers should not have to blindly trust us.'}
          </h2>
          <p className="text-[15px] sm:text-[17px] text-white/85 leading-relaxed font-sans font-light">
            {subtitle ||
              'Our processes give you clear reasons to trust us. Explore our defined 7-step approval protocol for every operational decision and expense.'}
          </p>
        </div>

        {/* 7-Step Approval Stepper Tabs */}
        <div className="mb-6 sm:mb-8 overflow-x-auto no-scrollbar pb-2">
          <div className="flex gap-2 sm:gap-3 min-w-max">
            {workflowItems.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <button
                  key={step.step || idx}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-gold text-forest-deep shadow-md font-bold'
                      : 'bg-white/10 text-white/80 hover:bg-white/15'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isActive ? 'bg-forest-deep text-gold' : 'bg-white/20 text-white'
                  }`}>
                    {idx + 1}
                  </span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Showcase Card */}
        {activeStep && (
          <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-12 sm:mb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
                  Stage {activeStep.step || activeStepIndex + 1} of {workflowItems.length}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium mt-1">
                  {activeStep.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevStep}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextStep}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Next step"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-sans max-w-3xl">
              {activeStep.description}
            </p>

            {(((activeStep as any).deliverables || [(activeStep as any).deliverable]).filter(Boolean) as string[]).length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gold mb-3">
                  Verification & Deliverables:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(((activeStep as any).deliverables || [(activeStep as any).deliverable]).filter(Boolean) as string[]).map((d: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5 Core Principles */}
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-6">
            Our 5 Fundamental Principles of Stewardship
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {principleItems.map((p, idx) => (
              <div
                key={p.id || idx}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-3">
                    {principleIcons[idx % principleIcons.length]}
                  </div>
                  <h4 className="font-serif text-base font-bold text-white mb-2">
                    {p.name}
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Link to full transparency charter */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <Link
            href="/transparency"
            className="inline-flex items-center gap-2 text-gold font-semibold text-sm hover:underline"
          >
            <span>Read the Complete FarmCare360 Transparency Charter</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}

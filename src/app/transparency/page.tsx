import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Eye, CheckCircle2, AlertTriangle, FileText, Smartphone, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { transparencyWorkflow, fiveCorePrinciples } from '@/data/visionData';
import { companyConfig } from '@/data/companyConfig';

export const metadata: Metadata = {
  title: `Customer Transparency Model | ${companyConfig.brandName} — Trust & Accountability`,
  description:
    'Explore the FarmCare360 Customer Transparency Model: our 7-step defined approval workflow, itemized estimates, and documented photo audit logs.',
  openGraph: {
    title: `Customer Transparency Model | ${companyConfig.brandName}`,
    description:
      'Customers should not have to blindly trust us; our processes give you clear reasons to trust us.',
  },
};

export default function TransparencyPage() {
  return (
    <div className="w-full bg-ivory">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-charcoal/10 py-3.5 px-4 sm:px-6 bg-cream/40">
        <div className="max-w-[1280px] mx-auto">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Customer Transparency' }]} />
        </div>
      </div>

      {/* Hero Header */}
      <section className="pt-10 sm:pt-16 pb-10 bg-cream/30 border-b border-charcoal/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2.5 text-gold text-[11px] sm:text-[11.5px] font-bold tracking-[0.2em] sm:tracking-[0.22em] uppercase mx-auto mb-2.5">
            <span>Our Customer Transparency Model</span>
            <span className="w-8 sm:w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h1 className="font-serif text-forest-deep text-[clamp(2.1rem,5.5vw,4.5rem)] font-normal leading-[1.08] tracking-tight max-w-[22em] mx-auto text-balance">
            Customers should not have to blindly trust us.
          </h1>
          <p className="mt-3 sm:mt-4 text-[15px] sm:text-[18px] text-charcoal/80 max-w-[34em] mx-auto font-sans font-light leading-relaxed">
            Our processes give you clear reasons to trust us. Discover how FarmCare360 handles customer money, pre-approval workflows, and operational decisions.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <main className="py-10 sm:py-16 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          
          {/* Section 1: The Core Problem & Our Radical Solution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 items-stretch">
            <div className="p-6 sm:p-9 rounded-2xl sm:rounded-3xl bg-white border border-charcoal/10 shadow-2xs space-y-3 sm:space-y-4">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-charcoal/60 block">
                The Conventional Industry Problem
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-forest-deep font-medium">
                The frustration of unexplained bills and opaque work.
              </h2>
              <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed font-sans font-light">
                In traditional farming arrangements, landowners frequently face unpleasant surprises: local labourers purchase inputs without prior authorization, work is performed without technical justification, and bills are presented after the money has already been spent. For absentee landowners living in cities or abroad, this lack of transparency creates persistent stress and distrust.
              </p>
            </div>

            <div className="p-6 sm:p-9 rounded-2xl sm:rounded-3xl bg-forest text-ivory border border-forest-dark shadow-2xs space-y-3 sm:space-y-4">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gold block">
                The FarmCare360 Distinction
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
                Defined pre-approvals, itemized costs, and documented proof.
              </h2>
              <p className="text-sm sm:text-base text-ivory/85 leading-relaxed font-sans font-light">
                We separate recurring farm management fees from operational expenses. Suppose your farm needs fertilizer or drip repairs: our agricultural team evaluates the requirement, prepares an itemized estimate, and shares it with you. You approve the expense before a single rupee is spent. Once executed, you receive supplier invoices, photo evidence, and digital logs.
              </p>
            </div>
          </div>

          {/* Section 2: Detailed 7-Step Process */}
          <div className="space-y-6 sm:space-y-8">
            <div className="max-w-[40em]">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-gold block mb-1">
                Step-by-Step Operating Workflow
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-forest-deep font-medium">
                How every field expense is handled.
              </h2>
              <p className="text-sm sm:text-base text-charcoal/70 mt-1">
                A defined 7-step governance protocol ensuring complete financial and operational clarity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {transparencyWorkflow.map((step) => (
                <div
                  key={step.step}
                  className="p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-charcoal/10 shadow-2xs flex flex-col justify-between space-y-4 hover:border-gold transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-cream text-gold">
                        STEP {step.step}
                      </span>
                      <span className="text-[10.5px] sm:text-[11px] font-medium text-charcoal/50 uppercase tracking-wider">
                        {step.actor}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl text-forest-deep font-medium">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-[13.5px] text-charcoal/80 leading-relaxed font-sans font-light">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-charcoal/10">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-charcoal/50 block mb-1">
                      Evidence Deliverable
                    </span>
                    <p className="text-xs font-medium text-forest-deep flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-botanical flex-shrink-0 mt-0.5" />
                      <span>{step.deliverable}</span>
                    </p>
                  </div>
                </div>
              ))}

              {/* Emergency Protocol Box */}
              <div className="p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-cream/70 border border-gold/40 shadow-2xs flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-gold/20 text-forest-deep">
                      SAFETY NET
                    </span>
                    <AlertTriangle className="w-4 h-4 text-gold" />
                  </div>
                  <h3 className="font-serif text-xl text-forest-deep font-medium">
                    Emergency Protocol
                  </h3>
                  <p className="text-xs sm:text-[13.5px] text-charcoal/80 leading-relaxed font-sans font-light">
                    In rare cases of acute danger (e.g. main pipe burst, sudden boundary breach, or fallen electrical line), our team executes immediate containment within pre-agreed threshold limits and notifies the landowner instantaneously with before-and-after photographs.
                  </p>
                </div>
                <div className="pt-3 border-t border-charcoal/10 text-xs font-semibold text-forest-deep">
                  Pre-agreed emergency threshold protocol
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Digital Platform Roadmap */}
          <div className="p-6 sm:p-10 lg:p-12 rounded-2xl sm:rounded-3xl bg-forest-dark text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-8 space-y-3.5 sm:space-y-4">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-gold block">
                  Technology-Enabled Farm Portal
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-medium">
                  Remote farm management on your smartphone.
                </h2>
                <p className="text-white/85 text-sm sm:text-base leading-relaxed font-sans font-light max-w-[36em]">
                  Over time, our dedicated digital platform centralizes your property’s task assignments, GPS photographic logs, digital approvals, expense reconciliations, soil health records, and harvest forecasts into one clean interface.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-white/10 text-xs flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>Instant mobile approvals</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 text-xs flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>Geo-tagged photo logs</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 text-xs flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>Transparent digital ledger</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 text-left sm:text-center lg:text-right pt-2 sm:pt-0">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-8 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-sm transition-all shadow-sm touch-manipulation"
                >
                  Schedule a Consultation →
                </Link>
              </div>
            </div>
          </div>

          {/* Section 4: 5 Foundational Principles */}
          <div className="space-y-5 sm:space-y-6">
            <div className="max-w-[36em]">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-gold block mb-1">
                Our Operating Philosophy
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-forest-deep font-medium">
                The five principles we live by.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {fiveCorePrinciples.map((p) => (
                <div key={p.number} className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-charcoal/10 flex flex-col justify-between shadow-2xs">
                  <div>
                    <span className="font-mono text-xs font-bold text-gold block mb-1.5 sm:mb-2">{p.number}</span>
                    <h3 className="font-serif text-base sm:text-lg text-forest-deep font-semibold mb-1.5">{p.title}</h3>
                    <p className="text-xs text-charcoal/75 leading-relaxed font-sans">{p.description}</p>
                  </div>
                  <div className="mt-3.5 pt-2.5 border-t border-charcoal/10 text-[11px] text-forest font-semibold">
                    {p.practicalApplication}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* CTA Footer */}
      <section className="bg-forest-dark text-white py-12 sm:py-14 border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
              Ready to experience transparent agricultural care?
            </h2>
            <p className="text-white/80 text-sm max-w-[32em]">
              Tell us your land location and objectives. We will deliver a structured, itemized proposal.
            </p>
          </div>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-8 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-sm transition-all shadow-sm touch-manipulation"
          >
            Plan a Consultation →
          </Link>
        </div>
      </section>
    </div>
  );
}

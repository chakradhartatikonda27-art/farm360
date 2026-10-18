import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { companyConfig } from '@/data/companyConfig';

export const metadata: Metadata = {
  title: `Terms & Conditions | ${companyConfig.brandName}`,
  description: 'Terms of Service and agricultural engagement guidelines for FarmCare 360°',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="w-full bg-ivory">
      <div className="border-b border-cream py-3.5 px-4 sm:px-6 lg:px-8 bg-ivory-surface">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-6 text-charcoal/80 text-sm sm:text-base leading-relaxed">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold block">
            TERMS OF ENGAGEMENT
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-charcoal font-normal">
            Terms & Conditions
          </h1>
          <p className="text-xs text-charcoal/60">
            Last Updated: October 2026 · FarmCare 360°
          </p>

          <div className="border-t border-cream pt-6 space-y-5">
            <h2 className="text-xl font-serif font-bold text-charcoal">
              1. Engagement & Scope of Work
            </h2>
            <p>
              All agricultural services provided by FarmCare 360° (including land cleaning, fencing, borewell coordination, drip installation, orchard setup, and ongoing managed care) are governed by an agreed written Scope of Work and proposal itemizing deliverables, schedules, and costs.
            </p>

            <h2 className="text-xl font-serif font-bold text-charcoal">
              2. Realistic Agricultural Expectations
            </h2>
            <p>
              Agriculture is subject to natural environmental variables including rainfall, weather fluctuations, seasonal temperatures, and groundwater dynamics. While FarmCare 360° applies professional agronomic practices and high-quality materials, no representation is made guaranteeing subterranean water yields or fixed commercial returns.
            </p>

            <h2 className="text-xl font-serif font-bold text-charcoal">
              3. Land Title & Site Permissions
            </h2>
            <p>
              The landowner warrants that they hold lawful possession or authority over the subject property and are authorized to permit site entry for machinery, soil testing, and construction work.
            </p>

            <h2 className="text-xl font-serif font-bold text-charcoal">
              4. Payment & Termination
            </h2>
            <p>
              Milestone payments for one-time setups and recurring stewardship agreements are detailed in individual service proposals. Managed care agreements may be paused or modified with prior written notice as stipulated in your contract.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

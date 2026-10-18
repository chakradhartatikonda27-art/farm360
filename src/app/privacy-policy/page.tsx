import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { companyConfig } from '@/data/companyConfig';

export const metadata: Metadata = {
  title: `Privacy Policy | ${companyConfig.brandName}`,
  description: 'Privacy Policy and client data protection practices for FarmCare 360°',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-ivory">
      <div className="border-b border-cream py-3.5 px-4 sm:px-6 lg:px-8 bg-ivory-surface">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-6 text-charcoal/80 text-sm sm:text-base leading-relaxed">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold block">
            LEGAL & COMPLIANCE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-charcoal font-normal">
            Privacy Policy
          </h1>
          <p className="text-xs text-charcoal/60">
            Last Updated: October 2026 · FarmCare 360°
          </p>

          <div className="border-t border-cream pt-6 space-y-5">
            <h2 className="text-xl font-serif font-bold text-charcoal">
              1. Information We Collect
            </h2>
            <p>
              When you submit a consultation request on FarmCare 360°, we collect details necessary to evaluate your agricultural space: full name, phone number, email address, property location (taluk/district), property classification (farm, plot, terrace, or estate), and your description of current land conditions.
            </p>

            <h2 className="text-xl font-serif font-bold text-charcoal">
              2. How We Use Your Property Information
            </h2>
            <p>
              Your property details are utilized strictly by our agricultural planning team to assess feasibility, study satellite topography, and prepare tailored service or stewardship proposals. We do not sell, rent, or trade client property data or contact numbers to third-party telemarketers.
            </p>

            <h2 className="text-xl font-serif font-bold text-charcoal">
              3. On-Site Inspection Data
            </h2>
            <p>
              Photographs, GPS boundary points, and soil assay reports generated during physical on-site surveys remain the confidential property of the landowner and are shared solely for project execution.
            </p>

            <h2 className="text-xl font-serif font-bold text-charcoal">
              4. Contact for Privacy Matters
            </h2>
            <p>
              For questions regarding your data or to request removal of your consultation records, please contact us at {companyConfig.contact.email}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

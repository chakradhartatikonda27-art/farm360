import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ConsultationForm } from '@/components/common/ConsultationForm';
import { companyConfig } from '@/data/companyConfig';

export const metadata: Metadata = {
  title: `Contact | ${companyConfig.brandName} — Complete Agricultural Solutions`,
  description: 'Share your property location and goals to receive a tailored agricultural proposal from FarmCare 360°.',
};

export default function ContactPage() {
  return (
    <div className="w-full bg-ivory">
      {/* Breadcrumbs */}
      <div className="border-b border-charcoal/10 py-3.5 px-5 bg-cream/40">
        <div className="max-w-[1280px] mx-auto">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
        </div>
      </div>

      {/* Main Contact Section (Split Layout) */}
      <section className="py-14 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Heading, Copy & Photo */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
                <span>Get in touch</span>
                <span className="w-10 h-[1px] bg-gold inline-block" />
              </div>
              <h1 className="font-serif text-forest-deep text-[clamp(2.4rem,5.5vw,4.5rem)] font-normal leading-[1.05] tracking-tight">
                Tell us what your space needs.
              </h1>
              <p className="text-[17px] sm:text-[18px] text-charcoal/80 leading-relaxed font-sans">
                Share your location, your plans, and the kind of support you are looking for. Our team can help you explore the next steps.
              </p>

              <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden bg-forest shadow-soft mt-7">
                <Image
                  src="/images/services/process-step-1.jpg"
                  alt="Team member consulting with a farmer"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Direct Inquiries & Hubs */}
              <div className="mt-8 pt-6 border-t border-charcoal/10 text-xs sm:text-sm text-charcoal/70 space-y-1.5 font-sans">
                <p>
                  <strong>Service Hubs:</strong> Bangalore & Deccan Agricultural Belts
                </p>
                <p>
                  <strong>Operational Hours:</strong> Monday – Saturday: 8:00 AM – 6:30 PM IST
                </p>
              </div>
            </div>

            {/* Right Column: Consultation Form */}
            <div>
              <Suspense fallback={<div className="p-8 text-center text-charcoal/50">Loading consultation form...</div>}>
                <ConsultationForm />
              </Suspense>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

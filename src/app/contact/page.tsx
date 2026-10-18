import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Instagram, Youtube, Linkedin } from 'lucide-react';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ConsultationForm } from '@/components/common/ConsultationForm';
import { WhatsAppIcon } from '@/components/common/FloatingWhatsApp';
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

              {/* WhatsApp Quick Chat Card */}
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-[#25D366]/10 to-[#128C7E]/5 border border-[#25D366]/25 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm flex-shrink-0">
                    <WhatsAppIcon className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-forest-deep">Prefer Instant Messaging?</h3>
                    <p className="text-xs text-charcoal/70">Connect directly with an agricultural advisor on WhatsApp.</p>
                  </div>
                </div>
                <div className="pt-1">
                  <a
                    href="https://wa.me/919876543210?text=Hello%20FarmCare%20360%C2%B0%2C%20I%20would%20like%20to%20discuss%20my%20property%20requirements."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-sans font-semibold text-sm transition-all shadow-sm"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-white" />
                    <span>Chat on WhatsApp (+91 98765 43210)</span>
                  </a>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4">
                <p className="text-xs uppercase tracking-wider text-charcoal/60 font-semibold mb-3">Connect on Social Media</p>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="https://instagram.com/farmcare360"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/80 border border-charcoal/10 text-charcoal/80 hover:text-[#E4405F] hover:border-[#E4405F]/40 text-xs font-semibold shadow-xs transition-all"
                  >
                    <Instagram className="w-4 h-4 text-[#E4405F]" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://youtube.com/@farmcare360"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/80 border border-charcoal/10 text-charcoal/80 hover:text-[#FF0000] hover:border-[#FF0000]/40 text-xs font-semibold shadow-xs transition-all"
                  >
                    <Youtube className="w-4 h-4 text-[#FF0000]" />
                    <span>YouTube</span>
                  </a>
                  <a
                    href="https://linkedin.com/company/farmcare360"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/80 border border-charcoal/10 text-charcoal/80 hover:text-[#0A66C2] hover:border-[#0A66C2]/40 text-xs font-semibold shadow-xs transition-all"
                  >
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    <span>LinkedIn</span>
                  </a>
                </div>
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

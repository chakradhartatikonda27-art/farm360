import React from 'react';
import Link from 'next/link';
import { WhatsAppIcon } from '../common/FloatingWhatsApp';

interface ContactCtaBannerProps {
  badge?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export function ContactCtaBanner({
  badge,
  title,
  description,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
}: ContactCtaBannerProps = {}) {
  const displayBadge = badge || "Plan a consultation";
  const displayTitle = title || "Tell us what your space needs.";
  const displayDesc =
    description ||
    "Share your location, your plans, and the kind of support you are looking for. Our team can help you explore the next steps.";
  const displayCtaText = ctaText || "Request a Consultation →";
  const displayCtaLink = ctaLink || "/contact";
  const displaySecCtaText = secondaryCtaText || "WhatsApp Us";
  const displaySecCtaLink =
    secondaryCtaLink ||
    "https://wa.me/919876543210?text=Hello%20FarmCare%20360%C2%B0%2C%20I%20would%20like%20to%20discuss%20my%20property%20requirements.";

  return (
    <section className="bg-forest-dark text-white py-12 sm:py-16">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="flex flex-wrap gap-7 items-center justify-between">
          <div className="max-w-[34em] space-y-3.5">
            <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
              <span>{displayBadge}</span>
              <span className="w-10 h-[1px] bg-gold inline-block" />
            </div>
            <h2 className="font-serif text-white text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.08] tracking-tight">
              {displayTitle}
            </h2>
            <p className="text-[16px] sm:text-[18px] text-white/80 leading-relaxed font-sans font-light">
              {displayDesc}
            </p>
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={displaySecCtaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[50px] px-6 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-sans font-semibold text-[15px] transition-all shadow-sm"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              <span>{displaySecCtaText}</span>
            </a>
            <Link
              href={displayCtaLink}
              className="inline-flex items-center justify-center min-h-[50px] px-8 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-[15px] transition-all shadow-sm text-center"
            >
              {displayCtaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

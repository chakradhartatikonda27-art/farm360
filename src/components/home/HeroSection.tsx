import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  badge?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  heroImage?: string;
  trustBadgeText?: string;
  trustBadgeLink?: string;
}

export function HeroSection({
  badge,
  title,
  description,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  heroImage,
  trustBadgeText,
  trustBadgeLink,
}: HeroSectionProps = {}) {
  const displayBadge = badge || "Complete Agricultural Solutions";
  const displayTitle = title || "Owning land is a privilege. We make it productive.";
  const displayDesc =
    description ||
    "Many agricultural lands, open plots, and terraces remain idle, while people dream of farming and rural living. FarmCare360 bridges that gap through end-to-end management, agronomic science, and radical transparency.";
  const displayCtaText = ctaText || "Explore Our 4 Models";
  const displayCtaLink = ctaLink || "/services";
  const displaySecCtaText = secondaryCtaText || "Discuss Your Land";
  const displaySecCtaLink = secondaryCtaLink || "/contact";
  const displayImage = heroImage || "/images/hero/hero-terrace-farm.jpg";
  const displayTrustBadge =
    trustBadgeText || "Customer Transparency Model: Zero unexplained bills";
  const displayTrustLink = trustBadgeLink || "/transparency";

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] min-h-0 lg:min-h-[660px] bg-forest-dark text-white overflow-hidden">
      {/* Editorial Content Column (Order 1 on all viewports for Mobile-First Storytelling) */}
      <div className="flex flex-col justify-center px-5 sm:px-10 lg:pl-12 lg:pr-16 py-10 sm:py-14 lg:py-20 max-w-[760px] lg:ml-auto w-full order-1">
        {/* Eyebrow with Gold Accent */}
        <div className="flex items-center gap-2.5 text-gold text-[11px] sm:text-[11.5px] font-bold tracking-[0.2em] sm:tracking-[0.22em] uppercase">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>{displayBadge}</span>
          <span className="w-8 sm:w-10 h-[1px] bg-gold inline-block" />
        </div>

        {/* Editorial Headline */}
        <h1 className="font-serif text-white font-normal text-[clamp(2.1rem,6.8vw,4.5rem)] leading-[1.06] sm:leading-[1.03] tracking-tight my-4 sm:my-5 text-balance">
          {displayTitle}
        </h1>

        {/* Subcopy rooted in user vision */}
        <p className="text-[15px] sm:text-[17px] lg:text-[18px] text-white/90 leading-relaxed font-sans max-w-[34em] font-light">
          {displayDesc}
        </p>

        {/* Dual Actions - Full-width stacked on mobile, row on tablet/desktop */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mt-6 sm:mt-8 w-full sm:w-auto">
          <Link
            href={displayCtaLink}
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-7 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-[15px] transition-all shadow-sm text-center touch-manipulation"
          >
            {displayCtaText}
          </Link>
          <Link
            href={displaySecCtaLink}
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-7 rounded-full bg-transparent border-1.5 border-white/80 text-white hover:bg-white/10 active:scale-[0.98] font-sans font-semibold text-[15px] transition-all text-center touch-manipulation"
          >
            {displaySecCtaText}
          </Link>
        </div>

        {/* Trust badge link */}
        <div className="mt-7 sm:mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs text-white/80">
          <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
          <span>{displayTrustBadge}</span>
          <Link 
            href={displayTrustLink} 
            className="text-gold font-semibold hover:underline inline-flex items-center gap-0.5 touch-manipulation"
          >
            <span>Learn how</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Hero Photograph (Order 2 on mobile - natural visual anchor below lead) */}
      <div 
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto min-h-[240px] sm:min-h-[340px] lg:min-h-full order-2 overflow-hidden"
        role="img"
        aria-label="Modern residential terrace garden overlooking an agricultural landscape"
      >
        <Image
          src={displayImage}
          alt="Modern residential terrace garden overlooking an agricultural landscape"
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
          unoptimized={displayImage.startsWith('http') || displayImage.startsWith('/uploads')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-forest-dark/40 lg:to-transparent pointer-events-none" />
      </div>
    </section>
  );
}

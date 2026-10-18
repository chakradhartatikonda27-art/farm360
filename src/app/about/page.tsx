'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

export default function AboutPage() {
  const stages = [
    { number: '01', title: 'Plan' },
    { number: '02', title: 'Develop' },
    { number: '03', title: 'Protect' },
    { number: '04', title: 'Grow' },
    { number: '05', title: 'Harvest' },
  ];

  return (
    <div className="w-full bg-ivory">
      {/* Breadcrumbs */}
      <div className="border-b border-charcoal/10 py-3.5 px-5 bg-cream/40">
        <div className="max-w-[1280px] mx-auto">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
        </div>
      </div>

      {/* Main Split Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
                <span>About us</span>
                <span className="w-10 h-[1px] bg-gold inline-block" />
              </div>
              <h1 className="font-serif text-forest-deep text-[clamp(2.4rem,5.5vw,4.5rem)] font-normal leading-[1.05] tracking-tight">
                Healthy land, brighter tomorrows.
              </h1>
              <p className="text-[18px] sm:text-[20px] text-charcoal/90 leading-relaxed font-sans font-light">
                FarmCare 360° offers comprehensive care for land, farms, gardens and agricultural projects. Your land, our care, every step. We work through five stages with every space: plan, develop, protect, grow and harvest.
              </p>
              <p className="text-[14px] text-charcoal/60 font-sans italic pt-2">
                Company history, team and credentials will be added once supplied.
              </p>
            </div>

            <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden bg-forest shadow-soft">
              <Image
                src="/images/hero/hero-terrace-farm.jpg"
                alt="Farmhouse garden"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5 Stages Section */}
      <section className="py-16 sm:py-24 bg-cream border-t border-charcoal/10">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {stages.map((stage) => (
              <div key={stage.number} className="border-t border-gold pt-3.5 space-y-1">
                <span className="font-serif text-[34px] text-gold font-normal block leading-none">
                  {stage.number}
                </span>
                <h2 className="font-serif text-forest-deep text-[32px] sm:text-[34px] font-normal leading-tight">
                  {stage.title}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Founders Section */}
      <section className="py-16 sm:py-24 border-t border-charcoal/10">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="max-w-[36em] space-y-3.5 mb-10">
            <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
              <span>Our founders</span>
              <span className="w-10 h-[1px] bg-gold inline-block" />
            </div>
            <h2 className="font-serif text-forest-deep text-[clamp(2rem,4.6vw,3.5rem)] font-normal leading-[1.05] tracking-tight">
              The people behind the care.
            </h2>
            <p className="text-[17px] sm:text-[18px] text-charcoal/80 leading-relaxed font-sans font-light">
              Dedicated agricultural professionals combining traditional land stewardship with modern agronomic precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1100px]">
            <article className="tm">
              <div className="pf">
                <svg viewBox="0 0 120 120" role="img" aria-label="Founder photo placeholder">
                  <rect width="120" height="120" fill="#EFE9D9"/>
                  <circle cx="60" cy="46" r="20" fill="#A8B69A"/>
                  <path d="M20 120c2-26 20-40 40-40s38 14 40 40z" fill="#A8B69A"/>
                </svg>
              </div>
              <div>
                <h3>Founder Name</h3>
                <p className="rl">Founder & Agricultural Director</p>
                <ul className="chips">
                  <li>Agricultural Planning</li>
                  <li>Soil & Water Management</li>
                  <li>Orchard Operations</li>
                </ul>
                <em className="smp">Sample. Replace before launch.</em>
              </div>
            </article>

            <article className="tm">
              <div className="pf">
                <svg viewBox="0 0 120 120" role="img" aria-label="Co-founder photo placeholder">
                  <rect width="120" height="120" fill="#EFE9D9"/>
                  <circle cx="60" cy="46" r="20" fill="#A8B69A"/>
                  <path d="M20 120c2-26 20-40 40-40s38 14 40 40z" fill="#A8B69A"/>
                </svg>
              </div>
              <div>
                <h3>Founder Name</h3>
                <p className="rl">Co-founder & Operations Lead</p>
                <ul className="chips">
                  <li>Farm Infrastructure</li>
                  <li>Terrace & Garden Design</li>
                  <li>Client Stewardship</li>
                </ul>
                <em className="smp">Sample. Replace before launch.</em>
              </div>
            </article>
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
                Tell us what your space needs.
              </h2>
              <p className="text-[17px] sm:text-[18px] text-white/80 leading-relaxed font-sans">
                Share your location, your plans, and the kind of support you are looking for. Our team can help you explore the next steps.
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

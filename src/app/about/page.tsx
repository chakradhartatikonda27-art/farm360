'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { fiveCorePrinciples, coreVision } from '@/data/visionData';
import { ShieldCheck, Eye, Cpu, Award, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  const stages = [
    { number: '01', title: 'Plan', desc: 'Soil testing, topographical mapping, and custom agronomic blueprints.' },
    { number: '02', title: 'Develop', desc: 'Laser levelling, drip irrigation networks, and high-density planting.' },
    { number: '03', title: 'Protect', desc: 'Secure boundary fencing, GPS monitoring, and organic bio-pest scouting.' },
    { number: '04', title: 'Grow', desc: 'Balanced nutrition, tree canopy management, and seasonal cultivation.' },
    { number: '05', title: 'Harvest', desc: 'Sorting, post-harvest produce handling, and wholesale market linkages.' },
  ];

  const principleIcons = [
    <ShieldCheck key="p1" className="w-5 h-5 text-gold" />,
    <Eye key="p2" className="w-5 h-5 text-gold" />,
    <Cpu key="p3" className="w-5 h-5 text-gold" />,
    <Award key="p4" className="w-5 h-5 text-gold" />,
    <HeartHandshake key="p5" className="w-5 h-5 text-gold" />,
  ];

  return (
    <div className="w-full bg-ivory">
      {/* Breadcrumbs */}
      <div className="border-b border-charcoal/10 py-3.5 px-5 bg-cream/40">
        <div className="max-w-[1280px] mx-auto">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
        </div>
      </div>

      {/* Main Split Section: The Core Vision */}
      <section className="py-16 sm:py-24">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
                <span>Our Vision for Agriculture & Land</span>
                <span className="w-10 h-[1px] bg-gold inline-block" />
              </div>
              <h1 className="font-serif text-forest-deep text-[clamp(2.4rem,5.5vw,4.5rem)] font-normal leading-[1.05] tracking-tight">
                Owning land is a privilege. <br />
                We make it productive.
              </h1>
              <p className="text-[17px] sm:text-[19px] text-charcoal/90 leading-relaxed font-sans font-light">
                Owning land does not automatically make it productive. Across India, countless agricultural parcels, vacant sites, and residential terraces remain underutilized because owners live far away, work demanding careers, or lack agricultural knowledge and reliable labour.
              </p>
              <p className="text-[15px] sm:text-[16px] text-charcoal/80 leading-relaxed font-sans font-light">
                At the same time, many people dream of farming, growing their own food, or owning a countryside retreat—yet hesitate because farming without guidance can be complex and risky. <strong>FarmCare360 exists to bridge that gap</strong> through an end-to-end management ecosystem.
              </p>
            </div>

            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-forest-dark shadow-soft">
              <Image
                src="/images/hero/hero-terrace-farm.jpg"
                alt="Farmhouse terrace garden overlooking productive land"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Stages of Stewardship */}
      <section className="py-16 sm:py-20 bg-cream border-t border-charcoal/10">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="max-w-[36em] space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-gold block">Our Methodology</span>
            <h2 className="font-serif text-forest-deep text-3xl sm:text-4xl font-normal">
              Five stages of complete care.
            </h2>
            <p className="text-sm sm:text-base text-charcoal/70 font-sans">
              Every property we steward progresses through five defined phases.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-6">
            {stages.map((stage) => (
              <div key={stage.number} className="p-5 rounded-2xl bg-white border border-charcoal/10 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="font-serif text-3xl text-gold font-normal block mb-1">
                    {stage.number}
                  </span>
                  <h3 className="font-serif text-forest-deep text-2xl font-normal mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-charcoal/70 leading-relaxed font-sans font-light">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How FarmCare360 Will Be Different (The 5 Principles) */}
      <section className="py-16 sm:py-24 border-t border-charcoal/10">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="max-w-[38em] space-y-3.5 mb-12">
            <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
              <span>Operating Principles</span>
              <span className="w-10 h-[1px] bg-gold inline-block" />
            </div>
            <h2 className="font-serif text-forest-deep text-[clamp(2rem,4.6vw,3.5rem)] font-normal leading-[1.05] tracking-tight">
              How FarmCare360 is fundamentally different.
            </h2>
            <p className="text-[17px] sm:text-[18px] text-charcoal/80 leading-relaxed font-sans font-light">
              We are building more than a conventional farm services agency. We operate by five strict covenants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {fiveCorePrinciples.map((p, idx) => (
              <div
                key={p.number}
                className="p-6 rounded-2xl bg-white border border-charcoal/10 shadow-2xs hover:border-gold transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-gold">{p.number}</span>
                    {principleIcons[idx]}
                  </div>
                  <h3 className="font-serif text-xl text-forest-deep font-medium mb-2">{p.title}</h3>
                  <p className="text-xs text-charcoal/75 leading-relaxed font-sans font-light">{p.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-charcoal/10 text-[11px] text-forest font-semibold">
                  {p.practicalApplication}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Guarantee Callout */}
      <section className="py-14 bg-forest-dark text-white border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold block">
              Customer Transparency Protocol
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
              Zero unexplained bills. Total pre-approval governance.
            </h2>
            <p className="text-white/80 text-sm max-w-[34em]">
              Explore our 7-step defined operational and financial approval protocol that gives you clear reasons to trust us.
            </p>
          </div>
          <Link
            href="/transparency"
            className="inline-flex items-center justify-center min-h-[48px] px-8 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-sm transition-all shadow-sm"
          >
            Explore Transparency Model →
          </Link>
        </div>
      </section>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ArrowRight, ArrowUpRight, CheckCircle2, Home, Trees, Layers, Sprout } from 'lucide-react';

interface SpaceType {
  id: string;
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  image: string;
  setupServices: Array<{ name: string; href: string }>;
  careRecommendation: string;
  benefits: string[];
}

const spaces: SpaceType[] = [
  {
    id: 'terraces',
    name: 'Terrace & Rooftop Gardens',
    eyebrow: 'RESIDENTIAL BOTANY',
    tagline: 'A productive green retreat, designed right at home.',
    description: 'Transform an urban concrete terrace or balcony into a lush organic food forest with lightweight living soil blends, custom raised planters, and automated drip systems that never leak into ceilings.',
    image: '/images/services/feat-terrace-setup.jpg',
    setupServices: [
      { name: 'Kitchen gardens & terrace setup', href: '/services/kitchen-gardens-and-landscaping' },
      { name: 'Automated micro-drip timers', href: '/services/drip-and-sprinkler-installation' },
      { name: 'Raised wooden planter fabrication', href: '/services/kitchen-gardens-and-landscaping' },
    ],
    careRecommendation: 'Fortnightly or Monthly horticulturist visits for organic bio-nutrition, pest spray, and seedling replenishment.',
    benefits: [
      'Engineered drainage mats protect roof waterproofing completely',
      'Pesticide-free organic greens, herbs, and vegetables on your table daily',
      'Automated timers keep plants thriving while you travel',
    ],
  },
  {
    id: 'plots',
    name: 'Small Plots & Vacant Sites',
    eyebrow: 'PROPERTY PROTECTION',
    tagline: 'Idle land. A fresh purpose and active care.',
    description: 'Turn an unused residential layout plot or peri-urban parcel into a thriving kitchen plot, or keep it clean, clear of wild scrub, securely demarcated, and free from illegal dumping.',
    image: '/images/managed/plot-after.jpg',
    setupServices: [
      { name: 'Land cleaning & brush clearing', href: '/services/land-cleaning-and-levelling' },
      { name: 'Fencing & concrete post boundary', href: '/services/fencing-and-boundary-protection' },
      { name: 'Soil testing & organic prep', href: '/services/soil-and-water-testing' },
    ],
    careRecommendation: 'Monthly security & boundary audit or quarterly deep clearing with digital photo verification.',
    benefits: [
      'Prevents illegal trash dumping and neighbor encroachments',
      'Eliminates dangerous snake habitats and pest harbors',
      'Maintains clean property presentation for future construction or sale',
    ],
  },
  {
    id: 'farms',
    name: 'Farms & High-Density Orchards',
    eyebrow: 'AGRICULTURAL PRODUCTION',
    tagline: 'Productive farmland with scientific agronomy and precision water.',
    description: 'Establish high-yielding commercial fruit orchards (Mango, Guava, Pomegranate, Avocado, Citrus) or cash crops with genuine grafted saplings, laser-guided levelling, and pressure-compensating drip networks.',
    image: '/images/services/card-managed-orchard.jpg',
    setupServices: [
      { name: 'Farm masterplanning & contour zoning', href: '/services/farm-and-land-planning' },
      { name: 'Drip & sprinkler irrigation installation', href: '/services/drip-and-sprinkler-installation' },
      { name: 'High-density planting & pit preparation', href: '/services/planting-and-orchard-setup' },
      { name: 'Borewell & electrical pump coordination', href: '/services/borewell-coordination' },
    ],
    careRecommendation: 'Bi-weekly or monthly agronomist oversight, pruning, bio-fertigation, and harvest coordination.',
    benefits: [
      'Gives absentee landowners complete confidence with photographic field updates',
      'Reduces water usage by up to 60% compared to flood irrigation',
      'Links harvest surplus with verified regional produce buyers',
    ],
  },
  {
    id: 'farmhouses',
    name: 'Farmhouse & Landscape Grounds',
    eyebrow: 'ESTATE HORTICULTURE',
    tagline: 'Manicured lawns, blooming pergolas, and fruit groves for your weekend sanctuary.',
    description: 'Ensure your countryside retreat is fragrant, lush, and pristine every Friday when you arrive. We manage lawn aeration, flowerbed borders, shade trees, and perimeter security with quiet dedication.',
    image: '/images/managed/cat-farmhouse-landscape.jpg',
    setupServices: [
      { name: 'Farmhouse landscape design', href: '/services/kitchen-gardens-and-landscaping' },
      { name: 'Perimeter fencing & farm gates', href: '/services/fencing-and-boundary-protection' },
      { name: 'Automated lawn sprinkler systems', href: '/services/drip-and-sprinkler-installation' },
    ],
    careRecommendation: 'Weekly or bi-weekly comprehensive estate grounds keeping.',
    benefits: [
      'Pristine grounds ready for weekend family enjoyment',
      'Healthy fruit trees offering fresh seasonal fruit for your table',
      'Seamless coordination with on-site caretakers and staff',
    ],
  },
];

export default function ForYourSpacePage() {
  const [activeTab, setActiveTab] = useState<string>('terraces');
  const currentSpace = spaces.find((s) => s.id === activeTab) || spaces[0];

  return (
    <div className="w-full bg-ivory">
      {/* Breadcrumbs */}
      <div className="border-b border-cream py-3.5 px-4 sm:px-6 lg:px-8 bg-ivory-surface">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Breadcrumbs items={[{ label: 'For Your Space' }]} />
          <span className="text-xs text-charcoal/50 uppercase tracking-widest hidden sm:inline">
            Solutions Tailored By Property Type
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="pt-12 pb-14 sm:pt-16 sm:pb-20 border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-gold text-xs font-semibold tracking-widest uppercase">
              <span className="w-4 h-[1px] bg-gold"></span>
              <span>MATCHED TO YOUR PROPERTY</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-charcoal font-normal leading-[1.15]">
              Tailored solutions <br />
              <span className="italic font-light text-forest">for your exact space.</span>
            </h1>
            <p className="text-base sm:text-lg text-charcoal/75 font-light leading-relaxed max-w-2xl">
              Whether you are cultivating an urban rooftop, protecting an idle suburban plot, or developing a multi-acre agricultural orchard, discover how FarmCare 360° configures the right balance of setup and ongoing care.
            </p>
          </div>

          {/* Space Type Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8 sm:mt-10">
            {spaces.map((s) => {
              const isSelected = s.id === activeTab;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveTab(s.id)}
                  className={`p-4 text-left rounded-2xl border transition-all duration-200 touch-manipulation active:scale-[0.98] ${
                    isSelected
                      ? 'bg-forest text-ivory border-forest shadow-soft font-semibold'
                      : 'bg-ivory-surface border-cream hover:border-gold/50 text-charcoal'
                  }`}
                >
                  <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${isSelected ? 'text-gold-light' : 'text-gold'}`}>
                    {s.eyebrow}
                  </span>
                  <div className="font-serif text-base sm:text-lg leading-tight">
                    {s.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Space Detail Showcase */}
      <section className="py-16 sm:py-24 border-b border-cream bg-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-ivory-surface rounded-3xl border border-cream overflow-hidden shadow-soft p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Photo */}
              <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream border border-cream">
                <Image
                  src={currentSpace.image}
                  alt={currentSpace.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute top-4 left-4 bg-forest-dark/85 backdrop-blur-md text-ivory text-xs px-3 py-1 rounded-full font-medium">
                  {currentSpace.eyebrow}
                </div>
              </div>

              {/* Space Details */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-gold block mb-1">
                    PROPERTY OVERVIEW
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">
                    {currentSpace.name}
                  </h2>
                  <p className="text-base font-serif italic text-forest mt-1">
                    "{currentSpace.tagline}"
                  </p>
                  <p className="text-xs sm:text-sm text-charcoal/75 mt-3 leading-relaxed">
                    {currentSpace.description}
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="space-y-2 pt-2 border-t border-cream">
                  <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                    Why choose FarmCare for this space:
                  </span>
                  <div className="space-y-1.5 text-xs text-charcoal/80">
                    {currentSpace.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-botanical shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Setup Services */}
                <div className="space-y-2 pt-2 border-t border-cream">
                  <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                    Recommended Setup Services:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentSpace.setupServices.map((srv, idx) => (
                      <Link
                        key={idx}
                        href={srv.href}
                        className="px-3 py-1.5 rounded-lg bg-cream text-charcoal text-xs font-medium border border-cream-border hover:bg-forest hover:text-ivory transition-colors flex items-center gap-1.5"
                      >
                        <span>{srv.name}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Ongoing Care Recommendation */}
                <div className="p-3.5 rounded-xl bg-ivory border border-cream text-xs text-charcoal/80">
                  <strong className="text-forest font-semibold block mb-0.5">Recommended Ongoing Rhythm:</strong>
                  {currentSpace.careRecommendation}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/contact?propertyType=${encodeURIComponent(currentSpace.name)}`}
                    className="btn-forest text-xs py-3 px-6 inline-flex items-center gap-2"
                  >
                    <span>Request Consultation for {currentSpace.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

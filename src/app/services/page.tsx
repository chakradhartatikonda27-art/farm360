'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { specializedServiceClusters } from '@/data/visionData';

interface ServiceCard {
  title: string;
  description: string;
  href: string;
  image: string;
}

export default function ServicesPage() {
  const oneTimeServices: ServiceCard[] = [
    {
      title: 'Land cleaning & levelling',
      description: 'A clean, even starting point for planting, fencing or building.',
      href: '/services/land-cleaning-levelling',
      image: '/images/services/grid-land-cleaning.jpg',
    },
    {
      title: 'Farm & land planning',
      description: 'Crop, farm and plot layouts planned around your goals.',
      href: '/services/farm-land-planning',
      image: '/images/services/card-land-design.jpg',
    },
    {
      title: 'Land preparation',
      description: 'Ground made ready for planting or development.',
      href: '/services/land-preparation',
      image: '/images/services/brochure-tractor.jpg',
    },
    {
      title: 'Fencing & boundary protection',
      description: 'Boundaries, fencing and security matched to your land.',
      href: '/services/fencing-boundary-protection',
      image: '/images/services/feat-fencing-boundary.jpg',
    },
    {
      title: 'Borewell coordination',
      description: 'Support with planning and coordinating borewell work, where offered.',
      href: '/services/borewell-coordination',
      image: '/images/services/grid-borewell-coordination.jpg',
    },
    {
      title: 'Drip irrigation & sprinklers',
      description: 'Efficient watering systems designed for your space.',
      href: '/services/drip-irrigation-sprinklers',
      image: '/images/services/grid-drip-sprinkler.jpg',
    },
    {
      title: 'Soil & water testing coordination',
      description: 'Testing support for informed farm and garden planning.',
      href: '/services/soil-water-testing',
      image: '/images/services/grid-soil-water-testing.jpg',
    },
    {
      title: 'Planting & orchard setup',
      description: 'Trees and crops planted properly, with early care guidance.',
      href: '/services/planting-orchard-setup',
      image: '/images/services/grid-planting-orchard.jpg',
    },
    {
      title: 'Pruning & tree care',
      description: 'Shaping and caring for trees for health and yield.',
      href: '/services/pruning-tree-care',
      image: '/images/services/grid-pruning-treecare.jpg',
    },
    {
      title: 'Farm electrical work',
      description: 'Electrical works for farms and sites.',
      href: '/services/farm-electrical-work',
      image: '/images/services/grid-electrical-work.jpg',
    },
    {
      title: 'One-time harvest support',
      description: 'Extra hands and guidance when harvest arrives.',
      href: '/services/one-time-harvest-support',
      image: '/images/services/grid-one-time-harvest.jpg',
    },
    {
      title: 'Kitchen gardens & landscaping',
      description: 'Gardens and landscaped spaces designed for your home.',
      href: '/services/kitchen-gardens-landscaping',
      image: '/images/services/grid-kitchen-gardens.jpg',
    },
    {
      title: 'Agricultural construction & development coordination',
      description: 'Coordination of farm construction and land development, where offered.',
      href: '/services/construction-development-coordination',
      image: '/images/services/grid-agri-construction.jpg',
    },
  ];

  const managedCareServices: ServiceCard[] = [
    {
      title: 'Managed farms & orchards',
      description: 'Ongoing care for productive land.',
      href: '/managed-care/managed-farms-orchards',
      image: '/images/managed/cat-managed-farms.jpg',
    },
    {
      title: 'Vacant-land upkeep',
      description: 'Keep an unused plot clean, visible and cared for.',
      href: '/managed-care/vacant-land-upkeep',
      image: '/images/managed/cat-vacant-site.jpg',
    },
    {
      title: 'Farmhouse garden care',
      description: 'Landscape and lawn care for farmhouses and weekend homes.',
      href: '/managed-care/farmhouse-garden-care',
      image: '/images/managed/cat-farmhouse-landscape.jpg',
    },
    {
      title: 'Terrace garden maintenance',
      description: 'Scheduled care so your terrace stays green.',
      href: '/managed-care/terrace-garden-maintenance',
      image: '/images/managed/cat-terrace-gardens.jpg',
    },
    {
      title: 'Seasonal planting & upkeep',
      description: 'Plan and grow what suits your space and the season.',
      href: '/managed-care/seasonal-planting-upkeep',
      image: '/images/managed/plot-after.jpg',
    },
    {
      title: 'Harvest assistance',
      description: 'Support through each harvest, including surplus.',
      href: '/managed-care/harvest-assistance',
      image: '/images/managed/harvest-surplus-basket.jpg',
    },
  ];

  const landownerServices: ServiceCard[] = [
    {
      title: 'Agricultural landowner enquiries',
      description: 'Tell us about your land and what you are considering.',
      href: '/landowners/landowner-enquiries',
      image: '/images/landowners/lease-directly.jpg',
    },
    {
      title: 'Farm leasing & operator partnerships',
      description: 'Direct leasing or an introduction to a suitable operator, where offered.',
      href: '/landowners/farm-leasing-operator-partnerships',
      image: '/images/landowners/lease-partner.jpg',
    },
    {
      title: 'Agricultural project enquiries',
      description: 'Discuss an agricultural project involving your land.',
      href: '/landowners/agricultural-project-enquiries',
      image: '/images/landowners/future-project-participation.jpg',
    },
  ];

  return (
    <div className="w-full bg-ivory">
      {/* Breadcrumbs */}
      <div className="border-b border-charcoal/10 py-3.5 px-5 bg-cream/40">
        <div className="max-w-[1280px] mx-auto">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Our Services' }]} />
        </div>
      </div>

      {/* Header Intro */}
      <section className="pt-14 pb-8 sm:pt-20 sm:pb-10">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="space-y-3.5 max-w-[42em]">
            <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
              <span>Our services</span>
              <span className="w-10 h-[1px] bg-gold inline-block" />
            </div>
            <h1 className="font-serif text-forest-deep text-[clamp(2.2rem,4.8vw,3.6rem)] font-normal leading-[1.05] tracking-tight">
              One thoughtful beginning. Lasting possibilities.
            </h1>
            <p className="text-[17px] sm:text-[18px] text-charcoal/80 leading-relaxed font-sans">
              Expert setup, ongoing care and landowner support, tailored to your space.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: One-time Services */}
      <section id="one-time" className="py-10 sm:py-14 border-t border-charcoal/10">
        <div className="max-w-[1280px] mx-auto px-5">
          <h2 className="font-serif text-forest-deep text-[clamp(2rem,4vw,3rem)] font-normal mb-8">
            One-time services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {oneTimeServices.map((card, idx) => (
              <Link
                key={idx}
                href={card.href}
                className="group flex flex-col bg-white/60 border border-charcoal/10 rounded-xl overflow-hidden hover:border-gold hover:shadow-soft transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3 className="font-serif text-[24px] text-forest-deep leading-snug group-hover:text-botanical transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[14.5px] text-charcoal/70 leading-relaxed font-sans">
                    {card.description}
                  </p>
                  <span className="mt-auto pt-3 text-[14px] font-semibold text-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Managed Care */}
      <section id="managed" className="py-10 sm:py-14 bg-cream/40 border-t border-charcoal/10">
        <div className="max-w-[1280px] mx-auto px-5">
          <h2 className="font-serif text-forest-deep text-[clamp(2rem,4vw,3rem)] font-normal mb-8">
            Managed care
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {managedCareServices.map((card, idx) => (
              <Link
                key={idx}
                href={card.href}
                className="group flex flex-col bg-white/80 border border-charcoal/10 rounded-xl overflow-hidden hover:border-gold hover:shadow-soft transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3 className="font-serif text-[24px] text-forest-deep leading-snug group-hover:text-botanical transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[14.5px] text-charcoal/70 leading-relaxed font-sans">
                    {card.description}
                  </p>
                  <span className="mt-auto pt-3 text-[14px] font-semibold text-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Landowners & Projects */}
      <section id="landowner" className="py-10 sm:py-14 border-t border-charcoal/10">
        <div className="max-w-[1280px] mx-auto px-5">
          <h2 className="font-serif text-forest-deep text-[clamp(2rem,4vw,3rem)] font-normal mb-8">
            Landowners & projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {landownerServices.map((card, idx) => (
              <Link
                key={idx}
                href={card.href}
                className="group flex flex-col bg-white/60 border border-charcoal/10 rounded-xl overflow-hidden hover:border-gold hover:shadow-soft transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3 className="font-serif text-[24px] text-forest-deep leading-snug group-hover:text-botanical transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[14.5px] text-charcoal/70 leading-relaxed font-sans">
                    {card.description}
                  </p>
                  <span className="mt-auto pt-3 text-[14px] font-semibold text-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-8 text-[14px] text-charcoal/65 font-sans">
            Services marked &quot;where offered&quot; depend on location and availability. Scope and pricing are agreed after assessment.
          </p>
        </div>
      </section>

      {/* Section 4: Specialized Agricultural & Land Services */}
      <section className="py-14 sm:py-20 bg-cream/30 border-t border-charcoal/10">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="max-w-[42em] space-y-3 mb-10 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gold block">
              Additional Agricultural & Land Services
            </span>
            <h2 className="font-serif text-forest-deep text-[clamp(2rem,4vw,3.2rem)] font-normal leading-tight">
              Specialized services tailored to your exact land requirement.
            </h2>
            <p className="text-[16px] sm:text-[17px] text-charcoal/80 font-sans font-light">
              Beyond our core business models, these specialized technical services can be engaged individually as standalone projects or integrated into larger farm development agreements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
            {specializedServiceClusters.map((cluster) => (
              <div key={cluster.id} className="p-6 sm:p-7 rounded-2xl bg-white border border-charcoal/10 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-forest-deep font-medium mb-1">{cluster.title}</h3>
                  <p className="text-xs text-charcoal/60 mb-5 font-sans">{cluster.tagline}</p>
                  <ul className="space-y-3.5 text-xs sm:text-[13px] text-charcoal/80 font-sans">
                    {cluster.services.map((s, sIdx) => (
                      <li key={sIdx} className="border-t border-charcoal/10 pt-2.5">
                        <strong className="text-forest-deep block text-sm font-semibold mb-0.5">{s.title}</strong>
                        <span className="text-charcoal/70 leading-relaxed block">{s.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-6 mt-6 border-t border-charcoal/10">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-full bg-forest text-ivory hover:bg-forest-dark text-xs font-semibold transition-all shadow-xs"
                  >
                    Inquire About This Service →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Banner */}
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

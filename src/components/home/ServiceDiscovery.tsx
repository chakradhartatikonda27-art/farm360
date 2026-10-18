'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ServiceCard {
  title: string;
  description: string;
  href: string;
  image: string;
}

export function ServiceDiscovery() {
  const services: ServiceCard[] = [
    {
      title: 'Farm & land planning',
      description: 'Crop, farm and plot layouts planned around your goals.',
      href: '/services/farm-and-land-planning',
      image: '/images/services/card-land-design.jpg',
    },
    {
      title: 'Land preparation',
      description: 'Ground made ready for planting or development.',
      href: '/services/land-preparation',
      image: '/images/services/grid-land-cleaning.jpg',
    },
    {
      title: 'Fencing & boundary protection',
      description: 'Boundaries, fencing and security matched to your land.',
      href: '/services/fencing-and-boundary-protection',
      image: '/images/services/feat-fencing-boundary.jpg',
    },
    {
      title: 'Drip irrigation & sprinklers',
      description: 'Efficient watering systems designed for your space.',
      href: '/services/drip-and-sprinkler-installation',
      image: '/images/services/grid-drip-sprinkler.jpg',
    },
    {
      title: 'Soil & water testing coordination',
      description: 'Testing support for informed farm and garden planning.',
      href: '/services/soil-and-water-testing',
      image: '/images/services/grid-soil-water-testing.jpg',
    },
    {
      title: 'Kitchen gardens & landscaping',
      description: 'Gardens and landscaped spaces designed for your home.',
      href: '/services/kitchen-gardens-and-landscaping',
      image: '/images/services/card-terrace-garden.jpg',
    },
    {
      title: 'Managed farms & orchards',
      description: 'Ongoing care for productive land.',
      href: '/managed-care/managed-farms-and-orchards',
      image: '/images/services/card-managed-orchard.jpg',
    },
    {
      title: 'One-time harvest support',
      description: 'Extra hands and guidance when harvest arrives.',
      href: '/services/one-time-harvest-support',
      image: '/images/services/grid-one-time-harvest.jpg',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-ivory">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Section Header */}
        <div className="space-y-3.5 max-w-[42em]">
          <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
            <span>Our services</span>
            <span className="w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h2 className="font-serif text-forest-deep text-[clamp(2rem,4.6vw,3.5rem)] font-normal leading-[1.05] tracking-tight">
            What would you like to create?
          </h2>
          <p className="text-[17px] sm:text-[18px] text-charcoal/80 leading-relaxed font-sans">
            Every space is different. Discover practical solutions designed around your land, goals, and long-term plans.
          </p>
        </div>

        {/* 8 Services Grid (4 cols on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-11">
          {services.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group flex flex-col bg-white/60 border border-charcoal/10 rounded-xl overflow-hidden hover:border-gold hover:shadow-soft transition-all duration-300"
            >
              {/* Image with Aspect Ratio 16/10 */}
              <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="font-serif text-[24px] text-forest-deep leading-snug group-hover:text-botanical transition-colors">
                  {item.title}
                </h3>
                <p className="text-[14.5px] text-charcoal/70 leading-relaxed font-sans">
                  {item.description}
                </p>
                <span className="mt-auto pt-3 text-[14px] font-semibold text-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Learn more →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Services Link */}
        <div className="mt-8">
          <Link
            href="/services"
            className="font-sans font-bold text-forest text-base underline underline-offset-4 hover:text-forest-deep transition-colors"
          >
            View all services →
          </Link>
        </div>
      </div>
    </section>
  );
}

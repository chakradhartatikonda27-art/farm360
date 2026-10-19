'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Images } from 'lucide-react';

export interface ProjectGalleryItem {
  title: string;
  image: string;
  category?: string;
  isHero?: boolean;
}

interface ProjectGalleryProps {
  badge?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  items?: ProjectGalleryItem[];
}

const defaultGalleryItems: ProjectGalleryItem[] = [
  {
    title: 'Productive farmland',
    image: '/images/managed/cat-managed-farms.jpg',
    category: 'farms',
    isHero: true,
  },
  {
    title: 'Land preparation',
    image: '/images/services/grid-land-cleaning.jpg',
    category: 'farms',
  },
  {
    title: 'Irrigation systems',
    image: '/images/services/grid-drip-sprinkler.jpg',
    category: 'irrigation',
  },
  {
    title: 'Farm boundaries',
    image: '/images/services/feat-fencing-boundary.jpg',
    category: 'boundaries',
  },
  {
    title: 'Kitchen gardens',
    image: '/images/managed/plot-after.jpg',
    category: 'gardens',
  },
  {
    title: 'Fruit orchards',
    image: '/images/services/card-managed-orchard.jpg',
    category: 'orchards',
  },
  {
    title: 'Landscaped outdoor spaces',
    image: '/images/services/card-terrace-garden.jpg',
    category: 'gardens',
  },
];

export function ProjectGallery({
  badge,
  title,
  description,
  ctaText,
  ctaLink,
  items,
}: ProjectGalleryProps = {}) {
  const displayBadge = badge || 'Photo Gallery';
  const displayTitle = title || 'Possibilities start with a plan.';
  const displayDesc =
    description ||
    'Explore our visual blueprints, orchard setups, and agricultural transformations.';
  const displayCtaText = ctaText || 'Explore Full Gallery (14+ Projects)';
  const displayCtaLink = ctaLink || '/gallery';
  const displayItems = items && items.length > 0 ? items : defaultGalleryItems;

  return (
    <section className="py-12 sm:py-20 bg-ivory">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Section Header with direct link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
          <div className="space-y-3.5 max-w-[42em]">
            <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
              <span>{displayBadge}</span>
              <span className="w-10 h-[1px] bg-gold inline-block" />
            </div>
            <h2 className="font-serif text-forest-deep text-[clamp(2rem,4.6vw,3.5rem)] font-normal leading-[1.05] tracking-tight">
              {displayTitle}
            </h2>
            <p className="text-[16px] sm:text-[18px] text-charcoal/80 leading-relaxed font-sans font-light">
              {displayDesc}
            </p>
          </div>

          <Link
            href={displayCtaLink}
            className="inline-flex items-center gap-2 self-start sm:self-end px-5 py-2.5 rounded-full bg-forest text-ivory hover:bg-forest-dark transition-all text-xs sm:text-sm font-semibold active:scale-95 shadow-xs"
          >
            <Images className="w-4 h-4" />
            <span>{displayCtaText}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 7-Item Grid Layout (4 columns on desktop, 2 on mobile, item 1 spans 2x2) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5 mt-10">
          {displayItems.map((item, idx) => (
            <Link
              key={idx}
              href="/gallery"
              className={`relative m-0 rounded-[10px] overflow-hidden group block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                item.isHero
                  ? 'col-span-2 row-span-2 min-h-[300px] sm:min-h-[420px]'
                  : 'aspect-[4/3]'
              }`}
              aria-label={`View ${item.title} in photo gallery`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={item.isHero ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
              />
              <div className="absolute inset-x-0 bottom-0 pt-7 pb-3 px-3 text-white font-sans text-sm font-medium bg-gradient-to-t from-forest-dark/90 via-forest-dark/45 to-transparent flex items-center justify-between pointer-events-none">
                <span>{item.title}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gold text-xs font-bold">
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

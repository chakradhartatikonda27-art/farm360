'use client';

import React from 'react';
import Image from 'next/image';

export function ProjectGallery() {
  const galleryItems = [
    {
      title: 'Productive farmland',
      image: '/images/managed/cat-managed-farms.jpg',
      isHero: true,
    },
    {
      title: 'Land preparation',
      image: '/images/services/grid-land-cleaning.jpg',
    },
    {
      title: 'Irrigation systems',
      image: '/images/services/grid-drip-sprinkler.jpg',
    },
    {
      title: 'Farm boundaries',
      image: '/images/services/feat-fencing-boundary.jpg',
    },
    {
      title: 'Kitchen gardens',
      image: '/images/managed/plot-after.jpg',
    },
    {
      title: 'Fruit orchards',
      image: '/images/services/card-managed-orchard.jpg',
    },
    {
      title: 'Landscaped outdoor spaces',
      image: '/images/services/card-terrace-garden.jpg',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-ivory">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Section Header */}
        <div className="space-y-3.5 max-w-[42em]">
          <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
            <span>Gallery</span>
            <span className="w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h2 className="font-serif text-forest-deep text-[clamp(2rem,4.6vw,3.5rem)] font-normal leading-[1.05] tracking-tight">
            Possibilities start with a plan.
          </h2>
          <p className="text-[17px] sm:text-[18px] text-charcoal/80 leading-relaxed font-sans">
            Concept imagery shown for illustration. It does not depict completed client work.
          </p>
        </div>

        {/* 7-Item Grid Layout (4 columns on desktop, 2 on mobile, item 1 spans 2x2) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5 mt-10">
          {galleryItems.map((item, idx) => (
            <figure
              key={idx}
              className={`relative m-0 rounded-[10px] overflow-hidden group ${
                item.isHero
                  ? 'col-span-2 row-span-2 min-h-[300px] sm:min-h-[420px]'
                  : 'aspect-[4/3]'
              }`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={item.isHero ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
              />
              <figcaption className="absolute inset-x-0 bottom-0 pt-7 pb-3 px-3 text-white font-sans text-sm font-medium bg-gradient-to-t from-forest-dark/85 via-forest-dark/40 to-transparent pointer-events-none">
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

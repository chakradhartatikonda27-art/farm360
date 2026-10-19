'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { ZoomIn, MapPin } from 'lucide-react';
import { galleryItems, galleryCategories, GalleryItem } from '@/data/galleryData';
import { GalleryLightbox } from './GalleryLightbox';

export function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const currentItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  const handleNext = () => {
    if (selectedItemIndex !== null) {
      setSelectedItemIndex((selectedItemIndex + 1) % filteredItems.length);
    }
  };

  const handlePrev = () => {
    if (selectedItemIndex !== null) {
      setSelectedItemIndex(
        (selectedItemIndex - 1 + filteredItems.length) % filteredItems.length
      );
    }
  };

  return (
    <>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 my-8 sm:my-10" role="tablist" aria-label="Gallery category filters">
        {galleryCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedItemIndex(null);
              }}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold active:scale-95 ${
                isActive
                  ? 'bg-forest text-ivory shadow-sm'
                  : 'bg-white/80 hover:bg-cream text-charcoal/80 border border-charcoal/10'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Counter summary */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-charcoal/60 mb-6 font-sans">
        <span>Showing {filteredItems.length} curated agricultural projects</span>
        <span className="hidden sm:inline">Click any photo to view specifications & full detail</span>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filteredItems.map((item, index) => (
          <article
            key={item.id}
            onClick={() => setSelectedItemIndex(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedItemIndex(index);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View photo and specifications for ${item.title}`}
            className="group flex flex-col bg-white/70 hover:bg-white rounded-2xl overflow-hidden border border-charcoal/10 hover:border-gold shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {/* Image Container with Zoom effect */}
            <div className="relative aspect-[16/10] overflow-hidden bg-forest-dark">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-forest-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="w-12 h-12 rounded-full bg-gold text-forest-deep flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <ZoomIn className="w-6 h-6" />
                </span>
              </div>

              {/* Category pill */}
              <div className="absolute top-3 left-3">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-forest-dark/85 text-ivory backdrop-blur-xs border border-white/10 shadow-xs">
                  {item.categoryLabel}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-gold text-xs font-semibold mb-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{item.locationContext}</span>
                </div>
                <h3 className="font-serif text-forest-deep text-xl font-medium leading-snug group-hover:text-forest transition-colors">
                  {item.title}
                </h3>
                <p className="text-charcoal/70 text-xs sm:text-[13.5px] line-clamp-2 mt-2 font-sans font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-charcoal/10 flex items-center justify-between text-xs font-semibold text-forest">
                <span>View Full Blueprint</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox Modal */}
      <GalleryLightbox
        item={currentItem}
        isOpen={selectedItemIndex !== null}
        onClose={() => setSelectedItemIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
}

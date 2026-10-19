'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, MapPin, Tag } from 'lucide-react';
import { GalleryItem } from '@/data/galleryData';

interface GalleryLightboxProps {
  item: GalleryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function GalleryLightbox({
  item,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync open state with native HTML5 dialog showModal()
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && item) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen, item]);

  // Light-dismiss fallback for browsers without native closedBy support
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleDialogClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isDialogContent) {
        onClose();
      }
    };

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('click', handleDialogClick);
    dialog.addEventListener('cancel', handleCancel);

    return () => {
      dialog.removeEventListener('click', handleDialogClick);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  if (!item) return null;

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="lightbox-title"
      className="m-auto p-0 bg-ivory rounded-2xl max-w-4xl w-[94vw] border border-charcoal/15 shadow-2xl backdrop:bg-forest-dark/75 overflow-hidden transition-all duration-300"
    >
      <div className="flex flex-col max-h-[90vh] overflow-y-auto overscroll-contain">
        {/* Top Header bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal/10 bg-cream/50 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest text-ivory">
              <Tag className="w-3.5 h-3.5" />
              {item.categoryLabel}
            </span>
            <span className="text-xs font-medium text-charcoal/60 uppercase tracking-wider hidden sm:inline">
              {item.typeBadge}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-charcoal/10 hover:bg-charcoal/20 flex items-center justify-center text-charcoal transition-colors active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Close photo preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Container with Previous/Next Arrows */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-forest-dark flex items-center justify-center overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            priority
            className="object-contain"
            sizes="(max-width: 1024px) 95vw, 1000px"
          />

          {/* Navigation Arrows */}
          {onPrev && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-forest-dark/80 hover:bg-forest-dark text-white border border-white/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {onNext && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-forest-dark/80 hover:bg-forest-dark text-white border border-white/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Details & Specs Footer */}
        <div className="p-6 sm:p-7 space-y-4 bg-ivory">
          <div>
            <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{item.locationContext}</span>
            </div>
            <h2 id="lightbox-title" className="font-serif text-forest-deep text-2xl sm:text-3xl font-medium">
              {item.title}
            </h2>
          </div>

          <p className="text-[15px] sm:text-[16px] text-charcoal/85 leading-relaxed font-sans font-light">
            {item.description}
          </p>

          {item.specifications && item.specifications.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2.5">
                Key Agronomic & Technical Specifications
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.specifications.map((spec, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center px-3 py-1 rounded-md bg-cream text-charcoal/90 text-xs font-medium border border-charcoal/10"
                  >
                    • {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-charcoal/60 font-sans">
              Press <kbd className="px-1.5 py-0.5 rounded bg-cream border text-charcoal font-mono text-[11px]">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-cream border text-charcoal font-mono text-[11px]">→</kbd> to browse
            </span>

            <Link
              href="/contact"
              onClick={onClose}
              className="inline-flex items-center justify-center min-h-[42px] px-6 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-sm transition-all shadow-sm"
            >
              Consult for Your Land →
            </Link>
          </div>
        </div>
      </div>
    </dialog>
  );
}

'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before: Idle & Overgrown',
  afterLabel = 'Possibilities After Care',
  className = '',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl bg-cream border border-cream shadow-soft aspect-[4/3] sm:aspect-[16/11] cursor-ew-resize group ${className}`}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Background (After image) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={afterImage}
          alt={afterLabel}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute top-4 right-4 bg-forest-dark/85 backdrop-blur-md text-ivory text-xs font-medium px-3 py-1.5 rounded-full shadow-sm z-10 border border-white/10 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gold"></span>
          <span>{afterLabel}</span>
        </div>
      </div>

      {/* Foreground (Before image clipped) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <Image
          src={beforeImage}
          alt={beforeLabel}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute top-4 left-4 bg-charcoal/85 backdrop-blur-md text-ivory text-xs font-medium px-3 py-1.5 rounded-full shadow-sm z-10 border border-white/10 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sage"></span>
          <span>{beforeLabel}</span>
        </div>
      </div>

      {/* Divider Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-ivory shadow-lg z-20 pointer-events-none transition-transform"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Handle Button */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-forest-dark border-2 border-gold text-ivory flex items-center justify-center shadow-elevated pointer-events-auto cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-0.5 text-xs text-gold font-bold">
            <span>‹</span>
            <span>›</span>
          </div>
        </div>
      </div>

      {/* Accessible native range input for keyboard users */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        className="sr-only"
        aria-label="Comparison slider position between before and after images"
      />
    </div>
  );
}

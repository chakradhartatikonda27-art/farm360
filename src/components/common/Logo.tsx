'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark' | 'emblem';
  className?: string;
  height?: number;
}

export function Logo({ variant = 'dark', className = '', height = 48 }: LogoProps) {
  // 'dark' = for light backgrounds (dark forest green text & emblem on ivory/white)
  // 'light' = for dark backgrounds (ivory/white text & emblem on deep forest green)
  // 'emblem' = icon only
  
  const isDarkBg = variant === 'light';
  
  return (
    <Link 
      href="/" 
      className={`inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm ${className}`}
      aria-label="FarmCare 360° — Complete Agricultural Solutions Homepage"
    >
      {variant === 'emblem' ? (
        <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
          <Image
            src="/images/brand/logo-emblem.png"
            alt="FarmCare 360° Emblem"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {/* Emblem Icon */}
          <div className="relative w-11 h-11 shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/brand/logo-emblem.png"
              alt="FarmCare 360° Emblem"
              width={44}
              height={44}
              className={`object-contain ${isDarkBg ? 'brightness-200 contrast-125' : ''}`}
              priority
            />
          </div>

          {/* Typography Lockup */}
          <div className="flex flex-col justify-center">
            <span
              className={`text-2xl font-serif font-bold tracking-tight leading-none ${
                isDarkBg ? 'text-ivory' : 'text-forest'
              }`}
            >
              FarmCare 360°
            </span>
            <span
              className={`text-[9.5px] font-sans font-semibold tracking-[0.16em] uppercase mt-1 leading-none ${
                isDarkBg ? 'text-ivory/75' : 'text-forest/80'
              }`}
            >
              Complete Agricultural Solutions
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}

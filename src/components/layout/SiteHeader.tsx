'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../common/Logo';

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Our Services', href: '/services' },
    { label: 'Managed Care', href: '/managed-care' },
    { label: 'For Landowners', href: '/landowners' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Announcement Ticker */}
      <div className="ticker" role="region" aria-label="Announcements">
        <div className="track">
          <span>Your land. Our care. Every step.</span>
          <span>Plan</span>
          <span>Develop</span>
          <span>Protect</span>
          <span>Grow</span>
          <span>Harvest</span>
          <span>One-time services</span>
          <span>Managed care</span>
          <span>Landowner support</span>
          <span>Healthy land, brighter tomorrows</span>
          <span>Your land. Our care. Every step.</span>
          <span>Plan</span>
          <span>Develop</span>
          <span>Protect</span>
          <span>Grow</span>
          <span>Harvest</span>
          <span>One-time services</span>
          <span>Managed care</span>
          <span>Landowner support</span>
          <span>Healthy land, brighter tomorrows</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#F7F4EA]/95 backdrop-blur-md border-b border-[#252C26]/10 transition-colors">
        <div className="max-w-[1280px] mx-auto px-5">
        <div className="flex items-center justify-between h-[72px] gap-5">
          {/* Official Brand Logo Lockup */}
          <Link 
            href="/" 
            className="flex-shrink-0 flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="FarmCare 360° - Home"
          >
            <Logo variant="dark" height={44} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[15px]" aria-label="Main navigation">
            {navLinks.map((link) => {
              const currentPath = pathname || '/';
              const isActive = link.href === '/' 
                ? currentPath === '/' 
                : currentPath === link.href || currentPath.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`py-1 border-b-2 font-medium transition-colors ${
                    isActive
                      ? 'border-gold text-forest-deep font-semibold'
                      : 'border-transparent text-charcoal/90 hover:text-forest-deep hover:border-gold'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Consultation Action (Champagne Gold per Reference) */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center min-h-[42px] px-6 rounded-full bg-gold hover:bg-[#D4B66B] text-forest-deep font-sans font-semibold text-[14.5px] transition-all shadow-sm hover:shadow"
            >
              Plan a Consultation
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center min-h-[38px] px-4 rounded-full bg-gold text-forest-deep font-sans font-semibold text-xs sm:text-[13px] transition-colors"
            >
              Consultation
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-12 h-12 flex flex-col items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
              aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMobileMenuOpen}
            >
              <span className={`block w-6 h-[2px] bg-forest transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
              <span className={`block w-6 h-[2px] bg-forest transition-opacity duration-200 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-[2px] bg-forest transition-transform duration-200 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <nav 
          className="lg:hidden fixed inset-x-0 top-[72px] bottom-0 bg-ivory z-50 flex flex-col px-6 py-6 overflow-y-auto animate-in fade-in duration-200 border-t border-charcoal/10"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col divide-y divide-charcoal/10">
            {navLinks.map((link) => {
              const currentPath = pathname || '/';
              const isActive = link.href === '/' 
                ? currentPath === '/' 
                : currentPath === link.href || currentPath.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-serif text-[28px] py-4 transition-colors ${
                    isActive
                      ? 'text-forest font-semibold border-l-4 border-gold pl-3'
                      : 'text-forest-deep hover:text-forest'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-charcoal/10 space-y-3">
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center min-h-[48px] px-6 rounded-full bg-gold hover:bg-[#D4B66B] text-forest-deep font-sans font-semibold text-base transition-colors"
            >
              Plan a Consultation
            </Link>
            <p className="text-center text-xs tracking-wider uppercase text-charcoal/60 pt-2">
              Healthy land, brighter tomorrows.
            </p>
          </div>
        </nav>
      )}
    </header>
  </>
);
}

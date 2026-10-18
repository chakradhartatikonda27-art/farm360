'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, Youtube, Linkedin } from 'lucide-react';
import { Logo } from '../common/Logo';
import { WhatsAppIcon } from '../common/FloatingWhatsApp';

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

          {/* Desktop Actions: WhatsApp + Consultation */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://wa.me/919876543210?text=Hello%20FarmCare%20360%C2%B0%2C%20I%20would%20like%20to%20discuss%20my%20property%20requirements."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with FarmCare 360° on WhatsApp"
              className="inline-flex items-center gap-2 min-h-[42px] px-3.5 py-1.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-medium text-[13.5px] transition-all border border-[#25D366]/30 shadow-xs"
            >
              <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
              <span className="hidden xl:inline">WhatsApp</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center min-h-[42px] px-6 rounded-full bg-gold hover:bg-[#D4B66B] text-forest-deep font-sans font-semibold text-[14.5px] transition-all shadow-sm hover:shadow"
            >
              Plan a Consultation
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">
            <a
              href="https://wa.me/919876543210?text=Hello%20FarmCare%20360%C2%B0%2C%20I%20would%20like%20to%20discuss%20my%20property%20requirements."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="w-10 h-10 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#128C7E] active:scale-95 transition-all"
            >
              <WhatsAppIcon className="w-5 h-5 fill-[#25D366]" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center min-h-[40px] px-3.5 sm:px-4 rounded-full bg-gold text-forest-deep font-sans font-semibold text-xs sm:text-[13.5px] transition-all active:scale-95 shadow-sm"
            >
              Consultation
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-11 h-11 flex flex-col items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl active:bg-cream/60 transition-colors touch-manipulation"
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
          className="lg:hidden fixed inset-x-0 top-[72px] h-[calc(100dvh-72px)] bg-ivory z-50 flex flex-col px-6 pt-6 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] overflow-y-auto animate-in fade-in duration-200 border-t border-charcoal/10 overscroll-contain"
          style={{
            paddingLeft: 'max(1.5rem, env(safe-area-inset-left, 0px))',
            paddingRight: 'max(1.5rem, env(safe-area-inset-right, 0px))',
          }}
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
                  className={`font-serif text-[26px] sm:text-[30px] py-4 transition-colors ${
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

          <div className="mt-auto pt-6 border-t border-charcoal/10 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="https://wa.me/919876543210?text=Hello%20FarmCare%20360%C2%B0%2C%20I%20would%20like%20to%20discuss%20my%20property%20requirements."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-sans font-semibold text-[15px] transition-all shadow-sm"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center min-h-[48px] px-4 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-[15px] transition-all shadow-sm"
              >
                Plan a Consultation
              </Link>
            </div>

            {/* Social Channels row */}
            <div className="pt-2">
              <p className="text-xs uppercase tracking-wider text-charcoal/50 font-semibold mb-2.5 text-center">Follow & Connect</p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href="https://instagram.com/farmcare360"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="FarmCare 360° on Instagram"
                  className="w-10 h-10 rounded-full bg-white/80 border border-charcoal/10 flex items-center justify-center text-charcoal/70 hover:text-[#E4405F] hover:border-[#E4405F]/40 active:scale-95 transition-all shadow-xs"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com/@farmcare360"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="FarmCare 360° on YouTube"
                  className="w-10 h-10 rounded-full bg-white/80 border border-charcoal/10 flex items-center justify-center text-charcoal/70 hover:text-[#FF0000] hover:border-[#FF0000]/40 active:scale-95 transition-all shadow-xs"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com/company/farmcare360"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="FarmCare 360° on LinkedIn"
                  className="w-10 h-10 rounded-full bg-white/80 border border-charcoal/10 flex items-center justify-center text-charcoal/70 hover:text-[#0A66C2] hover:border-[#0A66C2]/40 active:scale-95 transition-all shadow-xs"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/919876543210?text=Hello%20FarmCare%20360%C2%B0%2C%20I%20would%20like%20to%20discuss%20my%20property%20requirements."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="FarmCare 360° on WhatsApp"
                  className="w-10 h-10 rounded-full bg-white/80 border border-charcoal/10 flex items-center justify-center text-charcoal/70 hover:text-[#25D366] hover:border-[#25D366]/40 active:scale-95 transition-all shadow-xs"
                >
                  <WhatsAppIcon className="w-5 h-5 fill-current" />
                </a>
              </div>
            </div>

            <p className="text-center text-xs tracking-wider uppercase text-charcoal/60 pt-1">
              Healthy land, brighter tomorrows.
            </p>
          </div>
        </nav>
      )}
    </header>
  </>
);
}

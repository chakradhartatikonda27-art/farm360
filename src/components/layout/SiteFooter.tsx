'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../common/Logo';

export function SiteFooter() {
  return (
    <footer className="bg-forest-dark text-white/85 py-14 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Footer Grid: 1.3fr 1fr 1fr 1fr */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-9">
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4">
            <Logo variant="light" height={44} />
            <p className="mt-4 max-w-[22em] text-[14.5px] text-white/80 leading-relaxed font-sans font-light">
              Healthy land, brighter tomorrows. Your land. Our care. Every step.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="font-sans font-bold text-xs tracking-[0.2em] uppercase text-gold mb-3.5">
              Explore
            </h4>
            <ul className="space-y-2 text-[14.5px] text-white/80 font-sans">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/managed-care" className="hover:text-white transition-colors">
                  Managed Care
                </Link>
              </li>
              <li>
                <Link href="/landowners" className="hover:text-white transition-colors">
                  For Landowners
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="font-sans font-bold text-xs tracking-[0.2em] uppercase text-gold mb-3.5">
              Services
            </h4>
            <ul className="space-y-2 text-[14.5px] text-white/80 font-sans">
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  One-time services
                </Link>
              </li>
              <li>
                <Link href="/managed-care" className="hover:text-white transition-colors">
                  Managed care
                </Link>
              </li>
              <li>
                <Link href="/landowners" className="hover:text-white transition-colors">
                  Landowners & projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-sans font-bold text-xs tracking-[0.2em] uppercase text-gold mb-3.5">
              Contact
            </h4>
            <p className="text-[14.5px] text-white/75 leading-relaxed font-sans">
              Please use the consultation form.
            </p>
            <div className="mt-3">
              <Link
                href="/contact"
                className="inline-block text-gold hover:text-white text-sm font-semibold underline underline-offset-4 transition-colors"
              >
                Plan a Consultation →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="mt-9 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-white/60 font-sans">
          <span>© 2026 FarmCare 360°. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

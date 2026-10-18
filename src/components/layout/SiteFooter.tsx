import React from 'react';
import Link from 'next/link';
import { Instagram, Youtube, Linkedin } from 'lucide-react';
import { Logo } from '../common/Logo';
import { WhatsAppIcon } from '../common/FloatingWhatsApp';

export function SiteFooter() {
  return (
    <footer className="bg-forest-dark text-white/85 pt-12 sm:pt-14 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] border-t border-white/10">
      <div 
        className="max-w-[1280px] mx-auto px-5"
        style={{
          paddingLeft: 'max(1.25rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(1.25rem, env(safe-area-inset-right, 0px))',
        }}
      >
        {/* Footer Grid: 1.3fr 1fr 1fr 1fr */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-9">
          {/* Column 1: Brand & Philosophy + Social Media */}
          <div className="space-y-4">
            <Logo variant="light" height={44} />
            <p className="mt-4 max-w-[22em] text-[14.5px] text-white/80 leading-relaxed font-sans font-light">
              Healthy land, brighter tomorrows. Your land. Our care. Every step.
            </p>

            {/* Social Media & Instant Messaging */}
            <div className="pt-2">
              <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-3">
                Follow & Connect
              </span>
              <div className="flex items-center gap-3">
                {/* Instagram */}
                <a
                  href="https://instagram.com/farmcare360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#E4405F] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
                  aria-label="Follow FarmCare 360° on Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@farmcare360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF0000] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
                  aria-label="Subscribe to FarmCare 360° on YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/farmcare360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#0A66C2] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
                  aria-label="Connect with FarmCare 360° on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/919876543210?text=Hello%20FarmCare%20360%C2%B0%2C%20I%20would%20like%20to%20discuss%20my%20property%20requirements."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#25D366] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
                  aria-label="Chat with FarmCare 360° on WhatsApp"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
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
            <div className="mt-3 flex flex-col gap-2.5">
              <Link
                href="/contact"
                className="inline-block text-gold hover:text-white text-sm font-semibold underline underline-offset-4 transition-colors"
              >
                Plan a Consultation →
              </Link>
              <a
                href="https://wa.me/919876543210?text=Hello%20FarmCare%20360%C2%B0%2C%20I%20would%20like%20to%20discuss%20my%20property%20requirements."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] border border-[#25D366]/40 text-[#25D366] hover:text-white transition-all text-xs font-semibold w-fit active:scale-95"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
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

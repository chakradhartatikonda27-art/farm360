'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Instagram, 
  Youtube, 
  Linkedin, 
  ChevronDown,
  Layers,
  Compass,
  ShieldCheck,
  Building2,
  Images,
  Quote,
  Sparkles
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { WhatsAppIcon } from '../common/FloatingWhatsApp';

interface DropdownItem {
  label: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Close mobile menu & dropdowns on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
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

  // Smooth hover handlers with debounce
  const handleMouseEnter = (menuKey: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const servicesDropdownItems: DropdownItem[] = [
    {
      label: 'All Services',
      href: '/services',
      description: 'Land assessment, advisory & tech clusters',
      icon: Layers,
    },
    {
      label: 'Spaces We Serve',
      href: '/for-your-space',
      description: 'Farms, open plots, terraces & home spaces',
      icon: Compass,
    },
    {
      label: 'Managed Care',
      href: '/managed-care',
      description: 'Ongoing supervision, labor & farm ops',
      icon: ShieldCheck,
    },
    {
      label: 'For Landowners',
      href: '/landowners',
      description: 'Direct leasing, partnerships & management',
      icon: Building2,
    },
  ];

  const exploreDropdownItems: DropdownItem[] = [
    {
      label: 'Photo Gallery',
      href: '/gallery',
      description: 'Real site transformations, crops & systems',
      icon: Images,
    },
    {
      label: 'Testimonials',
      href: '/testimonials',
      description: 'Verified reviews from landowners & clients',
      icon: Quote,
    },
  ];

  const currentPath = pathname || '/';
  const isServicesActive = servicesDropdownItems.some(item => currentPath === item.href || currentPath.startsWith(`${item.href}/`));
  const isExploreActive = exploreDropdownItems.some(item => currentPath === item.href || currentPath.startsWith(`${item.href}/`));

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
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[74px] gap-4">
            
            {/* Official Brand Logo Lockup */}
            <Link 
              href="/" 
              className="flex-shrink-0 flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
              aria-label="FarmCare 360° - Home"
            >
              <Logo variant="dark" height={44} />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3 text-[14px]" aria-label="Main navigation">
              
              {/* Home */}
              <Link
                href="/"
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  currentPath === '/'
                    ? 'text-forest-deep font-semibold bg-forest/8'
                    : 'text-charcoal/85 hover:text-forest-deep hover:bg-forest/5'
                }`}
              >
                Home
              </Link>

              {/* Services & Spaces Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('services')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
                  aria-expanded={activeDropdown === 'services'}
                  aria-haspopup="true"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    isServicesActive || activeDropdown === 'services'
                      ? 'text-forest-deep font-semibold bg-forest/8'
                      : 'text-charcoal/85 hover:text-forest-deep hover:bg-forest/5'
                  }`}
                >
                  <span>Services & Spaces</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180 text-forest-deep' : 'text-charcoal/50'}`} />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === 'services' && (
                  <div 
                    className="absolute top-full left-0 pt-2 w-[330px] z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    <div className="bg-[#FCFAF5] rounded-2xl shadow-xl border border-charcoal/10 p-2.5 space-y-1">
                      {servicesDropdownItems.map((item) => {
                        const Icon = item.icon;
                        const isItemActive = currentPath === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                              isItemActive 
                                ? 'bg-gold/20 text-forest-deep' 
                                : 'hover:bg-forest/5 text-charcoal/90 hover:text-forest-deep'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-forest">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold text-[13.5px] leading-snug">{item.label}</p>
                              <p className="text-[11.5px] text-charcoal/60 leading-tight mt-0.5">{item.description}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Transparency (Key USP Direct Link) */}
              <Link
                href="/transparency"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  currentPath === '/transparency'
                    ? 'text-forest-deep font-semibold bg-forest/8'
                    : 'text-charcoal/85 hover:text-forest-deep hover:bg-forest/5'
                }`}
              >
                <span>Transparency</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
              </Link>

              {/* Explore Dropdown (Gallery & Testimonials) */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('explore')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'explore' ? null : 'explore')}
                  aria-expanded={activeDropdown === 'explore'}
                  aria-haspopup="true"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    isExploreActive || activeDropdown === 'explore'
                      ? 'text-forest-deep font-semibold bg-forest/8'
                      : 'text-charcoal/85 hover:text-forest-deep hover:bg-forest/5'
                  }`}
                >
                  <span>Explore</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'explore' ? 'rotate-180 text-forest-deep' : 'text-charcoal/50'}`} />
                </button>

                {activeDropdown === 'explore' && (
                  <div 
                    className="absolute top-full left-0 pt-2 w-[310px] z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    <div className="bg-[#FCFAF5] rounded-2xl shadow-xl border border-charcoal/10 p-2.5 space-y-1">
                      {exploreDropdownItems.map((item) => {
                        const Icon = item.icon;
                        const isItemActive = currentPath === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                              isItemActive 
                                ? 'bg-gold/20 text-forest-deep' 
                                : 'hover:bg-forest/5 text-charcoal/90 hover:text-forest-deep'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-forest">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold text-[13.5px] leading-snug">{item.label}</p>
                              <p className="text-[11.5px] text-charcoal/60 leading-tight mt-0.5">{item.description}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* About Us */}
              <Link
                href="/about"
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  currentPath === '/about'
                    ? 'text-forest-deep font-semibold bg-forest/8'
                    : 'text-charcoal/85 hover:text-forest-deep hover:bg-forest/5'
                }`}
              >
                About Us
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  currentPath === '/contact'
                    ? 'text-forest-deep font-semibold bg-forest/8'
                    : 'text-charcoal/85 hover:text-forest-deep hover:bg-forest/5'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Desktop Consultation Action (Always Single-Line) */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center min-h-[42px] px-5 xl:px-6 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-[14px] whitespace-nowrap transition-all shadow-xs hover:shadow outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <Sparkles className="w-4 h-4 mr-1.5 opacity-80" />
                <span>Plan a Consultation</span>
              </Link>
            </div>

            {/* Mobile Actions: Consultation + Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2.5">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center min-h-[38px] px-3.5 rounded-full bg-gold text-forest-deep font-sans font-semibold text-xs whitespace-nowrap transition-all active:scale-95 shadow-xs"
              >
                Consultation
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-11 h-11 flex flex-col items-center justify-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl active:bg-cream/60 transition-colors touch-manipulation"
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
            className="lg:hidden fixed inset-x-0 top-[74px] h-[calc(100dvh-74px)] bg-[#FAF8F2] z-50 flex flex-col px-6 pt-5 pb-8 overflow-y-auto animate-in fade-in duration-200 border-t border-charcoal/10 overscroll-contain"
            aria-label="Mobile navigation"
          >
            <div className="space-y-6">
              
              {/* Primary Links */}
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block font-serif text-[24px] py-2 transition-colors ${
                    currentPath === '/' ? 'text-forest font-semibold border-l-4 border-gold pl-3' : 'text-forest-deep'
                  }`}
                >
                  Home
                </Link>
              </div>

              {/* Group: Services & Spaces */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal/40 mb-2">Services & Spaces</p>
                <div className="space-y-1 pl-1">
                  {servicesDropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-2 text-[16px] font-medium transition-colors ${
                        currentPath === item.href ? 'text-forest font-semibold border-l-3 border-gold pl-2.5' : 'text-charcoal/80'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Group: Transparency & Proof */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal/40 mb-2">Governance & Proof</p>
                <div className="space-y-1 pl-1">
                  <Link
                    href="/transparency"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 text-[16px] font-medium transition-colors ${
                      currentPath === '/transparency' ? 'text-forest font-semibold border-l-3 border-gold pl-2.5' : 'text-charcoal/80'
                    }`}
                  >
                    Customer Transparency
                  </Link>
                  {exploreDropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-2 text-[16px] font-medium transition-colors ${
                        currentPath === item.href ? 'text-forest font-semibold border-l-3 border-gold pl-2.5' : 'text-charcoal/80'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Group: Company */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal/40 mb-2">Company</p>
                <div className="space-y-1 pl-1">
                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 text-[16px] font-medium transition-colors ${
                      currentPath === '/about' ? 'text-forest font-semibold border-l-3 border-gold pl-2.5' : 'text-charcoal/80'
                    }`}
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 text-[16px] font-medium transition-colors ${
                      currentPath === '/contact' ? 'text-forest font-semibold border-l-3 border-gold pl-2.5' : 'text-charcoal/80'
                    }`}
                  >
                    Contact
                  </Link>
                </div>
              </div>

            </div>

            {/* Mobile Actions Footer */}
            <div className="mt-auto pt-6 border-t border-charcoal/10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href="https://wa.me/919876543210?text=Hello%20FarmCare%20360%C2%B0%2C%20I%20would%20like%20to%20discuss%20my%20property%20requirements."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[46px] px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-sans font-semibold text-[14px] transition-all shadow-xs"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp</span>
                </a>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center min-h-[46px] px-4 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-[14px] transition-all shadow-xs"
                >
                  Plan a Consultation
                </Link>
              </div>

              {/* Social Channels row */}
              <div className="pt-2">
                <p className="text-[11px] uppercase tracking-wider text-charcoal/50 font-semibold mb-2.5 text-center">Follow & Connect</p>
                <div className="flex items-center justify-center gap-3">
                  <a
                    href="https://instagram.com/farmcare360"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="FarmCare 360° on Instagram"
                    className="w-9 h-9 rounded-full bg-white/80 border border-charcoal/10 flex items-center justify-center text-charcoal/70 hover:text-[#E4405F] hover:border-[#E4405F]/40 active:scale-95 transition-all shadow-xs"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://youtube.com/@farmcare360"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="FarmCare 360° on YouTube"
                    className="w-9 h-9 rounded-full bg-white/80 border border-charcoal/10 flex items-center justify-center text-charcoal/70 hover:text-[#FF0000] hover:border-[#FF0000]/40 active:scale-95 transition-all shadow-xs"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com/company/farmcare360"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="FarmCare 360° on LinkedIn"
                    className="w-9 h-9 rounded-full bg-white/80 border border-charcoal/10 flex items-center justify-center text-charcoal/70 hover:text-[#0A66C2] hover:border-[#0A66C2]/40 active:scale-95 transition-all shadow-xs"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://wa.me/919876543210?text=Hello%20FarmCare%20360%C2%B0%2C%20I%20would%20like%20to%20discuss%20my%20property%20requirements."
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="FarmCare 360° on WhatsApp"
                    className="w-9 h-9 rounded-full bg-white/80 border border-charcoal/10 flex items-center justify-center text-charcoal/70 hover:text-[#25D366] hover:border-[#25D366]/40 active:scale-95 transition-all shadow-xs"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                  </a>
                </div>
              </div>

              <p className="text-center text-[11px] tracking-wider uppercase text-charcoal/50 pt-1">
                Healthy land, brighter tomorrows.
              </p>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

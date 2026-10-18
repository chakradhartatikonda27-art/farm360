import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center bg-ivory px-4 py-16">
      <div className="max-w-md mx-auto text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto border border-forest/20">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold">
            PAGE NOT FOUND · 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-charcoal font-normal">
            Off the beaten track
          </h1>
          <p className="text-sm text-charcoal/70 leading-relaxed max-w-sm mx-auto">
            The agricultural page or service you are looking for might have been moved or does not exist.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-forest text-xs py-2.5 px-5 flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link href="/services" className="btn-outline-forest text-xs py-2.5 px-5">
            <span>Browse Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

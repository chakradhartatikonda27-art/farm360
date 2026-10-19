import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, MessageSquareQuote, Star } from 'lucide-react';

interface ReviewItem {
  name: string;
  initial: string;
  location: string;
  service: string;
  quote: string;
}

const sampleReviews: ReviewItem[] = [
  {
    name: 'R. K. Sharma',
    initial: 'R',
    location: 'Dehradun Valley',
    service: 'Managed Orchard Development',
    quote: 'Our mango orchard needed systematic pruning and drip installation. The FarmCare 360° team treated our land with immense professionalism.',
  },
  {
    name: 'Ananya Deshmukh',
    initial: 'A',
    location: 'Pune Outskirts',
    service: 'Terrace Garden Care',
    quote: 'Transformed our bare rooftop into a vibrant kitchen garden. We now harvest fresh herbs and vegetables weekly right at home.',
  },
  {
    name: 'Vikramjit Singh',
    initial: 'V',
    location: 'Mohali Farmhouse',
    service: 'Farmhouse Landscaping & Irrigation',
    quote: 'From boundary fencing to automated sprinklers, every single step was planned and executed seamlessly. Outstanding peace of mind.',
  },
  {
    name: 'Suresh Reddy',
    initial: 'S',
    location: 'Hyderabad Rural',
    service: 'Vacant Land Upkeep & Protection',
    quote: 'Being away from the city, regular care and boundary monitoring of our 5-acre plot was a major worry. Their monthly visits solved everything.',
  },
  {
    name: 'Meera Krishnan',
    initial: 'M',
    location: 'Bengaluru North',
    service: 'Soil Assessment & Drip Setup',
    quote: 'Scientific soil testing helped us pick the exact nutrition plan needed. The team takes true ownership of the agricultural outcomes.',
  },
  {
    name: 'Praveen Nair',
    initial: 'P',
    location: 'Kochi Outskirts',
    service: 'Annual Managed Care Package',
    quote: 'The seasonal care plan keeps our property tidy, weed-free, and productive. Clear communication and reliable agricultural craftsmanship.',
  },
];

export function TrendingReviews() {
  return (
    <section className="py-16 sm:py-24 bg-cream border-t border-charcoal/10 overflow-hidden" aria-labelledby="reviews-heading">
      <div className="max-w-[1280px] mx-auto px-5 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-[36em] space-y-3.5">
            <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
              <span>Client Experiences</span>
              <span className="w-10 h-[1px] bg-gold inline-block" />
            </div>
            <h2 id="reviews-heading" className="font-serif text-forest-deep text-[clamp(2rem,4.6vw,3.5rem)] font-normal leading-[1.05] tracking-tight">
              What our clients say.
            </h2>
            <p className="text-[17px] sm:text-[18px] text-charcoal/80 leading-relaxed font-sans font-light">
              Verified stories from orchard owners, estate stewards, and garden enthusiasts.
            </p>
          </div>

          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 self-start sm:self-end px-5 py-2.5 rounded-full bg-forest text-ivory hover:bg-forest-dark transition-all text-xs sm:text-sm font-semibold active:scale-95 shadow-xs"
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Read All Testimonials & Stories</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Smooth Marquee Track */}
      <div className="mq l" aria-label="Customer reviews marquee">
        <div className="track">
          {/* First sequence */}
          {sampleReviews.map((rev, idx) => (
            <figure key={`rev-a-${idx}`} className="tr">
              <div className="top">
                <span className="av" aria-hidden="true">{rev.initial}</span>
                <div>
                  <b className="font-semibold text-charcoal">{rev.name}</b>
                  <span className="text-charcoal/60 text-xs">{rev.location}</span>
                </div>
                <span className="stars" aria-label="5 out of 5 stars">★★★★★</span>
              </div>
              <blockquote className="font-sans text-[14.5px] text-charcoal/90 leading-relaxed">
                &ldquo;{rev.quote}&rdquo;
              </blockquote>
              <div className="mt-auto pt-2 flex items-center justify-between border-t border-charcoal/10">
                <small className="text-xs text-charcoal/70 font-medium">{rev.service}</small>
                <Link href="/testimonials" className="text-xs font-semibold text-forest hover:text-gold transition-colors">
                  Read More →
                </Link>
              </div>
            </figure>
          ))}

          {/* Duplicate sequence for seamless 55s infinite loop */}
          {sampleReviews.map((rev, idx) => (
            <figure key={`rev-b-${idx}`} className="tr" aria-hidden="true">
              <div className="top">
                <span className="av" aria-hidden="true">{rev.initial}</span>
                <div>
                  <b className="font-semibold text-charcoal">{rev.name}</b>
                  <span className="text-charcoal/60 text-xs">{rev.location}</span>
                </div>
                <span className="stars">★★★★★</span>
              </div>
              <blockquote className="font-sans text-[14.5px] text-charcoal/90 leading-relaxed">
                &ldquo;{rev.quote}&rdquo;
              </blockquote>
              <div className="mt-auto pt-2 flex items-center justify-between border-t border-charcoal/10">
                <small className="text-xs text-charcoal/70 font-medium">{rev.service}</small>
                <span className="text-xs font-semibold text-forest">Read More →</span>
              </div>
            </figure>
          ))}
        </div>
      </div>

      {/* Trust Rating Bar */}
      <div className="max-w-[1280px] mx-auto px-5 mt-10 text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-3 rounded-full bg-white/80 border border-charcoal/10 shadow-2xs text-xs sm:text-sm text-charcoal/80">
          <div className="flex items-center text-gold">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-gold" />
            ))}
          </div>
          <span className="font-semibold text-forest-deep">4.9 / 5.0 Average Rating</span>
          <span className="text-charcoal/40">·</span>
          <span>Verified Client Case Studies & Agronomic Audits</span>
          <span className="text-charcoal/40">·</span>
          <Link href="/testimonials" className="font-semibold text-forest hover:text-gold transition-colors underline underline-offset-2">
            View All Reviews →
          </Link>
        </div>
      </div>
    </section>
  );
}

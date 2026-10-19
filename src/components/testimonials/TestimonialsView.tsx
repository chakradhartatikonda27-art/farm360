'use client';

import React, { useState, useMemo } from 'react';
import { Star, ShieldCheck, ChevronDown, ChevronUp, MessageSquarePlus, Award, Trees, Sparkles, CheckCircle } from 'lucide-react';
import { testimonialsData, TestimonialItem } from '@/data/testimonialsData';
import { TestimonialModal } from './TestimonialModal';

const categories = [
  { id: 'all', label: 'All Reviews' },
  { id: 'orchards', label: 'Farms & Orchards' },
  { id: 'gardens', label: 'Terrace Gardens' },
  { id: 'vacant', label: 'Vacant Land Upkeep' },
  { id: 'irrigation', label: 'Irrigation & Systems' },
];

export function TestimonialsView() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const filteredReviews = useMemo(() => {
    if (activeCategory === 'all') return testimonialsData;
    return testimonialsData.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* Trust & Performance Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-charcoal/10 shadow-2xs flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center mb-3">
            <Star className="w-5 h-5 fill-gold" />
          </div>
          <span className="font-serif text-3xl sm:text-4xl font-normal text-forest-deep">4.9 / 5.0</span>
          <span className="text-xs sm:text-sm text-charcoal/70 mt-1 font-medium">Average Client Satisfaction</span>
          <span className="text-[11px] text-charcoal/50 mt-0.5">Across 85+ verified agricultural surveys</span>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-charcoal/10 shadow-2xs flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-forest/10 text-forest flex items-center justify-center mb-3">
            <Trees className="w-5 h-5" />
          </div>
          <span className="font-serif text-3xl sm:text-4xl font-normal text-forest-deep">100+ Acres</span>
          <span className="text-xs sm:text-sm text-charcoal/70 mt-1 font-medium">Active Managed Farmland</span>
          <span className="text-[11px] text-charcoal/50 mt-0.5">From Bangalore to Deccan farming belts</span>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-charcoal/10 shadow-2xs flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-botanical/10 text-botanical flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <span className="font-serif text-3xl sm:text-4xl font-normal text-forest-deep">98%</span>
          <span className="text-xs sm:text-sm text-charcoal/70 mt-1 font-medium">Annual Retention Rate</span>
          <span className="text-[11px] text-charcoal/50 mt-0.5">Recurring seasonal stewardship clients</span>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-charcoal/10 shadow-2xs flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-forest-dark/10 text-forest-dark flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-serif text-3xl sm:text-4xl font-normal text-forest-deep">100%</span>
          <span className="text-xs sm:text-sm text-charcoal/70 mt-1 font-medium">Boundary Integrity</span>
          <span className="text-[11px] text-charcoal/50 mt-0.5">Zero encroachments under managed watch</span>
        </div>
      </div>

      {/* Action Header with Filters & Add Review Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Review categories">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold active:scale-95 ${
                  isActive
                    ? 'bg-forest text-ivory shadow-sm'
                    : 'bg-white/80 hover:bg-cream text-charcoal/80 border border-charcoal/10'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Share Review CTA */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold hover:bg-[#D4B66B] active:scale-[0.98] text-forest-deep font-sans font-semibold text-xs sm:text-sm transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Share Your Feedback</span>
        </button>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
        {filteredReviews.map((rev) => {
          const isExpanded = expandedId === rev.id;

          return (
            <article
              key={rev.id}
              className="flex flex-col bg-white rounded-2xl border border-charcoal/10 hover:border-gold/60 p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all duration-300"
            >
              {/* Top row: Client info & Verified Badge */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-charcoal/10">
                <div className="flex items-center gap-3.5">
                  <span className="w-11 h-11 rounded-full bg-forest text-ivory font-serif text-lg font-bold flex items-center justify-center flex-shrink-0 shadow-xs">
                    {rev.initial}
                  </span>
                  <div>
                    <h3 className="font-semibold text-forest-deep text-base sm:text-lg flex items-center gap-2">
                      <span>{rev.name}</span>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-botanical bg-botanical/10 px-2 py-0.5 rounded-full" title="Verified Landowner Partner">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-charcoal/65 font-sans mt-0.5">
                      {rev.role} · <span className="text-charcoal/90 font-medium">{rev.location}</span>
                    </p>
                  </div>
                </div>

                {/* Star rating */}
                <div className="flex items-center text-gold" aria-label="5 out of 5 stars">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold" />
                  ))}
                </div>
              </div>

              {/* Property Details & Key Metric Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs">
                <span className="text-charcoal/70 font-medium">
                  <strong>Property:</strong> {rev.propertyType}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 text-forest font-semibold text-[11.5px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  {rev.keyMetric}
                </span>
              </div>

              {/* Main Quote */}
              <blockquote className="font-serif text-lg sm:text-[19px] text-forest-dark leading-snug italic my-2">
                &ldquo;{rev.quote}&rdquo;
              </blockquote>

              {/* Expandable Case Study Deep Dive */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-charcoal/10 text-charcoal/80 text-[14.5px] leading-relaxed font-sans font-light animate-in fade-in duration-200">
                  <p>{rev.fullStory}</p>
                </div>
              )}

              {/* Card Footer: Service Rendered & Expand Toggle */}
              <div className="mt-auto pt-4 border-t border-charcoal/10 flex items-center justify-between text-xs text-charcoal/60">
                <span className="font-medium text-forest-dark">
                  Service: {rev.serviceRendered}
                </span>

                <button
                  type="button"
                  onClick={() => toggleExpand(rev.id)}
                  className="inline-flex items-center gap-1 font-semibold text-gold hover:text-forest-deep transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded py-0.5"
                >
                  <span>{isExpanded ? 'Show Less' : 'Full Case Study'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Testimonial Submission Modal */}
      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

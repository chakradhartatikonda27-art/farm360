import React from 'react';
import Image from 'next/image';

export interface ApproachStep {
  number: string;
  title: string;
  description: string;
  image: string;
}

interface OurApproachProps {
  badge?: string;
  title?: string;
  description?: string;
  steps?: ApproachStep[];
}

const defaultSteps: ApproachStep[] = [
  {
    number: '01',
    title: 'Understand Your Vision',
    description: 'Discuss the property, requirements, goals, and budget.',
    image: '/images/services/process-step-1.jpg',
  },
  {
    number: '02',
    title: 'Assess Your Space',
    description: 'Evaluate site conditions, access, layout, and practical requirements.',
    image: '/images/services/process-step-2.jpg',
  },
  {
    number: '03',
    title: 'Plan Your Solution',
    description: 'Prepare a tailored scope of work and proposal.',
    image: '/images/services/process-step-3.jpg',
  },
  {
    number: '04',
    title: 'Create. Maintain. Grow.',
    description: 'Coordinate agreed services and ongoing support.',
    image: '/images/services/process-step-4.jpg',
  },
];

export function OurApproach({
  badge,
  title,
  description,
  steps,
}: OurApproachProps = {}) {
  const displayBadge = badge || 'Our approach';
  const displayTitle = title || 'From your idea to a living space.';
  const displaySteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <section className="py-12 sm:py-20 bg-cream">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Section Header */}
        <div className="space-y-3.5 max-w-[42em]">
          <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
            <span>{displayBadge}</span>
            <span className="w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h2 className="font-serif text-forest-deep text-[clamp(2rem,4.6vw,3.5rem)] font-normal leading-[1.05] tracking-tight">
            {displayTitle}
          </h2>
          {description && (
            <p className="text-[15px] sm:text-[17px] text-charcoal/80 leading-relaxed font-sans font-light">
              {description}
            </p>
          )}
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 mt-10">
          {displaySteps.map((step) => (
            <div key={step.number} className="flex flex-col group">
              {/* Aspect Ratio 1 Image */}
              <div className="relative aspect-square rounded-[10px] overflow-hidden bg-cream-dark">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Step Title & Copy */}
              <h3 className="font-serif text-[22px] sm:text-[24px] text-forest-deep font-normal mt-4 mb-1.5 flex items-baseline">
                <em className="not-italic text-gold text-[26px] sm:text-[28px] font-serif mr-2 font-medium">
                  {step.number}
                </em>
                <span>{step.title}</span>
              </h3>
              <p className="font-sans text-[14px] sm:text-[14.5px] text-charcoal/75 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

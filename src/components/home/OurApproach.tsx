import React from 'react';
import Image from 'next/image';

export function OurApproach() {
  const steps = [
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

  return (
    <section className="py-16 sm:py-24 bg-cream">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Section Header */}
        <div className="space-y-3.5 max-w-[42em]">
          <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
            <span>Our approach</span>
            <span className="w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h2 className="font-serif text-forest-deep text-[clamp(2rem,4.6vw,3.5rem)] font-normal leading-[1.05] tracking-tight">
            From your idea to a living space.
          </h2>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 mt-11">
          {steps.map((step) => (
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
              <h3 className="font-serif text-[24px] text-forest-deep font-normal mt-4 mb-1.5 flex items-baseline">
                <em className="not-italic text-gold text-[28px] font-serif mr-2 font-medium">
                  {step.number}
                </em>
                <span>{step.title}</span>
              </h3>
              <p className="font-sans text-[14.5px] text-charcoal/75 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

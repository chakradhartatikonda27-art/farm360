'use client';

import React, { useState, useRef } from 'react';

export function BeforeAfterComparison() {
  const [percent, setPercent] = useState<number>(50);
  const cmpRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setPercent(val);
    if (cmpRef.current) {
      cmpRef.current.style.setProperty('--p', `${val}%`);
    }
  };

  const updateFromClientX = (clientX: number) => {
    if (!cmpRef.current) return;
    const rect = cmpRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const val = Math.max(5, Math.min(95, Math.round((x / rect.width) * 100)));
    setPercent(val);
    cmpRef.current.style.setProperty('--p', `${val}%`);
  };

  return (
    <section className="py-16 sm:py-24 border-t border-charcoal/10" aria-labelledby="before-after-heading">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="max-w-[36em] space-y-3.5 mb-10">
          <div className="flex items-center gap-3 text-gold text-[11.5px] font-bold tracking-[0.22em] uppercase">
            <span>Before and after</span>
            <span className="w-10 h-[1px] bg-gold inline-block" />
          </div>
          <h2 id="before-after-heading" className="font-serif text-forest-deep text-[clamp(2rem,4.6vw,3.5rem)] font-normal leading-[1.05] tracking-tight">
            See what care can change.
          </h2>
          <p className="text-[17px] sm:text-[18px] text-charcoal/80 leading-relaxed font-sans font-light">
            Drag the handle to compare. Illustrative imagery until real project photos are added.
          </p>
        </div>

        <div className="max-w-[980px]">
          <article className="bac">
            {/* Interactive Before / After Split Slider */}
            <div 
              ref={cmpRef}
              className="cmp select-none" 
              style={{ ['--p' as any]: `${percent}%`, touchAction: 'pan-y' }}
              onClick={(e) => updateFromClientX(e.clientX)}
              onTouchMove={(e) => {
                if (e.touches.length > 0) updateFromClientX(e.touches[0].clientX);
              }}
              suppressHydrationWarning
            >
              <img
                src="/images/managed/plot-after.jpg"
                alt="Transformed kitchen garden after care"
                loading="lazy"
              />
              <img
                className="bf"
                src="/images/managed/plot-before.jpg"
                alt="Overgrown idle plot before care"
                loading="lazy"
              />
              <span className="lb l">Before</span>
              <span className="lb r">After</span>
              <i className="hd" aria-hidden="true" />
              <input
                type="range"
                min="5"
                max="95"
                value={percent}
                onChange={handleInput}
                aria-label="Compare before and after care"
              />
            </div>

            {/* Editorial Project Quote & Clear Sample Notice */}
            <div className="bq">
              <h3>Idle plot to kitchen garden</h3>
              <blockquote>
                Sample testimonial. Replace this with a real comment from the client about this project.
              </blockquote>
              <p className="who">
                <b>Client name</b> · Location · Vacant-land upkeep
              </p>
              <em className="smp">Sample. Replace before launch.</em>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

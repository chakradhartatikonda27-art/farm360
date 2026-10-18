'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export function FAQAccordion({ items, className = '' }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`border rounded-xl transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'bg-ivory-surface border-gold/50 shadow-soft'
                : 'bg-ivory-surface/60 border-cream hover:border-cream-border'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-base sm:text-lg text-charcoal font-medium">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-forest shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-gold' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-charcoal/80 leading-relaxed border-t border-cream/50 animate-in fade-in-50 duration-200">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

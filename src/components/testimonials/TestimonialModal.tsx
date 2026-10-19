'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestimonialModal({ isOpen, onClose }: TestimonialModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('Fruit Orchard');
  const [quote, setQuote] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Sync open state with native HTML5 dialog showModal()
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
      setSubmitted(false);
    }
  }, [isOpen]);

  // Light-dismiss fallback for browsers without native closedBy support
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleDialogClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isDialogContent) {
        onClose();
      }
    };

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('click', handleDialogClick);
    dialog.addEventListener('cancel', handleCancel);

    return () => {
      dialog.removeEventListener('click', handleDialogClick);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;
    setSubmitted(true);
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="review-modal-title"
      className="m-auto p-0 bg-ivory rounded-2xl max-w-lg w-[92vw] border border-charcoal/15 shadow-2xl backdrop:bg-forest-dark/75 overflow-hidden transition-all duration-300"
    >
      <div className="flex flex-col max-h-[90vh] overflow-y-auto overscroll-contain">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal/10 bg-cream/50 sticky top-0 z-10 backdrop-blur-md">
          <h2 id="review-modal-title" className="font-serif text-forest-deep text-xl font-medium">
            Share Your Experience
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-charcoal/10 hover:bg-charcoal/20 flex items-center justify-center text-charcoal transition-colors active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Close review dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-14 h-14 text-forest mx-auto" />
              <h3 className="font-serif text-2xl text-forest-deep">Thank you for sharing!</h3>
              <p className="text-sm text-charcoal/80 max-w-sm mx-auto">
                Your feedback has been received and will be reviewed by our agronomic team. We appreciate your partnership in cultivating healthy land.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-forest text-ivory text-sm font-semibold hover:bg-forest-dark transition-all"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
                  Your Overall Rating
                </label>
                <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating out of 5 stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                      aria-label={`${star} Star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          (hoverRating || rating) >= star ? 'fill-gold text-gold' : 'text-charcoal/30'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-charcoal/60 ml-2 font-medium">({rating} of 5 Stars)</span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="rev-name" className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                  Full Name *
                </label>
                <input
                  id="rev-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh K."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal/20 bg-white text-charcoal text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="rev-loc" className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                  Property Location / Region *
                </label>
                <input
                  id="rev-loc"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Devanahalli, Bengaluru Rural"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal/20 bg-white text-charcoal text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                />
              </div>

              {/* Property Type */}
              <div>
                <label htmlFor="rev-prop" className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                  Property or Project Category
                </label>
                <select
                  id="rev-prop"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal/20 bg-white text-charcoal text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                >
                  <option value="Fruit Orchard">Fruit Orchard (Mango, Guava, Citrus)</option>
                  <option value="Terrace Garden">Terrace / Kitchen Garden</option>
                  <option value="Vacant Land Upkeep">Vacant Land & Plot Protection</option>
                  <option value="Irrigation Setup">Drip Irrigation & Solar Pumping</option>
                  <option value="Farmhouse Landscape">Farmhouse & Retreat Estate</option>
                </select>
              </div>

              {/* Review Text */}
              <div>
                <label htmlFor="rev-quote" className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                  Your Review / Experience *
                </label>
                <textarea
                  id="rev-quote"
                  required
                  rows={4}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Describe the services provided and your experience working with FarmCare 360°..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal/20 bg-white text-charcoal text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-charcoal/70 hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-forest hover:bg-forest-dark text-white text-xs font-semibold shadow-sm active:scale-95 transition-all"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}

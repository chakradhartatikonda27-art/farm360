'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle2, AlertCircle, Loader2, Sprout, ShieldCheck } from 'lucide-react';
import { ConsultationSubmission } from '@/lib/consultationAdapter';

interface ConsultationFormProps {
  initialServiceCategory?: string;
  initialPropertyType?: string;
  initialEngagement?: string;
  className?: string;
}

export function ConsultationForm({
  initialServiceCategory = '',
  initialPropertyType = '',
  initialEngagement = '',
  className = '',
}: ConsultationFormProps) {
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<ConsultationSubmission>({
    fullName: '',
    phone: '',
    email: '',
    location: '',
    propertyType: 'Farm',
    serviceCategory: initialServiceCategory || 'General Agricultural Enquiry',
    approxSize: '',
    preferredEngagement: 'One-time Service',
    projectDescription: '',
    consent: true,
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    referenceId?: string;
    message?: string;
  } | null>(null);

  // Sync URL query params on load
  useEffect(() => {
    if (!searchParams) return;
    const typeParam = searchParams.get('propertyType');
    const serviceParam = searchParams.get('service');
    const sizeParam = searchParams.get('size');
    const engagementParam = searchParams.get('engagement');

    setFormData((prev) => ({
      ...prev,
      propertyType: (typeParam as any) || prev.propertyType,
      serviceCategory: serviceParam || prev.serviceCategory,
      approxSize: sizeParam || prev.approxSize,
      preferredEngagement: (engagementParam as any) || prev.preferredEngagement,
    }));
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    setSubmitResult(null);

    // Client side quick verification
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email is required.';
    if (!formData.location.trim()) newErrors.location = 'Property location is required.';
    if (!formData.projectDescription.trim() || formData.projectDescription.length < 10) {
      newErrors.projectDescription = 'Please share at least a few details about your property (min 10 characters).';
    }
    if (!formData.consent) newErrors.consent = 'Please confirm consent to be contacted.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        }
        setSubmitResult({
          success: false,
          message: data.message || 'Unable to submit consultation request. Please check highlighted fields.',
        });
      } else {
        setSubmitResult({
          success: true,
          referenceId: data.referenceId,
          message: data.message,
        });
      }
    } catch (err) {
      setSubmitResult({
        success: false,
        message: 'Network connection issue. Please check your internet or retry in a moment.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-ivory-surface rounded-2xl border border-cream shadow-soft p-6 sm:p-10 ${className}`}>
      {submitResult && submitResult.success ? (
        <div className="py-8 text-center space-y-4 animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-forest/10 text-forest rounded-full flex items-center justify-center mx-auto border-2 border-forest">
            <CheckCircle2 className="w-8 h-8 text-forest" />
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-gold font-bold">CONSULTATION RECORDED</span>
            <h3 className="text-2xl font-serif text-charcoal font-bold">
              Thank You, {formData.fullName.split(' ')[0]}
            </h3>
            <p className="text-sm text-charcoal/70 max-w-md mx-auto">
              {submitResult.message} An agricultural specialist will review your space requirements and reach out within 24 business hours.
            </p>
          </div>

          <div className="bg-ivory border border-cream rounded-xl p-4 max-w-sm mx-auto text-left space-y-1.5 text-xs text-charcoal/80">
            <div className="flex justify-between border-b border-cream/70 pb-1.5">
              <span className="text-charcoal/50">Reference ID:</span>
              <span className="font-mono font-bold text-forest">{submitResult.referenceId}</span>
            </div>
            <div className="flex justify-between border-b border-cream/70 pb-1.5">
              <span className="text-charcoal/50">Property Type:</span>
              <span className="font-medium">{formData.propertyType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/50">Location:</span>
              <span className="font-medium">{formData.location}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSubmitResult(null);
              setFormData((prev) => ({ ...prev, projectDescription: '' }));
            }}
            className="btn-outline-forest text-xs mt-4"
          >
            Submit Another Property Enquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Honeypot field (hidden) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="hp_field">Do not fill this</label>
            <input
              id="hp_field"
              type="text"
              name="honeypot"
              tabIndex={-1}
              autoComplete="off"
              value={formData.honeypot}
              onChange={handleChange}
            />
          </div>

          {submitResult && !submitResult.success && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start gap-3 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{submitResult.message}</span>
            </div>
          )}

          {/* Section 1: Contact Details */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-forest mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
              <span>1. Your Contact Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-xs font-medium text-charcoal/80 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white text-charcoal placeholder-charcoal/30 focus:outline-none focus:ring-2 focus:ring-forest ${
                    errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-cream'
                  }`}
                />
                {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-charcoal/80 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white text-charcoal placeholder-charcoal/30 focus:outline-none focus:ring-2 focus:ring-forest ${
                    errors.phone ? 'border-red-400 bg-red-50/20' : 'border-cream'
                  }`}
                />
                {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-xs font-medium text-charcoal/80 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. ramesh@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white text-charcoal placeholder-charcoal/30 focus:outline-none focus:ring-2 focus:ring-forest ${
                    errors.email ? 'border-red-400 bg-red-50/20' : 'border-cream'
                  }`}
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Property & Scope */}
          <div className="pt-2 border-t border-cream">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-forest mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
              <span>2. Property & Service Requirements</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-xs font-medium text-charcoal/80 mb-1">
                  Property Location (District / Taluk) <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Kanakapura, Ramanagara District"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white text-charcoal placeholder-charcoal/30 focus:outline-none focus:ring-2 focus:ring-forest ${
                    errors.location ? 'border-red-400 bg-red-50/20' : 'border-cream'
                  }`}
                />
                {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location}</p>}
              </div>

              <div>
                <label htmlFor="propertyType" className="block text-xs font-medium text-charcoal/80 mb-1">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-cream text-sm bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-forest"
                >
                  <option value="Farm">Farm / Agricultural Acreage</option>
                  <option value="Agricultural Plot">Agricultural Plot / Subdivided Farmland</option>
                  <option value="Vacant Land">Vacant Land / Peri-Urban Site</option>
                  <option value="Terrace / Kitchen Garden">Terrace / Rooftop Garden</option>
                  <option value="Farmhouse Grounds">Farmhouse & Landscape Grounds</option>
                  <option value="Other">Other / Commercial Agro Project</option>
                </select>
              </div>

              <div>
                <label htmlFor="approxSize" className="block text-xs font-medium text-charcoal/80 mb-1">
                  Approximate Land Size (Optional)
                </label>
                <input
                  id="approxSize"
                  type="text"
                  name="approxSize"
                  placeholder="e.g. 2.5 Acres, 1200 sq ft, 5 Guntas"
                  value={formData.approxSize}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-cream text-sm bg-white text-charcoal placeholder-charcoal/30 focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>

              <div>
                <label htmlFor="preferredEngagement" className="block text-xs font-medium text-charcoal/80 mb-1">
                  Preferred Engagement <span className="text-red-500">*</span>
                </label>
                <select
                  id="preferredEngagement"
                  name="preferredEngagement"
                  value={formData.preferredEngagement}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-cream text-sm bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-forest"
                >
                  <option value="One-time Service">One-time Service (Setup, Testing, Fencing)</option>
                  <option value="Ongoing Managed Care">Ongoing Managed Care (Seasonal Stewardship)</option>
                  <option value="Landowner Enquiry">Landowner Lease / Partnership Enquiry</option>
                  <option value="General Consultation">General Discussion / Planning Advice</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="serviceCategory" className="block text-xs font-medium text-charcoal/80 mb-1">
                  Specific Service Category of Interest
                </label>
                <input
                  id="serviceCategory"
                  type="text"
                  name="serviceCategory"
                  placeholder="e.g. Drip Irrigation, High-Density Orchard Setup, Vacant Site Care"
                  value={formData.serviceCategory}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-cream text-sm bg-white text-charcoal placeholder-charcoal/30 focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="projectDescription" className="block text-xs font-medium text-charcoal/80 mb-1">
                  Tell us what your space needs <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  rows={4}
                  required
                  placeholder="Describe current terrain condition, water availability (borewell/canal), your goals, and any specific questions you have."
                  value={formData.projectDescription}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white text-charcoal placeholder-charcoal/30 focus:outline-none focus:ring-2 focus:ring-forest ${
                    errors.projectDescription ? 'border-red-400 bg-red-50/20' : 'border-cream'
                  }`}
                />
                {errors.projectDescription && (
                  <p className="text-red-600 text-xs mt-1">{errors.projectDescription}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Consent and Submission */}
          <div className="pt-2 border-t border-cream space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-cream text-forest focus:ring-forest accent-forest"
              />
              <span className="text-xs text-charcoal/70 leading-relaxed">
                I agree to allow FarmCare 360° to contact me regarding this consultation request. We respect your privacy and never share property data with unsolicited third parties.
              </span>
            </label>
            {errors.consent && <p className="text-red-600 text-xs">{errors.consent}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-forest w-full py-3.5 text-base font-semibold flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Consultation Request...</span>
                </>
              ) : (
                <>
                  <span>Request a Tailored Consultation</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
            <div className="text-center text-[11px] text-charcoal/50">
              Direct response from our agricultural planning team within 24 business hours.
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

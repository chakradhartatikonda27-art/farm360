import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { PhotoStrip } from '@/components/home/PhotoStrip';
import { SpacesWeServeSection } from '@/components/home/SpacesWeServeSection';
import { BusinessModelsSection } from '@/components/home/BusinessModelsSection';
import { CustomerTransparencySection } from '@/components/home/CustomerTransparencySection';
import { OurApproach } from '@/components/home/OurApproach';
import { ProjectGallery } from '@/components/home/ProjectGallery';
import { BeforeAfterComparison } from '@/components/home/BeforeAfterComparison';
import { TrendingReviews } from '@/components/home/TrendingReviews';
import { ContactCtaBanner } from '@/components/home/ContactCtaBanner';
import {
  getPageBySlug,
  getSpaces,
  getBusinessModels,
  getTransparencyData,
  getTestimonials,
} from '@/lib/cms/db';

export const revalidate = 0; // Dynamic revalidation on every change

export default function HomePage() {
  // Load dynamic CMS data
  const page = getPageBySlug('home');
  const spaces = getSpaces({ status: 'active' });
  const businessModels = getBusinessModels();
  const transparency = getTransparencyData();
  const testimonials = getTestimonials({ status: 'approved' });

  // Helper to check section visibility from CMS page builder
  const isSectionEnabled = (sectionId: string, fallback = true) => {
    if (!page || !page.sections) return fallback;
    const s = page.sections.find(
      (sec) => sec.id === sectionId || sec.type === sectionId
    );
    return s ? s.enabled : fallback;
  };

  const heroSection = page?.sections?.find(
    (s) => s.id === 'sec-home-hero' || s.type === 'hero'
  );
  const spacesSection = page?.sections?.find((s) => s.id === 'sec-home-spaces');
  const modelsSection = page?.sections?.find((s) => s.id === 'sec-home-models');
  const transparencySection = page?.sections?.find(
    (s) => s.id === 'sec-home-transparency'
  );

  return (
    <div className="w-full">
      {/* 1. Hero Section: Core Vision & The Privilege of Land */}
      {isSectionEnabled('sec-home-hero') && (
        <HeroSection
          badge={heroSection?.subtitle}
          title={heroSection?.title}
          description={
            heroSection?.content?.description ||
            (typeof heroSection?.content === 'string'
              ? heroSection.content
              : undefined)
          }
          ctaText={heroSection?.ctaText}
          ctaLink={heroSection?.ctaLink}
          heroImage={heroSection?.content?.heroImage}
        />
      )}

      {/* 2. Visual Photo Strip */}
      <PhotoStrip />

      {/* 3. The 4 Types of Land and Spaces We Serve */}
      {isSectionEnabled('sec-home-spaces') && (
        <SpacesWeServeSection
          spaces={spaces}
          title={spacesSection?.title}
          subtitle={spacesSection?.subtitle}
        />
      )}

      {/* 4. Our 4 Core Business Models */}
      {isSectionEnabled('sec-home-models') && (
        <BusinessModelsSection
          models={businessModels}
          title={modelsSection?.title}
          subtitle={modelsSection?.subtitle}
        />
      )}

      {/* 5. Our Customer Transparency Model (7-Step Approval Process & 5 Principles) */}
      {isSectionEnabled('sec-home-transparency') && (
        <CustomerTransparencySection
          steps={transparency.steps}
          principles={transparency.principles}
          title={transparencySection?.title}
          subtitle={transparencySection?.subtitle}
        />
      )}

      {/* 6. Our 4-Step Agronomic Approach */}
      <OurApproach />

      {/* 7. Visual Blueprints & Project Photo Gallery */}
      <ProjectGallery />

      {/* 8. Interactive Before and After Transformation Slider */}
      <BeforeAfterComparison />

      {/* 9. Verified Client Testimonials & Review Marquee */}
      {isSectionEnabled('sec-home-testimonials') && (
        <TrendingReviews testimonials={testimonials} />
      )}

      {/* 10. Direct Consultation CTA Banner */}
      <ContactCtaBanner />
    </div>
  );
}

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

export default function HomePage() {
  return (
    <div className="w-full">
      {/* 1. Hero Section: Core Vision & The Privilege of Land */}
      <HeroSection />

      {/* 2. Visual Photo Strip */}
      <PhotoStrip />

      {/* 3. The 4 Types of Land and Spaces We Serve */}
      <SpacesWeServeSection />

      {/* 4. Our 4 Core Business Models */}
      <BusinessModelsSection />

      {/* 5. Our Customer Transparency Model (7-Step Approval Process & 5 Principles) */}
      <CustomerTransparencySection />

      {/* 6. Our 4-Step Agronomic Approach */}
      <OurApproach />

      {/* 7. Visual Blueprints & Project Photo Gallery */}
      <ProjectGallery />

      {/* 8. Interactive Before and After Transformation Slider */}
      <BeforeAfterComparison />

      {/* 9. Verified Client Testimonials & Review Marquee */}
      <TrendingReviews />

      {/* 10. Direct Consultation CTA Banner */}
      <ContactCtaBanner />
    </div>
  );
}

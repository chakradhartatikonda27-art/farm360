import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { PhotoStrip } from '@/components/home/PhotoStrip';
import { ServiceDiscovery } from '@/components/home/ServiceDiscovery';
import { OurApproach } from '@/components/home/OurApproach';
import { ManagedCarePreview } from '@/components/home/ManagedCarePreview';
import { LandownersPreview } from '@/components/home/LandownersPreview';
import { ProjectGallery } from '@/components/home/ProjectGallery';
import { BeforeAfterComparison } from '@/components/home/BeforeAfterComparison';
import { TrendingReviews } from '@/components/home/TrendingReviews';
import { ContactCtaBanner } from '@/components/home/ContactCtaBanner';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Photo Gallery Strip */}
      <PhotoStrip />

      {/* 3. Service Discovery */}
      <ServiceDiscovery />

      {/* 4. Our Approach */}
      <OurApproach />

      {/* 5. Managed Care Section */}
      <ManagedCarePreview />

      {/* 6. Landowners & Partnerships */}
      <LandownersPreview />

      {/* 7. Agricultural Project Gallery */}
      <ProjectGallery />

      {/* 8. Interactive Before and After Comparison */}
      <BeforeAfterComparison />

      {/* 9. Trending Reviews Marquee */}
      <TrendingReviews />

      {/* 10. Contact CTA Banner */}
      <ContactCtaBanner />
    </div>
  );
}

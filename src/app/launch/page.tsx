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
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { FloatingWhatsApp } from '@/components/common/FloatingWhatsApp';
import { LaunchCeremonyWrapper } from '@/components/launch/LaunchCeremonyWrapper';
import {
  getPageBySlug,
  getPageBySlugAsync,
  getSpacesAsync,
  getBusinessModelsAsync,
  getTransparencyDataAsync,
  getTestimonialsAsync,
} from '@/lib/cms/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function LaunchCelebrationPage() {
  // Load dynamic CMS data for the authentic live website
  const page = (await getPageBySlugAsync('home')) || getPageBySlug('home');
  const spaces = await getSpacesAsync({ status: 'active' });
  const businessModels = await getBusinessModelsAsync();
  const transparency = await getTransparencyDataAsync();
  const testimonials = await getTestimonialsAsync({ status: 'approved' });

  // Section finder helper
  const findSection = (key: string) => {
    if (!page || !page.sections) return undefined;
    return page.sections.find(
      (s) =>
        s.id === key ||
        s.type === key ||
        s.id === `sec_${key}` ||
        s.id === `sec-home-${key}` ||
        s.type === key.replace('sec_', '').replace('sec-home-', '')
    );
  };

  const isSectionEnabled = (key: string, fallback = true) => {
    const s = findSection(key);
    if (!s) return fallback;
    if (typeof s.enabled === 'boolean') return s.enabled;
    if (typeof s.isVisible === 'boolean') return s.isVisible;
    return fallback;
  };

  const heroSection = findSection('hero');
  const photoStripSection = findSection('photo_strip') || findSection('strip');
  const spacesSection = findSection('spaces');
  const modelsSection = findSection('models');
  const transparencySection = findSection('transparency');
  const approachSection = findSection('approach');
  const gallerySection = findSection('gallery');
  const beforeAfterSection = findSection('before_after');
  const testimonialsSection = findSection('testimonials');
  const ctaSection = findSection('cta_banner') || findSection('cta');

  return (
    <LaunchCeremonyWrapper>
      {/* Official Website Header */}
      <SiteHeader />

      {/* Main Website Body: 10 Core Agricultural Sections */}
      <main className="w-full flex-1">
        {/* 1. Hero Section */}
        {isSectionEnabled('hero') && (
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
            secondaryCtaText={heroSection?.secondaryCtaText}
            secondaryCtaLink={heroSection?.secondaryCtaLink}
            heroImage={heroSection?.mediaUrl || heroSection?.content?.heroImage}
            trustBadgeText={heroSection?.content?.trustBadgeText}
            trustBadgeLink={heroSection?.content?.trustBadgeLink}
          />
        )}

        {/* 2. Visual Photo Strip */}
        {isSectionEnabled('photo_strip', true) && (
          <PhotoStrip images={photoStripSection?.content?.images} />
        )}

        {/* 3. Spaces We Serve */}
        {isSectionEnabled('spaces') && (
          <SpacesWeServeSection
            spaces={spaces}
            title={spacesSection?.title}
            subtitle={spacesSection?.subtitle}
          />
        )}

        {/* 4. Business Models */}
        {isSectionEnabled('models') && (
          <BusinessModelsSection
            models={businessModels}
            title={modelsSection?.title}
            subtitle={modelsSection?.subtitle}
          />
        )}

        {/* 5. Customer Transparency */}
        {isSectionEnabled('transparency') && (
          <CustomerTransparencySection
            steps={transparency.steps}
            principles={transparency.principles}
            title={transparencySection?.title}
            subtitle={transparencySection?.subtitle}
          />
        )}

        {/* 6. Our Agronomic Approach */}
        {isSectionEnabled('approach') && (
          <OurApproach
            badge={approachSection?.subtitle}
            title={approachSection?.title}
            description={
              typeof approachSection?.content === 'string'
                ? approachSection.content
                : approachSection?.content?.description
            }
            steps={approachSection?.content?.steps}
          />
        )}

        {/* 7. Visual Blueprints & Gallery */}
        {isSectionEnabled('gallery') && (
          <ProjectGallery
            badge={gallerySection?.subtitle}
            title={gallerySection?.title}
            description={
              typeof gallerySection?.content === 'string'
                ? gallerySection.content
                : gallerySection?.content?.description
            }
            ctaText={gallerySection?.ctaText || gallerySection?.content?.ctaText}
            ctaLink={gallerySection?.ctaLink || gallerySection?.content?.ctaLink}
            items={gallerySection?.content?.items}
          />
        )}

        {/* 8. Before & After Transformation */}
        {isSectionEnabled('before_after') && (
          <BeforeAfterComparison
            title={beforeAfterSection?.title}
            subtitle={beforeAfterSection?.subtitle}
            description={
              typeof beforeAfterSection?.content === 'string'
                ? beforeAfterSection.content
                : beforeAfterSection?.content?.description
            }
            beforeImage={beforeAfterSection?.secondaryMediaUrl}
            afterImage={beforeAfterSection?.mediaUrl}
          />
        )}

        {/* 9. Verified Client Testimonials */}
        {isSectionEnabled('testimonials') && (
          <TrendingReviews testimonials={testimonials} />
        )}

        {/* 10. Consultation CTA Banner */}
        {isSectionEnabled('cta_banner') && (
          <ContactCtaBanner
            badge={ctaSection?.subtitle}
            title={ctaSection?.title}
            description={
              typeof ctaSection?.content === 'string'
                ? ctaSection.content
                : ctaSection?.content?.description
            }
            ctaText={ctaSection?.ctaText}
            ctaLink={ctaSection?.ctaLink}
            secondaryCtaText={ctaSection?.secondaryCtaText}
            secondaryCtaLink={ctaSection?.secondaryCtaLink}
          />
        )}
      </main>

      {/* Official Website Footer */}
      <SiteFooter />
      <FloatingWhatsApp />
    </LaunchCeremonyWrapper>
  );
}

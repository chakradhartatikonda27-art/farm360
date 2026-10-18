import React from 'react';
import Image from 'next/image';

const stripImages = [
  { src: '/images/managed/cat-managed-farms.jpg', alt: 'Managed farmland' },
  { src: '/images/services/card-land-design.jpg', alt: 'Agricultural land design' },
  { src: '/images/services/grid-drip-sprinkler.jpg', alt: 'Drip & sprinkler irrigation' },
  { src: '/images/services/feat-fencing-boundary.jpg', alt: 'Farm boundary fencing' },
  { src: '/images/managed/plot-after.jpg', alt: 'Care-restored agricultural plot' },
  { src: '/images/services/card-managed-orchard.jpg', alt: 'Managed fruit orchard' },
  { src: '/images/services/feat-terrace-setup.jpg', alt: 'Terrace garden setup' },
  { src: '/images/services/grid-soil-water-testing.jpg', alt: 'Soil and water testing' },
  { src: '/images/services/grid-planting-orchard.jpg', alt: 'Systematic planting' },
  { src: '/images/services/grid-pruning-treecare.jpg', alt: 'Seasonal tree pruning' },
  { src: '/images/services/grid-one-time-harvest.jpg', alt: 'Agricultural harvest' },
  { src: '/images/managed/cat-farmhouse-landscape.jpg', alt: 'Farmhouse landscape care' },
];

export function PhotoStrip() {
  return (
    <section className="strip" aria-label="Agricultural photo gallery">
      <div className="track">
        {/* First sequence */}
        {stripImages.map((img, idx) => (
          <img
            key={`strip-a-${idx}`}
            src={img.src}
            alt={img.alt}
            loading="lazy"
          />
        ))}
        {/* Cloned sequence for smooth infinite scrolling */}
        {stripImages.map((img, idx) => (
          <img
            key={`strip-b-${idx}`}
            src={img.src}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}

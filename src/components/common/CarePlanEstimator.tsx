'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Calculator, Sparkles, Clock, Calendar } from 'lucide-react';

interface SpaceConfig {
  id: string;
  name: string;
  sizeOptions: string[];
  cadenceOptions: string[];
  deliverables: string[];
  note: string;
}

const spaceConfigs: SpaceConfig[] = [
  {
    id: 'farms',
    name: 'Farms & Orchards',
    sizeOptions: ['1 to 2 Acres', '2 to 5 Acres', '5 to 15 Acres', '15+ Acres Estate'],
    cadenceOptions: ['Fortnightly Agronomist Visits', 'Weekly Comprehensive Care', 'Full-time Site Management'],
    deliverables: [
      'Canopy inspection & disease scouting with photo logs',
      'Organic fertigation recipe & bio-inoculant dosing',
      'Pressurized drip filter cleaning and flush line check',
      'Weed management & basin ring mulch maintenance',
      'Harvest scheduling & local market surplus linkage',
    ],
    note: 'Customized based on tree age, species (e.g. mango vs pomegranate), and water source.',
  },
  {
    id: 'plots',
    name: 'Small Plots & Vacant Sites',
    sizeOptions: ['1,200 to 2,400 sq ft', 'Quarter Acre (10,890 sq ft)', 'Half Acre', '1 to 3 Acres'],
    cadenceOptions: ['Monthly Security & Clearing', 'Quarterly Deep Clean', 'Seasonal Green Conversion'],
    deliverables: [
      'Fence integrity & boundary encroachment inspection',
      'Brush cutting, thorn removal & weed suppression',
      'Illegal dumping and rubble removal',
      'Timestamped geo-tagged photo report for absentee owners',
      'Optional seasonal cover crop (sunnhemp/cowpea) to enrich soil',
    ],
    note: 'Focuses on boundary protection, pest deterrence, and keeping land presentable.',
  },
  {
    id: 'terraces',
    name: 'Terrace & Kitchen Gardens',
    sizeOptions: ['Up to 400 sq ft', '400 - 1,000 sq ft', '1,000 - 2,500 sq ft', 'Expansive Rooftop Estate'],
    cadenceOptions: ['Fortnightly Care (2 Visits/Mo)', 'Weekly Care (4 Visits/Mo)'],
    deliverables: [
      'Soil aeration, vermicompost top-dressing, and bio-nutrients',
      'Organic pest control (neem oil / microbial sprays)',
      'Automated micro-drip timer calibration and emitter cleaning',
      'Trellis vine training and vegetable staking',
      'Seasonal crop rotation & organic heirloom seedling supply',
    ],
    note: 'Engineered lightweight planters prevent roof water seepage and floor loading.',
  },
  {
    id: 'farmhouses',
    name: 'Farmhouse & Landscape Grounds',
    sizeOptions: ['Half Acre Lawn & Perimeter', '1 to 2 Acres Grounds', '3+ Acres Estate'],
    cadenceOptions: ['Weekly Comprehensive Maintenance', 'Bi-weekly Estate Visit'],
    deliverables: [
      'Lawn mowing, edging, aeration, and organic weeding',
      'Flowering pergola training and bougainvillea pruning',
      'Hedge trimming and topiary shaping',
      'Pest and fungus monitoring across ornamental shrubs and shade trees',
      'Sprinkler balancing for lush green turf',
    ],
    note: 'Designed to ensure your weekend home is pristine, fragrant, and welcoming.',
  },
];

export function CarePlanEstimator() {
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('farms');
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(1);
  const [selectedCadenceIndex, setSelectedCadenceIndex] = useState<number>(0);

  const currentConfig = spaceConfigs.find((s) => s.id === selectedSpaceId) || spaceConfigs[0];
  const selectedSize = currentConfig.sizeOptions[selectedSizeIndex] || currentConfig.sizeOptions[0];
  const selectedCadence = currentConfig.cadenceOptions[selectedCadenceIndex] || currentConfig.cadenceOptions[0];

  return (
    <div className="bg-ivory-surface rounded-2xl border border-cream shadow-soft overflow-hidden">
      {/* Header */}
      <div className="bg-forest-dark text-ivory p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" />
            <span>Interactive Stewardship Planner</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-ivory">
            Scope Your Space’s Care Plan
          </h3>
          <p className="text-xs sm:text-sm text-ivory/70 mt-1">
            Select your property type and size to preview a tailored agronomic scope.
          </p>
        </div>
        <div className="text-xs bg-forest text-gold px-3 py-1.5 rounded-full border border-gold/30 flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tailored Scope Preview</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Step 1: Space Type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-3">
            01 — Select Your Space Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {spaceConfigs.map((space) => {
              const isSelected = space.id === selectedSpaceId;
              return (
                <button
                  key={space.id}
                  type="button"
                  onClick={() => {
                    setSelectedSpaceId(space.id);
                    setSelectedSizeIndex(0);
                    setSelectedCadenceIndex(0);
                  }}
                  className={`p-3.5 text-left rounded-xl border text-sm transition-all duration-200 ${
                    isSelected
                      ? 'bg-forest text-ivory border-forest shadow-soft font-semibold'
                      : 'bg-ivory border-cream hover:border-gold/50 text-charcoal'
                  }`}
                >
                  <div className="font-serif text-base">{space.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Approximate Property Size */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-3">
            02 — Select Approximate Property Size
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentConfig.sizeOptions.map((size, idx) => {
              const isSelected = idx === selectedSizeIndex;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSizeIndex(idx)}
                  className={`p-3 text-center rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-gold/15 border-gold text-forest-dark font-semibold'
                      : 'bg-ivory/60 border-cream/80 hover:bg-ivory text-charcoal'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Cadence */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-3">
            03 — Preferred Visit Frequency
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentConfig.cadenceOptions.map((cadence, idx) => {
              const isSelected = idx === selectedCadenceIndex;
              return (
                <button
                  key={cadence}
                  type="button"
                  onClick={() => setSelectedCadenceIndex(idx)}
                  className={`p-3.5 text-left rounded-lg border text-xs sm:text-sm transition-all ${
                    isSelected
                      ? 'bg-forest text-ivory border-forest font-semibold'
                      : 'bg-ivory/60 border-cream/80 hover:bg-ivory text-charcoal'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold shrink-0" />
                    <span>{cadence}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tailored Scope Summary Card */}
        <div className="bg-ivory rounded-xl p-5 sm:p-6 border border-cream space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-cream pb-3">
            <div>
              <span className="text-xs uppercase tracking-wider text-forest font-semibold">Recommended Scope for</span>
              <h4 className="text-lg font-serif text-charcoal font-bold">
                {currentConfig.name} ({selectedSize}) — {selectedCadence}
              </h4>
            </div>
            <div className="text-xs text-charcoal/60 bg-cream/50 px-2.5 py-1 rounded">
              Pricing agreed after initial on-site survey
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/60">Included in this plan:</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm text-charcoal/80">
              {currentConfig.deliverables.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-botanical shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-charcoal/60 italic pt-2 border-t border-cream/60">
            * Note: {currentConfig.note} No long-term lock-in; plans can be adjusted seasonally.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-charcoal/70">
            Have multiple plots or special requirements? Our agronomy leads are happy to visit.
          </div>
          <Link
            href={`/contact?propertyType=${encodeURIComponent(currentConfig.name)}&size=${encodeURIComponent(selectedSize)}&engagement=Ongoing%20Managed%20Care`}
            className="btn-forest w-full sm:w-auto"
          >
            <span>Request Proposal for this Space</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

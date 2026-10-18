export interface GalleryItem {
  id: string;
  title: string;
  category: 'farms' | 'gardens' | 'irrigation' | 'boundaries' | 'orchards';
  categoryLabel: string;
  image: string;
  aspect: string;
  typeBadge: 'Client Concept & Blueprint' | 'Operational Execution Model' | 'Horticultural Prototype';
  description: string;
  locationContext: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'proj-1',
    title: 'High-Density Guava & Mango Orchard',
    category: 'orchards',
    categoryLabel: 'Fruit Orchards',
    image: '/images/services/card-managed-orchard.jpg',
    aspect: 'aspect-[4/3]',
    typeBadge: 'Operational Execution Model',
    description: 'High-density fruit orchard zoning with pressure-compensating drip irrigation and integrated organic cover cropping.',
    locationContext: 'South India Semi-Arid Belt',
  },
  {
    id: 'proj-2',
    title: 'Urban Rooftop Organic Terrace Oasis',
    category: 'gardens',
    categoryLabel: 'Terrace Gardens',
    image: '/images/hero/hero-terrace-farm.jpg',
    aspect: 'aspect-[16/10]',
    typeBadge: 'Client Concept & Blueprint',
    description: 'Elevated edible landscape featuring raised planters, shaded dining arbor, and automated solar-timed micro-drip.',
    locationContext: 'Metropolitan Residential Residence',
  },
  {
    id: 'proj-3',
    title: 'Comprehensive Boundary & Fence Protection',
    category: 'boundaries',
    categoryLabel: 'Farm Boundaries',
    image: '/images/services/feat-fencing-boundary.jpg',
    aspect: 'aspect-[4/3]',
    typeBadge: 'Operational Execution Model',
    description: 'Galvanized 10-gauge chain-link boundary anchored by reinforced precast RCC posts with corner strainers.',
    locationContext: 'Agricultural Boundary Perimeter',
  },
  {
    id: 'proj-4',
    title: 'Regenerated Peri-Urban Kitchen Plot',
    category: 'gardens',
    categoryLabel: 'Kitchen Gardens',
    image: '/images/managed/plot-after.jpg',
    aspect: 'aspect-[4/3]',
    typeBadge: 'Horticultural Prototype',
    description: 'Transformation of a previously overgrown vacant residential parcel into raised organic vegetable and herb beds.',
    locationContext: 'Suburban Peri-Urban Community',
  },
  {
    id: 'proj-5',
    title: 'Precision Pressurized Drip Network',
    category: 'irrigation',
    categoryLabel: 'Irrigation Systems',
    image: '/images/services/grid-drip-sprinkler.jpg',
    aspect: 'aspect-[4/3]',
    typeBadge: 'Operational Execution Model',
    description: 'Mainline filtration manifold, Venturi injector, and pressure-compensating inline drippers for crop nutrition.',
    locationContext: 'Commercial Horticultural Parcel',
  },
  {
    id: 'proj-6',
    title: 'Topographic Contouring & Drainage Masterplan',
    category: 'farms',
    categoryLabel: 'Productive Farmland',
    image: '/images/services/feat-land-farm-design.jpg',
    aspect: 'aspect-[16/10]',
    typeBadge: 'Client Concept & Blueprint',
    description: 'Contour bunding and rainwater swales engineered to harvest monsoon runoff and prevent soil erosion.',
    locationContext: 'Decentralized Farm Cluster',
  },
  {
    id: 'proj-7',
    title: 'Acreage Heavy Land Cleaning & Grading',
    category: 'farms',
    categoryLabel: 'Land Preparation',
    image: '/images/services/grid-land-cleaning.jpg',
    aspect: 'aspect-[4/3]',
    typeBadge: 'Operational Execution Model',
    description: 'Deep excavation, thorny prosopis extraction, and laser surface grading for seasonal sowing.',
    locationContext: 'Farming Belt Site Preparation',
  },
  {
    id: 'proj-8',
    title: 'Farmhouse Pergola & Native Flower Borders',
    category: 'gardens',
    categoryLabel: 'Landscaped Spaces',
    image: '/images/managed/cat-farmhouse-landscape.jpg',
    aspect: 'aspect-[4/3]',
    typeBadge: 'Client Concept & Blueprint',
    description: 'Native flowering borders, walking flagstones, and shade-canopy trees framing a weekend farmhouse retreat.',
    locationContext: 'Countryside Retreat Parcel',
  },
];

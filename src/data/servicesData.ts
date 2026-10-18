export interface ServiceItem {
  slug: string;
  title: string;
  shortTitle: string;
  category: 'one-time' | 'managed' | 'landowner';
  subCategory: 'gardens' | 'land-protection' | 'water-soil' | 'crop-care' | 'development' | 'managed-care';
  badge?: string;
  eyebrow: string;
  tagline: string;
  summary: string;
  heroImage: string;
  cardImage: string;
  problem: string;
  benefits: string[];
  whatsIncluded: string[];
  processSteps: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  gallery: Array<{
    src: string;
    caption: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  relatedServices: string[];
  scopeNote: string;
}

export const servicesData: ServiceItem[] = [
  // 1. Land cleaning and levelling
  {
    slug: 'land-cleaning-and-levelling',
    title: 'Land Cleaning & Levelling',
    shortTitle: 'Land Cleaning & Levelling',
    category: 'one-time',
    subCategory: 'land-protection',
    badge: 'Site Preparation',
    eyebrow: 'FOUNDATIONAL LAND WORK',
    tagline: 'Transform overgrown, uneven terrain into a clean, workable canvas.',
    summary: 'Comprehensive removal of thorny shrubs, wild weeds, boulders, and surface grading tailored to your agricultural layout, drainage requirements, and boundary lines.',
    heroImage: '/images/services/grid-land-cleaning.jpg',
    cardImage: '/images/services/grid-land-cleaning.jpg',
    problem: 'Neglected plots quickly accumulate invasive weeds, wild scrub, surface rocks, and uneven undulations that prevent proper water flow, vehicular access, and safe boundary survey.',
    benefits: [
      'Eliminates pest harbors, snake habitats, and aggressive weed seed-banks',
      'Establishes proper natural drainage gradients to prevent water stagnation',
      'Exposes true boundary markers and facilitates accurate GPS farm mapping',
      'Creates safe access tracks for tractors, borewell rigs, and fencing equipment',
    ],
    whatsIncluded: [
      'Initial site assessment to identify root depths, rock outcrops, and boundary stakes',
      'Deployment of appropriate machinery (JCB, heavy excavators, or tractor blades)',
      'Clearing of thorny shrubs, prosopis (vilayati kikar), and unwanted stump extraction',
      'Removal or orderly stacking of loose surface boulders and construction debris',
      'Laser-assisted or contour-based surface levelling for optimal gravity drainage',
      'Compacting or bunding around property edges where agreed in scope',
    ],
    processSteps: [
      { step: '01', title: 'Site Inspection', description: 'We assess acreage, vegetation density, topography, and machinery accessibility.' },
      { step: '02', title: 'Equipment Mobilization', description: 'Deploy vetted heavy machinery operators with site supervisory oversight.' },
      { step: '03', title: 'Clearing & Grading', description: 'Systematic clearing, stump extraction, rock clearing, and slope contouring.' },
      { step: '04', title: 'Handover & Verification', description: 'Walkthrough with landowner to confirm grade, boundary clearance, and cleanliness.' },
    ],
    gallery: [
      { src: '/images/services/grid-land-cleaning.jpg', caption: 'Excavator grading fertile agricultural soil' },
      { src: '/images/services/feat-land-farm-design.jpg', caption: 'Contoured parcel ready for cultivation' },
    ],
    faqs: [
      { question: 'What machinery do you use for land cleaning?', answer: 'We match equipment to your site conditions — typically JCB backhoe loaders for moderate clearing, 20-ton tracked excavators for dense scrub and rock removal, and tractor implements for final grading.' },
      { question: 'Do you dispose of cleared vegetation off-site?', answer: 'Depending on local regulations and client preference, organic vegetative waste can be chipped for mulching, composted on-site, or hauled away.' },
      { question: 'Can you work on sloped or rocky terrains?', answer: 'Yes. Our site team assesses gradients first to prevent soil erosion, often recommending step-terracework or contour bunding for hilly topography.' },
    ],
    relatedServices: ['land-preparation', 'fencing-and-boundary-protection', 'farm-and-land-planning'],
    scopeNote: 'Machine hours, operator logistics, and dumping permissions vary by location and are detailed in your tailored scope proposal.',
  },

  // 2. Farm and land planning
  {
    slug: 'farm-and-land-planning',
    title: 'Farm & Land Planning',
    shortTitle: 'Land & Farm Planning',
    category: 'one-time',
    subCategory: 'development',
    badge: 'Strategic Masterplanning',
    eyebrow: 'VISION & ARCHITECTURE',
    tagline: 'Scientific zoning for long-term productivity, water security, and beauty.',
    summary: 'Holistic master plans that optimize access roads, water storage, crop zoning, windbreaks, residential pockets, and ecological corridors before a single rupee is spent on digging.',
    heroImage: '/images/services/feat-land-farm-design.jpg',
    cardImage: '/images/services/card-land-design.jpg',
    problem: 'Without a clear masterplan, landowners frequently drill borewells in the wrong location, plant trees that shade solar arrays or power lines, and build roads that wash away during monsoons.',
    benefits: [
      'Prevents costly infrastructure relocations and irrigation rework',
      'Optimizes microclimate with windbreaks, shade zoning, and solar orientation',
      'Integrates rainwater harvesting structures with natural watershed contours',
      'Phased development roadmaps tailored to realistic budgets and timelines',
    ],
    whatsIncluded: [
      'Topographic contour analysis and watershed drainage pattern mapping',
      'Soil suitability and microclimatic crop zoning recommendations',
      'Layout for internal roadways, turning radii, and boundary buffers',
      'Irrigation pipeline routes, pump house, and water storage reservoir positioning',
      'High-resolution 2D master plan blueprint with dimensioned plot zones',
      'Executive summary with step-by-step implementation milestones',
    ],
    processSteps: [
      { step: '01', title: 'Vision Discovery', description: 'In-depth discussion of your goals: weekend farmhouse, commercial orchard, or regenerative sanctuary.' },
      { step: '02', title: 'Topographical Survey', description: 'Drone or GPS mapping to capture elevations, water pathways, and prevailing winds.' },
      { step: '03', title: 'Zoning & Masterplanning', description: 'Drafting multi-layered functional layout integrating roads, water, power, and crops.' },
      { step: '04', title: 'Master Plan Delivery', description: 'Comprehensive presentation with digital CAD/PDF deliverables and phase rollout budget.' },
    ],
    gallery: [
      { src: '/images/services/feat-land-farm-design.jpg', caption: 'Contoured orchard and agricultural road zoning' },
      { src: '/images/services/card-land-design.jpg', caption: 'Structured farm layout with integrated drainage' },
    ],
    faqs: [
      { question: 'Do I need a boundary survey before masterplanning?', answer: 'Yes. An accurate legal boundary or surveyor sketch is necessary so the master plan aligns precisely with your physical property stakes.' },
      { question: 'Can the plan be implemented in phases over 2-3 years?', answer: 'Absolutely. We specifically design the roadmap with clear Phase 1 (fencing, borewell, soil prep), Phase 2 (irrigation, planting), and Phase 3 (structures).' },
    ],
    relatedServices: ['land-cleaning-and-levelling', 'drip-and-sprinkler-installation', 'planting-and-orchard-setup'],
    scopeNote: 'Deliverables include printable high-res plans and phase guidance. Site implementation coordination is available as an integrated package.',
  },

  // 3. Land preparation
  {
    slug: 'land-preparation',
    title: 'Agricultural Land Preparation',
    shortTitle: 'Land Preparation',
    category: 'one-time',
    subCategory: 'crop-care',
    badge: 'Agronomy Focus',
    eyebrow: 'SOIL CONDITIONING',
    tagline: 'Deep tillage, organic enrichment, and raised beds for optimal root development.',
    summary: 'Turn compacted, depleted earth into thriving, aerated soil through subsoiling, rotavation, green manuring, and customized organic enrichment based on lab soil assays.',
    heroImage: '/images/services/grid-planting-orchard.jpg',
    cardImage: '/images/services/grid-planting-orchard.jpg',
    problem: 'Hardpan subsoil compaction from past traffic or sun-baking prevents water infiltration and stunts tree root growth, leading to poor sapling survival and yellowing leaves.',
    benefits: [
      'Breaks deep subsoil hardpan to allow deep taproot penetration',
      'Restores active microbial life with well-cured farmyard manure and bio-fertilizers',
      'Improves water holding capacity while providing healthy root zone aeration',
      'Suppresses dormant weed seeds through pre-season cultivation cycles',
    ],
    whatsIncluded: [
      'Deep ripping / chiselling to break hardpan layer up to 18-24 inches',
      'Primary plowing (disc or mouldboard) to invert soil and expose larvae to sunlight',
      'Secondary tillage and rotavation to achieve fine tilth seedbeds or planting basins',
      'Incorporation of aged farmyard manure (FYM), press mud, or vermicompost as scoped',
      'Application of beneficial microbial inoculants (Trichoderma, Pseudomonas, mycorrhiza)',
      'Formation of raised planting ridges, broad beds, or tree planting pits',
    ],
    processSteps: [
      { step: '01', title: 'Soil Baseline Review', description: 'Review soil texture, pH, and electrical conductivity to specify tillage depth and amendments.' },
      { step: '02', title: 'Subsoiling & Ripping', description: 'Heavy tractor ripping to shatter impervious subsoil compaction layers.' },
      { step: '03', title: 'Organic Amendment', description: 'Even broadcast and rotavator incorporation of organic matter and soil conditioners.' },
      { step: '04', title: 'Bed / Pit Preparation', description: 'Laser-guided ridging or mechanised auger pit drilling according to crop spacing.' },
    ],
    gallery: [
      { src: '/images/services/grid-planting-orchard.jpg', caption: 'Soil conditioning and sapling pit preparation' },
      { src: '/images/services/grid-soil-water-testing.jpg', caption: 'Lab verification of soil organic matter' },
    ],
    faqs: [
      { question: 'When is the best season for land preparation?', answer: 'In tropical climates, pre-monsoon (April-May) is ideal for deep plowing to bake soil and catch the first rains. Post-monsoon preparation is also suitable for rabi plantings.' },
      { question: 'Can you source organic manure and compost?', answer: 'Yes, we coordinate quality-tested aged cow manure, poultry manure, or certified vermicompost directly to your site.' },
    ],
    relatedServices: ['soil-and-water-testing', 'planting-and-orchard-setup', 'drip-and-sprinkler-installation'],
    scopeNote: 'Quantities of organic inputs are determined by your soil test report and acreage targets.',
  },

  // 4. Fencing and boundary protection
  {
    slug: 'fencing-and-boundary-protection',
    title: 'Fencing & Boundary Protection',
    shortTitle: 'Fencing & Boundary',
    category: 'one-time',
    subCategory: 'land-protection',
    badge: 'Security & Demarcation',
    eyebrow: 'ASSET PROTECTION',
    tagline: 'Permanent, theft-resistant, animal-deterrent boundaries built to last.',
    summary: 'Robust fencing systems including heavy GI chain-link, precast RCC poles, stone pillars, high-tensile barbed wire, and custom farm gates designed for rural and peri-urban security.',
    heroImage: '/images/services/feat-fencing-boundary.jpg',
    cardImage: '/images/services/feat-fencing-boundary.jpg',
    problem: 'Unfenced properties suffer from boundary encroachment, stray cattle grazing, wild boar intrusion, illegal dumping, and disputes with adjoining parcels.',
    benefits: [
      'Secures legal possession and prevents neighbor encroachments',
      'Shields costly fruit saplings and vegetable beds from stray cattle and wildlife',
      'Durable galvanized GI wire coatings resist rusting in high-humidity zones',
      'Provides peace of mind for absentee landowners and weekend farm investors',
    ],
    whatsIncluded: [
      'Line-of-sight survey and boundary marking with your surveyor or existing markers',
      'Digging of footing pits at standard 8-10 ft intervals with corner strut bracing',
      'Supply of heavy-duty precast RCC concrete posts or dressed granite stone pillars',
      'Concrete footing foundation for corner posts, gate posts, and strainers',
      'Installation of hot-dip GI chain link mesh (standard 8G, 10G, or 12G) or 5-7 strand barbed wire',
      'Straining, tensioning wire alignment, and optional razor wire / solar fence provision',
      'Fabrication and installation of vehicular farm swing gates with lockable drop-bolts',
    ],
    processSteps: [
      { step: '01', title: 'Boundary Demarcation', description: 'Walk perimeter with surveyor points, measure running footage, and plan gate locations.' },
      { step: '02', title: 'Pit Excavation & Post Erection', description: 'Excavate post pits, erect RCC or stone pillars in true vertical plumb, and concrete corner braces.' },
      { step: '03', title: 'Mesh Weaving & Tensioning', description: 'Unroll heavy-duty GI mesh or high-tensile wire, tension with mechanical pullers, and clamp.' },
      { step: '04', title: 'Gate Fitting & Inspection', description: 'Hang fabricated steel gates, test swing clearance, and verify boundary rigidity.' },
    ],
    gallery: [
      { src: '/images/services/feat-fencing-boundary.jpg', caption: 'High-tensile chain-link fencing with concrete pillars' },
      { src: '/images/landowners/lease-directly.jpg', caption: 'Boundary protection for managed orchard estates' },
    ],
    faqs: [
      { question: 'Which is better: RCC concrete posts or granite stone pillars?', answer: 'Granite stone pillars are extremely long-lasting and termite-proof in rocky soils, while precast RCC posts offer uniform appearance and engineered steel rebar strength. We advise based on regional availability and aesthetic preference.' },
      { question: 'Can you install solar-powered deterrent fences for wild boars?', answer: 'Yes, we coordinate solar energizer pulsed electric fences (non-lethal, compliant with agricultural safety standards) for farms adjoining forest fringes.' },
    ],
    relatedServices: ['land-cleaning-and-levelling', 'farm-and-land-planning', 'agricultural-construction'],
    scopeNote: 'Perimeter running footage, post spacing, mesh gauge, and gate dimensions are itemized transparently in our quotation.',
  },

  // 5. Borewell coordination
  {
    slug: 'borewell-coordination',
    title: 'Borewell & Water Coordination',
    shortTitle: 'Borewell Coordination',
    category: 'one-time',
    subCategory: 'water-soil',
    badge: 'Water Security',
    eyebrow: 'HYDROLOGICAL SOLUTIONS',
    tagline: 'Scientific hydrogeological point selection, drilling oversight, and yield testing.',
    summary: 'Coordinate geophysical electrical resistivity surveys, vetted rotary drilling contractors, quality casing pipes, and accurate yield testing to secure your farm’s lifeblood.',
    heroImage: '/images/services/grid-borewell-coordination.jpg',
    cardImage: '/images/services/grid-borewell-coordination.jpg',
    problem: 'Drilling blind based solely on traditional dowsing often leads to dry bores, collapsed drill holes, poor water quality, and tens of thousands of rupees in lost capital.',
    benefits: [
      'Geophysical resistivity survey cross-checks water fracture zones',
      'On-site supervision ensures specified pipe thickness and casing depth are actually installed',
      'V-notch flow testing measures real continuous discharge in litres per hour (LPH)',
      'Prevents contractor over-invoicing and manages local drilling logistics',
    ],
    whatsIncluded: [
      'Coordination with qualified hydrogeologists for scientific point identification',
      'Screening and dispatch of high-capacity hydraulic rotary drilling rigs',
      'Supervision of drilling depth, aquifer strike points, and strata logging',
      'Installation of heavy-duty ISI slotted PVC or MS casing pipes through loose topsoil',
      'Air-compressor yield blowing, gravel packing, and silt flushing',
      'Water sample collection for comprehensive laboratory potability and TDS testing',
      'Detailed handover report with borehole depth, casing depth, water strike, and pump recommendations',
    ],
    processSteps: [
      { step: '01', title: 'Hydrogeological Survey', description: 'Resistivity sounding to identify subsurface fracture systems and groundwater potential.' },
      { step: '02', title: 'Rig Mobilization', description: 'Schedule reputable rig crew, negotiate footage rates, and prepare site access.' },
      { step: '03', title: 'Supervised Drilling', description: 'Full oversight during drilling, monitoring rock layers and water strike depths.' },
      { step: '04', title: 'Flushing & Yield Test', description: 'Compressor clean-out, casing verification, yield estimation, and lab sample collection.' },
    ],
    gallery: [
      { src: '/images/services/grid-borewell-coordination.jpg', caption: 'Deep drilling rig operating under agricultural supervision' },
      { src: '/images/services/grid-soil-water-testing.jpg', caption: 'Water quality and dissolved solids laboratory verification' },
    ],
    faqs: [
      { question: 'Do you guarantee water from the borewell?', answer: 'No reputable company can guarantee subterranean water. What we guarantee is rigorous scientific point selection, vetted drilling standards, and transparent supervision to maximize success probabilities.' },
      { question: 'Where is borewell coordination offered?', answer: 'Offered in regions where we maintain verified local hydrogeologist and drilling partner networks. Service availability is verified upon initial enquiry.' },
    ],
    relatedServices: ['soil-and-water-testing', 'drip-and-sprinkler-installation', 'farm-electrical-work'],
    scopeNote: 'Offered where permitted by local groundwater authority guidelines. Drilling is billed per foot based on agreed contractor terms.',
  },

  // 6. Drip irrigation and sprinkler installation
  {
    slug: 'drip-and-sprinkler-installation',
    title: 'Drip & Sprinkler Irrigation Installation',
    shortTitle: 'Drip & Sprinklers',
    category: 'one-time',
    subCategory: 'water-soil',
    badge: 'Water Efficiency',
    eyebrow: 'PRECISION WATER SYSTEMS',
    tagline: 'Save up to 60% water while delivering precise nutrients directly to plant roots.',
    summary: 'Custom-engineered pressurized irrigation layouts: inline drip for orchards, micro-sprinklers for vegetables, disc filtration, and automated solenoid manifolds for effortless watering.',
    heroImage: '/images/services/grid-drip-sprinkler.jpg',
    cardImage: '/images/services/grid-drip-sprinkler.jpg',
    problem: 'Flood irrigation wastes massive volumes of water, encourages weed outbreaks between rows, leaches expensive fertilizers past root zones, and stresses plants during hot afternoons.',
    benefits: [
      'Delivers uniform water discharge to every single tree regardless of terrain elevation',
      'Enables fertigation — injecting liquid nutrients directly into irrigation lines',
      'Significantly reduces electricity pumping hours and prevents soil crusting',
      'Modular layout allows expanding rows as new orchard plots are planted',
    ],
    whatsIncluded: [
      'Hydraulic calculation of flow rates, friction loss, and operating pressure',
      'Mainline and sub-main PVC pipeline trenching, laying, and solvent welding',
      'Heavy-duty disc or screen filtration unit to prevent emitter clogging',
      'Venturi injector setup for effortless liquid bio-fertilizer dosing',
      'UV-stabilized virgin HDPE lateral lines with pressure-compensating (PC) drippers',
      'Flush valves, air-release valves, pressure gauges, and control ball-valves per zone',
      'Commissioning pressure test, emitter flow calibration, and operator handover training',
    ],
    processSteps: [
      { step: '01', title: 'Hydraulic Layout Design', description: 'Calculate head pressure, water source capacity, and zone division for balanced flow.' },
      { step: '02', title: 'Mainline Pipeline Trenching', description: 'Excavate trenches below plow depth (2-3 ft) and connect PVC header pipes.' },
      { step: '03', title: 'Filter & Lateral Deployment', description: 'Assemble filter bank, pressure gauges, lateral lines, and calibrated drippers.' },
      { step: '04', title: 'System Pressure Testing', description: 'Flush debris, test working pressure across all zones, and certify emitter rates.' },
    ],
    gallery: [
      { src: '/images/services/grid-drip-sprinkler.jpg', caption: 'Precision drip emitters nourishing healthy young crops' },
      { src: '/images/hero/hero-terrace-farm.jpg', caption: 'Automated micro-irrigation for terrace and container gardens' },
    ],
    faqs: [
      { question: 'Can drip irrigation work with saline or hard borewell water?', answer: 'Yes, with proper filtration (disc filters + hydrocyclone sand separators) and periodic organic acid line flushing to dissolve carbonate scaling.' },
      { question: 'Do you provide automation and smartphone timers?', answer: 'Yes, we can integrate battery-operated or WiFi/GSM smart solenoid valves that let you schedule irrigation cycles from your phone.' },
    ],
    relatedServices: ['borewell-coordination', 'planting-and-orchard-setup', 'managed-farms-and-orchards'],
    scopeNote: 'System components are selected based on your water source pressure, crop spacing, and topography.',
  },

  // 7. Soil and water testing coordination
  {
    slug: 'soil-and-water-testing',
    title: 'Soil & Water Testing Coordination',
    shortTitle: 'Soil & Water Testing',
    category: 'one-time',
    subCategory: 'water-soil',
    badge: 'Scientific Grounding',
    eyebrow: 'LABORATORY ASSAYS',
    tagline: 'Stop guessing. Understand your land’s exact chemistry and mineral balance.',
    summary: 'Standardized core-sampling across your property sent to accredited agricultural testing labs, followed by a clear, plain-language agronomic roadmap on what amendments your soil actually requires.',
    heroImage: '/images/services/grid-soil-water-testing.jpg',
    cardImage: '/images/services/grid-soil-water-testing.jpg',
    problem: 'Applying fertilizers or planting sensitive fruit varieties without testing leads to mineral toxicity, nutrient lockup, salinity burn, and failed sapling investments.',
    benefits: [
      'Identifies pH imbalances (acidic vs alkaline) that cause severe nutrient lockup',
      'Pinpoints electrical conductivity (EC) to prevent salt shock in irrigation water',
      'Measures exact Nitrogen, Phosphorus, Potassium (NPK) and secondary micronutrients',
      'Provides actionable dosage charts for gypsum, lime, zinc, or compost additions',
    ],
    whatsIncluded: [
      'Multi-point zigzag soil sampling across stratified zones at 0-15cm and 15-30cm depths',
      'Proper sample drying, bagging, labelling, and chain-of-custody documentation',
      'Water sample collection directly from active borewell or storage source',
      'Certified lab testing for pH, EC, Organic Carbon %, N, P, K, Calcium, Magnesium, Sulphur, Zinc, Iron, Manganese, Boron',
      'Water testing for Sodium Adsorption Ratio (SAR), bicarbonates, nitrates, and heavy metals',
      'Consultation with an agronomist translating lab numbers into a practical site recipe',
    ],
    processSteps: [
      { step: '01', title: 'Stratified Core Sampling', description: 'Field visit to collect composite soil cores from different soil types across your property.' },
      { step: '02', title: 'Lab Dispatch', description: 'Samples sent to certified agricultural analytical testing laboratories.' },
      { step: '03', title: 'Assay Analysis', description: 'Receive certified 16-parameter mineral, organic carbon, and salinity results.' },
      { step: '04', title: 'Agronomic Action Plan', description: 'Detailed report with soil amendment guidelines and crop suitability matrix.' },
    ],
    gallery: [
      { src: '/images/services/grid-soil-water-testing.jpg', caption: 'Field specialist collecting stratified soil samples for testing' },
      { src: '/images/services/grid-planting-orchard.jpg', caption: 'Applying organic amendments based on lab recommendations' },
    ],
    faqs: [
      { question: 'How long does it take to get soil test results?', answer: 'Typical lab processing takes 7 to 10 working days from sampling. We compile the agronomic recommendation report within 3 days thereafter.' },
      { question: 'Why is testing borewell water as important as soil?', answer: 'If your borewell has high chlorides, bicarbonates, or sodium, irrigating with it can degrade even excellent soil within one to two seasons.' },
    ],
    relatedServices: ['land-preparation', 'planting-and-orchard-setup', 'managed-farms-and-orchards'],
    scopeNote: 'Includes sample collection, certified lab fees, and our agronomist interpretation summary.',
  },

  // 8. Planting and orchard setup
  {
    slug: 'planting-and-orchard-setup',
    title: 'Planting & High-Density Orchard Setup',
    shortTitle: 'Planting & Orchard Setup',
    category: 'one-time',
    subCategory: 'crop-care',
    badge: 'Long-term Yields',
    eyebrow: 'HORTICULTURE EXCELLENCE',
    tagline: 'Vetted genuine grafts, precision pit preparation, and high-survival planting.',
    summary: 'Turn acreage into productive fruit orchards (Mango, Guava, Pomegranate, Citrus, Avocado, Chikoo, Coconut) with certified disease-free nursery stock, mycorrhizal root dips, and support staking.',
    heroImage: '/images/services/card-managed-orchard.jpg',
    cardImage: '/images/services/grid-planting-orchard.jpg',
    problem: 'Buying unverified saplings from roadside nurseries leads to mislabelled varieties, diseased rootstock, graft failure, and years of wasted water and labor before realizing trees won’t fruit.',
    benefits: [
      'Procurement of true-to-type, certified grafted saplings from government-accredited mother blocks',
      'Engineered planting pits with organic compost, neem cake, and bio-inoculants prevent root rot',
      'Supports high-density planting (HDP) for early commercial yields and easier harvesting',
      'Proper bamboo staking and tree guards shield saplings from wind damage and grazing',
    ],
    whatsIncluded: [
      'Selection of fruit species and cultivars suited to your climate zone and soil profile',
      'Precision layout marking according to canopy spacing (e.g. 5m x 5m, 3m x 2m HDP)',
      'Pit excavation (3ft x 3ft x 3ft or mechanized tractor auger) and sun-curing',
      'Pit filling mixture: topsoil, aged manure, vermicompost, neem cake, bone meal, and bio-agents',
      'Careful graft planting without burying graft union, staking with treated bamboo poles',
      'Immediate basin establishment, prophylactic drenching, and initial irrigation cycle',
      'Care schedule document for the critical first 90 days of sapling establishment',
    ],
    processSteps: [
      { step: '01', title: 'Varietal Selection', description: 'Curate fruit cultivars tailored to soil test, water availability, and market or personal goals.' },
      { step: '02', title: 'Pit Digging & Curing', description: 'Excavate pits, allow solar disinfection, and refill with nutrient-rich organic blend.' },
      { step: '03', title: 'Sapling Procurement', description: 'Inspect and transport vigorous, pest-free grafts from certified mother nurseries.' },
      { step: '04', title: 'Precision Planting', description: 'Plant at exact graft height, stake against wind, drench with bio-stimulants, and irrigate.' },
    ],
    gallery: [
      { src: '/images/services/card-managed-orchard.jpg', caption: 'Bountiful mature mango orchard under FarmCare stewardship' },
      { src: '/images/services/grid-planting-orchard.jpg', caption: 'Field specialist planting certified grafted saplings' },
    ],
    faqs: [
      { question: 'What fruit varieties thrive best in South India?', answer: 'Mango (Alphonso, Banganapalli, Mallika), Taiwan Pink Guava, Red Pomegranate, Hass/Hass-cross Avocado, Mosambi, Sapota (Cricket Ball), and tender coconut thrive with proper irrigation.' },
      { question: 'What is your sapling survival rate?', answer: 'With our engineered pit preparation, mycorrhizal root inoculants, and immediate drip commissioning, survival rates consistently exceed 92-95%.' },
    ],
    relatedServices: ['drip-and-sprinkler-installation', 'pruning-and-tree-care', 'managed-farms-and-orchards'],
    scopeNote: 'Sapling costs, pit inputs, and labor vary by species and density; detailed per-tree breakdown provided in proposal.',
  },

  // 9. Pruning and tree care
  {
    slug: 'pruning-and-tree-care',
    title: 'Orchard Pruning & Tree Canopy Care',
    shortTitle: 'Pruning & Tree Care',
    category: 'one-time',
    subCategory: 'crop-care',
    badge: 'Canopy Architecture',
    eyebrow: 'HORTICULTURE HYGIENE',
    tagline: 'Scientific training, canopy thinning, deadwood removal, and disease sanitization.',
    summary: 'Professional pruning using sanitized shears and pole saws to open canopies to sunlight, remove parasitic mistletoe, stimulate fruiting spurs, and protect cut wounds with organic Bordeaux paste.',
    heroImage: '/images/services/grid-pruning-treecare.jpg',
    cardImage: '/images/services/grid-pruning-treecare.jpg',
    problem: 'Overgrown, unpruned fruit trees develop tangled, dark interiors where fungal spores and stem borers multiply, resulting in alternate-year bearing, poor fruit color, and broken branches.',
    benefits: [
      'Maximizes sunlight penetration and air circulation to dramatically lower fungal blight',
      'Directs tree energy away from unproductive water suckers into heavy fruit set',
      'Maintains manageable tree heights for easier pest inspection and safe fruit picking',
      'Removes decayed limbs before storm winds cause structural splits down tree trunks',
    ],
    whatsIncluded: [
      'Canopy inspection to diagnose branch structural integrity, borers, and gummosis',
      'Removal of crossing branches, water sprouts, diseased limbs, and deadwood',
      'Center-opening thinning to achieve open-center or modified central leader form',
      'Sterilization of pruning blades between trees to prevent cross-contamination',
      'Sealing of all cuts larger than 1 inch with protective copper oxychloride / Bordeaux paste',
      'Clearing and chipping of pruned wood; application of organic trunk whitewash to deter borers',
    ],
    processSteps: [
      { step: '01', title: 'Orchard Assessment', description: 'Inspect tree age, health, past fruiting patterns, and seasonal dormancy status.' },
      { step: '02', title: 'Sanitized Cut Execution', description: 'Skilled pruners execute angled collar cuts without tearing bark.' },
      { step: '03', title: 'Wound Dressing', description: 'Immediate application of fungicidal paste to all exposed cut surfaces.' },
      { step: '04', title: 'Trunk Protection & Cleanup', description: 'Whitewash tree trunks with lime and copper paste; chip or remove pruned brush.' },
    ],
    gallery: [
      { src: '/images/services/grid-pruning-treecare.jpg', caption: 'Clean angled branch pruning using professional shears' },
      { src: '/images/services/grid-nutrition-pestcare.jpg', caption: 'Inspecting foliage health following canopy thinning' },
    ],
    faqs: [
      { question: 'When should fruit trees be pruned?', answer: 'For most deciduous and subtropical fruit trees, pruning is performed immediately after harvest or during winter dormancy before the new vegetative flush.' },
      { question: 'Will pruning reduce this year’s yield?', answer: 'Correct pruning may yield slightly fewer individual fruits, but the resulting harvest will be significantly larger in fruit size, sweeter, disease-free, and higher in commercial grade.' },
    ],
    relatedServices: ['planting-and-orchard-setup', 'managed-farms-and-orchards', 'one-time-harvest-support'],
    scopeNote: 'Priced per tree or per acre based on tree height, canopy density, and cleanup requirements.',
  },

  // 10. Farm electrical work
  {
    slug: 'farm-electrical-work',
    title: 'Farm Electrical & Pump Automation',
    shortTitle: 'Farm Electrical',
    category: 'one-time',
    subCategory: 'development',
    badge: 'Power & Infrastructure',
    eyebrow: 'RURAL UTILITY SYSTEMS',
    tagline: 'Reliable pump starter panels, lightning protection, and solar pumping coordination.',
    summary: 'Safe, weatherproof rural electrical infrastructure: DOL and Star-Delta starter panels, single-phasing preventers, dry-run cutoffs, underground cabling, and solar pump conversions.',
    heroImage: '/images/services/grid-borewell-coordination.jpg',
    cardImage: '/images/services/grid-borewell-coordination.jpg',
    problem: 'Voltage fluctuations, single-phasing, and ungrounded wiring in rural fields frequently burn expensive submersible pump motors and create life-threatening electrical shock hazards.',
    benefits: [
      'Comprehensive motor protection against low voltage, phase reversal, and dry-run damage',
      'Armoured cable trenching protects lines from rodent gnawing and tractor plowing',
      'Proper copper chemical earthing pits protect pump motors from lightning surges',
      'GSM smart starter integration enables remote pump control and SMS failure alerts',
    ],
    whatsIncluded: [
      'Load assessment and coordination with state electricity boards (DISCOMs) where needed',
      'Installation of heavy-duty IP65 weatherproof outdoor control panels',
      'Star-Delta or Digital DOL starters with integrated digital voltmeter and ammeter',
      'Dry-run protection sensors to prevent motor burnout when borewell water dips',
      'Underground laying of 4-core copper armoured submersible cable in HDPE conduit',
      'Chemical earthing with bentonite compound and copper-bonded electrode rods',
      'Solar DC pumping systems coordination where grid power is unreliable',
    ],
    processSteps: [
      { step: '01', title: 'Load & Source Audit', description: 'Verify transformer phase availability, pump horsepower requirements, and voltage drops.' },
      { step: '02', title: 'Trenching & Panel Mount', description: 'Mount weatherproof enclosure on raised masonry plinth; trench armoured power runs.' },
      { step: '03', title: 'Protection Wiring', description: 'Wire starter relays, phase preventers, dry-run float switches, and earthing bus.' },
      { step: '04', title: 'Motor Load Testing', description: 'Measure starting and running current under full head pressure; verify auto-cutoff.' },
    ],
    gallery: [
      { src: '/images/services/grid-borewell-coordination.jpg', caption: 'Borewell pump and power coordination' },
      { src: '/images/services/grid-drip-sprinkler.jpg', caption: 'Electrically driven pressurized irrigation manifold' },
    ],
    faqs: [
      { question: 'Can I start my farm pump from my smartphone in the city?', answer: 'Yes. We install GSM/4G motor controllers that let you turn the pump on/off, receive power restoration notifications, and set timers via an app or missed call.' },
      { question: 'Do you help with solar agricultural pumps?', answer: 'Yes, we coordinate complete solar VFD pump drives with MNRE-compliant solar panel arrays for off-grid farms.' },
    ],
    relatedServices: ['borewell-coordination', 'drip-and-sprinkler-installation', 'agricultural-construction'],
    scopeNote: 'Electrical work complies with Indian Electricity Rules. Grid connection approvals remain the property owner’s responsibility with our technical support.',
  },

  // 11. One-time harvest support
  {
    slug: 'one-time-harvest-support',
    title: 'One-Time Harvest & Post-Harvest Support',
    shortTitle: 'Harvest Support',
    category: 'one-time',
    subCategory: 'crop-care',
    badge: 'Harvest Operations',
    eyebrow: 'FRUIT & CROP PICKING',
    tagline: 'Skilled harvesting crews, gentle handling, crate sorting, and market linkages.',
    summary: 'Coordinate trained harvesting labor, harvest clippers, food-grade ventilated crates, on-farm grading, and introductions to verified local fruit & vegetable buyers for surplus disposal.',
    heroImage: '/images/services/grid-one-time-harvest.jpg',
    cardImage: '/images/services/grid-one-time-harvest.jpg',
    problem: 'Landowners often struggle to organize reliable labor at the exact peak harvest window, causing fruit to overripen, drop to the ground, and suffer severe post-harvest bruising.',
    benefits: [
      'Timely labor mobilization ensures crops are harvested at peak brix (sweetness) and maturity',
      'Gentle picking protocols (retaining pedicels) extend post-harvest shelf life by days',
      'On-farm grading separates Grade A premium table fruit from processing grades',
      'Connecting excess produce with local buyers helps monetize surplus harvest',
    ],
    whatsIncluded: [
      'Pre-harvest maturity assessment and harvest window scheduling',
      'Mobilization of skilled pickers equipped with telescopic harvest poles and clippers',
      'Provision of clean, food-grade plastic harvesting crates (avoiding rough gunny sacks)',
      'Field-level sorting, cleaning, desapping (for mangoes), and weight tallying',
      'Assistance packing produce for personal delivery to friends/family or cold storage',
      'Facilitating connections with verified local wholesale buyers or organic aggregators',
    ],
    processSteps: [
      { step: '01', title: 'Maturity Check', description: 'Field check of fruit firmness, starch conversion, and skin color to fix harvest date.' },
      { step: '02', title: 'Crews & Crates Deployment', description: 'Equip trained harvesting crews with soft-touch picking gear and crates.' },
      { step: '03', title: 'Gentle Harvest & Grading', description: 'Systematic tree-by-tree picking, desapping, grading by size and quality.' },
      { step: '04', title: 'Packing & Linkage Support', description: 'Pack custom allocations for landowner and facilitate transport for excess volume.' },
    ],
    gallery: [
      { src: '/images/services/grid-one-time-harvest.jpg', caption: 'Field workers harvesting fresh farm produce into ventilated crates' },
      { src: '/images/managed/harvest-surplus-basket.jpg', caption: 'Fresh farm harvest basket prepared for landowner and community' },
    ],
    faqs: [
      { question: 'Do you guarantee buyer purchase prices?', answer: 'We connect you with verified local buyers and aggregators; actual sale prices depend on current market wholesale rates, produce grade, volume, and quality.' },
      { question: 'Can you handle small farmhouse harvests?', answer: 'Yes! Whether you have 20 mango trees or 5 acres of seasonal vegetables, we scale harvesting teams accordingly.' },
    ],
    relatedServices: ['pruning-and-tree-care', 'managed-farms-and-orchards', 'planting-and-orchard-setup'],
    scopeNote: 'Harvest coordination fees are based on acreage or tonnage harvested. Produce sales are transparent between buyer and landowner.',
  },

  // 12. Kitchen gardens and landscaping
  {
    slug: 'kitchen-gardens-and-landscaping',
    title: 'Kitchen Gardens, Terraces & Landscape Design',
    shortTitle: 'Gardens & Landscaping',
    category: 'one-time',
    subCategory: 'gardens',
    badge: 'Greener Living',
    eyebrow: 'RESIDENTIAL BOTANY',
    tagline: 'Fresh organic greens, aromatic herbs, and lush native landscaping at your doorstep.',
    summary: 'Turn empty terraces, backyards, or farmhouse perimeters into flourishing organic food forests with raised cedar/brick planters, lightweight living potting mixes, drip timers, and native flowering borders.',
    heroImage: '/images/services/feat-terrace-setup.jpg',
    cardImage: '/images/services/grid-kitchen-gardens.jpg',
    problem: 'City terraces face severe midday heat, water seepage risks from heavy mud pots, clogged drains, and frustrating plant deaths when watered haphazardly.',
    benefits: [
      'Engineered lightweight potting substrate (cocopeat, vermiculite, perlite) prevents roof load issues',
      'Integrated waterproofing drain-cell mats protect slab concrete from root penetration and dampness',
      'Daily harvest of pesticide-free salad greens, tomatoes, brinjals, chillies, and culinary herbs',
      'Automated micro-drip timers keep your garden thriving even while you travel',
    ],
    whatsIncluded: [
      'Structural site check: sun path, wind exposure, drainage points, and tap connections',
      'Custom wooden raised beds, terracotta planters, or UV-stabilized growbags',
      'Enriched living potting soil blend with bio-fertilizers and organic humic conditioners',
      'Automated tap-timer micro-drip irrigation system with adjustable shrub bubblers',
      'Initial planting of seasonal companion vegetables, culinary herbs, and companion pollinators',
      'Comprehensive starter kit with organic neem oil spray, bio-nutrients, and care manual',
    ],
    processSteps: [
      { step: '01', title: 'Space & Light Survey', description: 'Analyze balcony/terrace orientation, sunlight hours, and water supply.' },
      { step: '02', title: 'Layout & Planter Fabrication', description: 'Install drainage mats, assemble ergonomic raised planters and climbing trellises.' },
      { step: '03', title: 'Soil Blend & Micro-Drip', description: 'Fill planters with lightweight organic substrate and install automated drip lines.' },
      { step: '04', title: 'Planting & Living Handover', description: 'Plant heirloom saplings, seed microgreens, test irrigation timers, and guide the owner.' },
    ],
    gallery: [
      { src: '/images/services/feat-terrace-setup.jpg', caption: 'Lush terrace vegetable garden with shaded pergola and raised beds' },
      { src: '/images/services/grid-kitchen-gardens.jpg', caption: 'Stone pathway flanked by raised brick planters and flowering perennials' },
    ],
    faqs: [
      { question: 'Will a terrace garden cause water seepage in my ceiling?', answer: 'Never when built properly. We use raised planter stands and multi-layer drainage cells that keep pots elevated above the terrace floor with completely free water drainage.' },
      { question: 'How much maintenance is required?', answer: 'With our automated drip timers, daily effort is minimal (10-15 minutes). We also offer monthly or fortnightly Managed Care visits for pruning, pest control, and nutrient replenishment.' },
    ],
    relatedServices: ['terrace-garden-maintenance', 'farmhouse-garden-care', 'drip-and-sprinkler-installation'],
    scopeNote: 'Planter dimensions, plant varieties, and aesthetic styling are fully customizable to your residence.',
  },

  // 13. Agricultural construction and development coordination
  {
    slug: 'agricultural-construction',
    title: 'Agricultural Construction & Site Development',
    shortTitle: 'Agri Construction',
    category: 'one-time',
    subCategory: 'development',
    badge: 'Farmstead Infrastructure',
    eyebrow: 'DEVELOPMENT COORDINATION',
    tagline: 'Barns, tool sheds, farm security quarters, water ponds, and internal roads.',
    summary: 'Coordinate practical farmstead construction: pre-engineered steel storage sheds, pump houses, rainwater collection ponds, gravel access tracks, and rural solar lighting systems.',
    heroImage: '/images/hero/hero-terrace-farm.jpg',
    cardImage: '/images/services/card-land-design.jpg',
    problem: 'Hiring urban contractors for remote rural land often results in runaway transport costs, improper foundation depths in black-cotton soils, and leaky farm structures.',
    benefits: [
      'Cost-effective rural building techniques suited to local weather and soil types',
      'Secure storage sheds keep expensive irrigation pumps, tools, and fertilizers safe from theft',
      'Rainwater farm ponds recharge local aquifers and provide reserve dry-season irrigation',
      'Weather-resistant internal gravel roads allow tractor and vehicle access all year round',
    ],
    whatsIncluded: [
      'Site layout planning for farm structures to respect prevailing wind, slope, and aesthetics',
      'Construction of pump houses, security rooms, and fertilizer/tool storage sheds',
      'Excavation and geomembrane lining coordination for rainwater harvesting ponds',
      'Gravel (WBM) road preparation with roadside drainage swales and pipe culverts',
      'Perimeter solar street lighting and security camera post preparation',
      'Supervision by experienced civil & agricultural site supervisors',
    ],
    processSteps: [
      { step: '01', title: 'Functional Needs Audit', description: 'Determine storage dimensions, tractor turning requirements, and water pond volume.' },
      { step: '02', title: 'Design & Bill of Quantities', description: 'Prepare structural drawings, material specifications, and realistic cost estimates.' },
      { step: '03', title: 'Supervised Construction', description: 'Execute earthwork, masonry/steel fabrication, and drainage integration on site.' },
      { step: '04', title: 'Quality Handover', description: 'Inspect roof water seals, lock security, road compacting, and plumbing connections.' },
    ],
    gallery: [
      { src: '/images/hero/hero-terrace-farm.jpg', caption: 'Thoughtfully planned farmhouse perimeter and landscape development' },
      { src: '/images/services/feat-land-farm-design.jpg', caption: 'Farm road and drainage integration across agricultural acreage' },
    ],
    faqs: [
      { question: 'Do you build residential farmhouses?', answer: 'We focus on agricultural and utility structures (tool sheds, pump houses, pergolas, farm ponds, roads, caretaker rooms). For full residential farmhouses, we coordinate site preparation and utility connections in partnership with your architect.' },
      { question: 'Where is agricultural construction offered?', answer: 'Offered selectively based on regional logistics and local contractor networks. We confirm project feasibility during initial consultation.' },
    ],
    relatedServices: ['farm-and-land-planning', 'land-cleaning-and-levelling', 'fencing-and-boundary-protection'],
    scopeNote: 'Offered subject to regional availability and local building code compliance for agricultural land.',
  },
];

// Managed Care Programs
export interface ManagedCareProgram {
  slug: string;
  title: string;
  shortTitle: string;
  category: 'managed';
  eyebrow: string;
  tagline: string;
  summary: string;
  heroImage: string;
  cardImage: string;
  frequencyOptions: string[];
  idealFor: string;
  keyDeliverables: string[];
  seasonalRoadmap: Array<{
    season: string;
    focus: string;
    activities: string;
  }>;
  faqs: Array<{ question: string; answer: string }>;
}

export const managedCarePrograms: ManagedCareProgram[] = [
  {
    slug: 'managed-farms-and-orchards',
    title: 'Managed Farms & Commercial Orchards',
    shortTitle: 'Managed Farms',
    category: 'managed',
    eyebrow: 'COMPREHENSIVE STEWARDSHIP',
    tagline: 'Professional agronomic oversight so your orchard flourishes while you focus on life.',
    summary: 'Turn absentee farm ownership into a joyful, productive reality. Our field team manages pruning schedules, organic nutrition, drip maintenance, pest prevention, and harvest coordination season after season.',
    heroImage: '/images/managed/cat-managed-farms.jpg',
    cardImage: '/images/managed/cat-managed-farms.jpg',
    frequencyOptions: ['Fortnightly Field Inspection', 'Weekly Professional Stewardship', 'Full-time On-site Farm Management'],
    idealFor: 'Urban professionals, NRI landowners, and agricultural investors with 1 to 50+ acres of fruit trees or cash crops.',
    keyDeliverables: [
      'Scheduled bi-weekly or monthly agronomist site audits with digital photo reports',
      'Prescribed organic nutrition, micronutrient foliar sprays, and bio-fertilizer dosing',
      'Continuous drip irrigation inspection, filter backwashing, and leak repair',
      'Weed management through tractor slashing or manual ring weeding around rootzones',
      'Prophylactic biological pest and fungus management before infestations spread',
      'End-to-end harvest coordination, crate sorting, and surplus market linkages',
    ],
    seasonalRoadmap: [
      { season: 'Pre-Monsoon (Apr – Jun)', focus: 'Soil Enrichment & Pruning', activities: 'Basin opening, FYM manuring, canopy training, drip flush, and monsoon drainage prep.' },
      { season: 'Monsoon (Jul – Sep)', focus: 'Disease Defense & Growth', activities: 'Fungal prophylaxis, weed suppression, water stagnation checks, and green manuring.' },
      { season: 'Post-Monsoon (Oct – Dec)', focus: 'Flowering & Nutrient Boost', activities: 'Foliar micronutrients, flowering regulation, irrigation pacing, and stem whitewashing.' },
      { season: 'Summer Harvest (Jan – Mar)', focus: 'Fruit Quality & Harvest', activities: 'Brix monitoring, fruit bagging, gentle picking, crate packing, and post-harvest restitution.' },
    ],
    faqs: [
      { question: 'How do I know what work was done on my farm?', answer: 'After every scheduled visit, our field officer uploads a timestamped photo report and agronomic summary directly to your WhatsApp or email.' },
      { question: 'What if an unexpected pest outbreak occurs between scheduled visits?', answer: 'Our agreements include rapid emergency response visits when severe pest or irrigation breakdown triggers are detected.' },
    ],
  },
  {
    slug: 'vacant-land-upkeep',
    title: 'Vacant Land & Peri-Urban Site Care',
    shortTitle: 'Vacant Site Care',
    category: 'managed',
    eyebrow: 'BOUNDARY & VALUE PRESERVATION',
    tagline: 'Keep idle parcels clean, secure, encroachment-free, and biologically active.',
    summary: 'Neglected land invites illegal trash dumping, wild scrub overgrowth, snake infestation, and encroachment risks. We maintain boundaries, trim vegetation, and can convert idle land into productive short-cycle green plots.',
    heroImage: '/images/managed/cat-vacant-site.jpg',
    cardImage: '/images/managed/cat-vacant-site.jpg',
    frequencyOptions: ['Monthly Security & Clearing Audit', 'Quarterly Deep Clean & Bush Trimming', 'Seasonal Green Conversion'],
    idealFor: 'Owners of residential layouts, industrial plots, or peri-urban farmland awaiting future construction or sale.',
    keyDeliverables: [
      'Regular boundary verification, fence inspection, and encroachment deterrence',
      'Periodic brush cutting, weed clearing, and firebreak maintenance around edges',
      'Removal of illegal debris, dumped garbage, and construction rubble',
      'Timestamped geo-tagged photo inspections delivered directly to your dashboard',
      'Option to establish low-maintenance nitrogen-fixing cover crops or pollinator gardens',
    ],
    seasonalRoadmap: [
      { season: 'Summer', focus: 'Fire Prevention', activities: 'Clear dry brush and create clean perimeter firebreaks along fencing lines.' },
      { season: 'Monsoon', focus: 'Weed Suppression', activities: 'Slash aggressive wild scrub and verify surface water is not undermining boundary walls.' },
      { season: 'Winter', focus: 'Site Presentation', activities: 'Clean property lines, refresh boundary markings, and survey corner pegs.' },
    ],
    faqs: [
      { question: 'Can you maintain plots inside gated community layouts?', answer: 'Yes, we regularly service vacant plots inside gated farm communities and layout developments.' },
      { question: 'Do you help if someone tries to encroach on my land?', answer: 'Regular maintenance and visible active presence are the #1 deterrent against encroachment. If any unauthorized activity is observed, we document it immediately with date-stamped photographic evidence and alert you.' },
    ],
  },
  {
    slug: 'terrace-garden-maintenance',
    title: 'Terrace Garden Care & Ongoing Maintenance',
    shortTitle: 'Terrace Garden Care',
    category: 'managed',
    eyebrow: 'RESIDENTIAL BOTANY',
    tagline: 'Enjoy the harvest from your terrace without worrying about soil care and pest cycles.',
    summary: 'Our horticulturist visits your rooftop or balcony garden on a fixed schedule to inspect soil moisture, prune herbs, top-dress organic compost, apply bio-pesticides, and replant seasonal vegetables.',
    heroImage: '/images/managed/cat-terrace-gardens.jpg',
    cardImage: '/images/managed/cat-terrace-gardens.jpg',
    frequencyOptions: ['Fortnightly Care (2 Visits/Month)', 'Weekly Stewardship (4 Visits/Month)'],
    idealFor: 'Urban families who love fresh terrace greens and herbs but have busy weekday work schedules.',
    keyDeliverables: [
      'Comprehensive plant health check and organic pest control spray',
      'Soil aeration, vermicompost top-dressing, and liquid jeevamrut application',
      'Timer and drip irrigation calibration to prevent underwatering or overflowing',
      'Training vines on trellises, pruning dead foliage, and staking growing tomatoes',
      'Replacing spent seasonal plants with fresh organic seedlings every season',
    ],
    seasonalRoadmap: [
      { season: 'Spring/Summer', focus: 'Heat Defense & Summer Crops', activities: 'Shade net inspection, moisture mulch, planting gourds, okra, and heat-tolerant herbs.' },
      { season: 'Monsoon', focus: 'Drainage & Microbes', activities: 'Drain cleaning, fungal prevention, organic foliar nutrition, and leafy greens.' },
      { season: 'Winter', focus: 'Exotics & Salad Greens', activities: 'Planting lettuce, broccoli, cherry tomatoes, carrots, and companion flowers.' },
    ],
    faqs: [
      { question: 'Do you supply the organic fertilizers and sprays?', answer: 'Yes, our horticulturist arrives equipped with certified organic fertilizers, bio-fungicides, and pruning tools.' },
      { question: 'What if I am traveling for a month?', answer: 'Our scheduled care ensures your terrace is checked, trimmed, and automated timers are verified so your plants remain thriving.' },
    ],
  },
  {
    slug: 'farmhouse-garden-care',
    title: 'Farmhouse & Estate Landscape Stewardship',
    shortTitle: 'Farmhouse Gardens',
    category: 'managed',
    eyebrow: 'ESTATE HORTICULTURE',
    tagline: 'Manicured lawns, blooming pergolas, and flourishing fruit groves for your weekend retreat.',
    summary: 'Keep your country home and farmhouse lush, fragrant, and inviting every weekend. We manage lawn health, ornamental shrubs, flowering creepers, and estate fruit trees with quiet professional care.',
    heroImage: '/images/managed/cat-farmhouse-landscape.jpg',
    cardImage: '/images/managed/cat-farmhouse-landscape.jpg',
    frequencyOptions: ['Weekly Comprehensive Estate Care', 'Bi-weekly Maintenance Schedule'],
    idealFor: 'Weekend farmhouse owners, holiday estate owners, and hospitality properties wanting pristine landscapes.',
    keyDeliverables: [
      'Lawn aeration, mowing, edging, and organic fertilization',
      'Ornamental shrub shaping, hedge trimming, and topiary maintenance',
      'Flowering pergola pruning, creeper training, and deadheading',
      'Pest and disease monitoring across ornamental flora and surrounding fruit trees',
      'Irrigation system balancing for lawns, flowerbeds, and shade groves',
    ],
    seasonalRoadmap: [
      { season: 'Monsoon', focus: 'Lawn Health & Rapid Growth', activities: 'Frequent mowing, hedge shaping, drainage management, and moss control.' },
      { season: 'Winter', focus: 'Flowering & Pergola Beauty', activities: 'Winter annual blooms, rose care, bougainvillea shaping, and outdoor seating clean.' },
      { season: 'Summer', focus: 'Water Conservation', activities: 'Deep watering cycles, organic bark mulching, and shade maintenance.' },
    ],
    faqs: [
      { question: 'Can you work alongside our resident estate caretaker?', answer: 'Yes. We often provide specialized agronomic guidance and seasonal tasks while coordinating everyday watering with your on-site caretaker.' },
    ],
  },
];

// Landowner Partnership Models
export interface LandownerModel {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  image: string;
  highlights: string[];
  bestFor: string;
  structureOptions: string[];
  processSummary: string;
}

export const landownerModels: LandownerModel[] = [
  {
    id: 'direct-lease',
    title: 'Lease Directly to FarmCare',
    tagline: 'We assess your land and operate a productive farm managed by our expert team.',
    summary: 'For landowners seeking steady agricultural productivity without managing day-to-day operations. We evaluate soil fertility, water reliability, and road access, agreeing on a transparent lease structure.',
    image: '/images/landowners/lease-directly.jpg',
    highlights: [
      'Comprehensive property evaluation by our agronomy and water team',
      'Agreed operational stewardship and crop roadmap',
      'Transparent contract terms with structured land preservation covenants',
      'Continuous maintenance of boundaries, soil fertility, and water infrastructure',
    ],
    bestFor: 'Parcels of 3+ acres with clear title, adequate water source (borewell/canal), and motorable road access.',
    structureOptions: ['Fixed Annual Lease', 'Lease + Revenue Share', 'Pure Crop Revenue Share'],
    processSummary: 'Initial property dossier review -> On-site hydrological & soil audit -> Term sheet discussion -> Formal legal agreement -> Farm development commencement.',
  },
  {
    id: 'find-operator',
    title: 'Find a Qualified Lease Partner',
    tagline: 'We connect your land with vetted agricultural operators and coordinate the process.',
    summary: 'Connect your vacant agricultural property with experienced, reputable regional farmers and horticulture operators. We vet operator credentials, assist in lease structuring, and conduct periodic compliance audits.',
    image: '/images/landowners/lease-partner.jpg',
    highlights: [
      'Rigorous background and farming track-record verification of prospective operators',
      'Fair, market-aligned lease rate recommendations based on regional agricultural benchmarks',
      'Structured legal lease templates protecting landowner title and land preservation',
      'Optional periodic third-party farm condition audits on behalf of absentee owners',
    ],
    bestFor: 'Landowners wanting to lease out land to reputable local farming enterprises while retaining independent third-party oversight.',
    structureOptions: ['Partner Matching & Introduction', 'Site Assessment & Feasibility', 'Ongoing Agreement & Oversight Support'],
    processSummary: 'List land details -> Site evaluation -> Operator matchmaking -> Interview & negotiation -> Agreement execution -> Ongoing verification.',
  },
];

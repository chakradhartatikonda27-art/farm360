/**
 * FarmCare360 — Authoritative Vision, Business Models, Spaces Served & Transparency Architecture (v2)
 */

export interface SpaceServed {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  summary: string;
  idealFor: string;
  image: string;
  keyConsiderations: string[];
  solutions: string[];
  href: string;
}

export interface BusinessSubModel {
  id: string;
  code: string;
  title: string;
  targetAudience: string;
  description: string;
  howWeHelp: string[];
  revenueModel: string;
  keyCriteria?: string[];
}

export interface BusinessModel {
  id: string;
  modelNumber: number;
  code: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  servicesIncluded: string[];
  revenueModel: string;
  promise: string;
  subModels?: BusinessSubModel[];
  image: string;
  href: string;
}

export interface ServiceCluster {
  id: string;
  title: string;
  tagline: string;
  services: Array<{
    title: string;
    description: string;
  }>;
}

export interface CorePrinciple {
  number: string;
  title: string;
  description: string;
  practicalApplication: string;
}

export interface TransparencyStep {
  step: string;
  title: string;
  actor: string;
  description: string;
  deliverable: string;
}

export const coreVision = {
  tagline: 'Complete Agricultural Solutions',
  headline: 'Owning land is a privilege, but owning land does not automatically make it productive.',
  subheadline:
    'We bridge the gap between people who own land but lack time or expertise, and people who dream of entering agriculture and leading a productive rural lifestyle.',
  theGap: {
    landownerChallenge:
      'In India, millions of acres of agricultural lands, residential plots, and terraces remain unused. Owners live in cities, work in other states or abroad, or lack the agricultural knowledge, reliable labour, and daily supervision required to manage land effectively.',
    aspirantChallenge:
      'At the same time, many people want to enter agriculture, grow their own food, own a farmhouse, or enjoy rural living. But farming is complex: soil preparation, crop selection, labour coordination, precision irrigation, and pest management feel risky without qualified guidance.',
    ourBridge:
      'FarmCare360 transforms underutilized land and open spaces into productive, well-maintained, and purpose-driven assets through professional agronomic expertise, technology, reliable execution, and transparent management.',
  },
  missionStatement:
    'We are not simply offering farming services. We provide an end-to-end land and agricultural management ecosystem—making agriculture accessible, land management convenient, and productive ownership effortless.',
};

export const spacesWeServe: SpaceServed[] = [
  {
    id: 'agricultural-land',
    number: '01',
    title: 'Agricultural Land',
    subtitle: 'Acreage Properties & Commercial Farms (1 Acre or More)',
    summary:
      'Farmland parcels requiring comprehensive master planning, heavy land preparation, precision irrigation, crop cultivation, or ongoing operational management.',
    idealFor:
      'Absentee landowners, farm investors, family-owned agricultural estates, and new farming entrepreneurs.',
    image: '/images/managed/cat-managed-farms.jpg',
    keyConsiderations: [
      'Property size (1+ acre) & topography',
      'Water availability & groundwater yield',
      'Soil nutrient and microbial profile',
      'Owner economic & lifestyle objectives',
    ],
    solutions: [
      'Comprehensive agricultural zoning and topographic design',
      'High-density fruit orchard establishment (Mango, Guava, Citrus)',
      'Borewell recharging, swales, and drip irrigation networks',
      'Full-time or seasonal farm supervision and labour coordination',
    ],
    href: '/managed-care',
  },
  {
    id: 'residential-open-plots',
    number: '02',
    title: 'Residential & Open Plots',
    subtitle: 'Vacant Sites & Developing Plots',
    summary:
      'Unbuilt residential parcels and perimeter sites that owners want to keep clean, securely fenced, landscaped, or transformed into productive interim green spaces.',
    idealFor:
      'Non-resident plot owners, suburban property owners, and investors safeguarding land against encroachment.',
    image: '/images/managed/cat-vacant-site.jpg',
    keyConsiderations: [
      'Boundary clarity and legal demarcations',
      'Weed density, scrub overgrowth, and fire risks',
      'Accessibility for clearing machinery',
      'Interim agricultural or aesthetic productivity',
    ],
    solutions: [
      'Heavy scrub extraction and laser grading',
      'Reinforced precast RCC fencing and boundary demarcation',
      'Low-maintenance ground cover and perimeter tree planting',
      'Monthly GPS photographic inspection and audit logs',
    ],
    href: '/services/fencing-and-boundary-protection',
  },
  {
    id: 'terraces-rooftops',
    number: '03',
    title: 'Terraces & Rooftops',
    subtitle: 'Residential Terraces & Urban Rooftop Spaces',
    summary:
      'Unutilized rooftop surfaces transformed into thriving organic vegetable gardens, compact fruit arbors, and modern urban micro-farming systems.',
    idealFor:
      'Urban homeowners, apartment associations, penthouse residents, and wellness enthusiasts.',
    image: '/images/hero/hero-terrace-farm.jpg',
    keyConsiderations: [
      'Structural load capacity and waterproofing integrity',
      'Direct sunlight hours and wind exposure',
      'Water supply, pressure, and drainage gradients',
      'Maintenance bandwidth and desired crop varieties',
    ],
    solutions: [
      'Root-barrier safe growing containers and raised planters',
      'Lightweight enriched soil media and vermicompost beds',
      'Solar-timed automated drip and misting networks',
      'Scheduled bi-weekly or monthly expert plant nutrition visits',
    ],
    href: '/services/terrace-garden-setup',
  },
  {
    id: 'spaces-around-homes',
    number: '04',
    title: 'Spaces Around Homes',
    subtitle: 'Front Yards, Backyards & Surrounding Open Grounds',
    summary:
      'Open spaces around residential villas, farmhouses, and gated layouts converted into productive kitchen gardens, native pollinator borders, and peaceful retreats.',
    idealFor:
      'Farmhouse retreat owners, villa residents, and multi-generational families wanting fresh food at their doorstep.',
    image: '/images/managed/cat-farmhouse-landscape.jpg',
    keyConsiderations: [
      'Microclimate, shaded zones, and orientation',
      'Soil compaction and drainage remediation',
      'Aesthetic integration with architecture',
      'Pet-safe, child-safe natural growing practices',
    ],
    solutions: [
      'Custom kitchen garden layouts with vegetable & herb raised beds',
      'Native fruiting bushes, citrus groves, and flowering borders',
      'Composting units and rainwater harvesting catchment',
      'Ongoing routine pruning, pest deterrence, and seasonal replanting',
    ],
    href: '/services/kitchen-gardens',
  },
];

export const businessModels: BusinessModel[] = [
  {
    id: 'model-1-farm-management',
    modelNumber: 1,
    code: 'Model 1',
    title: 'End-to-End Farm Management',
    tagline: 'Professional agricultural stewardship for absentee and busy landowners.',
    problem:
      'Many people want to own and operate agricultural land without personally handling daily labour, irrigation, crop selection, fertilizers, and equipment. Entering farming without experienced guidance can lead to crop failures and wasted capital.',
    solution:
      'FarmCare360 acts as your full-service farm management partner. We plan, coordinate, supervise, and monitor every activity on your farm according to an agreed scientific roadmap and transparent budget.',
    servicesIncluded: [
      'Comprehensive land, soil, water, and objective audit',
      'Tailored crop development roadmap and seasonal calendars',
      'Coordination and supervision of skilled agricultural labour and machinery',
      'Irrigation scheduling and precision moisture monitoring',
      'Custom fertilizer, manure, and balanced crop nutrition programs',
      'Integrated pest and disease management under qualified agronomists',
      'Scheduled pruning, weeding, mulching, and tree basin upkeep',
      'Regular photographic inspection reports and digital field visit logs',
      'Complete expense record keeping with pre-approval workflows',
      'Harvesting, post-harvest produce handling, and market linkages',
    ],
    revenueModel:
      'Recurring farm management fee (monthly, quarterly, or annual contract based on acreage and complexity). Agricultural inputs, machinery, and labour are billed transparently as separate approved operational expenses.',
    promise:
      'The landowner should not have to manage every farming detail personally to maintain a thriving, well-organized farm.',
    image: '/images/services/card-managed-orchard.jpg',
    href: '/managed-care',
  },
  {
    id: 'model-2-farm-development-living',
    modelNumber: 2,
    code: 'Model 2',
    title: 'Farm Development, Farmhouses & Managed Farm Living',
    tagline: 'Turning empty land into a peaceful, functional countryside retreat.',
    problem:
      'Converting raw land into a living farmhouse retreat requires intricate coordination across topographic civil work, fencing, borewells, architecture, horticulture, and ongoing estate upkeep that overwhelmed owners struggle to manage.',
    solution:
      'We help clients plan, develop, and maintain a complete farm property tailored to their lifestyle and budget. After development, clients transition into our recurring Annual Maintenance Contracts (AMC) for effortless weekend enjoyment.',
    servicesIncluded: [
      'Topographic land assessment and holistic site masterplanning',
      'Farm layout and productive landscape architectural design',
      'Fruit orchards, kitchen gardens, and native shaded walkways',
      'Multi-zone pressurized micro-irrigation and water harvesting swales',
      'Heavy-duty perimeter fencing and security gates',
      'Soil improvement, deep ripping, and contour grading',
      'Farmhouse construction coordination with qualified architects & contractors',
      'Recurring AMC subscription covering landscape, irrigation, and security upkeep',
    ],
    revenueModel:
      'Turnkey project planning and development fees, implementation coordination charges, and ongoing Annual Maintenance Contracts (AMC).',
    promise:
      'We help customers turn their dream of a farmhouse retreat into a practical, maintainable reality.',
    image: '/images/services/feat-land-farm-design.jpg',
    href: '/services/farm-and-land-planning',
  },
  {
    id: 'model-3-land-leasing-partnerships',
    modelNumber: 3,
    code: 'Model 3',
    title: 'Land Leasing & Productive Land Utilization',
    tagline: 'Connecting landowners with productive, revenue-generating agricultural opportunities.',
    problem:
      'Many landowners have fertile acreage that lies idle because they cannot cultivate it. Concurrently, skilled commercial growers seek quality land with water security to execute profitable agricultural ventures.',
    solution:
      'FarmCare360 provides three distinct, structured pathways to monetize and protect idle land through leasing and farming partnerships.',
    servicesIncluded: [
      'Comprehensive property and agronomic feasibility audits',
      'Tenant and agricultural operator background vetting',
      'Structured legal lease documentation and permitted usage guidelines',
      'Direct FarmCare360 leasing for high-potential commercial orchards',
      'Transparent crop-share and revenue-share partnership structures',
      'Independent quarterly land condition and boundary inspection audits',
    ],
    revenueModel:
      'Leasing facilitation fees, management oversight fees, or direct agricultural produce revenues from operated leaseholds.',
    promise:
      'Idle land is safeguarded, put to productive agricultural use, and generates dependable returns without operational friction.',
    subModels: [
      {
        id: 'model-3-1',
        code: 'Model 3.1',
        title: 'Helping Landowners Lease Their Land',
        targetAudience: 'Landowners seeking reliable tenants without managing farm operations.',
        description:
          'We evaluate property suitability, match verified agricultural operators, structure secure lease terms, and coordinate documentation, with optional ongoing land condition monitoring.',
        howWeHelp: [
          'Site assessment (soil, water, access, local crop suitability)',
          'Landowner expectation setting and rental valuation',
          'Vetted tenant matchmaking and background verification',
          'Legal documentation and ongoing lease oversight',
        ],
        revenueModel: 'Clearly agreed leasing facilitation fee + optional ongoing monitoring retainer.',
      },
      {
        id: 'model-3-2',
        code: 'Model 3.2',
        title: 'FarmCare360 Directly Leases Suitable Agricultural Land',
        targetAudience: 'High-potential agricultural acreage with reliable water and strong commercial prospects.',
        description:
          'Where the economics make rigorous sense, FarmCare360 directly leases land and operates commercial orchards, high-density fruit crops, or integrated projects.',
        howWeHelp: [
          'Exhaustive agronomic due diligence before lease commitment',
          'Full capital deployment for irrigation, saplings, and infrastructure',
          'Commercial farm execution under senior agronomists',
          'Direct supply chain and institutional produce off-take',
        ],
        keyCriteria: [
          'Verified groundwater yield and soil depth',
          'Clear road access and logistics connectivity',
          'Favourable climate and commercial crop viability',
          'Realistic long-term lease economics and downside risk protection',
        ],
        revenueModel: 'Revenue generated from commercial produce sales and value-added harvest output.',
      },
      {
        id: 'model-3-3',
        code: 'Model 3.3',
        title: 'Managed Leasing & Farm Partnerships',
        targetAudience: 'Landowners interested in participating in farming upside rather than fixed rent.',
        description:
          'Structured collaborative agreements where the landowner contributes land and the operating partner contributes agreed capital, labour, or management, sharing revenue or profits under a clear legal agreement.',
        howWeHelp: [
          'Tailored legal structuring and risk-allocation agreements',
          'Transparent joint-venture accounting and auditable reporting',
          'Agronomic oversight and milestones tracking',
          'Balanced reward distribution based on agreed inputs',
        ],
        revenueModel: 'Agreed percentage share of net farm profits or crop revenues.',
      },
    ],
    image: '/images/landowners/lease-partner.jpg',
    href: '/landowners',
  },
  {
    id: 'model-4-terrace-small-space-farming',
    modelNumber: 4,
    code: 'Model 4',
    title: 'Terrace Gardens, Site Gardens & Small-Space Farming',
    tagline: 'Bringing fresh, chemical-free food production to rooftops and residential yards.',
    problem:
      'Millions of urban residents dream of harvesting their own food, but lack knowledge about container gardening, soil mixtures, watering schedules, pest identification, and plant nutrition.',
    solution:
      'FarmCare360 creates custom, highly productive food-growing environments for terraces, front yards, and open spaces—paired with regular expert maintenance so growing food is convenient and foolproof.',
    servicesIncluded: [
      'Homeowner culinary preference mapping (greens, herbs, root vegetables, fruits)',
      'Sunlight, water quality, and structural drainage assessment',
      'Custom raised planter beds, lightweight bio-soil media, or hydroponic systems',
      'Installation of automated micro-drip and misting manifolds',
      'Supply of non-GMO organic seeds, heirloom saplings, and bio-nutrients',
      'Ongoing weekly or bi-weekly expert visits for pruning, staking, and biological pest defense',
      'Transparent guidance so families learn and experience the joy of harvesting',
    ],
    revenueModel:
      'Initial setup and installation fee + recurring monthly, quarterly, or annual care subscription.',
    promise:
      'We bring food production closer to people’s everyday lives, helping them experience the health and satisfaction of eating food they grew.',
    image: '/images/services/feat-terrace-setup.jpg',
    href: '/services/terrace-garden-setup',
  },
];

export const specializedServiceClusters: ServiceCluster[] = [
  {
    id: 'land-assessment-development',
    title: 'Land Assessment & Development',
    tagline: 'Foundational civil, soil, and topographical site preparation.',
    services: [
      { title: 'Land Measurement & Surveying', description: 'Accurate boundary demarcations and topographic mapping through certified surveyors.' },
      { title: 'Scientific Soil Testing & Interpretation', description: 'Lab-certified chemical, physical, and microbial nutrient profiling with custom remediation.' },
      { title: 'Water Availability & Irrigation Assessment', description: 'Groundwater yield testing, borewell audits, and rainwater watershed capacity calculations.' },
      { title: 'Heavy Land Cleaning & Site Preparation', description: 'Thorough removal of invasive thorny scrub, boulders, and stump extraction.' },
      { title: 'Fencing & Perimeter Access Planning', description: 'Chain-link, granite post, or precast concrete fencing designed for security and aesthetics.' },
      { title: 'Land Layout & Agricultural Design', description: 'Scientific plot zoning optimizing internal roadways, windbreaks, and sun orientation.' },
      { title: 'Drainage & Water Management Planning', description: 'Contour swales, silt traps, and percolation trenches to capture seasonal monsoon runoff.' },
      { title: 'Soil Improvement & Land Restoration', description: 'Subsoil aeration, green manuring, biochar infusion, and microbial revitalization.' },
      { title: 'Crop & Orchard Suitability Assessment', description: 'Matching regional microclimate and soil chemistry to commercial fruit varieties.' },
    ],
  },
  {
    id: 'agricultural-planning-advisory',
    title: 'Agricultural Planning & Advisory',
    tagline: 'Scientific crop planning, agronomic calendars, and expert supervision.',
    services: [
      { title: 'Crop Selection & Market Analysis', description: 'Data-driven crop recommendations based on soil, water, climate, and wholesale demand.' },
      { title: 'Crop Calendars & Seasonal Planning', description: 'Step-by-step schedules for sowing, vegetative care, flowering, and harvest windows.' },
      { title: 'Fertilizer & Manure Recommendations', description: 'Balanced organic and mineral feeding prescriptions tailored to crop growth stages.' },
      { title: 'Precision Irrigation Scheduling', description: 'Calculating crop evapotranspiration rates to deliver exact water requirements.' },
      { title: 'Pest & Disease Monitoring', description: 'Proactive scouting and biological IPM protocols to protect crops before damage occurs.' },
      { title: 'Organic Farming Guidance', description: 'Natural compost brewing, jeevamrutha formulation, and organic certification readiness.' },
      { title: 'Integrated Farming Feasibility', description: 'Combining horticulture, poultry, bee-keeping, and composting for circular farm efficiency.' },
      { title: 'Qualified Agronomist Guidance', description: 'Direct field consultations and advisory from certified agricultural professionals.' },
    ],
  },
  {
    id: 'farm-infrastructure-technology',
    title: 'Farm Infrastructure & Technology',
    tagline: 'Smart irrigation, mechanization, and digital operational transparency.',
    services: [
      { title: 'Smart Irrigation Planning & Coordination', description: 'Automated drip manifolds, Venturi fertigation units, and soil moisture sensors.' },
      { title: 'Farm Machinery & Labour Coordination', description: 'Deployment and oversight of vetted tractor implements, sprayers, and skilled field hands.' },
      { title: 'Greenhouse & Protected Cultivation', description: 'Polyhouse and shade-net feasibility assessments for high-value exotic crops.' },
      { title: 'Hydroponic & Modern Growing Systems', description: 'NFT and substrate-based hydroponic installations for soil-less urban farming.' },
      { title: 'Farm Monitoring & Digital Reporting', description: 'Weekly geo-tagged photo updates, sensor logging, and operational dashboards.' },
      { title: 'Automation & Precision Agriculture', description: 'Solar pump controllers, weather station integration, and automated valve actuators.' },
    ],
  },
];

export const fiveCorePrinciples: CorePrinciple[] = [
  {
    number: '01',
    title: 'End-to-End Responsibility',
    description: 'We do not hand off half-finished advice. From initial soil testing to harvest logistics, we take full accountability for field execution.',
    practicalApplication: 'One dedicated partner coordinates surveyors, machinery operators, agronomists, and suppliers under a unified service level.',
  },
  {
    number: '02',
    title: 'Radical Transparency',
    description: 'No unexplained bills or mystery expenditures. Landowners review and pre-approve all operational expenses before work begins.',
    practicalApplication: 'Every input purchase is backed by supplier invoices, site photo verification, and clear ledger updates.',
  },
  {
    number: '03',
    title: 'Technology-Enabled Management',
    description: 'We utilize digital field tools, automated moisture sensors, GPS mapping, and structured reporting to make remote ownership seamless.',
    practicalApplication: 'Landowners anywhere in the world receive timestamped photo logs and structured status updates on their mobile device.',
  },
  {
    number: '04',
    title: 'Grounded Agricultural Expertise',
    description: 'Technology alone cannot replace field knowledge. All decisions are steered by qualified agronomists and practical soil practitioners.',
    practicalApplication: 'Fertilizer and pest protocols are based on scientific laboratory assays rather than guesswork or vendor push.',
  },
  {
    number: '05',
    title: 'Trust & Long-Term Accountability',
    description: 'We measure success in multi-year land health, client retention, and thriving harvests rather than quick one-off sales.',
    practicalApplication: 'We communicate seasonal risks honestly, document all approvals, and treat your land with the stewardship it deserves.',
  },
];

export const transparencyWorkflow: TransparencyStep[] = [
  {
    step: '01',
    title: 'Need Identified',
    actor: 'On-Site Farm Team',
    description: 'The farm team scouts the property during regular operations and identifies a specific requirement (e.g. fertilizer top-dressing, drip line repair, or weed clearing).',
    deliverable: 'Field inspection log with timestamped photographs of the requirement.',
  },
  {
    step: '02',
    title: 'Agronomic Evaluation',
    actor: 'Senior Agricultural Specialist',
    description: 'Our qualified agronomists review the observation, determine whether the intervention is necessary, and prescribe the exact scientific solution.',
    deliverable: 'Technical recommendation note detailing required materials and specifications.',
  },
  {
    step: '03',
    title: 'Transparent Cost Estimate',
    actor: 'Operations & Procurement Team',
    description: 'FarmCare360 compiles an itemized estimate covering materials at wholesale rates, machinery hours, and labour requirements.',
    deliverable: 'Itemized quotation breakdown with zero hidden markups.',
  },
  {
    step: '04',
    title: 'Landowner Review',
    actor: 'Landowner Notification',
    description: 'The customer receives the recommendation, supporting photographs, technical rationale, and estimated cost via their digital channel or email.',
    deliverable: 'One-click approval request with complete supporting context.',
  },
  {
    step: '05',
    title: 'Approval & Fund Allocation',
    actor: 'Landowner Action',
    description: 'The customer reviews, approves the expenditure, and releases the agreed funds. No non-emergency work proceeds without prior approval.',
    deliverable: 'Documented authorization record added to the property ledger.',
  },
  {
    step: '06',
    title: 'Supervised Field Execution',
    actor: 'Execution & Quality Team',
    description: 'FarmCare360 deploys skilled labour, machinery, and genuine agricultural inputs to execute the approved scope to exacting standards.',
    deliverable: 'Supervised field operations conducted under agronomist oversight.',
  },
  {
    step: '07',
    title: 'Proof & Audit Handover',
    actor: 'Final Verification',
    description: 'FarmCare360 uploads completion evidence: supplier bills, geo-tagged completion photos, and updated property health logs.',
    deliverable: 'Verified completion report and transparent ledger reconciliation.',
  },
];

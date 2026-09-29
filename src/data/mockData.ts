import {
  Property,
  RealEstateProject,
  Agent,
  Lead,
  PropertyInquiry,
  ViewingAppointment,
  BlogPost,
  PlatformSettings,
  PropertyAmenity,
  AuditLogItem,
  User
} from '../types';

// SVG Visual Generator for Architectural Assets (100% resilient, offline-ready, responsive, zero-broken-image)
export const createArchitecturalArt = (
  theme: 'villa' | 'penthouse' | 'tower' | 'craftsman' | 'project' | 'interior' | 'plot',
  title: string
): string => {
  const themes = {
    villa: {
      bg1: '#0f172a',
      bg2: '#1e293b',
      accent: '#f59e0b',
      structure: '#e2e8f0',
      glass: '#38bdf8'
    },
    penthouse: {
      bg1: '#18181b',
      bg2: '#27272a',
      accent: '#eab308',
      structure: '#f4f4f5',
      glass: '#a5f3fc'
    },
    tower: {
      bg1: '#090d16',
      bg2: '#1e293b',
      accent: '#38bdf8',
      structure: '#cbd5e1',
      glass: '#60a5fa'
    },
    craftsman: {
      bg1: '#1c1917',
      bg2: '#292524',
      accent: '#fbbf24',
      structure: '#f5f5f4',
      glass: '#bae6fd'
    },
    project: {
      bg1: '#0b132b',
      bg2: '#1c2541',
      accent: '#48e5c2',
      structure: '#ffffff',
      glass: '#70e000'
    },
    interior: {
      bg1: '#262626',
      bg2: '#404040',
      accent: '#fb923c',
      structure: '#fafafa',
      glass: '#fef08a'
    },
    plot: {
      bg1: '#14281d',
      bg2: '#1f4833',
      accent: '#84cc16',
      structure: '#ecfccb',
      glass: '#bef264'
    }
  };

  const t = themes[theme] || themes.villa;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
    <defs>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${t.bg1}" />
        <stop offset="60%" stop-color="${t.bg2}" />
        <stop offset="100%" stop-color="${t.accent}22" />
      </linearGradient>
      <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${t.glass}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="${t.accent}" stop-opacity="0.15" />
      </linearGradient>
      <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
      </pattern>
    </defs>

    <!-- Sky Background -->
    <rect width="1200" height="800" fill="url(#skyGrad)"/>
    <rect width="1200" height="800" fill="url(#grid)" />

    <!-- Distant Mountain/Skyline Silhouette -->
    <path d="M0,520 L150,490 L320,530 L550,470 L780,510 L980,460 L1200,500 L1200,800 L0,800 Z" fill="#0b1120" opacity="0.6"/>

    <!-- Architectural Structure -->
    ${
      theme === 'tower'
        ? `
      <!-- Skyscraper / Commercial Tower -->
      <polygon points="360,140 520,120 520,640 360,640" fill="${t.bg2}" stroke="${t.structure}" stroke-width="2"/>
      <polygon points="520,120 720,180 720,640 520,640" fill="#0f172a" stroke="${t.structure}" stroke-width="2"/>
      <!-- Tower Glass Strips -->
      <line x1="400" y1="180" x2="400" y2="620" stroke="${t.glass}" stroke-width="8" stroke-dasharray="20,12" opacity="0.8"/>
      <line x1="440" y1="170" x2="440" y2="620" stroke="${t.accent}" stroke-width="6" stroke-dasharray="20,12" opacity="0.6"/>
      <line x1="480" y1="160" x2="480" y2="620" stroke="${t.glass}" stroke-width="8" stroke-dasharray="20,12" opacity="0.8"/>
      <line x1="570" y1="190" x2="570" y2="620" stroke="${t.glass}" stroke-width="12" stroke-dasharray="16,14" opacity="0.7"/>
      <line x1="630" y1="210" x2="630" y2="620" stroke="${t.accent}" stroke-width="8" stroke-dasharray="16,14" opacity="0.6"/>
      <line x1="680" y1="230" x2="680" y2="620" stroke="${t.glass}" stroke-width="10" stroke-dasharray="16,14" opacity="0.7"/>
      <!-- Spire / Antenna -->
      <line x1="440" y1="60" x2="440" y2="130" stroke="${t.accent}" stroke-width="4"/>
      <circle cx="440" cy="55" r="4" fill="${t.accent}"/>
      `
        : `
      <!-- Villa / Residence Cantilever -->
      <polygon points="220,320 980,320 920,400 160,400" fill="#1e293b" stroke="${t.structure}" stroke-width="1.5" opacity="0.9"/>
      <!-- Upper Glass Box -->
      <rect x="260" y="240" width="520" height="150" rx="4" fill="url(#glassGrad)" stroke="${t.structure}" stroke-width="2"/>
      <line x1="390" y1="240" x2="390" y2="390" stroke="${t.structure}" stroke-width="1.5"/>
      <line x1="520" y1="240" x2="520" y2="390" stroke="${t.structure}" stroke-width="1.5"/>
      <line x1="650" y1="240" x2="650" y2="390" stroke="${t.structure}" stroke-width="1.5"/>
      <!-- Warm Interior Glow -->
      <rect x="290" y="270" width="180" height="90" rx="3" fill="${t.accent}" opacity="0.35"/>
      <!-- Lower Ground Floor & Louvers -->
      <rect x="180" y="400" width="840" height="200" fill="#0f172a" stroke="${t.structure}" stroke-width="2"/>
      <rect x="240" y="430" width="380" height="140" fill="url(#glassGrad)" stroke="${t.structure}" stroke-width="2"/>
      <line x1="360" y1="430" x2="360" y2="570" stroke="${t.structure}" stroke-width="1.5"/>
      <line x1="480" y1="430" x2="480" y2="570" stroke="${t.structure}" stroke-width="1.5"/>
      <!-- Wood slat partition -->
      <g stroke="${t.accent}" stroke-width="3" opacity="0.75">
        <line x1="720" y1="410" x2="720" y2="590"/>
        <line x1="740" y1="410" x2="740" y2="590"/>
        <line x1="760" y1="410" x2="760" y2="590"/>
        <line x1="780" y1="410" x2="780" y2="590"/>
        <line x1="800" y1="410" x2="800" y2="590"/>
        <line x1="820" y1="410" x2="820" y2="590"/>
      </g>
      <!-- Modern Infinity Pool and Reflection -->
      <rect x="120" y="600" width="960" height="60" fill="url(#glassGrad)" stroke="${t.glass}" stroke-width="1.5"/>
      `
    }

    <!-- Landscape / Ground -->
    <rect x="0" y="660" width="1200" height="140" fill="url(#groundGrad)"/>
    <line x1="0" y1="660" x2="1200" y2="660" stroke="${t.accent}" stroke-width="1" opacity="0.4"/>

    <!-- Subtle Lighting Accents -->
    <circle cx="200" cy="630" r="3" fill="${t.accent}"/>
    <circle cx="400" cy="630" r="3" fill="${t.accent}"/>
    <circle cx="600" cy="630" r="3" fill="${t.accent}"/>
    <circle cx="800" cy="630" r="3" fill="${t.accent}"/>
    <circle cx="1000" cy="630" r="3" fill="${t.accent}"/>

    <!-- Clean Architectural Tagline Watermark (Subtle & Elegant) -->
    <text x="50" y="740" fill="#ffffff" opacity="0.8" font-family="Cabinet Grotesk, sans-serif" font-weight="700" font-size="28">${title}</text>
    <text x="50" y="765" fill="${t.accent}" opacity="0.9" font-family="Plus Jakarta Sans, sans-serif" font-weight="600" font-size="14">PRIMEHAVEN SIGNATURE ARCHITECTURE</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const MOCK_AMENITIES: PropertyAmenity[] = [
  { id: 'am-1', name: 'Swimming Pool', category: 'outdoor', icon: 'Waves' },
  { id: 'am-2', name: 'Dedicated Car Parking', category: 'indoor', icon: 'Car' },
  { id: 'am-3', name: '24/7 CCTV & Security', category: 'security', icon: 'ShieldCheck' },
  { id: 'am-4', name: 'High-Speed Elevators', category: 'indoor', icon: 'ArrowUpDown' },
  { id: 'am-5', name: 'Full Backup Generator', category: 'utilities', icon: 'Zap' },
  { id: 'am-6', name: 'Central Air Conditioning', category: 'indoor', icon: 'AirVent' },
  { id: 'am-7', name: 'Private Garden & Lawn', category: 'outdoor', icon: 'Trees' },
  { id: 'am-8', name: 'Fitness Gym & Spa', category: 'indoor', icon: 'Dumbbell' },
  { id: 'am-9', name: 'Smart Home Automation', category: 'indoor', icon: 'Cpu' },
  { id: 'am-10', name: 'Sui Gas Supply', category: 'utilities', icon: 'Flame' },
  { id: 'am-11', name: 'Underground Clean Water', category: 'utilities', icon: 'Droplets' },
  { id: 'am-12', name: 'Solar Panels Ready', category: 'eco', icon: 'Sun' },
  { id: 'am-13', name: 'Rooftop Terrace', category: 'outdoor', icon: 'Maximize2' },
  { id: 'am-14', name: 'Servant Quarter', category: 'indoor', icon: 'Home' }
];

export const MOCK_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Ahsan Maqsood',
    email: 'admin@primehaven.estate',
    role: 'SUPER_ADMIN',
    phone: '+92 300 8472910',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    company: 'PrimeHaven Real Estate Holdings',
    createdAt: '2025-01-10T08:00:00Z'
  },
  {
    id: 'usr-admin-2',
    name: 'Zainab Shah (Ops Manager)',
    email: 'admin.ops@primehaven.estate',
    role: 'ADMIN',
    phone: '+92 301 5566778',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    company: 'PrimeHaven Operations Hub',
    createdAt: '2025-01-12T08:00:00Z'
  },
  {
    id: 'usr-agent-1',
    name: 'Tariq Mehmood',
    email: 'tariq.agent@primehaven.estate',
    role: 'AGENT',
    phone: '+92 321 4455882',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    company: 'PrimeHaven Elite Advisory',
    bio: '12+ years specializing in prime residential villas across DHA Lahore and Gulberg.',
    licenseNumber: 'REA-PB-8841',
    createdAt: '2025-01-15T09:30:00Z'
  },
  {
    id: 'usr-agent-2',
    name: 'Ayesha Khan',
    email: 'ayesha.agent@primehaven.estate',
    role: 'AGENT',
    phone: '+92 333 9128374',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    company: 'PrimeHaven Capital Luxury',
    bio: 'Corporate commercial property advisor for Islamabad Diplomatic Enclave and Blue Area.',
    licenseNumber: 'REA-ICT-4209',
    createdAt: '2025-02-01T10:00:00Z'
  },
  {
    id: 'usr-customer-1',
    name: 'Hamza Farooq',
    email: 'hamza.buyer@gmail.com',
    role: 'CUSTOMER',
    phone: '+92 302 7719283',
    createdAt: '2025-03-01T12:00:00Z'
  }
];

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    slug: 'tariq-mehmood',
    name: 'Tariq Mehmood',
    designation: 'Senior Luxury Property Director',
    email: 'tariq.agent@primehaven.estate',
    phone: '+92 321 4455882',
    whatsapp: '923214455882',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'Over 12 years of premier real estate consultancy in DHA Lahore, Gulberg, and Cantt. Certified luxury property specialist with over 450 verified transactions.',
    experienceYears: 12,
    specialization: ['Luxury Villas', 'Boutique Penthouses', 'Commercial Plots'],
    areasServed: ['DHA Lahore', 'Gulberg', 'Model Town', 'Cantt'],
    activeListingsCount: 14,
    rating: 4.9,
    reviewsCount: 68
  },
  {
    id: 'agent-2',
    slug: 'ayesha-khan',
    name: 'Ayesha Khan',
    designation: 'Commercial & High-Rise Advisor',
    email: 'ayesha.agent@primehaven.estate',
    phone: '+92 333 9128374',
    whatsapp: '923339128374',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    bio: 'Expert in Blue Area Islamabad commercial towers and Diplomatic Enclave residential leasing. Trusted partner for embassies and multinational headquarters.',
    experienceYears: 9,
    specialization: ['Corporate Offices', 'Diplomatic Enclave Residences', 'Pre-Launch Projects'],
    areasServed: ['F-6', 'F-7', 'E-7', 'Blue Area Islamabad'],
    activeListingsCount: 11,
    rating: 4.95,
    reviewsCount: 52
  },
  {
    id: 'agent-3',
    slug: 'bilal-ashraf',
    name: 'Bilal Ashraf',
    designation: 'Waterfront & Seaside Specialist',
    email: 'bilal.agent@primehaven.estate',
    phone: '+92 300 2819034',
    whatsapp: '923002819034',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    bio: 'Specializing in Clifton and DHA Karachi seaside developments, luxury duplexes, and prime real estate investments.',
    experienceYears: 8,
    specialization: ['Seaside Duplexes', 'Gated Societies', 'Rental Investments'],
    areasServed: ['Clifton Karachi', 'DHA Phase 8', 'KDA Scheme 1'],
    activeListingsCount: 9,
    rating: 4.85,
    reviewsCount: 41
  }
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-101',
    slug: '1-kanal-contemporary-designer-villa-dha-phase-6-lahore',
    title: '1 Kanal Contemporary Designer Villa',
    tagline: 'Brand New Architectural Masterpiece with Italian Finishes',
    purpose: 'sale',
    propertyType: 'Villa / House',
    price: 98000000,
    currency: 'PKR',
    bedrooms: 5,
    bathrooms: 6,
    areaSqFt: 4500,
    areaMarla: 20,
    floors: 2,
    yearBuilt: 2025,
    furnishing: 'furnished',
    parkingSpaces: 4,
    description: `A brand-new, bespoke 1 Kanal modern architectural villa situated in Sector J, DHA Phase 6, Lahore. Built with uncompromising standards, this home incorporates Spanish porcelain tiles, imported German kitchen fittings, and floor-to-ceiling double-glazed thermal windows. 

The ground floor features an expansive double-height lounge, a formal dining suite, an Italian designer show kitchen, and a ground-floor master suite. The upper level includes 4 lavish bedrooms with en-suite walk-in closets, an intimate family media room, and a landscaped viewing terrace.`,
    highlights: [
      'Prime DHA Phase 6 Sector J corner location',
      'Double-height ceiling entrance foyer',
      'Imported Italian marble & German Blum kitchen cabinetry',
      'Full solar setup with net-metering installed',
      'Dedicated driver/servant room with attached bath'
    ],
    features: [
      'Central VRF Inverter Air Conditioning',
      'Underground 10,000L Water Storage',
      'Automated Remote Access Garage Gates',
      'Solid Ash Wood Solid Core Doors'
    ],
    amenities: [
      'Swimming Pool',
      'Dedicated Car Parking',
      '24/7 CCTV & Security',
      'Full Backup Generator',
      'Smart Home Automation',
      'Private Garden & Lawn',
      'Rooftop Terrace'
    ],
    images: [
      createArchitecturalArt('villa', '1 Kanal Contemporary Villa · DHA Phase 6'),
      createArchitecturalArt('interior', 'Double-Height Living & Italian Marble'),
      createArchitecturalArt('craftsman', 'Landscaped Garden & Patio')
    ],
    location: {
      country: 'Pakistan',
      province: 'Punjab',
      city: 'Lahore',
      area: 'DHA Phase 6',
      society: 'Defence Housing Authority',
      address: 'Plot 412, Block J, DHA Phase 6, Lahore',
      lat: 31.4722,
      lng: 74.4533,
      nearbyPoints: [
        { type: 'school', name: 'Lahore Grammar School Phase 6', distance: '1.2 km' },
        { type: 'hospital', name: 'National Hospital DHA', distance: '3.5 km' },
        { type: 'mall', name: 'DHA Phase 6 Commercial Hub', distance: '800 m' },
        { type: 'airport', name: 'Allama Iqbal International Airport', distance: '12 km' }
      ]
    },
    status: 'published',
    isFeatured: true,
    isVerified: true,
    agentId: 'agent-1',
    viewsCount: 3840,
    inquiryCount: 42,
    createdAt: '2025-02-14T11:00:00Z',
    updatedAt: '2025-03-01T15:00:00Z'
  },
  {
    id: 'prop-102',
    slug: 'luxury-skyline-penthouse-gulberg-galleria-lahore',
    title: 'Luxury Skyline Penthouse with Private Pool',
    tagline: 'Panoramic City Views from Gulberg’s Premier Address',
    purpose: 'sale',
    propertyType: 'Penthouse',
    price: 135000000,
    currency: 'PKR',
    bedrooms: 4,
    bathrooms: 5,
    areaSqFt: 5200,
    areaMarla: 23,
    floors: 1,
    yearBuilt: 2024,
    furnishing: 'furnished',
    parkingSpaces: 3,
    description: `Perched on the 18th floor above Main Boulevard Gulberg, this full-floor penthouse redefines elevated luxury living. Offering 360-degree unobstructed vistas of the Lahore Gymkhana and skyline, private direct elevator foyer access, and an ultra-exclusive heated plunge pool on the sky deck.`,
    highlights: [
      'Private keycard direct elevator penthouse access',
      'Heated private rooftop plunge pool',
      'Floor-to-ceiling acoustic soundproof glazing',
      'Fully equipped Gaggenau kitchen suite',
      'Includes 3 covered basement parking bays'
    ],
    features: [
      'Sonos integrated multi-zone sound system',
      'Private fitness suite room',
      'Concierge service 24/7'
    ],
    amenities: [
      'Swimming Pool',
      'High-Speed Elevators',
      'Fitness Gym & Spa',
      '24/7 CCTV & Security',
      'Full Backup Generator',
      'Smart Home Automation'
    ],
    images: [
      createArchitecturalArt('penthouse', 'Skyline Penthouse · Main Boulevard Gulberg'),
      createArchitecturalArt('interior', 'Skyline Lounge & Panoramas')
    ],
    location: {
      country: 'Pakistan',
      province: 'Punjab',
      city: 'Lahore',
      area: 'Gulberg III',
      society: 'Main Boulevard Commercial',
      address: 'Floor 18, Prime Tower, Main Boulevard Gulberg III',
      lat: 31.5126,
      lng: 74.3478,
      nearbyPoints: [
        { type: 'mall', name: 'Mall of Lahore & MM Alam Road', distance: '500 m' },
        { type: 'metro', name: 'Gulberg Metro Station', distance: '1.4 km' },
        { type: 'hospital', name: 'Doctors Hospital & Medical Center', distance: '4.2 km' }
      ]
    },
    status: 'published',
    isFeatured: true,
    isVerified: true,
    agentId: 'agent-1',
    viewsCount: 5120,
    inquiryCount: 65,
    createdAt: '2025-01-20T09:15:00Z',
    updatedAt: '2025-02-28T16:20:00Z'
  },
  {
    id: 'prop-103',
    slug: 'corporate-headquarters-office-floor-blue-area-islamabad',
    title: 'A-Grade Commercial Corporate Floor',
    tagline: 'Prime Investment in Islamabad’s Financial District',
    purpose: 'rent',
    propertyType: 'Commercial Building',
    price: 1800000,
    currency: 'PKR',
    bedrooms: 0,
    bathrooms: 4,
    areaSqFt: 6000,
    yearBuilt: 2023,
    furnishing: 'semi-furnished',
    parkingSpaces: 8,
    description: `State-of-the-art office floor situated within Islamabad's central business artery on Jinnah Avenue, Blue Area. Fitted with raised access flooring for structured cabling, high-efficiency centralized HVAC, dedicated fiber connectivity, and high-security turnstiles at reception.`,
    highlights: [
      'Heart of Blue Area financial corridor',
      'CDA approved building with fire-suppression systems',
      'Dedicated transformer with 100% dual-generator redundancy',
      '8 designated underground reserved parking spots'
    ],
    features: [
      'Executive conference room setup',
      'Modern pantry & executive washrooms',
      'Card access security gates'
    ],
    amenities: [
      'High-Speed Elevators',
      '24/7 CCTV & Security',
      'Full Backup Generator',
      'Central Air Conditioning',
      'Dedicated Car Parking'
    ],
    images: [
      createArchitecturalArt('tower', 'Blue Area Corporate Hub · Islamabad'),
      createArchitecturalArt('interior', 'Open Corporate Floorplate')
    ],
    location: {
      country: 'Pakistan',
      province: 'Islamabad Capital Territory',
      city: 'Islamabad',
      area: 'Blue Area',
      address: '7th Floor, Al-Rehman Corporate Center, Jinnah Avenue, Islamabad',
      lat: 33.7142,
      lng: 73.0645,
      nearbyPoints: [
        { type: 'metro', name: 'Parade Ground Metro Station', distance: '250 m' },
        { type: 'hospital', name: 'Polyclinic Hospital', distance: '1.1 km' },
        { type: 'mall', name: 'Centaurus Mall', distance: '1.8 km' }
      ]
    },
    status: 'published',
    isFeatured: true,
    isVerified: true,
    agentId: 'agent-2',
    viewsCount: 2290,
    inquiryCount: 28,
    createdAt: '2025-02-05T14:40:00Z',
    updatedAt: '2025-03-02T10:10:00Z'
  },
  {
    id: 'prop-104',
    slug: '2-kanal-diplomatic-luxury-estate-sector-e-7-islamabad',
    title: '2 Kanal Diplomatic Luxury Estate',
    tagline: 'Margalla Foothills Views with Maximum Security Perimeter',
    purpose: 'sale',
    propertyType: 'Villa / House',
    price: 320000000,
    currency: 'PKR',
    bedrooms: 6,
    bathrooms: 7,
    areaSqFt: 9000,
    areaMarla: 40,
    floors: 3,
    yearBuilt: 2023,
    furnishing: 'furnished',
    parkingSpaces: 6,
    description: `Rare opportunity to acquire an ultra-prestigious 2 Kanal residential estate in Islamabad's most coveted sector, E-7. Backing onto the Margalla Hills National Park, this estate features bullet-resistant guard cabin architecture, sprawling private manicured lawn, Olympic-grade pool, and classical limestone exterior.`,
    highlights: [
      'Unobstructed Margalla Hills views',
      'Certified high-security zone appropriate for embassies',
      'Olympic-standard heated outdoor pool & jacuzzi',
      'Separate security barracks with independent utilities'
    ],
    features: [
      'Wine/Beverage cellar',
      'Underfloor radiant bathroom heating',
      'Double insulated exterior wall cavity'
    ],
    amenities: [
      'Swimming Pool',
      'Private Garden & Lawn',
      'Dedicated Car Parking',
      '24/7 CCTV & Security',
      'Full Backup Generator',
      'Smart Home Automation',
      'Servant Quarter'
    ],
    images: [
      createArchitecturalArt('craftsman', '2 Kanal Diplomatic Estate · Sector E-7'),
      createArchitecturalArt('interior', 'Classical Banquet Room')
    ],
    location: {
      country: 'Pakistan',
      province: 'Islamabad Capital Territory',
      city: 'Islamabad',
      area: 'Sector E-7',
      address: 'Street 18, Sector E-7, Islamabad',
      lat: 33.7297,
      lng: 73.0531,
      nearbyPoints: [
        { type: 'park', name: 'Margalla Hills Trail 3', distance: '900 m' },
        { type: 'school', name: 'Islamabad Model College', distance: '1.5 km' },
        { type: 'mall', name: 'F-7 Markaz Jinnah Super', distance: '2.0 km' }
      ]
    },
    status: 'published',
    isFeatured: true,
    isVerified: true,
    agentId: 'agent-2',
    viewsCount: 6410,
    inquiryCount: 54,
    createdAt: '2025-01-18T16:20:00Z',
    updatedAt: '2025-02-25T11:00:00Z'
  },
  {
    id: 'prop-105',
    slug: 'modern-3-bed-luxury-apartment-clifton-karachi',
    title: '3-Bed Seaview Luxury Residence',
    tagline: 'Direct Sea Breeze with Contemporary Open-Plan Design',
    purpose: 'sale',
    propertyType: 'Apartment',
    price: 48000000,
    currency: 'PKR',
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 2200,
    floors: 1,
    yearBuilt: 2024,
    furnishing: 'semi-furnished',
    parkingSpaces: 2,
    description: `A sunlit, seafront 3-bedroom luxury condominium in Clifton Block 4, Karachi. Features expansive floor-to-ceiling glass balconies capturing Arabian Sea sunsets, imported Turkish quartz countertops, and dedicated basement parking.`,
    highlights: [
      'Permanent sunset seaview from master bedroom & balcony',
      'Triple-filtered reverse osmosis desalinated water connection',
      'Earthquake-resistant RCC structure',
      'Community gym and clubhouse access included'
    ],
    features: [
      'Built-in audio wiring',
      'Balcony with tempered glass railing',
      'Independent utility meter'
    ],
    amenities: [
      'High-Speed Elevators',
      '24/7 CCTV & Security',
      'Fitness Gym & Spa',
      'Full Backup Generator',
      'Dedicated Car Parking'
    ],
    images: [
      createArchitecturalArt('interior', 'Clifton Seaside Apartment · Karachi'),
      createArchitecturalArt('tower', 'Oceanview Tower Facade')
    ],
    location: {
      country: 'Pakistan',
      province: 'Sindh',
      city: 'Karachi',
      area: 'Clifton',
      society: 'Clifton Block 4',
      address: 'Tower B, Clifton Marine Heights, Block 4, Karachi',
      lat: 24.8184,
      lng: 67.0278,
      nearbyPoints: [
        { type: 'mall', name: 'Dolmen Mall Clifton', distance: '1.3 km' },
        { type: 'hospital', name: 'South City Hospital', distance: '900 m' },
        { type: 'park', name: 'Benazir Bhutto Park', distance: '1.1 km' }
      ]
    },
    status: 'published',
    isFeatured: false,
    isVerified: true,
    agentId: 'agent-3',
    viewsCount: 1980,
    inquiryCount: 19,
    createdAt: '2025-02-10T12:00:00Z',
    updatedAt: '2025-02-27T09:30:00Z'
  },
  {
    id: 'prop-106',
    slug: '10-marla-brand-new-house-bahria-town-lahore',
    title: '10 Marla Mediterranean Modern Home',
    tagline: 'Gated Community Living in Sector C Bahria Town',
    purpose: 'sale',
    propertyType: 'House',
    price: 36500000,
    currency: 'PKR',
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 2750,
    areaMarla: 10,
    floors: 2,
    yearBuilt: 2025,
    furnishing: 'unfurnished',
    parkingSpaces: 2,
    description: `Constructed with immaculate attention to detail, this 10 Marla residence offers spacious open-plan living, Spanish tiles, a contemporary open kitchen plus auxiliary dirty kitchen, and a charming courtyard garden.`,
    highlights: [
      'Walking distance to Sector C Commercial Broadway',
      'Round the clock Bahria security and maintenance',
      'Near Grand Jamia Mosque and Safari Park',
      'Solid Ash woodwork throughout'
    ],
    features: [
      'Grohe sanitary fittings',
      'Terrace bbq counter',
      'UPS wiring done'
    ],
    amenities: [
      '24/7 CCTV & Security',
      'Dedicated Car Parking',
      'Private Garden & Lawn',
      'Sui Gas Supply',
      'Underground Clean Water'
    ],
    images: [
      createArchitecturalArt('craftsman', '10 Marla Mediterranean Home · Bahria Town')
    ],
    location: {
      country: 'Pakistan',
      province: 'Punjab',
      city: 'Lahore',
      area: 'Bahria Town',
      society: 'Sector C',
      address: 'Street 9, Sector C, Bahria Town, Lahore',
      lat: 31.3685,
      lng: 74.1804,
      nearbyPoints: [
        { type: 'park', name: 'Eiffel Tower Park Bahria', distance: '1.5 km' },
        { type: 'school', name: 'Beaconhouse School Bahria', distance: '900 m' },
        { type: 'hospital', name: 'Bahria International Hospital', distance: '2.1 km' }
      ]
    },
    status: 'published',
    isFeatured: false,
    isVerified: true,
    agentId: 'agent-1',
    viewsCount: 1450,
    inquiryCount: 16,
    createdAt: '2025-02-20T10:15:00Z',
    updatedAt: '2025-03-01T11:00:00Z'
  },
  {
    id: 'prop-107',
    slug: 'furnished-luxury-suite-for-rent-dha-phase-5-lahore',
    title: 'Furnished Executive 2-Bed Suite',
    tagline: 'Move-in Ready with High-End Designer Interiors',
    purpose: 'rent',
    propertyType: 'Apartment',
    price: 220000,
    currency: 'PKR',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1400,
    floors: 1,
    yearBuilt: 2024,
    furnishing: 'furnished',
    parkingSpaces: 1,
    description: `Turnkey luxury apartment in DHA Phase 5. Complete with customized Nordic furniture, 65-inch OLED televisions, Daikin inverter cooling, and high-speed fiber internet. Ideal for expatriates, executives, and diplomats.`,
    highlights: [
      'Fully furnished with designer lighting and artwork',
      'Weekly housekeeping service included',
      'Secured gated basement parking',
      'Immediate occupancy available'
    ],
    features: ['Washing machine & dryer', 'Microwave & espresso machine', 'Bedding & linens'],
    amenities: [
      'Central Air Conditioning',
      'High-Speed Elevators',
      '24/7 CCTV & Security',
      'Full Backup Generator'
    ],
    images: [
      createArchitecturalArt('interior', 'Executive 2-Bed Furnished Suite · DHA 5')
    ],
    location: {
      country: 'Pakistan',
      province: 'Punjab',
      city: 'Lahore',
      area: 'DHA Phase 5',
      address: 'Park View Heights, Sector G, DHA Phase 5, Lahore',
      lat: 31.4682,
      lng: 74.4215,
      nearbyPoints: [
        { type: 'mall', name: 'DHA Phase 5 Commercial Ring', distance: '400 m' },
        { type: 'hospital', name: 'Shaukat Khanum Lab Phase 5', distance: '600 m' }
      ]
    },
    status: 'published',
    isFeatured: false,
    isVerified: true,
    agentId: 'agent-1',
    viewsCount: 2890,
    inquiryCount: 31,
    createdAt: '2025-02-22T08:30:00Z',
    updatedAt: '2025-03-02T13:45:00Z'
  },
  {
    id: 'prop-108',
    slug: '1-kanal-residential-plot-dha-phase-7-lahore',
    title: '1 Kanal Prime Residential Corner Plot',
    tagline: 'Ideal Investment Ready for Immediate Construction',
    purpose: 'sale',
    propertyType: 'Plot',
    price: 38500000,
    currency: 'PKR',
    bedrooms: 0,
    bathrooms: 0,
    areaSqFt: 4500,
    areaMarla: 20,
    furnishing: 'unfurnished',
    parkingSpaces: 0,
    description: `Corner 1 Kanal residential plot in Block T, DHA Phase 7. Fully developed sector with all underground electricity, gas lines, and paved wide roads in place. Clear possession with zero litigation.`,
    highlights: [
      'Corner plot with extra green belt front',
      'Direct access from 100 ft sector boulevard',
      'Possession & utility charges paid',
      'Ideal for immediate home construction'
    ],
    features: ['Direct owner deal', 'Ready for registry/transfer'],
    amenities: [
      '24/7 CCTV & Security',
      'Sui Gas Supply',
      'Underground Clean Water'
    ],
    images: [
      createArchitecturalArt('plot', '1 Kanal Corner Plot · DHA Phase 7')
    ],
    location: {
      country: 'Pakistan',
      province: 'Punjab',
      city: 'Lahore',
      area: 'DHA Phase 7',
      address: 'Plot 104, Block T, DHA Phase 7, Lahore',
      lat: 31.4421,
      lng: 74.4691,
      nearbyPoints: [
        { type: 'park', name: 'DHA Phase 7 Sector Park', distance: '200 m' },
        { type: 'mall', name: 'Commercial Broadway Phase 7', distance: '1.1 km' }
      ]
    },
    status: 'published',
    isFeatured: false,
    isVerified: true,
    agentId: 'agent-1',
    viewsCount: 1620,
    inquiryCount: 14,
    createdAt: '2025-02-12T14:00:00Z',
    updatedAt: '2025-02-28T10:00:00Z'
  },
  {
    id: 'prop-109',
    slug: '5-marla-smart-luxury-house-dha-phase-9-prism',
    title: '5 Marla Smart Architectural House',
    tagline: 'Compact Luxury with Solar & Smart Automation',
    purpose: 'sale',
    propertyType: 'House',
    price: 24500000,
    currency: 'PKR',
    bedrooms: 3,
    bathrooms: 4,
    areaSqFt: 1650,
    areaMarla: 5,
    floors: 2,
    yearBuilt: 2025,
    furnishing: 'semi-furnished',
    parkingSpaces: 1,
    description: `Expertly engineered 5 Marla home optimizing every inch of interior space. Features double glazed acoustic windows, built-in smart Alexa-enabled switchboards, 5KW on-grid solar system, and high-gloss kitchen cabinets.`,
    highlights: [
      '5KW Solar Net Metering installed',
      'Smart app-controlled lighting and HVAC',
      'Modern open-concept floor plan',
      'Low maintenance luxury living'
    ],
    features: ['Solar installed', 'Smart security lock'],
    amenities: [
      'Smart Home Automation',
      'Solar Panels Ready',
      '24/7 CCTV & Security',
      'Dedicated Car Parking'
    ],
    images: [
      createArchitecturalArt('villa', '5 Marla Smart House · DHA Prism 9')
    ],
    location: {
      country: 'Pakistan',
      province: 'Punjab',
      city: 'Lahore',
      area: 'DHA Phase 9 Prism',
      address: 'Block R, DHA Phase 9 Prism, Lahore',
      lat: 31.4285,
      lng: 74.4891,
      nearbyPoints: [
        { type: 'park', name: 'Central Theme Park Phase 9', distance: '800 m' }
      ]
    },
    status: 'pending_approval',
    isFeatured: false,
    isVerified: false,
    agentId: 'agent-1',
    viewsCount: 420,
    inquiryCount: 3,
    createdAt: '2025-03-01T15:20:00Z',
    updatedAt: '2025-03-01T15:20:00Z'
  }
];

export const MOCK_PROJECTS: RealEstateProject[] = [
  {
    id: 'proj-1',
    slug: 'prime-skyline-residences-gulberg',
    name: 'Prime Skyline Residences',
    developer: 'PrimeHaven Developments & Zameen Builders',
    location: {
      country: 'Pakistan',
      province: 'Punjab',
      city: 'Lahore',
      area: 'Gulberg III',
      address: 'Main Boulevard, Gulberg III, Lahore',
      lat: 31.514,
      lng: 74.348
    },
    description: 'A 28-storey iconic residential architectural masterwork featuring sky-bridge penthouses, infinity rooftop pool, valet parking, and high-yield serviced apartments.',
    startingPrice: 32000000,
    currency: 'PKR',
    status: 'under_construction',
    totalUnits: 140,
    availableUnits: 48,
    totalArea: '2.5 Acres',
    completionDate: 'December 2026',
    amenities: ['Swimming Pool', 'Fitness Gym & Spa', 'High-Speed Elevators', '24/7 CCTV & Security', 'Full Backup Generator'],
    images: [createArchitecturalArt('project', 'Prime Skyline Residences · Gulberg')],
    unitsAvailableByType: [
      { type: '1-Bedroom Executive', beds: '1', size: '750 sq ft', price: 18500000 },
      { type: '2-Bedroom Luxury', beds: '2', size: '1350 sq ft', price: 32000000 },
      { type: '3-Bedroom Royal Suite', beds: '3', size: '2100 sq ft', price: 49000000 },
      { type: 'Duplex Penthouse', beds: '4', size: '4200 sq ft', price: 110000000 }
    ],
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 'proj-2',
    slug: 'margalla-creek-villas-islamabad',
    name: 'Margalla Creek Villas',
    developer: 'Capital Luxury Estates',
    location: {
      country: 'Pakistan',
      province: 'Islamabad Capital Territory',
      city: 'Islamabad',
      area: 'Zone IV',
      address: 'Park Road, Chak Shahzad, Islamabad',
      lat: 33.672,
      lng: 73.125
    },
    description: 'An exclusive gated sanctuary of 65 standalone modern villas nestled alongside natural pine creeks with sustainable solar grids and organic private orchards.',
    startingPrice: 75000000,
    currency: 'PKR',
    status: 'pre_launch',
    totalUnits: 65,
    availableUnits: 29,
    totalArea: '18 Acres',
    completionDate: 'June 2027',
    amenities: ['Private Garden & Lawn', 'Solar Panels Ready', '24/7 CCTV & Security', 'Smart Home Automation'],
    images: [createArchitecturalArt('craftsman', 'Margalla Creek Villas · Islamabad')],
    unitsAvailableByType: [
      { type: '1 Kanal Modern Villa', beds: '5', size: '4800 sq ft', price: 75000000 },
      { type: '2 Kanal Estate Mansion', beds: '6', size: '8200 sq ft', price: 145000000 }
    ],
    createdAt: '2024-12-15T12:00:00Z'
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Dr. Zulfiqar Ali',
    phone: '+92 300 8471920',
    email: 'zulfiqar.ali@gmail.com',
    source: 'website',
    propertyId: 'prop-101',
    agentId: 'agent-1',
    budget: 100000000,
    preferredLocation: 'DHA Phase 6 Lahore',
    purpose: 'sale',
    notes: 'Overseas doctor returning to Lahore in April. Wants 1 Kanal brand new corner house with solar setup.',
    followUpDate: '2026-10-02',
    status: 'interested',
    createdAt: '2025-02-28T09:00:00Z',
    updatedAt: '2025-03-01T14:00:00Z',
    activities: [
      {
        id: 'act-1',
        date: '2025-02-28T09:10:00Z',
        agentName: 'Tariq Mehmood',
        activityType: 'call',
        details: 'Initial phone call. Sent video walkthrough of DHA Phase 6 Villa.'
      },
      {
        id: 'act-2',
        date: '2025-03-01T14:00:00Z',
        agentName: 'Tariq Mehmood',
        activityType: 'note',
        details: 'Client confirmed budget up to 10 Crore PKR.'
      }
    ]
  },
  {
    id: 'lead-2',
    name: 'Sobia Qureshi',
    phone: '+92 321 9918234',
    email: 'sobia.q@techhub.pk',
    source: 'google',
    propertyId: 'prop-103',
    agentId: 'agent-2',
    budget: 2000000,
    preferredLocation: 'Blue Area Islamabad',
    purpose: 'rent',
    notes: 'Looking for 5,000 - 6,000 sq ft office for expanding software company with 75 engineers.',
    followUpDate: '2026-10-01',
    status: 'viewing_scheduled',
    createdAt: '2025-02-26T11:30:00Z',
    updatedAt: '2025-03-02T10:00:00Z',
    activities: [
      {
        id: 'act-3',
        date: '2025-02-26T11:45:00Z',
        agentName: 'Ayesha Khan',
        activityType: 'meeting',
        details: 'Office viewing confirmed for tomorrow 3 PM.'
      }
    ]
  },
  {
    id: 'lead-3',
    name: 'Kamran Siddiqui',
    phone: '+92 333 4819201',
    email: 'kamran.siddiqui@investor.ae',
    source: 'referral',
    propertyId: 'prop-102',
    agentId: 'agent-1',
    budget: 140000000,
    preferredLocation: 'Gulberg Lahore',
    purpose: 'sale',
    notes: 'Dubai expat looking to purchase high-yield penthouse.',
    followUpDate: '2026-10-05',
    status: 'negotiation',
    createdAt: '2025-02-20T16:00:00Z',
    updatedAt: '2025-03-02T16:00:00Z'
  },
  {
    id: 'lead-4',
    name: 'Naveed Akhtar',
    phone: '+92 312 5551234',
    email: 'naveed.akhtar@yahoo.com',
    source: 'facebook',
    budget: 35000000,
    preferredLocation: 'Bahria Town Lahore',
    purpose: 'sale',
    notes: 'Inquired through Facebook ad for 10 Marla houses.',
    status: 'new',
    createdAt: '2025-03-02T15:00:00Z',
    updatedAt: '2025-03-02T15:00:00Z'
  }
];

export const MOCK_INQUIRIES: PropertyInquiry[] = [
  {
    id: 'inq-3',
    propertyId: 'prop-101',
    propertyTitle: '1 Kanal Contemporary Designer Villa',
    customerName: 'Hamza Farooq',
    customerEmail: 'hamza.buyer@gmail.com',
    customerPhone: '+92 302 7719283',
    preferredContact: 'whatsapp',
    message: 'Salam Tariq sahib, could you please confirm the payment schedule and whether transfer fees are included in the asking price? Looking forward to our scheduled walkthrough.',
    status: 'contacted',
    createdAt: '2025-03-01T15:40:00Z'
  },
  {
    id: 'inq-4',
    propertyId: 'prop-104',
    propertyTitle: 'Spanish Colonial Estate Mansion',
    customerName: 'Hamza Farooq',
    customerEmail: 'hamza.buyer@gmail.com',
    customerPhone: '+92 302 7719283',
    preferredContact: 'phone',
    message: 'Interested in making an offer. Please share the society NOC and registry papers for DHA Phase 5.',
    status: 'new',
    createdAt: '2025-03-03T10:15:00Z'
  },
  {
    id: 'inq-1',
    propertyId: 'prop-101',
    propertyTitle: '1 Kanal Contemporary Designer Villa',
    customerName: 'Muhammad Salman',
    customerEmail: 'salman.eng@gmail.com',
    customerPhone: '+92 321 8847291',
    preferredContact: 'whatsapp',
    message: 'Is the price negotiable for an upfront cash offer? When can I arrange a private tour with my family?',
    status: 'new',
    createdAt: '2025-03-02T11:20:00Z'
  },
  {
    id: 'inq-2',
    propertyId: 'prop-102',
    propertyTitle: 'Luxury Skyline Penthouse with Private Pool',
    customerName: 'Amina Baig',
    customerEmail: 'amina.baig@lawfirm.com',
    customerPhone: '+92 301 2291038',
    preferredContact: 'phone',
    message: 'Please send complete floor plans, monthly maintenance charges, and title deed verification documents.',
    status: 'contacted',
    createdAt: '2025-03-01T16:45:00Z'
  }
];

export const MOCK_APPOINTMENTS: ViewingAppointment[] = [
  {
    id: 'app-3',
    propertyId: 'prop-101',
    propertyTitle: '1 Kanal Contemporary Designer Villa',
    customerName: 'Hamza Farooq',
    customerEmail: 'hamza.buyer@gmail.com',
    customerPhone: '+92 302 7719283',
    agentId: 'agent-1',
    agentName: 'Tariq Mehmood',
    date: '2026-10-04',
    timeSlot: '02:00 PM - 03:00 PM',
    notes: 'Family visit for 1 Kanal villa in DHA Phase 6. Want to inspect 10KW solar net-metering, basement theatre, and servant quarters.',
    status: 'confirmed',
    createdAt: '2025-03-02T09:15:00Z'
  },
  {
    id: 'app-4',
    propertyId: 'prop-102',
    propertyTitle: 'Luxury Skyline Penthouse with Private Pool',
    customerName: 'Hamza Farooq',
    customerEmail: 'hamza.buyer@gmail.com',
    customerPhone: '+92 302 7719283',
    agentId: 'agent-1',
    agentName: 'Tariq Mehmood',
    date: '2026-10-08',
    timeSlot: '05:00 PM - 06:00 PM',
    notes: 'Evening sunset viewing to assess panoramic city skyline and private infinity pool.',
    status: 'pending',
    createdAt: '2025-03-03T11:00:00Z'
  },
  {
    id: 'app-1',
    propertyId: 'prop-101',
    propertyTitle: '1 Kanal Contemporary Designer Villa',
    customerName: 'Dr. Zulfiqar Ali',
    customerEmail: 'zulfiqar.ali@gmail.com',
    customerPhone: '+92 300 8471920',
    agentId: 'agent-1',
    agentName: 'Tariq Mehmood',
    date: '2026-10-02',
    timeSlot: '11:00 AM - 12:00 PM',
    notes: 'Client representative in Pakistan attending first walkthrough.',
    status: 'confirmed',
    createdAt: '2025-03-01T12:00:00Z'
  },
  {
    id: 'app-2',
    propertyId: 'prop-103',
    propertyTitle: 'A-Grade Commercial Corporate Floor',
    customerName: 'Sobia Qureshi',
    customerEmail: 'sobia.q@techhub.pk',
    customerPhone: '+92 321 9918234',
    agentId: 'agent-2',
    agentName: 'Ayesha Khan',
    date: '2026-10-01',
    timeSlot: '03:00 PM - 04:00 PM',
    notes: 'Technical inspection of server room electrical load capacity.',
    status: 'confirmed',
    createdAt: '2025-02-28T14:30:00Z'
  }
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'pakistan-real-estate-market-outlook-2026',
    title: 'Pakistan Real Estate Market Outlook 2026: Prime Areas & High ROI Sectors',
    excerpt: 'An in-depth analysis of high-yield residential corridors in Lahore, Islamabad, and Karachi, along with capital gain trends following real estate tax policy revisions.',
    content: `The Pakistani real estate sector is witnessing a decisive flight to quality. Overseas Pakistani remittances and local institutional investors are prioritizing master-planned gated communities with established infrastructure and verified title deeds.

Key growth drivers include:
1. Expansion of DHA Phase 6, 7, and 9 Prism with Ring Road connectivity.
2. Demand for Class-A green commercial offices in Islamabad.
3. Serviced apartments delivering 8-11% annual rental yields in urban hubs.

Investors are advised to focus on properties with verified completion certificates and underground utility infrastructure.`,
    category: 'Market Trends',
    tags: ['Investment', 'DHA Lahore', 'Capital Gains', 'Tax Policy'],
    featuredImage: createArchitecturalArt('project', 'Market Outlook 2026'),
    authorName: 'Ahsan Maqsood',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    readingTime: '5 min read',
    status: 'published',
    publishedAt: '2025-02-20T10:00:00Z'
  },
  {
    id: 'post-2',
    slug: 'essential-checklist-for-buying-property-in-pakistan',
    title: 'The Essential Due Diligence Checklist for Buying Property in Pakistan',
    excerpt: 'Avoid common title pitfalls: from FBR tax compliance and mutation verification to society NOCs and structural inspection checklists.',
    content: `Purchasing a residential or commercial property requires a systematic legal verification process. 

1. Society Transfer Verification: Confirm whether the plot or built home is directly transferable through the housing authority (e.g. DHA, CDA, Bahria) or requires a registry and mutation (Intiqal) through the revenue department (Patwari/Tehsildar).
2. Non-Encumbrance Certificate (NEC): Ensure no banking mortgage, stay order, or tax lien is registered against the property title.
3. Approved Architectural Building Plan: Check whether any unauthorized structural alterations or setback violations exist against the sanctioned blueprint.
4. FBR Active Taxpayer Status: Non-filers face significantly higher advance tax rates (Section 236K and 236C).`,
    category: 'Buyer Guide',
    tags: ['Legal', 'Due Diligence', 'Registry', 'FBR Taxes'],
    featuredImage: createArchitecturalArt('villa', 'Due Diligence Checklist'),
    authorName: 'Tariq Mehmood',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    readingTime: '7 min read',
    status: 'published',
    publishedAt: '2025-02-15T14:30:00Z'
  }
];

export const DEFAULT_SETTINGS: PlatformSettings = {
  companyName: 'PrimeHaven Real Estate',
  supportEmail: 'contact@primehaven.estate',
  supportPhone: '+92 42 3589 1200',
  whatsappNumber: '923214455882',
  address: 'Prime Tower, Main Boulevard Gulberg III, Lahore, Pakistan',
  currency: 'PKR',
  currencySymbol: 'Rs. ',
  currencyPosition: 'prefix',
  requireApproval: true,
  defaultPropertyStatus: 'published',
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
    twitter: 'https://x.com'
  }
};

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    userId: 'usr-admin-1',
    userName: 'Ahsan Maqsood',
    action: 'PUBLISH_PROPERTY',
    entity: 'Property',
    entityId: 'prop-101',
    details: 'Approved and published 1 Kanal Contemporary Villa in DHA Phase 6',
    ipAddress: '103.255.4.18',
    timestamp: '2025-02-14T11:00:00Z'
  },
  {
    id: 'log-2',
    userId: 'usr-agent-1',
    userName: 'Tariq Mehmood',
    action: 'LEAD_STATUS_UPDATE',
    entity: 'Lead',
    entityId: 'lead-1',
    details: 'Updated lead status from NEW to INTERESTED after video walkthrough',
    ipAddress: '39.40.12.89',
    timestamp: '2025-03-01T14:00:00Z'
  },
  {
    id: 'log-3',
    userId: 'usr-admin-1',
    userName: 'Ahsan Maqsood',
    action: 'SETTING_UPDATE',
    entity: 'Settings',
    entityId: 'general',
    details: 'Updated platform default currency to PKR',
    ipAddress: '103.255.4.18',
    timestamp: '2025-03-02T09:30:00Z'
  }
];

export const CITIES_AND_AREAS = [
  {
    city: 'Lahore',
    areas: ['DHA Phase 6', 'Gulberg III', 'DHA Phase 5', 'DHA Phase 7', 'DHA Phase 9 Prism', 'Bahria Town', 'Model Town', 'Cantt']
  },
  {
    city: 'Islamabad',
    areas: ['Sector E-7', 'Blue Area', 'Sector F-6', 'Sector F-7', 'DHA Islamabad', 'Bahria Town Phase 8', 'Zone IV Chak Shahzad']
  },
  {
    city: 'Karachi',
    areas: ['Clifton', 'DHA Phase 8', 'DHA Phase 6', 'KDA Scheme 1', 'Bahria Town Karachi', 'PECHS']
  },
  {
    city: 'Dubai',
    areas: ['Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Business Bay']
  }
];

export const PROPERTY_TYPES = [
  'Villa / House',
  'Apartment',
  'Penthouse',
  'Commercial Building',
  'Office Floor',
  'Plot',
  'Farm House',
  'Shop / Retail'
];

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'AGENT' | 'PROPERTY_OWNER' | 'CUSTOMER' | 'GUEST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  company?: string;
  bio?: string;
  licenseNumber?: string;
  createdAt: string;
}

export type PropertyPurpose = 'sale' | 'rent' | 'lease';

export type PropertyStatus =
  | 'draft'
  | 'pending_approval'
  | 'published'
  | 'featured'
  | 'sold'
  | 'rented'
  | 'archived';

export interface PropertyAmenity {
  id: string;
  name: string;
  category: 'indoor' | 'outdoor' | 'security' | 'utilities' | 'eco';
  icon: string;
}

export interface PropertyLocation {
  country: string;
  province: string;
  city: string;
  area: string;
  society?: string;
  address: string;
  lat: number;
  lng: number;
  nearbyPoints?: {
    type: 'school' | 'hospital' | 'metro' | 'mall' | 'airport' | 'park';
    name: string;
    distance: string;
  }[];
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  purpose: PropertyPurpose;
  propertyType: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  areaMarla?: number;
  floors?: number;
  yearBuilt?: number;
  furnishing: 'unfurnished' | 'semi-furnished' | 'furnished';
  parkingSpaces: number;
  description: string;
  highlights: string[];
  features: string[];
  amenities: string[];
  images: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  location: PropertyLocation;
  status: PropertyStatus;
  isFeatured: boolean;
  isVerified: boolean;
  agentId: string;
  ownerId?: string;
  projectId?: string;
  viewsCount: number;
  inquiryCount: number;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RealEstateProject {
  id: string;
  slug: string;
  name: string;
  developer: string;
  location: PropertyLocation;
  description: string;
  startingPrice: number;
  currency: string;
  status: 'upcoming' | 'pre_launch' | 'under_construction' | 'completed';
  totalUnits: number;
  availableUnits: number;
  totalArea: string;
  completionDate: string;
  amenities: string[];
  images: string[];
  brochureUrl?: string;
  unitsAvailableByType?: {
    type: string;
    beds: string;
    size: string;
    price: number;
  }[];
  createdAt: string;
}

export interface Agent {
  id: string;
  slug: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  whatsapp: string;
  avatar: string;
  bio: string;
  experienceYears: number;
  specialization: string[];
  areasServed: string[];
  activeListingsCount: number;
  rating: number;
  reviewsCount: number;
  socials?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'interested'
  | 'viewing_scheduled'
  | 'negotiation'
  | 'converted'
  | 'lost';

export type LeadSource =
  | 'website'
  | 'facebook'
  | 'instagram'
  | 'whatsapp'
  | 'google'
  | 'referral'
  | 'walk_in'
  | 'phone'
  | 'other';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  propertyId?: string;
  agentId?: string;
  budget: number;
  preferredLocation: string;
  purpose: PropertyPurpose;
  notes: string;
  followUpDate?: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  activities?: {
    id: string;
    date: string;
    agentName: string;
    activityType: 'call' | 'email' | 'meeting' | 'note' | 'status_change';
    details: string;
  }[];
}

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredContact: 'phone' | 'email' | 'whatsapp';
  message: string;
  preferredViewingDate?: string;
  preferredViewingTime?: string;
  status: 'new' | 'contacted' | 'resolved' | 'archived';
  createdAt: string;
}

export interface ViewingAppointment {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  agentId: string;
  agentName: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  authorName: string;
  authorAvatar: string;
  readingTime: string;
  status: 'published' | 'draft';
  publishedAt: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  targetType: 'property' | 'agent' | 'platform';
  targetId: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface PlatformSettings {
  companyName: string;
  logoUrl?: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  address: string;
  currency: string;
  currencySymbol: string;
  currencyPosition: 'prefix' | 'suffix';
  requireApproval: boolean;
  defaultPropertyStatus: PropertyStatus;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface FilterState {
  keyword: string;
  purpose: 'all' | 'sale' | 'rent' | 'lease';
  propertyType: string;
  city: string;
  area: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  bathrooms: string;
  furnishing: string;
  isVerifiedOnly: boolean;
  isFeaturedOnly: boolean;
  amenities: string[];
  sortBy: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'most_viewed';
}

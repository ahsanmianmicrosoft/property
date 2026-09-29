import React, { useState, useMemo } from 'react';
import {
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Car,
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2,
  Share2,
  Heart,
  Scale,
  Phone,
  MessageSquare,
  ShieldCheck,
  Building2,
  Compass,
  Check
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';
import { PropertyCard } from '../components/PropertyCard';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { MortgageCalculator } from '../components/MortgageCalculator';
import { ViewingModal } from '../components/ViewingModal';
import { InquiryModal } from '../components/InquiryModal';
import { ImageViewerModal } from '../components/ImageViewerModal';

interface PropertyDetailsPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({ slug, navigate }) => {
  const {
    properties,
    agents,
    formatPrice,
    toggleFavorite,
    isFavorite,
    toggleCompare,
    isCompared,
    addToast
  } = useRealEstate();

  const property = useMemo(() => {
    return properties.find((p) => p.slug === slug || p.id === slug) || properties[0];
  }, [properties, slug]);

  const agent = useMemo(() => {
    return agents.find((a) => a.id === property?.agentId) || agents[0];
  }, [agents, property]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const favorite = isFavorite(property.id);
  const compared = isCompared(property.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    addToast('Property link copied to clipboard!', 'info');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const similarProperties = useMemo(() => {
    return properties
      .filter((p) => p.id !== property.id && p.location.city === property.location.city)
      .slice(0, 3);
  }, [properties, property]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Header & Action Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button onClick={() => navigate('/properties')} className="hover:text-slate-900">
              Properties
            </button>
            <span aria-hidden="true">/</span>
            <span>{property.location.city}</span>
            <span aria-hidden="true">/</span>
            <span className="text-amber-700 font-semibold">{property.location.area}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            {property.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{property.location.address}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Ref ID: #{property.id}</span>
          </div>
        </div>

        {/* Price & Action Group */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:text-right">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Asking Price</div>
            <div className="text-2xl sm:text-3xl font-display font-black text-slate-900 tabular-nums">
              {formatPrice(property.price)}
              {property.purpose === 'rent' && <span className="text-sm font-normal text-slate-500"> / month</span>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(property.id)}
              className={`p-2.5 rounded-xl border transition-colors shadow-xs ${
                favorite
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
              title="Save Property"
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => toggleCompare(property)}
              className={`p-2.5 rounded-xl border transition-colors shadow-xs ${
                compared
                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
              title="Compare Property"
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs transition-colors"
              title="Share Listing"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Showcase */}
      <div className="space-y-3">
        <div
          onClick={() => setIsViewerOpen(true)}
          className="relative aspect-16/9 md:aspect-21/9 rounded-2xl overflow-hidden bg-slate-950 cursor-pointer shadow-lg group"
        >
          <img
            src={property.images[activeImageIndex] || property.images[0]}
            alt={property.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
          />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-slate-950/85 text-white backdrop-blur-xs">
              For {property.purpose}
            </span>
            {property.isVerified && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-600/90 text-white flex items-center gap-1 backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Listing
              </span>
            )}
          </div>

          <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-xs px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Click to view all {property.images.length} photos</span>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {property.images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {property.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`w-24 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                  activeImageIndex === i ? 'border-amber-500 scale-102' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Details, Specs, Amenities, Location, Mortgage */}
        <div className="lg:col-span-2 space-y-10">
          {/* Key Specifications Grid */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Property Specifications
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-slate-400" /> Bedrooms
                </span>
                <p className="text-base font-bold text-slate-900 tabular-nums">
                  {property.bedrooms > 0 ? property.bedrooms : 'Studio / N/A'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Bath className="w-4 h-4 text-slate-400" /> Bathrooms
                </span>
                <p className="text-base font-bold text-slate-900 tabular-nums">
                  {property.bathrooms}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-slate-400" /> Area
                </span>
                <p className="text-base font-bold text-slate-900 tabular-nums">
                  {property.areaSqFt.toLocaleString()} sq ft
                  {property.areaMarla && <span className="text-xs font-normal text-slate-500"> ({property.areaMarla} Marla)</span>}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-slate-400" /> Parking Bays
                </span>
                <p className="text-base font-bold text-slate-900 tabular-nums">
                  {property.parkingSpaces} Vehicles
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-400" /> Furnishing
                </span>
                <p className="text-base font-bold text-slate-900 capitalize">
                  {property.furnishing.replace('_', ' ')}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" /> Property Type
                </span>
                <p className="text-base font-bold text-slate-900">
                  {property.propertyType}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" /> Year Built
                </span>
                <p className="text-base font-bold text-slate-900 tabular-nums">
                  {property.yearBuilt || '2024'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-slate-400" /> Floors
                </span>
                <p className="text-base font-bold text-slate-900 tabular-nums">
                  {property.floors || 1}
                </p>
              </div>
            </div>
          </div>

          {/* Description & Highlights */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Executive Overview
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {property.highlights && property.highlights.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Property Highlights
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {property.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Amenities Grid */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Features & Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {property.amenities.map((am, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">{am}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Surrounding Neighborhood */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Location & Nearby Landmarks
                </h2>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {property.location.area}, {property.location.city}
                </p>
              </div>
            </div>

            {property.location.nearbyPoints && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                {property.location.nearbyPoints.map((pt, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{pt.name}</p>
                      <p className="text-[11px] text-slate-500 capitalize">{pt.type}</p>
                    </div>
                    <span className="font-bold text-amber-700 tabular-nums">{pt.distance}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Mortgage Calculator */}
          <MortgageCalculator propertyPrice={property.price} />
        </div>

        {/* Right 1 Col: Agent Sticky Card & Tour CTA */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm sticky top-24">
            {/* Agent Info */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src={agent.avatar}
                alt={agent.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-100"
              />
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">{agent.name}</h3>
                <p className="text-xs text-amber-700 font-medium">{agent.designation}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">★ {agent.rating} ({agent.reviewsCount} reviews)</p>
              </div>
            </div>

            {/* Direct Contact Actions */}
            <div className="space-y-2.5">
              <button
                onClick={() => setIsViewingModalOpen(true)}
                className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Schedule Private Viewing Tour</span>
              </button>

              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>Send Direct Inquiry</span>
              </button>

              <WhatsAppButton
                property={property}
                agentPhone={agent.whatsapp}
                className="w-full py-2.5 rounded-xl text-xs"
              />

              <a
                href={`tel:${agent.phone}`}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 text-center"
              >
                <Phone className="w-4 h-4 text-slate-600" />
                <span>Call {agent.phone}</span>
              </a>
            </div>

            {/* Trust Assurance */}
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Ownership Documents</span>
              </div>
              <p className="text-slate-400 leading-normal">
                Direct owner communication with transparent title checks and zero commission surprises.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Nearby Market</span>
            <h2 className="text-2xl font-display font-bold text-slate-900 mt-1">
              Similar Properties in {property.location.city}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.map((simProp) => (
              <PropertyCard
                key={simProp.id}
                property={simProp}
                onSelect={(p) => navigate(`/properties/${p.slug}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ImageViewerModal
        images={property.images}
        currentIndex={activeImageIndex}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onSelectIndex={(idx) => setActiveImageIndex(idx)}
        title={property.title}
      />

      <ViewingModal
        property={property}
        agent={agent}
        isOpen={isViewingModalOpen}
        onClose={() => setIsViewingModalOpen(false)}
      />

      <InquiryModal
        property={property}
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
      />
    </div>
  );
};

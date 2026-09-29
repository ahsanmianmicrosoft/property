import React from 'react';
import {
  Bed,
  Bath,
  Maximize2,
  Heart,
  Scale,
  MapPin,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Property } from '../types';
import { useRealEstate } from '../context/RealEstateContext';

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
  viewMode?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  viewMode = 'grid'
}) => {
  const { formatPrice, toggleFavorite, isFavorite, toggleCompare, isCompared } = useRealEstate();

  const favorite = isFavorite(property.id);
  const compared = isCompared(property.id);

  const handleClick = () => {
    if (onSelect) onSelect(property);
  };

  const imageSrc = property.images && property.images.length > 0 ? property.images[0] : '';

  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col md:flex-row">
        {/* Media Container */}
        <div className="relative md:w-80 h-56 md:h-auto shrink-0 bg-slate-900 overflow-hidden cursor-pointer" onClick={handleClick}>
          <img
            src={imageSrc}
            alt={property.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
          {/* Subtle Purpose / Verified Indicator */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/90 text-white backdrop-blur-xs">
              For {property.purpose}
            </span>
            {property.isVerified && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-600/90 text-white flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
        </div>

        {/* Content Container */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Unboxed Metadata Header */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-medium text-amber-700">{property.propertyType}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {property.location.area}, {property.location.city}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property.id);
                  }}
                  className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${
                    favorite ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title={favorite ? 'Remove from favorites' : 'Save to favorites'}
                >
                  <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompare(property);
                  }}
                  className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${
                    compared ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title={compared ? 'Remove from comparison' : 'Compare property'}
                >
                  <Scale className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title */}
            <h3
              onClick={handleClick}
              className="font-display text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors cursor-pointer line-clamp-1"
            >
              {property.title}
            </h3>

            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
              {property.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 mt-3">
            {/* Price */}
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Price</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums font-display">
                {formatPrice(property.price)}
                {property.purpose === 'rent' && <span className="text-xs font-normal text-slate-500"> / month</span>}
              </p>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-4 text-xs text-slate-600">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1" title="Bedrooms">
                  <Bed className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold tabular-nums">{property.bedrooms}</span> Beds
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1" title="Bathrooms">
                  <Bath className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold tabular-nums">{property.bathrooms}</span> Baths
                </div>
              )}
              <div className="flex items-center gap-1" title="Total Area">
                <Maximize2 className="w-4 h-4 text-slate-400" />
                <span className="font-semibold tabular-nums">{property.areaSqFt.toLocaleString()}</span> sq ft
              </div>
            </div>

            {/* Action */}
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-900 hover:text-white hover:bg-slate-900 rounded-lg border border-slate-200 transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid View
  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Media Frame */}
        <div className="relative aspect-16/10 bg-slate-900 overflow-hidden cursor-pointer" onClick={handleClick}>
          <img
            src={imageSrc}
            alt={property.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />

          {/* Top Overlays */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 pointer-events-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/90 text-white backdrop-blur-xs">
                For {property.purpose}
              </span>
              {property.isVerified && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-600/90 text-white flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
            </div>

            {/* Quick Actions (Favorite & Compare) */}
            <div className="flex items-center gap-1 pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(property.id);
                }}
                className={`w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition-colors shadow-sm ${
                  favorite ? 'text-rose-500' : 'text-slate-600 hover:text-rose-500'
                }`}
                title={favorite ? 'Remove from favorites' : 'Save to favorites'}
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompare(property);
                }}
                className={`w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition-colors shadow-sm ${
                  compared ? 'text-amber-600 font-bold bg-amber-50' : 'text-slate-600 hover:text-amber-600'
                }`}
                title={compared ? 'Remove from comparison' : 'Compare property'}
              >
                <Scale className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Price Ribbon */}
          <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-xs px-2.5 py-1 rounded text-white font-display font-bold text-sm tabular-nums">
            {formatPrice(property.price)}
            {property.purpose === 'rent' && <span className="text-[10px] font-normal text-slate-300"> / mo</span>}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2">
          {/* Unboxed Metadata Row */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-amber-700">{property.propertyType}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate flex items-center gap-1 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {property.location.area}, {property.location.city}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={handleClick}
            className="font-display font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1 cursor-pointer"
          >
            {property.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {property.tagline || property.description}
          </p>
        </div>
      </div>

      {/* Footer Specs Row */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-3">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1" title="Bedrooms">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold tabular-nums">{property.bedrooms}</span> Beds
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1" title="Bathrooms">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold tabular-nums">{property.bathrooms}</span> Baths
            </div>
          )}
          <div className="flex items-center gap-1" title="Area">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold tabular-nums">{property.areaSqFt.toLocaleString()}</span> sq ft
          </div>
        </div>

        <button
          onClick={handleClick}
          className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Details</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Filter,
  Grid,
  List,
  MapPin,
  X,
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';
import { PropertyCard } from '../components/PropertyCard';
import { CITIES_AND_AREAS, PROPERTY_TYPES, MOCK_AMENITIES } from '../data/mockData';
import { Property } from '../types';

interface PropertiesPageProps {
  navigate: (path: string) => void;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({ navigate }) => {
  const { properties, filters, setFilters, resetFilters } = useRealEstate();

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedMapProperty, setSelectedMapProperty] = useState<Property | null>(null);

  // Filter properties client-side using context filters
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Status check: public only sees published, featured, sold, rented
      if (p.status !== 'published' && p.status !== 'featured' && p.status !== 'sold' && p.status !== 'rented') {
        return false;
      }

      if (filters.purpose !== 'all' && p.purpose !== filters.purpose) return false;
      if (filters.propertyType !== 'all' && p.propertyType.toLowerCase() !== filters.propertyType.toLowerCase()) return false;
      if (filters.city !== 'all' && p.location.city.toLowerCase() !== filters.city.toLowerCase()) return false;
      if (filters.area !== 'all' && !p.location.area.toLowerCase().includes(filters.area.toLowerCase())) return false;
      if (filters.minPrice > 0 && p.price < filters.minPrice) return false;
      if (filters.maxPrice > 0 && p.price > filters.maxPrice) return false;
      if (filters.isVerifiedOnly && !p.isVerified) return false;
      if (filters.isFeaturedOnly && !p.isFeatured) return false;

      if (filters.bedrooms !== 'all') {
        const beds = parseInt(filters.bedrooms, 10);
        if (filters.bedrooms.includes('+')) {
          if (p.bedrooms < beds) return false;
        } else {
          if (p.bedrooms !== beds) return false;
        }
      }

      if (filters.bathrooms !== 'all') {
        const baths = parseInt(filters.bathrooms, 10);
        if (p.bathrooms < baths) return false;
      }

      if (filters.furnishing !== 'all' && p.furnishing !== filters.furnishing) return false;

      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((am) => p.amenities.includes(am));
        if (!hasAllAmenities) return false;
      }

      if (filters.keyword) {
        const q = filters.keyword.toLowerCase();
        const matches =
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.area.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (filters.sortBy === 'most_viewed') return b.viewsCount - a.viewsCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [properties, filters]);

  const activeCityAreas = useMemo(() => {
    if (filters.city === 'all') return [];
    const found = CITIES_AND_AREAS.find((c) => c.city.toLowerCase() === filters.city.toLowerCase());
    return found ? found.areas : [];
  }, [filters.city]);

  const toggleAmenity = (name: string) => {
    setFilters((prev) => {
      const exists = prev.amenities.includes(name);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== name) : [...prev.amenities, name]
      };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            Property Listings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified luxury homes, apartments, commercial offices, and plots.
          </p>
        </div>

        {/* View Controls & Sort */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_asc">Sort: Price Low to High</option>
              <option value="price_desc">Sort: Price High to Low</option>
              <option value="most_viewed">Sort: Most Viewed</option>
              <option value="oldest">Sort: Oldest</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Grid / List / Map Segmented Control */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Map View"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5 space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-700" />
              <span className="font-display font-bold text-slate-900 text-sm">Refine Search</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Keyword */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Keyword</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => setFilters((p) => ({ ...p, keyword: e.target.value }))}
                placeholder="Search title, street..."
                className="w-full pl-8 pr-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Purpose</label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
              {(['all', 'sale', 'rent'] as const).map((pur) => (
                <button
                  key={pur}
                  onClick={() => setFilters((p) => ({ ...p, purpose: pur }))}
                  className={`py-1 rounded capitalize transition-colors ${
                    filters.purpose === pur ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                  }`}
                >
                  {pur}
                </button>
              ))}
            </div>
          </div>

          {/* City & Area */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">City</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value, area: 'all' }))}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50"
              >
                <option value="all">All Cities</option>
                {CITIES_AND_AREAS.map((c) => (
                  <option key={c.city} value={c.city}>
                    {c.city}
                  </option>
                ))}
              </select>
            </div>

            {activeCityAreas.length > 0 && (
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">Area / Society</label>
                <select
                  value={filters.area}
                  onChange={(e) => setFilters((p) => ({ ...p, area: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50"
                >
                  <option value="all">All Areas</option>
                  {activeCityAreas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Property Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">Property Type</label>
            <select
              value={filters.propertyType}
              onChange={(e) => setFilters((p) => ({ ...p, propertyType: e.target.value }))}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50"
            >
              <option value="all">All Property Types</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">Bedrooms</label>
            <div className="flex items-center gap-1">
              {['all', '1', '2', '3', '4', '5+'].map((bed) => (
                <button
                  key={bed}
                  onClick={() => setFilters((p) => ({ ...p, bedrooms: bed }))}
                  className={`flex-1 py-1 text-xs rounded border text-center transition-colors ${
                    filters.bedrooms === bed
                      ? 'bg-slate-900 border-slate-900 text-white font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {bed}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">Price Range (PKR)</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice || ''}
                onChange={(e) => setFilters((p) => ({ ...p, minPrice: Number(e.target.value) || 0 }))}
                className="w-full p-1.5 border border-slate-200 rounded text-xs"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice || ''}
                onChange={(e) => setFilters((p) => ({ ...p, maxPrice: Number(e.target.value) || 0 }))}
                className="w-full p-1.5 border border-slate-200 rounded text-xs"
              />
            </div>
          </div>

          {/* Verified & Featured Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isVerifiedOnly}
                onChange={(e) => setFilters((p) => ({ ...p, isVerifiedOnly: e.target.checked }))}
                className="rounded text-amber-500 focus:ring-amber-400"
              />
              <span className="text-slate-700 font-medium">Verified Listings Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isFeaturedOnly}
                onChange={(e) => setFilters((p) => ({ ...p, isFeaturedOnly: e.target.checked }))}
                className="rounded text-amber-500 focus:ring-amber-400"
              />
              <span className="text-slate-700 font-medium">Featured Properties Only</span>
            </label>
          </div>

          {/* Amenities Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">Key Amenities</label>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 text-xs">
              {MOCK_AMENITIES.slice(0, 8).map((am) => (
                <label key={am.id} className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(am.name)}
                    onChange={() => toggleAmenity(am.name)}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>{am.name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Listings Content */}
        <main className="lg:col-span-3 space-y-6">
          {/* Active Summary Bar */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tabular-nums">
                {filteredProperties.length}
              </span>
              <span>properties found</span>
              {filters.city !== 'all' && (
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">
                  City: {filters.city}
                </span>
              )}
              {filters.purpose !== 'all' && (
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 capitalize">
                  For {filters.purpose}
                </span>
              )}
            </div>

            {(filters.city !== 'all' || filters.purpose !== 'all' || filters.propertyType !== 'all' || filters.keyword) && (
              <button
                onClick={resetFilters}
                className="text-amber-600 font-semibold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Map View Mode */}
          {viewMode === 'map' && (
            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg relative min-h-[460px] flex flex-col md:flex-row">
              {/* Map Illustration with Interactive Pins */}
              <div className="relative flex-1 bg-slate-950 p-6 flex items-center justify-center min-h-[300px]">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 800 500" fill="none">
                    <line x1="100" y1="0" x2="100" y2="500" stroke="#fff" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="300" y1="0" x2="300" y2="500" stroke="#fff" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="500" y1="0" x2="500" y2="500" stroke="#fff" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="700" y1="0" x2="700" y2="500" stroke="#fff" strokeWidth="1" strokeDasharray="5,5" />
                    <path d="M50 150 Q 250 80 450 200 T 750 350" stroke="#38BDF8" strokeWidth="4" />
                    <path d="M100 450 Q 400 420 500 200 T 700 80" stroke="#F59E0B" strokeWidth="3" />
                  </svg>
                </div>

                <div className="relative z-10 w-full h-full flex flex-wrap gap-4 items-center justify-center p-4">
                  {filteredProperties.slice(0, 8).map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedMapProperty(p)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5 ${
                        selectedMapProperty?.id === p.id
                          ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-110'
                          : 'bg-slate-800 text-white border border-slate-700'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{p.location.area.split(' ')[0]} · #{idx + 1}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Pin Details Sidebar */}
              {selectedMapProperty ? (
                <div className="w-full md:w-80 bg-white p-5 space-y-3 shrink-0 flex flex-col justify-between">
                  <div className="space-y-2">
                    <img
                      src={selectedMapProperty.images[0]}
                      alt={selectedMapProperty.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover rounded-lg"
                    />
                    <div className="text-[11px] font-semibold text-amber-700">
                      {selectedMapProperty.propertyType} · {selectedMapProperty.location.city}
                    </div>
                    <h4 className="font-display font-bold text-slate-900 text-sm line-clamp-1">
                      {selectedMapProperty.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {selectedMapProperty.location.address}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="font-display font-bold text-sm text-slate-900">
                      {selectedMapProperty.bedrooms} Beds · {selectedMapProperty.areaSqFt} sq ft
                    </div>
                    <button
                      onClick={() => navigate(`/properties/${selectedMapProperty.slug}`)}
                      className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg"
                    >
                      View
                    </button>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex w-80 bg-slate-800/50 p-6 items-center justify-center text-center text-xs text-slate-400">
                  Click any location marker on the map to preview property specifications.
                </div>
              )}
            </div>
          )}

          {/* Properties Grid or List View */}
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-base">No Matching Properties Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria, clearing specific filters, or expanding your price and area bounds.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'list'
                  ? 'space-y-4'
                  : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              }
            >
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  viewMode={viewMode === 'list' ? 'list' : 'grid'}
                  onSelect={(p) => navigate(`/properties/${p.slug}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-display font-bold text-lg text-slate-900">Search Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* City */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">City</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              >
                <option value="all">All Cities</option>
                {CITIES_AND_AREAS.map((c) => (
                  <option key={c.city} value={c.city}>
                    {c.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Purpose */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Purpose</label>
              <div className="grid grid-cols-3 gap-2">
                {(['all', 'sale', 'rent'] as const).map((pur) => (
                  <button
                    key={pur}
                    onClick={() => setFilters((p) => ({ ...p, purpose: pur }))}
                    className={`py-2 text-xs rounded-lg capitalize border font-medium ${
                      filters.purpose === pur ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    {pur}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 rounded-xl text-xs"
            >
              Show {filteredProperties.length} Properties
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

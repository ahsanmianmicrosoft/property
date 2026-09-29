import React from 'react';
import { Scale, X, ArrowRight, Check, Minus, PlusCircle } from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';
import { MOCK_AMENITIES } from '../data/mockData';

interface ComparePageProps {
  navigate: (path: string) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ navigate }) => {
  const { comparedProperties, toggleCompare, clearCompare, formatPrice } = useRealEstate();

  if (comparedProperties.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Scale className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-900">
          No Properties Selected for Comparison
        </h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Add up to 4 properties from search results or listing cards to evaluate specifications, pricing, and amenities side-by-side.
        </p>
        <button
          onClick={() => navigate('/properties')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          Explore Properties
        </button>
      </div>
    );
  }

  const specRows = [
    {
      label: 'Price',
      render: (p: any) => (
        <span className="font-display font-bold text-slate-900 text-sm tabular-nums">
          {formatPrice(p.price)}
          {p.purpose === 'rent' && <span className="text-[10px] font-normal text-slate-500"> / mo</span>}
        </span>
      )
    },
    {
      label: 'Price / Sq Ft',
      render: (p: any) => (
        <span className="tabular-nums font-medium text-slate-700">
          {p.areaSqFt > 0 ? formatPrice(Math.round(p.price / p.areaSqFt)) : 'N/A'}
        </span>
      )
    },
    {
      label: 'Purpose',
      render: (p: any) => <span className="uppercase text-slate-800 font-semibold">{p.purpose}</span>
    },
    {
      label: 'Property Type',
      render: (p: any) => <span className="font-medium text-slate-800">{p.propertyType}</span>
    },
    {
      label: 'City & Location',
      render: (p: any) => (
        <span className="text-slate-800">
          {p.location.area}, {p.location.city}
        </span>
      )
    },
    {
      label: 'Area (Sq Ft)',
      render: (p: any) => (
        <span className="tabular-nums font-semibold text-slate-900">
          {p.areaSqFt.toLocaleString()} sq ft
          {p.areaMarla && <span className="text-slate-400 block text-[11px]">({p.areaMarla} Marla)</span>}
        </span>
      )
    },
    {
      label: 'Bedrooms',
      render: (p: any) => <span className="tabular-nums font-semibold text-slate-900">{p.bedrooms || 'N/A'}</span>
    },
    {
      label: 'Bathrooms',
      render: (p: any) => <span className="tabular-nums font-semibold text-slate-900">{p.bathrooms || 'N/A'}</span>
    },
    {
      label: 'Furnishing',
      render: (p: any) => <span className="capitalize text-slate-800">{p.furnishing.replace('_', ' ')}</span>
    },
    {
      label: 'Parking Bays',
      render: (p: any) => <span className="tabular-nums text-slate-800">{p.parkingSpaces} Vehicles</span>
    },
    {
      label: 'Year Built',
      render: (p: any) => <span className="tabular-nums text-slate-800">{p.yearBuilt || '2024'}</span>
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            Property Comparison Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluating {comparedProperties.length} of 4 selected listings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/properties')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Add More</span>
          </button>
          <button
            onClick={clearCompare}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="p-4 w-48 font-display font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Property
              </th>
              {comparedProperties.map((p) => (
                <th key={p.id} className="p-4 min-w-[220px] align-top">
                  <div className="relative space-y-2">
                    <button
                      onClick={() => toggleCompare(p)}
                      className="absolute -top-1 -right-1 p-1 bg-slate-200 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-colors"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <h3 className="font-display font-bold text-slate-900 text-sm line-clamp-1">
                      {p.title}
                    </h3>
                    <button
                      onClick={() => navigate(`/properties/${p.slug}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700"
                    >
                      <span>View Full Listing</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {specRows.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                <td className="p-4 font-semibold text-slate-600 border-r border-slate-100">
                  {row.label}
                </td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 border-r border-slate-100 last:border-r-0">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}

            {/* Amenities Comparison Section */}
            <tr className="bg-slate-100/70 font-display font-bold text-slate-800">
              <td colSpan={comparedProperties.length + 1} className="p-3 uppercase text-[10px] tracking-wider text-slate-500">
                Amenity Checklist
              </td>
            </tr>

            {MOCK_AMENITIES.slice(0, 10).map((am) => (
              <tr key={am.id} className="hover:bg-slate-50/50">
                <td className="p-3 text-slate-600 border-r border-slate-100 font-medium">
                  {am.name}
                </td>
                {comparedProperties.map((p) => {
                  const has = p.amenities.includes(am.name);
                  return (
                    <td key={p.id} className="p-3 text-center border-r border-slate-100 last:border-r-0">
                      {has ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

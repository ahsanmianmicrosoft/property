import React from 'react';
import { Heart, Search, ArrowRight } from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';
import { PropertyCard } from '../components/PropertyCard';

interface FavoritesPageProps {
  navigate: (path: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ navigate }) => {
  const { favorites, properties } = useRealEstate();

  const savedProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-bold text-slate-900">
          Saved Properties
        </h1>
        <p className="text-xs text-slate-500">
          You have {savedProperties.length} properties saved to your shortlist.
        </p>
      </div>

      {savedProperties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-slate-900 text-lg">No Saved Properties Yet</h3>
          <p className="text-xs text-slate-500">
            Click the heart icon on any property listing to save it to your personal shortlist for quick access and comparison.
          </p>
          <button
            onClick={() => navigate('/properties')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
          >
            Explore Verified Properties
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onSelect={(p) => navigate(`/properties/${p.slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

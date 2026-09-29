import React from 'react';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface CompareDrawerProps {
  navigate: (path: string) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({ navigate }) => {
  const { comparedProperties, toggleCompare, clearCompare } = useRealEstate();

  if (comparedProperties.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-3 flex items-center gap-4 max-w-xl w-[92vw] sm:w-auto animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-2 pl-2">
        <Scale className="w-5 h-5 text-amber-400 shrink-0" />
        <span className="text-xs font-semibold whitespace-nowrap">
          Compare ({comparedProperties.length}/4)
        </span>
      </div>

      {/* Item Previews */}
      <div className="flex items-center gap-2 overflow-x-auto py-0.5">
        {comparedProperties.map((p) => (
          <div key={p.id} className="relative group shrink-0">
            <img
              src={p.images[0]}
              alt={p.title}
              referrerPolicy="no-referrer"
              className="w-10 h-10 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={() => toggleCompare(p)}
              className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 rounded-full text-white flex items-center justify-center text-[10px] opacity-90 hover:opacity-100"
              title="Remove"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
        <button
          onClick={clearCompare}
          className="text-[11px] text-slate-400 hover:text-white px-2 py-1"
        >
          Clear
        </button>
        <button
          onClick={() => navigate('/compare')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm whitespace-nowrap transition-colors"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

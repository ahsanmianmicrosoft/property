import React from 'react';
import { Building2, MapPin, Calendar, ArrowRight, Download, CheckCircle2 } from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface ProjectsPageProps {
  navigate: (path: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ navigate }) => {
  const { projects, formatPrice } = useRealEstate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">New Developments</span>
        <h1 className="text-3xl font-display font-bold text-slate-900">
          Prime Real Estate Projects & Housing Societies
        </h1>
        <p className="text-xs text-slate-500 max-w-2xl">
          Discover vetted master-planned residential towers, commercial plazas, and gated suburban communities with convenient milestone installment plans.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((proj) => (
          <div
            key={proj.id}
            onClick={() => navigate(`/projects/${proj.slug}`)}
            className="group bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all overflow-hidden cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
                <img
                  src={proj.images[0]}
                  alt={proj.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-xs text-amber-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                  {proj.status.replace('_', ' ')}
                </div>
                <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-xs px-3.5 py-1.5 rounded text-white text-xs font-display font-bold tabular-nums">
                  Starting {formatPrice(proj.startingPrice)}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{proj.developer}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {proj.location.city}, {proj.location.area}
                  </span>
                </div>

                <h3 className="font-display font-bold text-slate-900 text-xl group-hover:text-amber-600 transition-colors">
                  {proj.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-400">Total Units</p>
                    <p className="font-bold text-slate-900 tabular-nums">{proj.totalUnits}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-400">Available</p>
                    <p className="font-bold text-amber-600 tabular-nums">{proj.availableUnits}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-400">Completion</p>
                    <p className="font-bold text-slate-900">{proj.completionDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-900">
              <span>View Floor Plans & Available Inventory</span>
              <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

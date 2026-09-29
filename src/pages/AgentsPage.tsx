import React from 'react';
import { Phone, Mail, MessageSquare, Star, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface AgentsPageProps {
  navigate: (path: string) => void;
}

export const AgentsPage: React.FC<AgentsPageProps> = ({ navigate }) => {
  const { agents } = useRealEstate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Advisory Roster</span>
        <h1 className="text-3xl font-display font-bold text-slate-900">
          Verified Real Estate Agents & Property Directors
        </h1>
        <p className="text-xs text-slate-500 max-w-2xl">
          Connect directly with licensed real estate specialists with proven transaction records in high-value residential and corporate corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 hover:shadow-lg transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shrink-0"
                />
                <div>
                  <h3
                    onClick={() => navigate(`/agents/${agent.slug}`)}
                    className="font-display font-bold text-slate-900 text-base hover:text-amber-600 transition-colors cursor-pointer"
                  >
                    {agent.name}
                  </h3>
                  <p className="text-xs text-amber-700 font-medium">{agent.designation}</p>
                  <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-slate-800 tabular-nums">{agent.rating}</span>
                    <span className="text-slate-400">({agent.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {agent.bio}
              </p>

              {/* Specializations */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Specialties</p>
                <div className="flex flex-wrap gap-1">
                  {agent.specialization.map((spec, i) => (
                    <span key={i} className="text-slate-700 font-medium bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Areas Served */}
              <div className="space-y-1 text-xs">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Territories</p>
                <div className="flex items-center gap-1 text-slate-600 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{agent.areasServed.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-800 tabular-nums">
                {agent.activeListingsCount} Active Listings
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${agent.phone}`}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors"
                  title="Call"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`https://wa.me/${agent.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-xs transition-colors"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => navigate(`/agents/${agent.slug}`)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

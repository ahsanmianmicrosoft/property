import React, { useMemo } from 'react';
import { Phone, Mail, MessageSquare, Star, MapPin, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';
import { PropertyCard } from '../components/PropertyCard';

interface AgentDetailsPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const AgentDetailsPage: React.FC<AgentDetailsPageProps> = ({ slug, navigate }) => {
  const { agents, properties } = useRealEstate();

  const agent = useMemo(() => {
    return agents.find((a) => a.slug === slug || a.id === slug) || agents[0];
  }, [agents, slug]);

  const agentProperties = useMemo(() => {
    return properties.filter((p) => p.agentId === agent.id);
  }, [properties, agent]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Agent Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={agent.avatar}
            alt={agent.name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-100 shadow-sm shrink-0"
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">{agent.name}</h1>
              <span className="p-1 rounded-full bg-emerald-100 text-emerald-600" title="Verified License">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <p className="text-sm font-semibold text-amber-700">{agent.designation}</p>
            <p className="text-xs text-slate-500">
              {agent.experienceYears} Years Market Experience · ★ {agent.rating} ({agent.reviewsCount} verified reviews)
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Areas: {agent.areasServed.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`tel:${agent.phone}`}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call Now</span>
          </a>
          <a
            href={`https://wa.me/${agent.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>WhatsApp Agent</span>
          </a>
          <a
            href={`mailto:${agent.email}`}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </a>
        </div>
      </div>

      {/* Bio & Details */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">About {agent.name}</h2>
        <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
          {agent.bio}
        </p>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-semibold text-slate-900 block mb-1">Asset Specialization:</span>
            <div className="flex flex-wrap gap-1.5">
              {agent.specialization.map((s, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="font-semibold text-slate-900 block mb-1">Languages:</span>
            <span className="text-slate-600">English, Urdu, Punjabi</span>
          </div>
        </div>
      </div>

      {/* Agent's Assigned Properties */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Active Inventory</span>
            <h2 className="text-2xl font-display font-bold text-slate-900 mt-1">
              Properties Represented by {agent.name}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 tabular-nums">
            {agentProperties.length} Listings
          </span>
        </div>

        {agentProperties.length === 0 ? (
          <p className="text-xs text-slate-500">No active public listings currently assigned.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agentProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={(p) => navigate(`/properties/${p.slug}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

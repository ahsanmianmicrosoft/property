import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Download,
  Phone,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface ProjectDetailsPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({ slug, navigate }) => {
  const { projects, formatPrice, addToast } = useRealEstate();

  const project = projects.find((p) => p.slug === slug || p.id === slug) || projects[0];
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadBrochure = () => {
    setDownloaded(true);
    addToast(`Downloading ${project.name} Official Sales Brochure (PDF)`, 'success');
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb & Header */}
      <div className="space-y-3 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('/projects')} className="hover:text-slate-900">
            Projects
          </button>
          <span aria-hidden="true">/</span>
          <span>{project.location.city}</span>
          <span aria-hidden="true">/</span>
          <span className="text-amber-700 font-semibold">{project.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              {project.name}
            </h1>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
              <span className="font-semibold text-slate-900">Developer: {project.developer}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {project.location.address}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadBrochure}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-semibold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              {downloaded ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 text-slate-500" />}
              <span>{downloaded ? 'Brochure Downloaded' : 'Download Brochure PDF'}</span>
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
            >
              Contact Sales Desk
            </button>
          </div>
        </div>
      </div>

      {/* Main Banner Media */}
      <div className="relative aspect-16/9 md:aspect-21/9 rounded-2xl overflow-hidden bg-slate-950 shadow-lg">
        <img
          src={project.images[0]}
          alt={project.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-xs text-amber-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg">
          Status: {project.status.replace('_', ' ')}
        </div>
        <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-xs px-4 py-2 rounded-xl text-white font-display font-bold text-sm">
          Starting from {formatPrice(project.startingPrice)}
        </div>
      </div>

      {/* Project Specs Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completion Target</p>
          <p className="text-base font-bold text-slate-900 mt-1">{project.completionDate}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Development Area</p>
          <p className="text-base font-bold text-slate-900 mt-1">{project.totalArea || 'N/A'}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Inventory</p>
          <p className="text-base font-bold text-slate-900 mt-1 tabular-nums">{project.totalUnits} Units</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Units Available</p>
          <p className="text-base font-bold text-emerald-600 mt-1 tabular-nums">{project.availableUnits} Units</p>
        </div>
      </div>

      {/* Overview & Available Unit Configurations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Development Overview</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Unit Inventory Table */}
          {project.unitsAvailableByType && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h3 className="font-display font-bold text-slate-900 text-sm">Available Unit Floorplans & Pricing</h3>
                <p className="text-xs text-slate-500">Flexible 2-year and 3-year installment plans available</p>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {project.unitsAvailableByType.map((unit, i) => (
                  <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{unit.type}</h4>
                      <p className="text-slate-500 mt-0.5">{unit.beds} Bedrooms · {unit.size}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Starting Price</span>
                        <span className="font-display font-bold text-slate-900 text-sm tabular-nums">
                          {formatPrice(unit.price)}
                        </span>
                      </div>
                      <button
                        onClick={() => navigate('/contact')}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg"
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sales Office Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs sticky top-24">
            <h3 className="font-display font-bold text-slate-900 text-base">Project Sales Office</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Book a site tour or schedule a meeting with the official project director to review NOC approvals and master floor blueprints.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => navigate('/contact')}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                Inquire for Site Tour
              </button>
              <a
                href="https://wa.me/923214455882"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat with Project Desk</span>
              </a>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>CDA / LDA Regulated Development</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Escrow Bank Account Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

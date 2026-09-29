import React from 'react';
import { Building2, Phone, Mail, MapPin } from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings } = useRealEstate();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                PrimeHaven
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Pakistan & International premier real estate platform offering verified properties, high-yield commercial developments, and end-to-end property management.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.supportPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Discover
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/properties?purpose=sale')}
                  className="hover:text-white transition-colors"
                >
                  Properties for Sale
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/properties?purpose=rent')}
                  className="hover:text-white transition-colors"
                >
                  Properties for Rent
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/projects')}
                  className="hover:text-white transition-colors"
                >
                  New Developments
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/agents')}
                  className="hover:text-white transition-colors"
                >
                  Verified Real Estate Agents
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/compare')}
                  className="hover:text-white transition-colors"
                >
                  Property Comparison Tool
                </button>
              </li>
            </ul>
          </div>

          {/* Prime Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Prime Locations
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/properties?city=Lahore&area=DHA%20Phase%206')}
                  className="hover:text-white transition-colors"
                >
                  DHA Phase 6, Lahore
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/properties?city=Lahore&area=Gulberg')}
                  className="hover:text-white transition-colors"
                >
                  Gulberg III, Lahore
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/properties?city=Islamabad&area=Sector%20E-7')}
                  className="hover:text-white transition-colors"
                >
                  Sector E-7, Islamabad
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/properties?city=Islamabad&area=Blue%20Area')}
                  className="hover:text-white transition-colors"
                >
                  Blue Area, Islamabad
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/properties?city=Karachi&area=Clifton')}
                  className="hover:text-white transition-colors"
                >
                  Clifton, Karachi
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Operations */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors"
                >
                  About PrimeHaven
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/services')}
                  className="hover:text-white transition-colors"
                >
                  Real Estate Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/blog')}
                  className="hover:text-white transition-colors"
                >
                  Market Insights & Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="hover:text-white transition-colors text-amber-400 font-medium"
                >
                  Admin CRM Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/post-property')}
                  className="hover:text-white transition-colors"
                >
                  Submit Listing
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} PrimeHaven Real Estate Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
              Terms of Service
            </button>
            <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
              Regulatory Compliance
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

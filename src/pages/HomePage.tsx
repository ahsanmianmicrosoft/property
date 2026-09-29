import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Building,
  Building2,
  CheckCircle,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  Phone,
  MessageSquare,
  Users,
  Star,
  FileText,
  BadgeCheck,
  Mail,
  Send,
  ChevronRight,
  Globe,
  Briefcase
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';
import { PropertyCard } from '../components/PropertyCard';
import { CITIES_AND_AREAS, PROPERTY_TYPES } from '../data/mockData';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const {
    properties,
    featuredProperties,
    projects,
    agents,
    blogPosts,
    formatPrice,
    setFilters,
    createLead,
    addToast
  } = useRealEstate();

  // Search Bar State
  const [purpose, setPurpose] = useState<'sale' | 'rent'>('sale');
  const [city, setCity] = useState<string>('Lahore');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [keyword, setKeyword] = useState<string>('');

  // Quick Advisory Consultation Form State
  const [consultName, setConsultName] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [consultInterest, setConsultInterest] = useState('Buying Luxury Villa / Home');
  const [consultCity, setConsultCity] = useState('Lahore');
  const [consultMessage, setConsultMessage] = useState('');
  const [consultSubmitting, setConsultSubmitting] = useState(false);
  const [consultSuccess, setConsultSuccess] = useState(false);

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsultSubmitting(true);
    await createLead({
      name: consultName,
      phone: consultPhone,
      email: consultEmail,
      preferredLocation: consultCity,
      notes: `Interest: ${consultInterest}. Notes: ${consultMessage}`,
      source: 'website',
      status: 'new'
    });
    setConsultSubmitting(false);
    setConsultSuccess(true);
    addToast('Consultation request received! A senior advisor will contact you within 2 hours.', 'success');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      purpose,
      city,
      propertyType,
      keyword
    }));
    navigate('/properties');
  };

  const handleTypeClick = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      propertyType: type,
      city: 'all'
    }));
    navigate('/properties');
  };

  const marketStats = [
    { label: 'Verified Listings', value: '1,450+', sub: 'Direct title verified' },
    { label: 'Active Buyers & Tenants', value: '18,200+', sub: 'Monthly active inquiries' },
    { label: 'Gross Volume Traded', value: 'Rs. 4.2 Billion', sub: 'In closed transactions' },
    { label: 'Licensed Advisors', value: '45+', sub: 'Senior property directors' }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] bg-slate-950 text-white flex items-center justify-center overflow-hidden">
        {/* Architectural Twilight Canvas */}
        <div className="absolute inset-0 z-0 opacity-40">
          <svg className="w-full h-full object-cover" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="1440" height="800" fill="#090D16" />
            <circle cx="900" cy="200" r="450" fill="#F59E0B" fillOpacity="0.08" />
            <path d="M0 650L240 580L480 620L720 540L960 610L1200 520L1440 600V800H0V650Z" fill="#0B132B" opacity="0.8" />
            <polygon points="500,200 780,200 860,700 420,700" fill="#1E293B" opacity="0.4" stroke="#F59E0B" strokeWidth="1" />
            <polygon points="820,120 1100,120 1160,700 760,700" fill="#0F172A" opacity="0.5" stroke="#38BDF8" strokeWidth="1" />
            <line x1="0" y1="700" x2="1440" y2="700" stroke="#F59E0B" strokeOpacity="0.3" strokeWidth="2" />
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center space-y-8">
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pakistan & GCC Premier Property Exchange</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-tight text-balance">
              Find Your Perfect Property with Verified Title Confidence
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore bespoke residential estates, luxury penthouses, and premier commercial towers across Lahore, Islamabad, Karachi, and Dubai.
            </p>
          </div>

          {/* Search Box Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl max-w-4xl mx-auto text-slate-900 border border-slate-100">
            {/* Purpose Tabs */}
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setPurpose('sale')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  purpose === 'sale'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Buy Property
              </button>
              <button
                type="button"
                onClick={() => setPurpose('rent')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  purpose === 'rent'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Rent Property
              </button>
            </div>

            {/* Inputs Grid */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 text-xs text-left">
              {/* City */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Location / City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs font-medium"
                  >
                    <option value="all">All Locations</option>
                    {CITIES_AND_AREAS.map((c) => (
                      <option key={c.city} value={c.city}>
                        {c.city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Property Type
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs font-medium"
                  >
                    <option value="all">All Types</option>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Keyword / Area */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Keywords / Society
                </label>
                <input
                  type="text"
                  placeholder="e.g. DHA Phase 6, Sector J"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs font-medium"
                />
              </div>

              {/* Search Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Market Statistics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {marketStats.map((stat, i) => (
            <div key={i} className="text-left space-y-0.5">
              <div className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-slate-700">{stat.label}</div>
              <div className="text-[11px] text-slate-400">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Curated Portfolio</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
              Featured Luxury Listings
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Hand-picked estates and commercial assets with full title deed clearance.
            </p>
          </div>
          <button
            onClick={() => navigate('/properties')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-amber-600 transition-colors"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.slice(0, 6).map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={(p) => navigate(`/properties/${p.slug}`)}
            />
          ))}
        </div>
      </section>

      {/* About PrimeHaven & Institutional Credentials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>About PrimeHaven · Established 2011</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight text-white leading-tight">
                Pakistan’s Most Rigorous Real Estate Advisory & Property Exchange
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Founded with an unwavering commitment to transparent transactions, legal title sanctity, and zero-compromise due diligence. PrimeHaven serves local families, expatriates, and institutional funds acquiring or selling premier assets in Lahore, Islamabad, Karachi, and Dubai.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                  <p className="text-xl font-display font-extrabold text-amber-400">15+ Years</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Market Leadership</p>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                  <p className="text-xl font-display font-extrabold text-white">Rs. 45+ Bn</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Volume Transacted</p>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 col-span-2 sm:col-span-1">
                  <p className="text-xl font-display font-extrabold text-emerald-400">100%</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Title Verified Deeds</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => navigate('/about')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-2"
                >
                  <span>Company Story & Credentials</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate('/services')}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
                >
                  Our Professional Services
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 space-y-4">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Regulatory Accreditations
                </h3>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>DHA Registered Advisory:</strong> Licensed under REA-PB-8841 for premier transfer & mutation proceedings.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>CDA Approved Agency:</strong> Authorized broker for Islamabad Sectors E-7, F-6, F-7, and Blue Area.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>SECP Incorporated:</strong> Corporate governance conforming to Securities & Exchange Commission standards.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>FBR Tax Compliant:</strong> Certified advisory on Section 236C, 236K, and Capital Value Tax (CVT).</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by Property Type */}
      <section className="bg-slate-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Asset Classes</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
              Explore by Property Type
            </h2>
            <p className="text-xs text-slate-500">
              Tailored categories catering to end-users, corporate headquarters, and high-yield investors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {PROPERTY_TYPES.map((type) => {
              const count = properties.filter((p) => p.propertyType.toLowerCase() === type.toLowerCase()).length;
              return (
                <button
                  key={type}
                  onClick={() => handleTypeClick(type)}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-50 group-hover:bg-amber-500 text-amber-600 group-hover:text-slate-950 flex items-center justify-center transition-colors mb-3">
                    <Building className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                    {type}
                  </h3>
                  <p className="text-xs text-slate-500 tabular-nums mt-0.5">
                    {count} Available {count === 1 ? 'Listing' : 'Listings'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real Estate Projects Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Master Developments</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
              Prime Real Estate Projects
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Integrated housing societies and mixed-use luxury residential towers with installment plans.
            </p>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-amber-600 transition-colors"
          >
            <span>Explore All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => navigate(`/projects/${proj.slug}`)}
              className="group bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
                <img
                  src={proj.images[0]}
                  alt={proj.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-amber-400 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  {proj.status.replace('_', ' ')}
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-950/80 px-3 py-1 rounded text-white text-xs font-display font-bold">
                  Starts from {formatPrice(proj.startingPrice)}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{proj.developer}</span>
                  <span aria-hidden="true">·</span>
                  <span>{proj.location.city}</span>
                </div>

                <h3 className="font-display font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">
                  {proj.name}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="tabular-nums font-semibold">{proj.availableUnits} of {proj.totalUnits} Units Available</span>
                  <span className="text-amber-600 font-semibold flex items-center gap-1">
                    Details & Floor Plans <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Core Real Estate Services */}
      <section className="bg-slate-900/5 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">End-to-End Capabilities</span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
                Our Professional Real Estate Services
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Institutional precision across acquisitions, sales, commercial leasing, and title due diligence.
              </p>
            </div>
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-sm">Luxury Residential Sales</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Turnkey brokerage for signature designer villas, bespoke mansions, and serviced penthouses in premier gated communities.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-sm">Commercial Corporate Leasing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Corporate headquarters, Grade-A IT office floors, and high-visibility retail outlets matching multinational safety guidelines.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-sm">Title Due Diligence & Intiqal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thorough verification of mutation records, non-encumbrance certificates, society transfer approvals, and tax clearances.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-sm">Overseas Pakistani Advisory</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Remote property inspections, power of attorney facilitation, Roshan Digital Account repatriation, and asset management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose PrimeHaven (Bento Value Proposition) */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Institutional Standard</span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white">
              Why Investors & Homeowners Choose PrimeHaven
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Eliminating the uncertainty of real estate transactions through legal rigor and transparent execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-base">Verified Title Deeds</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every property undergoes exhaustive NOC verification with DHA, CDA, and local revenue bodies before public listing.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-base">Predictable ROI & Rental Yields</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Institutional market data providing real-time rental valuation comps, occupancy rates, and capital growth metrics.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-base">Dedicated Senior Advisory</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct access to seasoned property directors who specialize exclusively in specific sectors and micro-markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Agents Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Expert Guidance</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
              Connect with Senior Advisors
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Certified real estate professionals ready to assist with acquisition, sales, and portfolio structuring.
            </p>
          </div>
          <button
            onClick={() => navigate('/agents')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-amber-600 transition-colors"
          >
            <span>View All Advisors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
                />
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-sm hover:text-amber-600 cursor-pointer" onClick={() => navigate(`/agents/${agent.slug}`)}>
                    {agent.name}
                  </h3>
                  <p className="text-xs text-amber-700 font-medium">{agent.designation}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{agent.experienceYears} Years Experience · ★ {agent.rating}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {agent.bio}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 tabular-nums">
                  {agent.activeListingsCount} Active Listings
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${agent.phone}`}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/${agent.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Client Reviews & Testimonials */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Client Trust & Track Record</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
              Trusted by 18,000+ Resident & Overseas Clients
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Read authentic feedback from families and institutional buyers who executed their transactions through PrimeHaven.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "As an overseas Pakistani living in London for 18 years, buying a home in DHA Phase 6 felt daunting. PrimeHaven verified the title documents directly with the DHA office before I sent a single pound. Absolute transparency and integrity."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  AR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Dr. Asad Rehman</h4>
                  <p className="text-[11px] text-slate-500">London, United Kingdom · DHA Phase 6 Villa</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "We needed a 6,000 sq ft corporate office floor in Blue Area Islamabad for our software consultancy. Ayesha Khan and the PrimeHaven advisory team secured the property and completed commercial lease vetting in 8 working days."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  KS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Khawaja Salman</h4>
                  <p className="text-[11px] text-slate-500">Managing Partner, TechHub · Islamabad</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "I invested in a luxury skyline penthouse in Gulberg through PrimeHaven. Their rental management division placed a multinational corporate executive tenant delivering a solid 9.5% annual net rental yield."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  AT
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Mrs. Amina Tariq</h4>
                  <p className="text-[11px] text-slate-500">Dubai, UAE Expat · Gulberg Penthouse</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Branch Offices & Centers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Nationwide & Global Footprint</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
              Visit Our Regional Advisory Offices
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Walk-in consultation centers with dedicated property advisors and legal due diligence desks.
            </p>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-amber-600 transition-colors"
          >
            <span>Full Contact Details & Maps</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
              Corporate Headquarters
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Lahore Main Office</h3>
            <p className="text-xs text-slate-500">
              Prime Tower, Level 4, Main Boulevard, Gulberg III, Lahore, Pakistan
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <p className="font-medium">+92 42 3589 1200</p>
              <p className="text-slate-400">lahore@primehaven.estate</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
              Capital Liaison Office
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Islamabad Office</h3>
            <p className="text-xs text-slate-500">
              Executive Heights, Jinnah Avenue, Blue Area, Islamabad, Pakistan
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <p className="font-medium">+92 51 2891 4400</p>
              <p className="text-slate-400">islamabad@primehaven.estate</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
              Sindh Regional Desk
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Karachi Office</h3>
            <p className="text-xs text-slate-500">
              Ocean Tower, Khayaban-e-Iqbal, Block 9, Clifton, Karachi, Pakistan
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <p className="font-medium">+92 21 3514 8820</p>
              <p className="text-slate-400">karachi@primehaven.estate</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
              GCC Expat Desk
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Dubai Global Desk</h3>
            <p className="text-xs text-slate-500">
              Building 4, Bay Square, Business Bay, Dubai, United Arab Emirates
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <p className="font-medium">+971 4 429 8810</p>
              <p className="text-slate-400">dubai@primehaven.estate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Intelligence & Insights</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
              Market Trends & Legal Guides
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Read our analysis on property taxation, society NOCs, and high-yield sectors.
            </p>
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-amber-600 transition-colors"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-amber-700">{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime}</span>
                </div>

                <h3 className="font-display font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-4">
                <div className="flex items-center gap-2">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-medium text-slate-700">{post.authorName}</span>
                </div>
                <span className="font-semibold text-amber-600 flex items-center gap-1">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Consultation Request Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="px-3 py-1 rounded-md bg-amber-500/20 text-amber-400 text-xs font-semibold">
                Direct Senior Consultation
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Request a Confidential Advisory Call
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Whether you are exploring high-yield property investment, seeking legal title validation, or listing an estate, our directors will assist you with verified market insights.
              </p>
              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Free Initial Title Search & NOC Audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Dedicated Senior Advisor for Your Preferred City</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Response Guaranteed Within 2 Business Hours</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-800/90 p-6 sm:p-8 rounded-2xl border border-slate-700">
              {consultSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Consultation Request Dispatched</h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Thank you, {consultName}. Your request has been assigned to our senior territory director. We will call you at {consultPhone}.
                  </p>
                  <button
                    onClick={() => setConsultSuccess(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConsultSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={consultName}
                        onChange={(e) => setConsultName(e.target.value)}
                        placeholder="e.g. Asad Farooq"
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={consultPhone}
                        onChange={(e) => setConsultPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={consultEmail}
                        onChange={(e) => setConsultEmail(e.target.value)}
                        placeholder="asad@example.com"
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Preferred City</label>
                      <select
                        value={consultCity}
                        onChange={(e) => setConsultCity(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value="Lahore">Lahore (DHA, Gulberg)</option>
                        <option value="Islamabad">Islamabad (Blue Area, Sectors)</option>
                        <option value="Karachi">Karachi (Clifton, DHA 8)</option>
                        <option value="Dubai">Dubai (Downtown, Marina)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Property Interest</label>
                    <select
                      value={consultInterest}
                      onChange={(e) => setConsultInterest(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="Buying Luxury Villa / Home">Buying Luxury Villa / Home</option>
                      <option value="Commercial Office Floor / Retail">Commercial Office Floor / Retail</option>
                      <option value="Residential Plot Investment">Residential Plot Investment</option>
                      <option value="Selling / Listing a Property">Selling / Listing a Property</option>
                      <option value="Legal Title Verification & Mutation">Legal Title Verification & Mutation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Message / Requirements (Optional)</label>
                    <textarea
                      rows={3}
                      value={consultMessage}
                      onChange={(e) => setConsultMessage(e.target.value)}
                      placeholder="Specify your budget range, target sector, or any legal verification questions..."
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={consultSubmitting}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{consultSubmitting ? 'Submitting...' : 'Request Free Consultation'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-500 rounded-2xl p-8 sm:p-12 text-slate-950 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight">
              Looking to Sell or Lease Your Luxury Property?
            </h2>
            <p className="text-xs sm:text-sm text-slate-900/80 max-w-xl">
              List directly with PrimeHaven to reach high-net-worth investors, overseas buyers, and verified corporate tenants.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/post-property')}
              className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-lg transition-colors whitespace-nowrap"
            >
              Submit Property Listing
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl border border-slate-950/20 transition-colors whitespace-nowrap"
            >
              Contact Sales Advisory
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

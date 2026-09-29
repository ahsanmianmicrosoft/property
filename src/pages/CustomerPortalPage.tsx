import React, { useState } from 'react';
import {
  User,
  Heart,
  Calendar,
  Building2,
  Clock,
  Shield,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Bell,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Calculator,
  Compass,
  FileText,
  BadgeCheck,
  Send,
  Eye,
  Trash2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface CustomerPortalPageProps {
  navigate: (path: string) => void;
}

export const CustomerPortalPage: React.FC<CustomerPortalPageProps> = ({ navigate }) => {
  const {
    currentUser,
    switchUserRole,
    favorites,
    toggleFavorite,
    properties,
    appointments,
    inquiries,
    formatPrice,
    addToast
  } = useRealEstate();

  const [activeTab, setActiveTab] = useState<
    'tours' | 'saved' | 'inquiries' | 'alerts' | 'mortgage' | 'listings'
  >('tours');

  // Filter items for current customer
  const myFavorites = properties.filter((p) => favorites.includes(p.id));
  const myAppointments = appointments.filter(
    (a) => a.customerEmail === currentUser.email || currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'AGENT'
  );
  const myInquiries = inquiries.filter(
    (i) => i.customerEmail === currentUser.email || currentUser.role === 'SUPER_ADMIN'
  );
  const mySubmittedProperties = properties.filter(
    (p) => p.ownerId === currentUser.id || p.status === 'pending_approval'
  );

  // Mortgage Calculator State
  const [loanAmount, setLoanAmount] = useState<number>(75000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(25);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(15);
  const [interestRate, setInterestRate] = useState<number>(13.5);

  const downPaymentAmount = (loanAmount * downPaymentPercent) / 100;
  const principal = loanAmount - downPaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTenureYears * 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : principal / totalMonths;

  // Saved alerts
  const [savedAlerts, setSavedAlerts] = useState([
    {
      id: 'al-1',
      title: 'DHA Phase 6 & 7 · 1 Kanal Luxury Villas',
      city: 'Lahore',
      priceRange: 'Up to Rs. 11 Crore',
      frequency: 'Instant WhatsApp & Email',
      matchesCount: 6,
      enabled: true
    },
    {
      id: 'al-2',
      title: 'Gulberg Skyline Penthouses · 3-4 Beds',
      city: 'Lahore',
      priceRange: 'Up to Rs. 15 Crore',
      frequency: 'Daily Digest',
      matchesCount: 3,
      enabled: true
    }
  ]);

  const toggleAlert = (id: string) => {
    setSavedAlerts((prev) =>
      prev.map((al) => (al.id === id ? { ...al, enabled: !al.enabled } : al))
    );
    addToast('Notification alert preference updated', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Customer Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-display font-black text-2xl flex items-center justify-center shadow-sm shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-display font-bold text-slate-900">
                    Welcome back, {currentUser.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Buyer
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    Customer Account
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {currentUser.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {currentUser.phone || '+92 302 7719283'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Lahore & Islamabad Portfolios
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => navigate('/properties')}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Explore Properties</span>
              </button>
              <button
                onClick={() => navigate('/post-property')}
                className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>List My Property</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('tours')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeTab === 'tours'
                  ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-medium">Viewing Tours</span>
                <Calendar className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-xl font-display font-bold text-slate-900">
                {myAppointments.length}
              </p>
              <span className="text-[11px] text-emerald-600 font-medium">
                {myAppointments.filter((a) => a.status === 'confirmed').length} Confirmed
              </span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeTab === 'saved'
                  ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-medium">Saved Properties</span>
                <Heart className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-xl font-display font-bold text-slate-900">
                {myFavorites.length}
              </p>
              <span className="text-[11px] text-slate-500">In Wishlist</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeTab === 'inquiries'
                  ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-medium">Inquiries & Offers</span>
                <MessageSquare className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-xl font-display font-bold text-slate-900">
                {myInquiries.length}
              </p>
              <span className="text-[11px] text-sky-700 font-medium">Agent Active</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeTab === 'alerts'
                  ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-medium">Property Alerts</span>
                <Bell className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xl font-display font-bold text-slate-900">
                {savedAlerts.filter((a) => a.enabled).length}
              </p>
              <span className="text-[11px] text-slate-500">Live Notifiers</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('tours')}
            className={`pb-3.5 px-4 text-xs font-semibold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tours'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Scheduled Viewing Tours</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
              {myAppointments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3.5 px-4 text-xs font-semibold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'saved'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Saved Wishlist & Price Watch</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
              {myFavorites.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3.5 px-4 text-xs font-semibold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-sky-600" />
            <span>My Inquiries & Offers</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
              {myInquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`pb-3.5 px-4 text-xs font-semibold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'alerts'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Saved Searches & Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab('mortgage')}
            className={`pb-3.5 px-4 text-xs font-semibold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'mortgage'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4 text-slate-600" />
            <span>Mortgage & Affordability Planner</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3.5 px-4 text-xs font-semibold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'listings'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-slate-600" />
            <span>My Listed Properties</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
              {mySubmittedProperties.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Scheduled Viewing Tours */}
        {activeTab === 'tours' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Upcoming Property Walkthroughs
                </h2>
                <p className="text-xs text-slate-500">
                  Physical and guided walkthrough appointments coordinated with our verified senior agents.
                </p>
              </div>
              <button
                onClick={() => navigate('/properties')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>Book a Tour</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No scheduled walkthroughs yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse verified villas, penthouses, and apartments and click "Schedule Private Viewing" on any listing.
                </p>
                <button
                  onClick={() => navigate('/properties')}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Explore Properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myAppointments.map((app) => {
                  const prop = properties.find((p) => p.id === app.propertyId);
                  return (
                    <div
                      key={app.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mb-2 ${
                              app.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {app.status === 'confirmed' ? '✓ Tour Confirmed' : '⏳ Awaiting Agent Confirmation'}
                          </span>
                          <h3
                            onClick={() => prop && navigate(`/properties/${prop.slug}`)}
                            className="text-sm font-bold text-slate-900 hover:text-amber-600 cursor-pointer line-clamp-1"
                          >
                            {app.propertyTitle}
                          </h3>
                        </div>
                        {prop && prop.images?.[0] && (
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="w-16 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span className="font-semibold text-slate-800">{app.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-slate-800">{app.timeSlot}</span>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Assigned Agent:</span>
                          <span className="font-semibold text-slate-900">{app.agentName}</span>
                        </div>
                      </div>

                      {app.notes && (
                        <p className="text-xs text-slate-600 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/60">
                          "{app.notes}"
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <a
                          href={`https://wa.me/923214455882?text=${encodeURIComponent(
                            `Salam ${app.agentName}, I am following up on my scheduled tour for ${app.propertyTitle} on ${app.date} at ${app.timeSlot}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 font-semibold hover:text-emerald-800 flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Chat on WhatsApp</span>
                        </a>

                        <button
                          onClick={() => {
                            addToast('Tour calendar reminder copied to clipboard', 'success');
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors"
                        >
                          Add to Calendar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Wishlist & Price Watch */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Saved Properties & Price Watch
                </h2>
                <p className="text-xs text-slate-500">
                  Properties you have bookmarked for comparative analysis, site visits, or investment review.
                </p>
              </div>
              <button
                onClick={() => navigate('/compare')}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5"
              >
                <span>Compare Matrix</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myFavorites.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Heart className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">Your wishlist is currently empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the heart icon on any property card to save it to your buyer dashboard.
                </p>
                <button
                  onClick={() => navigate('/properties')}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Browse Featured Listings
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myFavorites.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col group"
                  >
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                        {prop.purpose === 'sale' ? 'For Sale' : 'For Rent'}
                      </div>
                      <button
                        onClick={() => toggleFavorite(prop.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-rose-500 flex items-center justify-center hover:bg-white transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 font-medium">
                          {prop.location.area}, {prop.location.city}
                        </p>
                        <h3
                          onClick={() => navigate(`/properties/${prop.slug}`)}
                          className="text-sm font-bold text-slate-900 hover:text-amber-600 cursor-pointer mt-0.5 line-clamp-1"
                        >
                          {prop.title}
                        </h3>
                        <p className="text-base font-display font-black text-slate-900 mt-1">
                          {formatPrice(prop.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
                        <span>{prop.bedrooms} Beds · {prop.bathrooms} Baths</span>
                        <span className="font-medium text-slate-700">{prop.areaSqFt} sq ft</span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => navigate(`/properties/${prop.slug}`)}
                          className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg text-center transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            navigate(`/properties/${prop.slug}`);
                            addToast('Please click "Schedule Viewing" on the listing page to choose your date', 'info');
                          }}
                          className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Book Tour
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Inquiries & Offers */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Inquiries & Offer Messages
                </h2>
                <p className="text-xs text-slate-500">
                  Track communications sent to property owners and designated listing agents.
                </p>
              </div>
            </div>

            {myInquiries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No active inquiries submitted</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you send a message or price offer on any property, it will appear here with live response tracking.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myInquiries.map((inq) => {
                  const prop = properties.find((p) => p.id === inq.propertyId);
                  return (
                    <div
                      key={inq.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                inq.status === 'contacted'
                                  ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {inq.status === 'contacted' ? 'Agent Replied' : 'Pending Response'}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3
                            onClick={() => prop && navigate(`/properties/${prop.slug}`)}
                            className="text-sm font-bold text-slate-900 hover:text-amber-600 cursor-pointer mt-1"
                          >
                            {inq.propertyTitle}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/923214455882?text=${encodeURIComponent(
                              `Salam, I am following up on my inquiry for ${inq.propertyTitle}.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp Agent</span>
                          </a>
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                        <p className="font-medium text-slate-500 text-[11px] uppercase tracking-wider">
                          Your Inquiry Message:
                        </p>
                        <p className="text-slate-800 leading-relaxed font-normal">
                          "{inq.message}"
                        </p>
                      </div>

                      {inq.status === 'contacted' && (
                        <div className="bg-sky-50/70 border border-sky-200 p-3.5 rounded-xl text-xs space-y-1">
                          <p className="font-semibold text-sky-950 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-sky-600" />
                            Agent Note from Senior Advisory:
                          </p>
                          <p className="text-sky-900">
                            "Tariq Mehmood has acknowledged your inquiry. The verified NOC documentation, society transfer guidelines, and schedule have been dispatched to your contact."
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Saved Searches & Alerts */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Instant Property Alerts & Saved Searches
                </h2>
                <p className="text-xs text-slate-500">
                  Get notified immediately via WhatsApp and Email as soon as new matching properties are listed.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {savedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{alert.title}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                        {alert.city}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Price Ceiling: <span className="font-semibold text-slate-800">{alert.priceRange}</span> ·{' '}
                      Frequency: <span className="font-medium text-slate-700">{alert.frequency}</span>
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">
                      ✓ {alert.matchesCount} listings currently match this criterion
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate('/properties')}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
                    >
                      View Matches
                    </button>
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        alert.enabled
                          ? 'bg-amber-500 text-slate-950 border-amber-600 hover:bg-amber-400 font-bold'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {alert.enabled ? 'Alert Active' : 'Muted'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-950 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900 text-sm">Create New Alert on Any Search</p>
                <p className="text-amber-800 mt-0.5">
                  Whenever you apply filters on the Properties page (e.g. 10 Marla houses in Islamabad or Plots in DHA Phase 9), click the "Save Alert" button to receive instant push alerts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Mortgage & Financing Calculator */}
        {activeTab === 'mortgage' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Home Financing & Islamic Musharakah Calculator
              </h2>
              <p className="text-xs text-slate-500">
                Estimate your monthly installment (EMI), required down payment, and partner bank financing terms.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Controls */}
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1.5">
                    <span>Target Property Value</span>
                    <span className="font-display font-bold text-amber-600">
                      {formatPrice(loanAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5000000}
                    max={250000000}
                    step={1000000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Rs. 50 Lakh</span>
                    <span>Rs. 25 Crore</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Down Payment (%)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={15}
                        max={70}
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                      <span className="text-xs font-semibold text-slate-500">%</span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Initial Equity: {formatPrice(downPaymentAmount)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Financing Tenure (Years)
                    </label>
                    <select
                      value={loanTenureYears}
                      onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value={5}>5 Years (60 Months)</option>
                      <option value={10}>10 Years (120 Months)</option>
                      <option value={15}>15 Years (180 Months)</option>
                      <option value={20}>20 Years (240 Months)</option>
                      <option value={25}>25 Years (300 Months)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Profit / Interest Rate (Annual KIBOR + Spread %)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={8}
                    max={25}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Current benchmark Islamic banking rates range between 12.5% and 15.5%.
                  </span>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between space-y-6">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Estimated Monthly Installment
                  </p>
                  <p className="text-3xl font-display font-black text-amber-400 mt-2">
                    {formatPrice(Math.round(monthlyPayment))}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">per month for {loanTenureYears} years</p>
                </div>

                <div className="space-y-2.5 text-xs border-t border-slate-800 pt-4 text-slate-300">
                  <div className="flex justify-between">
                    <span>Principal Financed:</span>
                    <span className="font-semibold text-white">{formatPrice(principal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Down Payment Required:</span>
                    <span className="font-semibold text-white">{formatPrice(downPaymentAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recommended Monthly Income:</span>
                    <span className="font-semibold text-amber-300">
                      {formatPrice(Math.round(monthlyPayment * 2.2))}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      addToast('Loan pre-approval application request dispatched to senior financing advisors', 'success');
                    }}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-sm"
                  >
                    Request Pre-Approval Assistance
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Customer Submitted Properties */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Properties Submitted for Sale or Rent
                </h2>
                <p className="text-xs text-slate-500">
                  Manage the listings you have submitted as an owner or landlord.
                </p>
              </div>
              <button
                onClick={() => navigate('/post-property')}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                + Post New Property
              </button>
            </div>

            {mySubmittedProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No properties submitted yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Want to sell or rent out your villa, apartment, or plot? Submit your listing for free verification.
                </p>
                <button
                  onClick={() => navigate('/post-property')}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Post Your Property Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {mySubmittedProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {prop.images?.[0] && (
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-20 h-16 object-cover rounded-xl border border-slate-200"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              prop.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {prop.status === 'published' ? 'Active / Published' : 'Under Verification'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {prop.location.area}, {prop.location.city}
                          </span>
                        </div>
                        <h3
                          onClick={() => navigate(`/properties/${prop.slug}`)}
                          className="text-sm font-bold text-slate-900 hover:text-amber-600 cursor-pointer mt-1"
                        >
                          {prop.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-800 mt-0.5">
                          {formatPrice(prop.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/properties/${prop.slug}`)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Preview Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

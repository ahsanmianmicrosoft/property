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
  AlertCircle
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface ProfilePageProps {
  navigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
  const {
    currentUser,
    switchUserRole,
    favorites,
    properties,
    appointments,
    inquiries,
    formatPrice
  } = useRealEstate();

  const [activeTab, setActiveTab] = useState<'listings' | 'appointments' | 'inquiries' | 'favorites'>('appointments');

  const myFavorites = properties.filter((p) => favorites.includes(p.id));
  const myAppointments = appointments.filter(
    (a) => a.customerEmail === currentUser.email || currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'AGENT'
  );
  const myInquiries = inquiries.filter(
    (i) => i.customerEmail === currentUser.email || currentUser.role === 'SUPER_ADMIN'
  );
  const mySubmittedProperties = properties.filter((p) => p.ownerId === currentUser.id || p.status === 'pending_approval');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-display font-black text-2xl flex items-center justify-center shadow-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-200">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentUser.email} · {currentUser.phone || '+92 300 8472910'}</p>
            {currentUser.company && <p className="text-xs text-slate-700 font-medium">{currentUser.company}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role !== 'CUSTOMER' && (
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Management Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-medium pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-2 px-3 flex items-center gap-1.5 transition-colors border-b-2 font-semibold ${
            activeTab === 'appointments'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>My Viewing Tours ({myAppointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-2 px-3 flex items-center gap-1.5 transition-colors border-b-2 font-semibold ${
            activeTab === 'listings'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Submitted Listings ({mySubmittedProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-2 px-3 flex items-center gap-1.5 transition-colors border-b-2 font-semibold ${
            activeTab === 'inquiries'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Inquiries Sent ({myInquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`pb-2 px-3 flex items-center gap-1.5 transition-colors border-b-2 font-semibold ${
            activeTab === 'favorites'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Favorites ({myFavorites.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {myAppointments.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-xs text-slate-500">
              No viewing appointments scheduled yet. Request a tour on any property details page!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myAppointments.map((app) => (
                <div key={app.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 font-display text-sm">{app.propertyTitle}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        app.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Tour Date: <strong className="text-slate-800">{app.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Time Slot: <strong className="text-slate-800">{app.timeSlot}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Advisor: <strong className="text-slate-800">{app.agentName}</strong></span>
                    </div>
                  </div>

                  {app.notes && (
                    <p className="text-slate-500 italic bg-slate-50 p-2 rounded">
                      Note: {app.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Your Submitted Properties</h3>
            <button
              onClick={() => navigate('/post-property')}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
            >
              + Submit New Property
            </button>
          </div>

          <div className="space-y-3">
            {mySubmittedProperties.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt={p.title} referrerPolicy="no-referrer" className="w-14 h-14 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</h4>
                    <p className="text-slate-500">{p.location.area}, {p.location.city} · {formatPrice(p.price)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase ${
                      p.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {p.status.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => navigate(`/properties/${p.slug}`)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'inquiries' && (
        <div className="space-y-3">
          {myInquiries.map((inq) => (
            <div key={inq.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{inq.propertyTitle}</span>
                <span className="text-[10px] text-slate-400 font-mono">#{inq.id}</span>
              </div>
              <p className="text-slate-600 bg-slate-50 p-2.5 rounded italic">"{inq.message}"</p>
              <div className="text-[11px] text-slate-400">
                Preferred Contact: <span className="capitalize text-slate-700 font-medium">{inq.preferredContact}</span> · Status: {inq.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myFavorites.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 text-xs">
              <img src={p.images[0]} alt={p.title} referrerPolicy="no-referrer" className="w-full h-32 object-cover rounded-lg" />
              <h4 className="font-bold text-slate-900 line-clamp-1">{p.title}</h4>
              <p className="font-bold text-amber-600 tabular-nums">{formatPrice(p.price)}</p>
              <button
                onClick={() => navigate(`/properties/${p.slug}`)}
                className="w-full py-1.5 text-center bg-slate-900 text-white rounded-lg font-semibold"
              >
                View Listing
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

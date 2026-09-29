import React from 'react';
import { Shield, UserCheck, Calendar, Heart, MessageSquare, ArrowRightLeft } from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface ViewModeBarProps {
  navigate: (path: string) => void;
  currentPath: string;
}

export const ViewModeBar: React.FC<ViewModeBarProps> = ({ navigate, currentPath }) => {
  const { currentUser, switchUserRole, favorites, appointments, inquiries } = useRealEstate();

  const isCustomer = currentUser.role === 'CUSTOMER';
  const myAppointmentsCount = appointments.filter(
    (a) => a.customerEmail === currentUser.email || isCustomer
  ).length;
  const myInquiriesCount = inquiries.filter(
    (i) => i.customerEmail === currentUser.email || isCustomer
  ).length;

  return (
    <div className="bg-slate-900 text-slate-100 text-xs border-b border-slate-800 py-1.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Active Mode Pill */}
        <div className="flex items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isCustomer
                ? 'bg-amber-400 text-slate-950'
                : 'bg-emerald-500 text-white'
            }`}
          >
            {isCustomer ? (
              <>
                <UserCheck className="w-3 h-3 text-slate-950" />
                <span>CUSTOMER VIEW ACTIVE</span>
              </>
            ) : (
              <>
                <Shield className="w-3 h-3 text-white" />
                <span>ADMIN / CRM VIEW</span>
              </>
            )}
          </span>

          <span className="text-slate-300 hidden md:inline">
            Logged in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
          </span>
        </div>

        {/* Center: Customer shortcuts if in customer mode */}
        {isCustomer && (
          <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-300">
            <button
              onClick={() => navigate('/customer')}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>Viewing Tours ({myAppointmentsCount})</span>
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => navigate('/customer')}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Heart className="w-3 h-3 text-rose-400" />
              <span>Wishlist ({favorites.length})</span>
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => navigate('/customer')}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3 text-sky-400" />
              <span>Inquiries ({myInquiriesCount})</span>
            </button>
          </div>
        )}

        {/* Right: Quick 1-Click Role/View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
              currentPath === '/'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700'
            }`}
            title="Go to Public Website Home"
          >
            🏠 Website Home
          </button>

          {isCustomer ? (
            <>
              <button
                onClick={() => navigate('/customer')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  currentPath === '/customer'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                }`}
              >
                Customer Portal
              </button>
              <button
                onClick={() => switchUserRole('SUPER_ADMIN')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-[11px] font-medium transition-colors flex items-center gap-1 border border-slate-700"
                title="Switch to Admin CRM Dashboard"
              >
                <ArrowRightLeft className="w-3 h-3 text-amber-400" />
                <span>Switch to Admin CRM</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/admin')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  currentPath === '/admin'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                }`}
              >
                Open Admin CRM
              </button>
              <button
                onClick={() => switchUserRole('CUSTOMER')}
                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded text-[11px] font-bold transition-colors flex items-center gap-1"
                title="Switch to Customer / Buyer View"
              >
                <ArrowRightLeft className="w-3 h-3 text-slate-950" />
                <span>Switch to Customer View</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Building2,
  Heart,
  Scale,
  PlusCircle,
  Menu,
  X,
  Shield,
  ChevronDown,
  Lock,
  LogOut,
  User as UserIcon,
  CheckCircle2
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const {
    currentUser,
    isAuthenticated,
    isStaff,
    logout,
    openAuthModal,
    currency,
    setCurrency,
    favorites,
    comparedProperties
  } = useRealEstate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Properties', path: '/properties' },
    { label: 'Projects', path: '/projects' },
    { label: 'Services', path: '/services' },
    { label: 'About Us', path: '/about' },
    { label: 'Agents', path: '/agents' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];

  const currencies = ['PKR', 'USD', 'AED', 'GBP', 'EUR'];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-amber-400 group-hover:bg-slate-800 transition-colors shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-display font-black text-xl tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                PrimeHaven
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links for Public Visitors */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive =
                currentPath === link.path ||
                (link.path.includes('?') &&
                  currentPath.startsWith('/properties') &&
                  window.location.search.includes(link.path.split('?')[1]));
              return (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.path)}
                  className={`relative py-1 hover:text-slate-900 transition-colors ${
                    isActive ? 'text-slate-900 font-semibold' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setCurrencyDropdownOpen(!currencyDropdownOpen);
                  setUserDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-md transition-colors"
                title="Select Platform Currency"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white rounded-xl shadow-xl border border-slate-200 p-1 z-50 animate-in fade-in slide-in-from-top-1">
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors font-medium ${
                        currency === c
                          ? 'bg-amber-50 text-amber-900 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Favorites Icon */}
            <button
              onClick={() => handleNav('/favorites')}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Compare Icon */}
            <button
              onClick={() => handleNav('/compare')}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Compare Properties"
            >
              <Scale className="w-5 h-5" />
              {comparedProperties.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {comparedProperties.length}
                </span>
              )}
            </button>

            {/* Authentication / Staff Status */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold"
                >
                  <img
                    src={
                      currentUser.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                    }
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="max-w-[110px] truncate hidden sm:inline">{currentUser.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    {isStaff && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNav('/admin');
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-amber-50 rounded-lg text-slate-800 font-semibold flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>Open CRM Dashboard</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        handleNav('/');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 rounded-lg font-medium flex items-center gap-2 mt-1 pt-2 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Public Visitor View: Discreet Staff Sign In */
              <button
                onClick={openAuthModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
                title="Staff & Management Login"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Staff Portal</span>
              </button>
            )}

            {/* Post Property Primary CTA */}
            <button
              onClick={() => handleNav('/post-property')}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Post Property</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.path)}
                className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
                  currentPath === link.path
                    ? 'bg-amber-50 text-amber-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                {isStaff && (
                  <button
                    onClick={() => handleNav('/admin')}
                    className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-900 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between"
                  >
                    <span>Management CRM Dashboard</span>
                    <Shield className="w-4 h-4 text-amber-600" />
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    handleNav('/');
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg flex items-center justify-between"
                >
                  <span>Sign Out ({currentUser.name})</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-between"
              >
                <span>Staff & Broker Login</span>
                <Lock className="w-4 h-4 text-slate-600" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

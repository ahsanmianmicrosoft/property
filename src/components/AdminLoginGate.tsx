import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface AdminLoginGateProps {
  navigate: (path: string) => void;
  onLoginSuccess: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({ navigate, onLoginSuccess }) => {
  const { login, addToast } = useRealEstate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success && res.user) {
      if (res.user.role === 'CUSTOMER') {
        setError('This customer account does not have staff permissions. Please sign in with an Admin or Agent account.');
        return;
      }
      addToast(`Authenticated as ${res.user.name} (${res.user.role.replace('_', ' ')})`, 'success');
      onLoginSuccess();
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold mx-auto shadow-lg shadow-amber-500/20">
          <Building2 className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            PrimeHaven Portal
          </h1>
          <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mt-1">
            Restricted Staff & Broker CRM Access
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900 py-8 px-6 sm:px-10 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-base font-semibold text-white">Management Authentication</h2>
            <p className="text-xs text-slate-400">
              Please enter your authorized credentials to access leads, approvals, and reports.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-950/80 border border-rose-800 rounded-xl flex items-start gap-2.5 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1.5">Staff Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@primehaven.estate"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-medium text-slate-300">Staff Password</label>
                <span className="text-[11px] text-slate-500">Demo password: password123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Verifying access...' : 'Authenticate & Open CRM'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Test Chips */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Test Credentials:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@primehaven.estate')}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-amber-300 border border-slate-700/80 text-left transition-colors font-medium flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Super Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin.ops@primehaven.estate')}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-left transition-colors font-medium flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Ops Manager</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('tariq.agent@primehaven.estate')}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-left transition-colors font-medium flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Agent (Tariq)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('ayesha.agent@primehaven.estate')}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-left transition-colors font-medium flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Agent (Ayesha)</span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

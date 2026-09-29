import React, { useState } from 'react';
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  Building2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, addToast } = useRealEstate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success && res.user) {
      addToast(`Welcome back, ${res.user.name}!`, 'success');
      onClose();
      if (onSuccess) onSuccess();
    } else {
      setError(res.error || 'Invalid credentials. Please try again.');
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-white">PrimeHaven</span>
              <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">Enterprise Portal</span>
            </div>
          </div>

          <h2 className="text-xl font-display font-bold mt-2">Staff & Management Sign In</h2>
          <p className="text-xs text-slate-300 mt-1">
            Access CRM leads, property approvals, analytics, and operational tools.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Authorized Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@primehaven.estate"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-700">Password</label>
                <span className="text-[11px] text-slate-400">Default demo: password123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Quick Test Credentials (Click to fill):
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@primehaven.estate')}
                className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-left transition-colors font-medium flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Super Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin.ops@primehaven.estate')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-left transition-colors font-medium flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="truncate">Ops Manager</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('tariq.agent@primehaven.estate')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-left transition-colors font-medium flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="truncate">Agent (Tariq)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('hamza.buyer@gmail.com')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-left transition-colors font-medium flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="truncate">Customer (Buyer)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

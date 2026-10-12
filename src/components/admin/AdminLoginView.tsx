import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { AUTHORIZED_OWNER_EMAIL } from '../../utils/adminAuth';

interface AdminLoginViewProps {
  onSuccessRedirectTab?: string;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = () => {
  const { loginAdmin, setActiveView, showToast } = useStore();

  const [identifier, setIdentifier] = useState('nailasher020@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = loginAdmin(identifier, password, rememberMe);
      setLoading(false);

      if (res.success) {
        showToast('Khush Amdeed, Naila Sher! Admin ERP khul gaya hai.', 'success');
        setActiveView('admin');
      } else {
        setError(res.error || 'Authentication failed. Access is strictly restricted.');
      }
    }, 350);
  };

  const handleQuickFill = (pass: string = 'nailash123') => {
    setIdentifier('nailasher020@gmail.com');
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FCF9EA] flex flex-col justify-between antialiased text-stone-800 selection:bg-[#DB9558]/20 selection:text-[#8e5220]">
      {/* Top Header Bar */}
      <header className="border-b border-stone-200/80 bg-white/70 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif-title font-bold text-2xl tracking-wider uppercase text-stone-900">
            Nailash
          </span>
          <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[11px] font-mono font-medium border border-stone-200">
            Owner Security Gate
          </span>
        </div>

        <button
          onClick={() => setActiveView('home')}
          className="text-xs font-semibold text-stone-600 hover:text-stone-950 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-stone-100 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </button>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200/90 overflow-hidden">
          {/* Card Header */}
          <div className="bg-linear-to-b from-[#FAF5E6] to-white p-6 sm:p-8 text-center border-b border-stone-100">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#DB9558]/15 border border-[#DB9558]/30 flex items-center justify-center text-[#DB9558] mb-4 shadow-xs">
              <Lock className="w-6 h-6" />
            </div>

            <h1 className="font-serif-title font-semibold text-2xl text-stone-900 tracking-wide">
              Store Owner & Admin Portal
            </h1>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Yeh dashboard aur product management procedure sirf authorized store manager <strong className="text-stone-700">{AUTHORIZED_OWNER_EMAIL}</strong> ke liye makhsoos hai.
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-[11px] font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Strict Ownership Access Control Active</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <strong className="block font-semibold">Access Denied</strong>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Authorized Manager Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="nailasher020@gmail.com"
                    autoFocus
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#DB9558]/30 focus:border-[#DB9558] transition-all"
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Only nailasher020@gmail.com is authorized to manage the store.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (e.g. nailash123)"
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#DB9558]/30 focus:border-[#DB9558] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-stone-300 text-[#DB9558] focus:ring-[#DB9558]"
                  />
                  <span>Remember my session on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs tracking-wider uppercase rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In & Open Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Access for Owner */}
            <div className="mt-6 pt-5 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#DB9558]" />
                  <span>Authorized Store Owner</span>
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-medium">
                  Verified Manager
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleQuickFill('nailash123')}
                className="w-full text-left p-3 rounded-lg border border-stone-200 bg-stone-50/70 hover:bg-[#FCF9EA] hover:border-[#DB9558]/40 transition-colors flex items-center justify-between text-xs group cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-stone-900 group-hover:text-[#8e5220] flex items-center gap-1.5">
                    <span>Naila Sher (Store Manager)</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-[#DB9558]/20 text-[#8e5220] rounded">Owner</span>
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                    nailasher020@gmail.com · Password: <span className="font-bold text-stone-700">nailash123</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#DB9558] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pl-2">
                  Auto Fill →
                </span>
              </button>
            </div>
          </div>

          {/* Security Assurance footer */}
          <div className="bg-stone-50 px-6 py-3.5 border-t border-stone-100 flex items-center justify-center gap-2 text-[11px] text-stone-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sole Authorization: nailasher020@gmail.com</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} Nailash Apparel (Pvt) Ltd. All administrative operations are restricted to Naila Sher.
      </footer>
    </div>
  );
};

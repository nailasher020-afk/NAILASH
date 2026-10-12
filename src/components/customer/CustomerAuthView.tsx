import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { User, Lock, Mail, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export const CustomerAuthView: React.FC = () => {
  const {
    loginAsCustomer,
    registerCustomer,
    setActiveView,
    setUserRole,
    customers,
    showToast
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isOwnerLoginMode, setIsOwnerLoginMode] = useState(false);

  // Registration inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('Lahore');
  const [regPassword, setRegPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    const clean = loginEmail.trim().toLowerCase();
    const ok = loginAsCustomer(clean);
    if (ok) {
      if (clean === 'nailasher020@gmail.com') {
        setActiveView('admin');
      } else {
        setActiveView('account');
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone) {
      showToast('Please fill in required fields', 'error');
      return;
    }
    const ok = registerCustomer({
      name: regName,
      email: regEmail,
      phone: regPhone,
      city: regCity
    });
    if (ok) {
      setActiveView('account');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      {/* Brand Header */}
      <div className="text-center space-y-2 mb-8">
        <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold">
          Nailash Client Portal
        </span>
        <h1 className="text-3xl font-serif-title font-semibold text-stone-900">
          {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
        </h1>
        <p className="text-xs text-stone-500">
          {mode === 'login'
            ? 'Sign in to access your order history and bespoke measurements.'
            : 'Join the Nailash clientele for exclusive drops & seamless checkout.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-6 text-xs uppercase tracking-wider font-semibold">
        <button
          onClick={() => setMode('login')}
          className={`flex-1 py-3 text-center transition-all ${
            mode === 'login'
              ? 'border-b-2 border-[#DB9558] text-[#DB9558]'
              : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setMode('register')}
          className={`flex-1 py-3 text-center transition-all ${
            mode === 'register'
              ? 'border-b-2 border-[#DB9558] text-[#DB9558]'
              : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          Register
        </button>
      </div>

      {/* Login Form */}
      {mode === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-stone-200 shadow-xs text-xs">
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-stone-700 font-semibold">Password</label>
              <button
                type="button"
                onClick={() => showToast('Password reset link sent to registered email', 'info')}
                className="text-[11px] text-[#DB9558] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-stone-900 text-[#FCF9EA] uppercase tracking-wider font-semibold rounded hover:bg-stone-800 transition-colors shadow-sm cursor-pointer"
          >
            Sign In to Account
          </button>

          {/* Quick Demo Logins */}
          <div className="pt-4 border-t border-stone-100 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block text-center">
              Quick 1-Click Demo Accounts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('ayesha.k@example.com');
                  loginAsCustomer('ayesha.k@example.com');
                  setActiveView('account');
                }}
                className="p-2 border border-stone-200 rounded hover:bg-stone-50 text-left text-[11px] text-stone-700"
              >
                <span className="font-semibold block truncate">Ayesha Khan</span>
                <span className="text-[10px] text-stone-400">Lahore Client</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('hamza.f@example.com');
                  loginAsCustomer('hamza.f@example.com');
                  setActiveView('account');
                }}
                className="p-2 border border-stone-200 rounded hover:bg-stone-50 text-left text-[11px] text-stone-700"
              >
                <span className="font-semibold block truncate">Hamza Farooq</span>
                <span className="text-[10px] text-stone-400">Karachi Client</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Registration Form */
        <form onSubmit={handleRegisterSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-stone-200 shadow-xs text-xs">
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Sana Mir"
                className="w-full pl-9 pr-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="sana@example.com"
                className="w-full pl-9 pr-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Mobile Phone (Pakistan)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                required
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="03XXXXXXXXX"
                className="w-full pl-9 pr-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">City</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={regCity}
                onChange={(e) => setRegCity(e.target.value)}
                placeholder="e.g. Lahore, Karachi, Rawalpindi"
                className="w-full pl-9 pr-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#97A87A] text-white uppercase tracking-wider font-semibold rounded hover:bg-[#839367] transition-colors shadow-sm cursor-pointer"
          >
            Create My Account
          </button>
        </form>
      )}

      {/* Discreet Owner Access section (Only for nailasher020@gmail.com) */}
      <div className="mt-8 pt-6 border-t border-stone-200/60 text-center">
        {!isOwnerLoginMode ? (
          <button
            type="button"
            onClick={() => {
              setIsOwnerLoginMode(true);
              setMode('login');
              setLoginEmail('nailasher020@gmail.com');
              setLoginPassword('nailash123');
            }}
            className="text-[11px] text-stone-400 hover:text-[#DB9558] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3 h-3 text-[#DB9558]" />
            <span>Store Owner Access (Naila Sher)</span>
          </button>
        ) : (
          <div className="p-4 bg-stone-900 text-stone-200 rounded-xl text-left space-y-3 animate-in fade-in duration-200 border border-[#DB9558]/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#DB9558] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Store Owner Sign In</span>
              </span>
              <button
                type="button"
                onClick={() => setIsOwnerLoginMode(false)}
                className="text-[10px] text-stone-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <p className="text-[11px] text-stone-400">
              Only authorized for <strong>nailasher020@gmail.com</strong>.
            </p>
            <button
              type="button"
              onClick={() => {
                loginAsCustomer('nailasher020@gmail.com');
                setActiveView('admin');
              }}
              className="w-full py-2 bg-[#DB9558] text-white text-xs font-semibold rounded hover:bg-[#c47f42] transition-colors cursor-pointer"
            >
              Sign In as Naila Sher & Open Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

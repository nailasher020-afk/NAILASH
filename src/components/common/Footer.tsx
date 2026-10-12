import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Truck, RefreshCw, Sparkles, Phone, Mail, MapPin, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, storeSettings, isAdminAuthenticated, adminUser, currentUser } = useStore();

  const isOwner = Boolean(
    isAdminAuthenticated &&
    (adminUser?.email?.toLowerCase() === 'nailasher020@gmail.com' ||
     currentUser?.email?.toLowerCase() === 'nailasher020@gmail.com')
  );

  const handleNav = (view: string) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#21211e] text-[#FCF9EA] border-t border-stone-800">
      {/* Brand Value Pillars */}
      <div className="border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="p-2.5 rounded bg-[#97A87A]/20 text-[#97A87A]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white">Artisanal Mastercraft</h4>
              <p className="text-xs text-stone-400 mt-1">Exquisite hand-guided embroidery and heirloom pure fabrics.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="p-2.5 rounded bg-[#DB9558]/20 text-[#DB9558]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white">Express Nationwide</h4>
              <p className="text-xs text-stone-400 mt-1">Free delivery across Pakistan on orders over Rs. 15,000.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="p-2.5 rounded bg-[#A8BBA3]/20 text-[#A8BBA3]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white">Authentic & Secure</h4>
              <p className="text-xs text-stone-400 mt-1">Verified JazzCash & Cash on Delivery payment gateways.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="p-2.5 rounded bg-[#97A87A]/20 text-[#97A87A]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white">Bespoke Fitting</h4>
              <p className="text-xs text-stone-400 mt-1">Hassle-free 7-day exchange and sizing adjustments.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-2xl font-serif-title font-semibold tracking-wider text-white uppercase">
              {storeSettings.storeName}
            </span>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Timeless South Asian elegance reimagined for the modern silhouette. Discover bespoke luxury pret, festive couture, and pure lawn crafted with grace.
            </p>
            <div className="space-y-2 text-xs text-stone-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#DB9558] shrink-0" />
                <span>{storeSettings.address}, {storeSettings.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#97A87A] shrink-0" />
                <span>{storeSettings.phone} · Concierge WhatsApp: {storeSettings.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#A8BBA3] shrink-0" />
                <span>{storeSettings.supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Quick shop */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#DB9558] mb-4">
              Explore Collections
            </h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => handleNav('shop')} className="hover:text-white transition-colors">
                  All Designs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('new-arrivals')} className="hover:text-white transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('collections')} className="hover:text-white transition-colors">
                  Festive Couture
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop')} className="hover:text-white transition-colors">
                  Men’s Formal Wear
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop')} className="hover:text-white transition-colors">
                  Heirloom Shawls
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#97A87A] mb-4">
              Customer Concierge
            </h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => handleNav('my-orders')} className="hover:text-white transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq')} className="hover:text-white transition-colors">
                  Size Guide & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors">
                  Contact & Atelier
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq')} className="hover:text-white transition-colors">
                  JazzCash Payment Guide
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq')} className="hover:text-white transition-colors">
                  Exchange Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A8BBA3] mb-4">
              Trust & Security
            </h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors">
                  About Nailash Heritage
                </button>
              </li>
              {isOwner ? (
                <li>
                  <button
                    onClick={() => handleNav('admin')}
                    className="hover:text-[#DB9558] text-[#DB9558] font-medium transition-colors flex items-center gap-1.5 pt-1"
                  >
                    <Shield className="w-3 h-3 text-[#DB9558]" />
                    <span>Admin ERP Dashboard (Naila Sher)</span>
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    onClick={() => handleNav('about')}
                    className="hover:text-white transition-colors"
                  >
                    Authenticity Guarantee
                  </button>
                </li>
              )}
            </ul>
            <div className="mt-6 pt-4 border-t border-stone-800">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-2">Accepted Payments</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-1 bg-stone-800 text-[11px] text-[#DB9558] font-semibold rounded">JazzCash</span>
                <span className="px-2 py-1 bg-stone-800 text-[11px] text-[#97A87A] font-semibold rounded">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-stone-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Nailash Apparel (Pvt) Ltd. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-light">Crafted for timeless elegance & luxury fashion.</p>
        </div>
      </div>
    </footer>
  );
};

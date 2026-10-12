import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Settings, Save, CheckCircle2, Shield, Store, CreditCard, Bell } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { storeSettings, updateStoreSettings } = useStore();

  const [form, setForm] = useState(storeSettings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(form);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#DB9558]">
            System Configuration
          </span>
          <h1 className="text-2xl font-serif-title font-semibold text-stone-900">
            Store Profile & Gateway Settings
          </h1>
          <p className="text-xs text-stone-500">
            Configure atelier details, JazzCash merchant credentials, shipping fee thresholds, and currencies.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Brand Information */}
        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Store className="w-4 h-4 text-[#DB9558]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800">
              Atelier Profile & Invoicing Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Store / Brand Name</label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded text-stone-800"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Brand Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded text-stone-800"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Customer Support Email</label>
              <input
                type="email"
                required
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded text-stone-800"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Telephone Contact</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded text-stone-800"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Concierge WhatsApp</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded text-stone-800"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">City / Region</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded text-stone-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-700 font-semibold mb-1">Physical Flagship Atelier Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded text-stone-800"
              />
            </div>
          </div>
        </div>

        {/* Currency & Logistics */}
        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <CreditCard className="w-4 h-4 text-[#97A87A]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800">
              Currency, Taxes & Courier Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Primary Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value, currencySymbol: e.target.value === 'PKR' ? 'Rs.' : '$' })}
                className="w-full px-3 py-2 border border-stone-300 rounded text-stone-800 font-semibold"
              >
                <option value="PKR">PKR (Pakistani Rupee)</option>
                <option value="USD">USD (US Dollar)</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Sales Tax (%)</label>
              <input
                type="number"
                min="0"
                max="30"
                value={form.taxRate}
                onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-stone-300 rounded font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Free Shipping (Rs.)</label>
              <input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-stone-300 rounded font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Default Courier Fee (Rs.)</label>
              <input
                type="number"
                value={form.defaultShippingFee}
                onChange={(e) => setForm({ ...form, defaultShippingFee: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-stone-300 rounded font-mono"
              />
            </div>
          </div>
        </div>

        {/* JazzCash Merchant Configuration */}
        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Shield className="w-4 h-4 text-[#DB9558]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800">
              Official JazzCash Gateway Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                JazzCash Merchant Mobile Number
              </label>
              <input
                type="text"
                required
                value={form.jazzCashMerchantNumber}
                onChange={(e) => setForm({ ...form, jazzCashMerchantNumber: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                JazzCash Account Title
              </label>
              <input
                type="text"
                required
                value={form.jazzCashAccountTitle}
                onChange={(e) => setForm({ ...form, jazzCashAccountTitle: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded font-semibold text-stone-800"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#DB9558] text-stone-950 font-semibold uppercase tracking-wider rounded hover:bg-[#c88243] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

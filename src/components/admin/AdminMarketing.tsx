import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types';
import { Tag, Plus, CheckCircle2, XCircle, Trash2, Calendar, Megaphone, Sparkles, X } from 'lucide-react';

export const AdminMarketing: React.FC = () => {
  const {
    coupons,
    addCoupon,
    toggleCouponActive,
    storeSettings,
    updateStoreSettings,
    showToast
  } = useStore();

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // New Coupon state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(10000);
  const [maxDiscount, setMaxDiscount] = useState<number | undefined>(3000);
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState<number>(500);

  // Banner announcement
  const [bannerText, setBannerText] = useState(storeSettings.bannerAnnouncement);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast('Please specify a coupon code', 'error');
      return;
    }
    addCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrder: Number(minOrder),
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      startDate,
      endDate,
      usageLimit: Number(usageLimit),
      isActive: true
    });
    setIsCouponModalOpen(false);
    setCode('');
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({ bannerAnnouncement: bannerText });
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#DB9558]">
            Growth & Merchandising
          </span>
          <h1 className="text-2xl font-serif-title font-semibold text-stone-900">
            Marketing & Discount Campaigns
          </h1>
          <p className="text-xs text-stone-500">
            Create promotional coupons, manage homepage hero announcements, and curate featured drops.
          </p>
        </div>

        <button
          onClick={() => setIsCouponModalOpen(true)}
          className="px-4 py-2.5 bg-[#97A87A] text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#839367] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Homepage Announcement Banner Manager */}
      <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-[#DB9558]" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800">
            Storefront Announcement Banner
          </h3>
        </div>
        <form onSubmit={handleSaveBanner} className="flex gap-2">
          <input
            type="text"
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#FCF9EA]/50 border border-stone-300 rounded text-xs text-stone-800"
            placeholder="Banner announcement displayed across all customer pages..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-stone-900 text-white rounded text-xs uppercase tracking-wider font-semibold hover:bg-stone-800"
          >
            Update Banner
          </button>
        </form>
      </div>

      {/* Coupons Directory */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800">
            Active Discount Coupons ({coupons.length})
          </h3>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 font-semibold text-stone-400 uppercase tracking-wider">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-2">Discount Type</th>
                <th className="py-3 px-2">Value</th>
                <th className="py-3 px-2 text-right">Min Order</th>
                <th className="py-3 px-2 text-right">Max Cap</th>
                <th className="py-3 px-2 text-center">Usage</th>
                <th className="py-3 px-2">Validity</th>
                <th className="py-3 pr-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-stone-50">
                  <td className="py-3 px-4 font-mono font-bold text-stone-900 text-sm">
                    {coupon.code}
                  </td>
                  <td className="py-3 px-2 uppercase font-semibold text-[11px] text-stone-600">
                    {coupon.discountType}
                  </td>
                  <td className="py-3 px-2 font-mono font-bold text-[#DB9558]">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}%`
                      : `Rs. ${coupon.discountValue.toLocaleString()}`}
                  </td>
                  <td className="py-3 px-2 text-right font-mono tabular-nums">
                    Rs. {coupon.minOrder.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-right font-mono tabular-nums text-stone-500">
                    {coupon.maxDiscount ? `Rs. ${coupon.maxDiscount.toLocaleString()}` : 'No limit'}
                  </td>
                  <td className="py-3 px-2 text-center font-mono tabular-nums">
                    {coupon.usedCount} / {coupon.usageLimit}
                  </td>
                  <td className="py-3 px-2 text-[11px] text-stone-500 font-mono">
                    {coupon.startDate} to {coupon.endDate}
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <button
                      onClick={() => toggleCouponActive(coupon.id)}
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded cursor-pointer ${
                        coupon.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="font-serif-title font-semibold text-lg text-stone-900">
                Create Promotional Coupon
              </h3>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Coupon Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. FESTIVE20"
                    className="w-full px-3 py-2 border border-stone-300 rounded font-mono uppercase text-stone-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded text-stone-800"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Minimum Order (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Max Cap (Rs.)</label>
                  <input
                    type="number"
                    value={maxDiscount ?? ''}
                    onChange={(e) => setMaxDiscount(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-stone-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Total Usage Limit</label>
                <input
                  type="number"
                  required
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#97A87A] text-white font-semibold rounded hover:bg-[#839367]"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
